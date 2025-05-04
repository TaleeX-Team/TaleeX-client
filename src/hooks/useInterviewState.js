"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Vapi from "@vapi-ai/web"

const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
}

const VAPI_ASSISTANT_ID = "a7939f6e-e04e-4bce-ac30-c6e7e35655a6"
const VAPI_API_KEY = "d4ecde21-8c7d-4f5c-9996-5c2b306d9ccf"
const ENDING_PHRASE = "That concludes our interview today. Thank you for your time."
const INTERVIEW_DURATION_MINUTES = 20
const WARNING_TIME_MINUTES = 5
const FINAL_WARNING_MINUTES = 1
const RESPONSE_TIMEOUT = 15000 // Increased to 15 seconds
const SPEAKING_FALLBACK_DURATION = 3000 // 3 seconds for message-based fallback
const SPEECH_END_TIMEOUT = 500 // 500ms timeout for speech-end
const MAX_RETRIES = 3 // Maximum call retry attempts

export function useInterviewState(questions) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [displayedQuestion, setDisplayedQuestion] = useState(questions.length > 0 ? questions[0] : "")
    const [progress, setProgress] = useState({ current: 1, total: questions.length })
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isInterviewComplete, setIsInterviewComplete] = useState(false)
    const [isInterviewStarted, setIsInterviewStarted] = useState(false)
    const [isAITalking, setIsAITalking] = useState(false)
    const [isUserTalking, setIsUserTalking] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [messages, setMessages] = useState([])
    const [lastMessage, setLastMessage] = useState(null)
    const [showTranscript, setShowTranscript] = useState(true)
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [conclusionDetected, setConclusionDetected] = useState(false)
    const [lastUserResponseTime, setLastUserResponseTime] = useState(null)
    const [interviewDuration, setInterviewDuration] = useState(0)
    const [transcriptExpanded, setTranscriptExpanded] = useState(false)
    const [lastSpeakingRole, setLastSpeakingRole] = useState(null)
    const [screenshots, setScreenshots] = useState([])
    const [screenshotTimes, setScreenshotTimes] = useState([])
    const [lastCapturedScreenshot, setLastCapturedScreenshot] = useState(null)
    const [screenshotInterval, setScreenshotInterval] = useState(null)
    const [screenshotError, setScreenshotError] = useState(null)
    const [debugMode, setDebugMode] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION_MINUTES * 60)
    const [timerWarningGiven, setTimerWarningGiven] = useState(false)
    const [finalWarningGiven, setFinalWarningGiven] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    // Question tracking system
    const [questionStates, setQuestionStates] = useState(
        questions.map((question, idx) => ({
            question,
            index: idx,
            status: idx === 0 ? "current" : "pending",
            startTime: null,
            endTime: null,
            duration: 0,
            userResponses: [],
            aiResponses: [],
        })),
    )

    const maxScreenshots = 3
    const navigate = useNavigate()

    // Refs
    const videoRef = useRef(null)
    const aiVideoContainerRef = useRef(null)
    const userVideoContainerRef = useRef(null)
    const transcriptContainerRef = useRef(null)
    const mainContentRef = useRef(null)
    const vapiClientRef = useRef(null)
    const durationTimerRef = useRef(null)
    const interviewTimerRef = useRef(null)
    const responseTimeoutRef = useRef(null)
    const screenshotIntervalRef = useRef(null)
    const speechEndTimeoutRef = useRef(null)
    const userSpeechEndTimeoutRef = useRef(null)

    // Initialize VAPI client
    useEffect(() => {
        if (!vapiClientRef.current && typeof Vapi !== "undefined") {
            vapiClientRef.current = new Vapi(VAPI_API_KEY)
            if (debugMode) console.log("VAPI client initialized with API key", { timestamp: new Date().toISOString() })

            // Add WebRTC connection state listener
            vapiClientRef.current.on("call-state", (state) => {
                if (debugMode) console.log("VAPI call state changed:", { state, timestamp: new Date().toISOString() })
                if (state === "disconnected" && callStatus === CallStatus.ACTIVE && retryCount < MAX_RETRIES) {
                    setError("WebRTC connection lost. Attempting to reconnect...")
                    setRetryCount((prev) => prev + 1)
                    setTimeout(() => startVAPICall(), 2000)
                }
            })
        } else if (!Vapi) {
            setError("VAPI SDK failed to load")
        }
    }, [debugMode, callStatus, retryCount])

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => {
            if (callStatus === CallStatus.FINISHED && retryCount < MAX_RETRIES) {
                if (debugMode)
                    console.log("Network restored, attempting to restart call", { timestamp: new Date().toISOString() })
                startVAPICall()
            }
        }

        const handleOffline = () => {
            if (callStatus === CallStatus.ACTIVE) {
                if (debugMode) console.log("Network lost, pausing call", { timestamp: new Date().toISOString() })
                setError("Network connection lost. Attempting to reconnect...")
                endCallImmediately()
            }
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [callStatus, retryCount, debugMode])

    // Synchronize question states and progress
    useEffect(() => {
        if (questions.length > 0) {
            setQuestionStates((prevStates) => {
                const newStates = questions.map((question, idx) => {
                    console.log(questions, "map question")
                    const existingState = prevStates.find((qs) => qs.index === idx) || {}
                    return {
                        question,
                        index: idx,
                        status: idx === currentQuestionIndex ? "current" : idx < currentQuestionIndex ? "completed" : "pending",
                        startTime: idx === currentQuestionIndex && !existingState.startTime ? new Date() : existingState.startTime,
                        endTime: existingState.endTime || null,
                        duration: existingState.duration || 0,
                        userResponses: existingState.userResponses || [],
                        aiResponses: existingState.aiResponses || [],
                    }
                })
                return newStates
            })

            setDisplayedQuestion(questions[currentQuestionIndex] || "")
            setProgress({
                current: currentQuestionIndex + 1,
                total: questions.length,
            })

            if (debugMode) {
                console.log("Question state updated:", {
                    currentQuestionIndex,
                    displayedQuestion: questions[currentQuestionIndex],
                    progress: { current: currentQuestionIndex + 1, total: questions.length },
                    timestamp: new Date().toISOString(),
                })
            }
        }
    }, [questions, currentQuestionIndex, debugMode])

    // Update messages and track responses
    useEffect(() => {
        if (messages.length > 0) {
            const newLastMessage = messages[messages.length - 1]
            setLastMessage(newLastMessage)

            if (currentQuestionIndex >= 0 && currentQuestionIndex < questionStates.length) {
                setQuestionStates((prevStates) => {
                    const newStates = [...prevStates]
                    const currentState = newStates[currentQuestionIndex]

                    if (newLastMessage.role === "user") {
                        currentState.userResponses = [
                            ...currentState.userResponses,
                            {
                                content: newLastMessage.content || "",
                                timestamp: new Date(),
                            },
                        ]
                        setLastUserResponseTime(new Date())
                        setLastSpeakingRole("user")
                        if (!isUserTalking) {
                            setIsUserTalking(true)
                            setIsAITalking(false)
                            if (debugMode)
                                console.log("User message received, isUserTalking: true, isAITalking: false", {
                                    timestamp: new Date().toISOString(),
                                })
                            setTimeout(() => {
                                if (isUserTalking && !isAITalking) {
                                    setIsUserTalking(false)
                                    if (debugMode)
                                        console.log("User talking fallback timeout, isUserTalking: false", {
                                            timestamp: new Date().toISOString(),
                                        })
                                }
                            }, SPEAKING_FALLBACK_DURATION)
                        }
                        if (responseTimeoutRef.current) {
                            clearTimeout(responseTimeoutRef.current)
                            responseTimeoutRef.current = null
                            if (debugMode)
                                console.log("Response timeout cleared due to user response", { timestamp: new Date().toISOString() })
                        }
                    }

                    if (newLastMessage.role === "assistant") {
                        currentState.aiResponses = [
                            ...currentState.aiResponses,
                            {
                                content: newLastMessage.content || "",
                                timestamp: new Date(),
                            },
                        ]
                        setLastSpeakingRole("assistant")
                        if (!isAITalking) {
                            setIsAITalking(true)
                            setIsUserTalking(false)
                            if (debugMode)
                                console.log("Assistant message received, isAITalking: true, isUserTalking: false", {
                                    timestamp: new Date().toISOString(),
                                })
                            setTimeout(() => {
                                if (isAITalking && !isUserTalking) {
                                    setIsAITalking(false)
                                    if (debugMode)
                                        console.log("AI talking fallback timeout, isAITalking: false", {
                                            timestamp: new Date().toISOString(),
                                        })
                                }
                            }, SPEAKING_FALLBACK_DURATION)
                        }
                    }

                    return newStates
                })
            }
        }
    }, [messages, currentQuestionIndex, isAITalking, isUserTalking, debugMode])

    // Setup VAPI client listeners
    useEffect(() => {
        if (vapiClientRef.current) {
            const handleMessage = (message) => {
                const messageContent = message.content || message.transcript || message.text || ""
                const normalizedMessage = messageContent
                    .replace(/[.,!?]/g, "")
                    .toLowerCase()
                    .trim()
                const normalizedEndingPhrase = ENDING_PHRASE.replace(/[.,!?]/g, "")
                    .toLowerCase()
                    .trim()

                if (debugMode) {
                    console.log("VAPI message received:", {
                        role: message.role,
                        content: messageContent,
                        normalized: normalizedMessage,
                        questionIndex: currentQuestionIndex,
                        isAITalking,
                        isUserTalking,
                        timestamp: new Date().toISOString(),
                    })
                }

                setMessages((prev) => [...prev, { ...message, content: messageContent }])

                // End call if the ending phrase is contained in the message, call is active, and message is from assistant
                if (
                    message.role === "assistant" &&
                    (normalizedMessage.includes(normalizedEndingPhrase) || messageContent.includes(ENDING_PHRASE)) &&
                    callStatus === CallStatus.ACTIVE
                ) {
                    if (debugMode)
                        console.log("Conclusion phrase detected, ending interview", {
                            questionIndex: currentQuestionIndex,
                            timestamp: new Date().toISOString(),
                        })
                    setConclusionDetected(true)
                    setIsInterviewComplete(true)
                    endCallImmediately()
                    return
                }

                // Question transition detection
                if (message.role === "assistant" && messageContent) {
                    const transitionMatch = messageContent.match(
                        /Moving to question\s*(\d+)|Next question\s*(\d+)|Question\s*(\d+)|Now for question\s*(\d+)/i,
                    )

                    if (transitionMatch) {
                        const questionNumber = Number.parseInt(
                            transitionMatch[1] || transitionMatch[2] || transitionMatch[3] || transitionMatch[4],
                            10,
                        )
                        const questionIndex = questionNumber - 1

                        if (questionIndex >= 0 && questionIndex < questions.length && questionIndex !== currentQuestionIndex) {
                            if (debugMode)
                                console.log(`Detected explicit transition to question ${questionNumber}`, {
                                    timestamp: new Date().toISOString(),
                                })
                            updateQuestionState(questionIndex)
                            return
                        } else if (questionIndex === currentQuestionIndex) {
                            if (debugMode)
                                console.log("Transition to current question ignored", {
                                    questionIndex,
                                    timestamp: new Date().toISOString(),
                                })
                        } else {
                            if (debugMode)
                                console.log("Invalid question transition detected", {
                                    questionNumber,
                                    timestamp: new Date().toISOString(),
                                })
                        }
                    }

                    const nextIndex = currentQuestionIndex + 1
                    if (nextIndex < questions.length) {
                        const nextQuestion = questions[nextIndex]

                        const isQuestionMatch =
                            messageContent.toLowerCase().includes(nextQuestion.toLowerCase().slice(0, 50)) ||
                            messageContent.toLowerCase().includes(`question ${nextIndex + 1}`)

                        if (isQuestionMatch && nextIndex !== currentQuestionIndex) {
                            if (debugMode)
                                console.log(`Detected question content match for question ${nextIndex + 1}`, {
                                    timestamp: new Date().toISOString(),
                                })
                            updateQuestionState(nextIndex)
                            return
                        }
                    }
                }
            }

            const updateQuestionState = (newIndex) => {
                clearAllTimers()

                setQuestionStates((prevStates) => {
                    const newStates = [...prevStates]
                    const prevIndex = currentQuestionIndex

                    if (prevIndex >= 0 && prevIndex < newStates.length) {
                        newStates[prevIndex].status = "completed"
                        newStates[prevIndex].endTime = new Date()
                        newStates[prevIndex].duration = newStates[prevIndex].startTime
                            ? (new Date() - newStates[prevIndex].startTime) / 1000
                            : 0
                    }

                    newStates[newIndex].status = "current"
                    newStates[newIndex].startTime = new Date()
                    return newStates
                })

                setCurrentQuestionIndex(newIndex)
                setDisplayedQuestion(questions[newIndex])
                setProgress({
                    current: newIndex + 1,
                    total: questions.length,
                })

                if (debugMode) {
                    console.log("Question state updated:", {
                        newQuestionIndex: newIndex,
                        question: questions[newIndex],
                        progress: { current: newIndex + 1, total: questions.length },
                        timestamp: new Date().toISOString(),
                    })
                }
            }

            const handleSpeechStart = () => {
                if (!isAITalking) {
                    setIsAITalking(true)
                    setIsUserTalking(false)
                    setLastSpeakingRole("assistant")
                    if (responseTimeoutRef.current) {
                        clearTimeout(responseTimeoutRef.current)
                        responseTimeoutRef.current = null
                        if (debugMode)
                            console.log("Response timeout cleared due to AI speech start", { timestamp: new Date().toISOString() })
                    }
                    if (debugMode)
                        console.log("AI speech started, isAITalking: true, isUserTalking: false", {
                            questionIndex: currentQuestionIndex,
                            timestamp: new Date().toISOString(),
                        })
                }
            }

            const handleSpeechEnd = () => {
                setIsAITalking(false)
                setLastSpeakingRole(null)
                if (debugMode)
                    console.log("AI speech ended, isAITalking: false", {
                        questionIndex: currentQuestionIndex,
                        timestamp: new Date().toISOString(),
                    })

                if (speechEndTimeoutRef.current) clearTimeout(speechEndTimeoutRef.current)
                speechEndTimeoutRef.current = setTimeout(() => {
                    if (isAITalking) {
                        setIsAITalking(false)
                        if (debugMode)
                            console.log("Forced isAITalking to false after speech-end timeout", {
                                timestamp: new Date().toISOString(),
                            })
                    }
                }, SPEECH_END_TIMEOUT)

                if (callStatus === CallStatus.ACTIVE) {
                    if (debugMode)
                        console.log(`Setting response timeout for ${RESPONSE_TIMEOUT}ms`, {
                            questionIndex: currentQuestionIndex,
                            timestamp: new Date().toISOString(),
                        })
                    responseTimeoutRef.current = setTimeout(() => {
                        if (callStatus !== CallStatus.ACTIVE) {
                            if (debugMode)
                                console.log("Timeout aborted due to inactive call status", {
                                    questionIndex: currentQuestionIndex,
                                    timestamp: new Date().toISOString(),
                                })
                            return
                        }

                        const nextIndex = currentQuestionIndex + 1
                        if (nextIndex < questions.length) {
                            if (debugMode)
                                console.log(`No user response after ${RESPONSE_TIMEOUT}ms, moving to question ${nextIndex + 1}`, {
                                    timestamp: new Date().toISOString(),
                                })
                            vapiClientRef.current.send({
                                type: "add-message",
                                message: {
                                    role: "system",
                                    content: `The candidate has not responded after 15 seconds. Moving to question ${nextIndex + 1}: "${questions[nextIndex]}"`,
                                },
                            })
                            updateQuestionState(nextIndex)
                        } else {
                            if (debugMode)
                                console.log("Reached last question, ending interview", { timestamp: new Date().toISOString() })
                            vapiClientRef.current.say(ENDING_PHRASE, true)
                        }
                    }, RESPONSE_TIMEOUT)
                }
            }

            const handleUserSpeechStart = () => {
                if (!isUserTalking) {
                    setIsUserTalking(true)
                    setIsAITalking(false)
                    setLastSpeakingRole("user")
                    if (responseTimeoutRef.current) {
                        clearTimeout(responseTimeoutRef.current)
                        responseTimeoutRef.current = null
                        if (debugMode)
                            console.log("Response timeout cleared due to user speech start", { timestamp: new Date().toISOString() })
                    }
                    if (debugMode)
                        console.log("User speech started, isUserTalking: true, isAITalking: false", {
                            timestamp: new Date().toISOString(),
                        })
                }
            }

            const handleUserSpeechEnd = () => {
                setIsUserTalking(false)
                setLastSpeakingRole(null)
                if (debugMode) console.log("User speech ended, isUserTalking: false", { timestamp: new Date().toISOString() })

                if (userSpeechEndTimeoutRef.current) clearTimeout(userSpeechEndTimeoutRef.current)
                userSpeechEndTimeoutRef.current = setTimeout(() => {
                    if (isUserTalking) {
                        setIsUserTalking(false)
                        if (debugMode)
                            console.log("Forced isUserTalking to false after user speech-end timeout", {
                                timestamp: new Date().toISOString(),
                            })
                    }
                }, SPEECH_END_TIMEOUT)
            }

            const handleError = (error) => {
                let errorMessage = error.message || "Unknown error"
                if (errorMessage.includes("microphone")) {
                    errorMessage =
                        "Microphone access issue. Please ensure your microphone is enabled and permissions are granted."
                }
                setError(`VAPI error: ${errorMessage}`)
                setIsAITalking(false)
                setIsUserTalking(false)
                if (debugMode)
                    console.error("Detailed VAPI error:", {
                        message: error.message,
                        stack: error.stack,
                        callStatus,
                        isAITalking,
                        isUserTalking,
                        timestamp: new Date().toISOString(),
                    })
            }

            if (debugMode) console.log("Registering VAPI event listeners", { timestamp: new Date().toISOString() })
            vapiClientRef.current.on("message", handleMessage)
            vapiClientRef.current.on("speech-start", handleSpeechStart)
            vapiClientRef.current.on("speech-end", handleSpeechEnd)
            vapiClientRef.current.on("user-speech-start", handleUserSpeechStart)
            vapiClientRef.current.on("user-speech-end", handleUserSpeechEnd)
            vapiClientRef.current.on("error", handleError)

            return () => {
                if (debugMode) console.log("Cleaning up VAPI event listeners", { timestamp: new Date().toISOString() })
                vapiClientRef.current.off("message", handleMessage)
                vapiClientRef.current.off("speech-start", handleSpeechStart)
                vapiClientRef.current.off("speech-end", handleSpeechEnd)
                vapiClientRef.current.off("user-speech-start", handleUserSpeechStart)
                vapiClientRef.current.off("user-speech-end", handleUserSpeechEnd)
                vapiClientRef.current.off("error", handleError)
                if (responseTimeoutRef.current) {
                    clearTimeout(responseTimeoutRef.current)
                    if (debugMode) console.log("Response timeout cleared on cleanup", { timestamp: new Date().toISOString() })
                }
                if (speechEndTimeoutRef.current) {
                    clearTimeout(speechEndTimeoutRef.current)
                    if (debugMode)
                        console.log("AI speech end timeout cleared on cleanup", { timestamp: new Date().toISOString() })
                }
                if (userSpeechEndTimeoutRef.current) {
                    clearTimeout(userSpeechEndTimeoutRef.current)
                    if (debugMode)
                        console.log("User speech end timeout cleared on cleanup", { timestamp: new Date().toISOString() })
                }
            }
        }
    }, [vapiClientRef.current, currentQuestionIndex, questions, callStatus, debugMode])

    // Interview timer (for warnings only)
    useEffect(() => {
        if (isInterviewStarted && callStatus === CallStatus.ACTIVE) {
            interviewTimerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1
                    const canSpeak =
                        !isAITalking && !isUserTalking && (!lastUserResponseTime || new Date() - lastUserResponseTime > 2000)

                    if (newTime <= WARNING_TIME_MINUTES * 60 && !timerWarningGiven && canSpeak) {
                        vapiClientRef.current.say(
                            `We have five minutes remaining in the interview. Please continue with your response or prepare to wrap up.`,
                        )
                        setTimerWarningGiven(true)
                        if (debugMode) console.log("5-minute warning given", { timestamp: new Date().toISOString() })
                    }

                    if (newTime <= FINAL_WARNING_MINUTES * 60 && !finalWarningGiven && canSpeak) {
                        vapiClientRef.current.say(`We have one minute remaining. Please conclude your current response.`)
                        setFinalWarningGiven(true)
                        if (debugMode) console.log("1-minute warning given", { timestamp: new Date().toISOString() })
                    }

                    return newTime
                })
            }, 1000)
        }
        return () => {
            if (interviewTimerRef.current) {
                clearInterval(interviewTimerRef.current)
                if (debugMode) console.log("Interview timer cleared", { timestamp: new Date().toISOString() })
            }
        }
    }, [
        isInterviewStarted,
        callStatus,
        isAITalking,
        isUserTalking,
        lastUserResponseTime,
        timerWarningGiven,
        finalWarningGiven,
        debugMode,
    ])

    // Capture screenshot
    const captureScreenshot = () => {
        if (!videoRef.current) {
            setScreenshotError("Video reference not available")
            return null
        }
        try {
            const screenshot = videoRef.current.getScreenshot()
            if (!screenshot) {
                setScreenshotError("Failed to capture screenshot - empty result")
                return null
            }
            setScreenshots((prev) => [...prev, screenshot])
            setScreenshotTimes((prev) => [...prev, new Date()])
            setLastCapturedScreenshot(screenshot)
            setTimeout(() => setLastCapturedScreenshot(null), 2000)
            const interviewId = Date.now().toString()
            const screenshotData = {
                interviewId,
                screenshot,
                timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`interview_screenshot_${interviewId}_${screenshots.length}`, JSON.stringify(screenshotData))
            return screenshot
        } catch (error) {
            setScreenshotError(`Screenshot error: ${error.message}`)
            return null
        }
    }

    // Manual screenshot
    const takeManualScreenshot = () => {
        if (screenshots.length < maxScreenshots) {
            captureScreenshot()
        }
    }

    // Setup screenshot capture
    useEffect(() => {
        if (isInterviewStarted && callStatus === CallStatus.ACTIVE && videoRef.current) {
            if (screenshotIntervalRef.current) clearInterval(screenshotIntervalRef.current)

            let screenshotCount = 0
            const intervalTime = 90000 // 1.5 minutes
            const intervalId = setInterval(() => {
                if (screenshotCount < maxScreenshots) {
                    captureScreenshot()
                    screenshotCount++
                    if (screenshotCount >= maxScreenshots) {
                        clearInterval(intervalId)
                        setScreenshotInterval(null)
                        if (debugMode) console.log("Screenshot interval cleared", { timestamp: new Date().toISOString() })
                    }
                }
            }, intervalTime)

            captureScreenshot()
            screenshotCount++

            setScreenshotInterval(intervalId)
            return () => {
                clearInterval(intervalId)
                setScreenshotInterval(null)
                if (debugMode) console.log("Screenshot interval cleared on cleanup", { timestamp: new Date().toISOString() })
            }
        }
    }, [isInterviewStarted, callStatus, debugMode])

    // Duration timer
    useEffect(() => {
        if (isInterviewStarted) {
            durationTimerRef.current = setInterval(() => {
                setInterviewDuration((prev) => prev + 1)
            }, 1000)
        }
        return () => {
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current)
                if (debugMode) console.log("Duration timer cleared", { timestamp: new Date().toISOString() })
            }
        }
    }, [isInterviewStarted, debugMode])

    // Monitor conclusion
    useEffect(() => {
        if (conclusionDetected && !isInterviewComplete) {
            if (screenshots.length < maxScreenshots) captureScreenshot()
            endCallImmediately()
        }
    }, [conclusionDetected, isInterviewComplete, screenshots.length])

    // Reset isAITalking and isUserTalking when call is inactive or finished
    useEffect(() => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            setIsAITalking(false)
            setIsUserTalking(false)
            if (debugMode)
                console.log(`Call status changed to ${callStatus}, isAITalking: false, isUserTalking: false`, {
                    timestamp: new Date().toISOString(),
                })
        }
    }, [callStatus, debugMode])

    // Stop VAPI call
    const stopVAPICall = async () => {
        try {
            if (!vapiClientRef.current) {
                if (debugMode) console.warn("VAPI client is not available", { timestamp: new Date().toISOString() })
            } else if (callStatus === CallStatus.FINISHED) {
                if (debugMode) console.log("Call already finished", { timestamp: new Date().toISOString() })
            } else {
                await endCallImmediately()
            }
        } catch (error) {
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            setIsAITalking(false)
            setIsUserTalking(false)
            setMessages([])
            setTranscript("")
            clearAllTimers()
            if (debugMode) console.error("Stop VAPI call error:", { error, timestamp: new Date().toISOString() })
        }
    }

    const endCallImmediately = async () => {
        if (callStatus === CallStatus.FINISHED) {
            if (debugMode) console.log("Call already finished, skipping end call", { timestamp: new Date().toISOString() })
            return
        }
        try {
            if (vapiClientRef.current) {
                await vapiClientRef.current.stop()
            }
            if (screenshots.length < maxScreenshots) {
                captureScreenshot()
            }

            setQuestionStates((prevStates) => {
                const newStates = [...prevStates]
                const currentState = newStates.find((state) => state.status === "current")

                if (currentState) {
                    currentState.status = "completed"
                    currentState.endTime = new Date()
                    currentState.duration = currentState.startTime ? (new Date() - currentState.startTime) / 1000 : 0
                }

                return newStates
            })

            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            if (debugMode) console.log("Call status changed to FINISHED", { timestamp: new Date().toISOString() })
            setIsAITalking(false)
            setIsUserTalking(false)
            setConclusionDetected(true)
            setIsLoading(false)
            setMessages([])
            setTranscript("")
            clearAllTimers()

            // Retry if call ended unexpectedly and retry limit not reached
            if (!conclusionDetected && retryCount < MAX_RETRIES) {
                if (debugMode)
                    console.log(`Retrying VAPI call, attempt ${retryCount + 1}`, { timestamp: new Date().toISOString() })
                setRetryCount((prev) => prev + 1)
                setTimeout(() => startVAPICall(), 2000)
            }
        } catch (error) {
            setError(`Call termination error: ${error.message}`)
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            if (debugMode) console.log("Call status changed to FINISHED", { timestamp: new Date().toISOString() })
            setIsAITalking(false)
            setIsUserTalking(false)
            setIsLoading(false)
            setMessages([])
            setTranscript("")
            clearAllTimers()
            if (debugMode) console.error("End call error:", { error, timestamp: new Date().toISOString() })
        }
    }

    const clearAllTimers = () => {
        if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current)
            if (debugMode) console.log("Duration timer cleared", { timestamp: new Date().toISOString() })
        }
        if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current)
            if (debugMode) console.log("Response timeout cleared", { timestamp: new Date().toISOString() })
        }
        if (screenshotIntervalRef.current) {
            clearInterval(screenshotIntervalRef.current)
            if (debugMode) console.log("Screenshot interval cleared", { timestamp: new Date().toISOString() })
        }
        if (interviewTimerRef.current) {
            clearInterval(interviewTimerRef.current)
            if (debugMode) console.log("Interview timer cleared", { timestamp: new Date().toISOString() })
        }
        if (speechEndTimeoutRef.current) {
            clearTimeout(speechEndTimeoutRef.current)
            if (debugMode) console.log("AI speech end timeout cleared", { timestamp: new Date().toISOString() })
        }
        if (userSpeechEndTimeoutRef.current) {
            clearTimeout(userSpeechEndTimeoutRef.current)
            if (debugMode) console.log("User speech end timeout cleared", { timestamp: new Date().toISOString() })
        }
        durationTimerRef.current = null
        responseTimeoutRef.current = null
        screenshotIntervalRef.current = null
        interviewTimerRef.current = null
        speechEndTimeoutRef.current = null
        userSpeechEndTimeoutRef.current = null
        setScreenshotInterval(null)
        if (debugMode) console.log("All timers cleared", { timestamp: new Date().toISOString() })
    }

    // Start VAPI call
    const startVAPICall = async () => {
        if (!navigator.onLine) {
            setError("No internet connection. Please check your network and try again.")
            setIsLoading(false)
            return
        }

        if (!vapiClientRef.current || callStatus === CallStatus.ACTIVE || isLoading) {
            if (debugMode)
                console.log("Cannot start VAPI call", { callStatus, isLoading, timestamp: new Date().toISOString() })
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            setCallStatus(CallStatus.CONNECTING)
            if (debugMode) console.log("Call status changed to CONNECTING", { timestamp: new Date().toISOString() })
            setIsAITalking(false)
            setIsUserTalking(false)

            if (currentQuestionIndex === 0 && messages.length === 0) {
                const introMessage = {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: "Welcome to your technical interview. I'll begin with the first question shortly.",
                    timestamp: new Date(),
                }
                setMessages([introMessage])
                setLastSpeakingRole("assistant")
                if (debugMode) console.log("Intro message added", { timestamp: new Date().toISOString() })
            }
            console.log(questions, "questions2")

            const formattedQuestions = questions.map((q, i) => `Question ${i + 1}: ${q}`).join("\n\n")
            console.log(formattedQuestions, "formatedQuestions2")
            const assistantOverrides = {
                name: "AI Technical Interviewer",
                firstMessage: `Hello! I'm TaleX AI, your interviewer today. I'll be asking you ${questions.length} technical questions to assess your skills. The interview will last up to ${INTERVIEW_DURATION_MINUTES} minutes. Let's begin with the first question: "${questions[0]},Are you Ready?!"`,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en-US",
                    keywords: [],
                    smartFormat: false,
                },
                voice: {
                    provider: "playht",
                    voiceId: "jennifer",
                },
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `You are a senior technical interviewer conducting a structured, professional interview to evaluate a candidate's technical expertise, problem-solving ability, and communication skills. Your goal is to create a realistic, engaging, and fair interview experience.

**OBJECTIVES**:
1. Ask the ${questions.length} predefined technical questions in order, one at a time, starting with question 1.
2. Maintain a professional, friendly, yet firm tone.
3. Analyze responses for accuracy, depth, clarity, and relevance.
4. Detect evasive or off-topic responses and redirect politely with: "Could you focus on the question?"
5. Ask follow-up questions if the response is incomplete (e.g., "Can you elaborate on X?").
6. After receiving a response, a declined answer, or exactly 10 seconds of silence, transition to the next question by saying: "Moving to question X: [question]".

**INTERVIEW GUIDELINES**:
- **Introduction**: Greet the candidate, state the number of questions, and set expectations for the interview duration.
- **Question Delivery**:
  - Ask one question at a time, using the exact wording provided.
  - Wait for a response or exactly 10 seconds of silence before moving to the next question.
  - Announce transitions with: "Moving to question X: [question]" for all questions except the last.
- **Response Handling**:
  - If the response is vague or off-topic, redirect with: "Could you focus on the question?"
  - If silent for 5 seconds, prompt: "Would you like me to repeat the question?"
  - After a response or 10 seconds of silence, move to the next question.
- **Conclusion**:
  - After asking the final question (question ${questions.length}) and receiving a response or 10 seconds of silence, say: "${ENDING_PHRASE}".
  - Terminate the call immediately after saying the ending phrase.
- **Timing**:
  - Monitor silence after asking a question or finishing a follow-up.
  - If 10 seconds of silence occur, immediately announce the next question or ending phrase.

**RESTRICTIONS**:
- Do NOT move to the next question until a response is received, the candidate declines to answer, or exactly 10 seconds of silence have passed.
- Do NOT end the interview until the final question is asked and the ending phrase is spoken.
- Do NOT engage in casual conversation or answer unrelated questions.
- Do NOT provide hints unless clarifying the current question.
- Do NOT interrupt the candidate's response to announce time warnings.
- ALWAYS announce question transitions with: "Moving to question X: [question]".
- NEVER terminate the call prematurely, even if the interview duration exceeds ${INTERVIEW_DURATION_MINUTES} minutes.

**QUESTIONS**:
${formattedQuestions}
`,
                        },
                    ],
                },
                recordingEnabled: false,
                endCallPhrases: [ENDING_PHRASE],
            }

            if (debugMode) console.log("Starting VAPI call", { timestamp: new Date().toISOString() })
            await vapiClientRef.current.start(VAPI_ASSISTANT_ID, assistantOverrides)
            if (debugMode) console.log("VAPI call started successfully", { timestamp: new Date().toISOString() })

            // Wait for call to be fully active before unmuting
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (callStatus === CallStatus.ACTIVE && vapiClientRef.current) {
                try {
                    vapiClientRef.current.setMuted(false)
                    setIsAudioOn(true)
                    if (debugMode) console.log("Microphone unmuted after call start", { timestamp: new Date().toISOString() })
                } catch (muteError) {
                    if (debugMode)
                        console.warn("Failed to unmute microphone", { error: muteError, timestamp: new Date().toISOString() })
                    setError(`Warning: Could not unmute microphone: ${muteError.message}`)
                }
            }

            setCallStatus(CallStatus.ACTIVE)
            if (debugMode) console.log("Call status changed to ACTIVE", { timestamp: new Date().toISOString() })
            setIsLoading(false)

            setQuestionStates((prevStates) => {
                const newStates = [...prevStates]
                if (newStates[0]) {
                    newStates[0].startTime = new Date()
                    newStates[0].status = "current"
                }
                return newStates
            })
        } catch (error) {
            setError(`Failed to start the interview: ${error.message || "Unknown error"}`)
            setIsAITalking(false)
            setIsUserTalking(false)
            setCallStatus(CallStatus.INACTIVE)
            if (debugMode) console.log("Call status changed to INACTIVE", { timestamp: new Date().toISOString() })
            setIsLoading(false)
            if (debugMode)
                console.error("Start VAPI call error, isAITalking: false, isUserTalking: false", {
                    error,
                    timestamp: new Date().toISOString(),
                })
        }
    }

    // Handle start interview
    const handleStartInterview = async () => {
        try {
            // Request microphone permissions
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach((track) => track.stop())
            if (debugMode) console.log("Microphone permission granted", { timestamp: new Date().toISOString() })
        } catch (err) {
            setError("Microphone access denied. Please allow microphone access in your browser settings.")
            if (debugMode) console.error("Microphone permission error:", { error: err, timestamp: new Date().toISOString() })
            return
        }

        setIsInterviewStarted(true)
        setScreenshots([])
        setScreenshotTimes([])
        setProgress({ current: 1, total: questions.length })
        setTimeRemaining(INTERVIEW_DURATION_MINUTES * 60)
        setTimerWarningGiven(false)
        setFinalWarningGiven(false)
        setRetryCount(0)

        setQuestionStates(
            questions.map((question, idx) => ({
                question,
                index: idx,
                status: idx === 0 ? "current" : "pending",
                startTime: idx === 0 ? new Date() : null,
                endTime: null,
                duration: 0,
                userResponses: [],
                aiResponses: [],
            })),
        )

        await startVAPICall()
        if (debugMode) console.log("Interview started", { timestamp: new Date().toISOString() })
    }

    // Handle end interview
    const handleEndInterview = () => {
        stopVAPICall()
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach((track) => track.stop())
        }

        if (debugMode) console.log("Interview ended manually", { timestamp: new Date().toISOString() })
    }

    // Force next question
    const forceNextQuestion = () => {
        if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
            setError("Cannot move to next question: Call is not active or VAPI client is unavailable.")
            if (debugMode) console.log("Next question aborted", { callStatus, timestamp: new Date().toISOString() })
            return
        }

        const nextIndex = currentQuestionIndex + 1
        if (nextIndex < questions.length) {
            vapiClientRef.current.send({
                type: "add-message",
                message: {
                    role: "system",
                    content: `Moving to question ${nextIndex + 1}: "${questions[nextIndex]}"`,
                },
            })
            if (debugMode) console.log("Forced next question", { nextIndex, timestamp: new Date().toISOString() })
        } else {
            vapiClientRef.current.say(ENDING_PHRASE, true)
            if (debugMode) console.log("Forced interview end on last question", { timestamp: new Date().toISOString() })
        }
    }

    // Toggle transcript visibility
    const toggleTranscript = () => {
        if (showTranscript && transcriptContainerRef.current) {
            import("gsap").then(({ gsap }) => {
                gsap.to(transcriptContainerRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => setShowTranscript(false),
                })
            })
        } else {
            setShowTranscript(true)
        }
    }

    // Toggle transcript expanded state
    const toggleTranscriptExpanded = () => {
        setTranscriptExpanded(!transcriptExpanded)
    }

    // Toggle audio
    const toggleAudio = () => {
        if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
            setError("Cannot toggle audio: Call is not active or VAPI client is unavailable.")
            if (debugMode) console.log("Audio toggle aborted", { callStatus, timestamp: new Date().toISOString() })
            return
        }
        const currentMuted = vapiClientRef.current.isMuted()
        vapiClientRef.current.setMuted(!currentMuted)
        setIsAudioOn(!currentMuted)
        if (debugMode) console.log("Audio toggled", { isAudioOn: !currentMuted, timestamp: new Date().toISOString() })
    }

    // Format transcript for submission
    const formatTranscriptForSubmission = () => {
        const formattedTranscript = messages
            .map((msg) => {
                const speaker = msg.role === "assistant" ? "AI Interviewer" : "Candidate"
                const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "unknown time"
                return `[${timestamp}] ${speaker}: ${msg.content || "[No content]"}`
            })
            .join("\n\n")
        const header =
            `Interview Transcript\n` +
            `Date: ${new Date().toLocaleDateString()}\n` +
            `Duration: ${formatDuration(interviewDuration)}\n` +
            `Questions: ${questionStates.filter((s) => s.status === "completed").length} of ${questions.length}\n` +
            `--------------------------------\n\n`
        return header + formattedTranscript
    }

    // Format duration
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Question state management
    const getCurrentQuestionSummary = () => {
        const currentState = questionStates.find((state) => state.status === "current")
        if (!currentState) return null
        return {
            index: currentState.index,
            question: currentState.question,
            status: currentState.status,
            duration: currentState.duration ? formatDuration(currentState.duration) : "0:00",
            userResponses: currentState.userResponses,
            aiResponses: currentState.aiResponses,
        }
    }

    const getCompletedQuestionsSummary = () => {
        return questionStates
            .filter((state) => state.status === "completed")
            .map((state) => ({
                index: state.index,
                question: state.question,
                duration: formatDuration(state.duration),
                userResponseCount: state.userResponses.length,
                aiResponseCount: state.aiResponses.length,
            }))
    }

    const getPendingQuestionsCount = () => {
        return questionStates.filter((state) => state.status === "pending").length
    }

    const resetQuestionStates = () => {
        setQuestionStates(
            questions.map((question, idx) => ({
                question,
                index: idx,
                status: idx === 0 ? "current" : "pending",
                startTime: idx === 0 ? new Date() : null,
                endTime: null,
                duration: 0,
                userResponses: [],
                aiResponses: [],
            })),
        )
        setCurrentQuestionIndex(0)
        setDisplayedQuestion(questions[0] || "")
        setProgress({ current: 1, total: questions.length })
        if (debugMode) console.log("Question states reset", { timestamp: new Date().toISOString() })
    }

    const retryQuestion = (questionIndex) => {
        if (questionIndex >= 0 && questionIndex < questions.length) {
            setQuestionStates((prevStates) => {
                const newStates = [...prevStates]
                newStates.forEach((state, idx) => {
                    if (idx === questionIndex) {
                        state.status = "current"
                        state.startTime = new Date()
                        state.endTime = null
                        state.duration = 0
                        state.userResponses = []
                        state.aiResponses = []
                    } else if (idx > questionIndex) {
                        state.status = "pending"
                        state.startTime = null
                        state.endTime = null
                        state.duration = 0
                        state.userResponses = []
                        state.aiResponses = []
                    } else if (state.status === "current") {
                        state.status = "completed"
                        state.endTime = new Date()
                        state.duration = state.startTime ? (new Date() - state.startTime) / 1000 : state.duration
                    }
                })
                return newStates
            })
            setCurrentQuestionIndex(questionIndex)
            setDisplayedQuestion(questions[questionIndex])
            setProgress({ current: questionIndex + 1, total: questions.length })

            if (vapiClientRef.current) {
                vapiClientRef.current.send({
                    type: "add-message",
                    message: {
                        role: "system",
                        content: `Retrying question ${questionIndex + 1}: "${questions[questionIndex]}"`,
                    },
                })
                if (debugMode) console.log("Retrying question", { questionIndex, timestamp: new Date().toISOString() })
            }
        }
    }

    const formatQuestionStateForUI = () => {
        return questionStates.map((state) => ({
            index: state.index,
            question: state.question,
            status: state.status,
            duration: state.duration ? formatDuration(state.duration) : "N/A",
            userResponseCount: state.userResponses.length,
            aiResponseCount: state.aiResponses.length,
            startTime: state.startTime ? new Date(state.startTime).toLocaleTimeString() : null,
            endTime: state.endTime ? new Date(state.endTime).toLocaleTimeString() : null,
            userResponses: state.userResponses.map((res) => ({
                content: res.content,
                timestamp: res.timestamp ? new Date(res.timestamp).toLocaleTimeString() : "unknown",
            })),
            aiResponses: state.aiResponses.map((res) => ({
                content: res.content,
                timestamp: res.timestamp ? new Date(res.timestamp).toLocaleTimeString() : "unknown",
            })),
        }))
    }

    // Retrieve saved data
    const retrieveInterviewData = (interviewId) => {
        try {
            const transcriptData = JSON.parse(localStorage.getItem(`interview_transcript_${interviewId}`))
            const screenshotData = []
            for (let i = 0; i < maxScreenshots; i++) {
                const data = JSON.parse(localStorage.getItem(`interview_screenshot_${interviewId}_${i}`))
                if (data) screenshotData.push(data)
            }
            return {
                transcript: transcriptData,
                screenshots: screenshotData,
            }
        } catch (error) {
            setError(`Failed to retrieve interview data: ${error.message}`)
            return null
        }
    }

    // Monitor interview completion state
    useEffect(() => {
        if (isInterviewComplete && conclusionDetected) {
            // This is where you would show the interviewCompletedAttachment dialog
            if (debugMode)
                console.log("Interview completed, should show completion dialog", { timestamp: new Date().toISOString() })

            // If you have a navigate function from react-router, you can use it to navigate to a completion page
            // navigate('/interview-complete');

            // Or you can trigger a custom event that your parent component can listen for
            const event = new CustomEvent("interviewCompleted", {
                detail: {
                    transcript: formatTranscriptForSubmission(),
                    screenshots: screenshots,
                    questionStates: formatQuestionStateForUI(),
                },
            })
            window.dispatchEvent(event)
        }
    }, [isInterviewComplete, conclusionDetected])

    return {
        state: {
            currentQuestionIndex,
            displayedQuestion,
            progress,
            isVideoOn,
            isAudioOn,
            isInterviewComplete,
            isInterviewStarted,
            isAITalking,
            isUserTalking,
            transcript,
            messages,
            lastMessage,
            showTranscript,
            callStatus,
            isLoading,
            error,
            conclusionDetected,
            lastUserResponseTime,
            interviewDuration,
            transcriptExpanded,
            lastSpeakingRole,
            screenshots,
            screenshotTimes,
            lastCapturedScreenshot,
            debugMode,
            timeRemaining,
            questionStates: formatQuestionStateForUI(),
            currentQuestionSummary: getCurrentQuestionSummary(),
            completedQuestionsSummary: getCompletedQuestionsSummary(),
            pendingQuestionsCount: getPendingQuestionsCount(),
        },
        actions: {
            setCurrentQuestionIndex,
            setDisplayedQuestion,
            setProgress,
            setIsVideoOn,
            setIsAudioOn,
            setIsInterviewComplete,
            setIsInterviewStarted,
            setIsAITalking,
            setIsUserTalking,
            setTranscript,
            setMessages,
            setLastMessage,
            setShowTranscript,
            setCallStatus,
            setIsLoading,
            setError,
            setConclusionDetected,
            setLastUserResponseTime,
            setInterviewDuration,
            setTranscriptExpanded,
            setLastSpeakingRole,
            handleStartInterview,
            handleEndInterview,
            toggleTranscript,
            toggleTranscriptExpanded,
            toggleAudio,
            stopVAPICall,
            startVAPICall,
            captureScreenshot,
            takeManualScreenshot,
            retrieveInterviewData,
            setDebugMode,
            forceNextQuestion,
            resetQuestionStates,
            retryQuestion,
        },
        refs: {
            videoRef,
            aiVideoContainerRef,
            userVideoContainerRef,
            transcriptContainerRef,
            mainContentRef,
            vapiClientRef,
            durationTimerRef,
            interviewTimerRef,
        },
    }
}
