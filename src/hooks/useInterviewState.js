"use client"

import {useState, useEffect, useRef, useCallback} from "react"
import {useNavigate} from "react-router-dom"
import Vapi from "@vapi-ai/web"

const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
}

const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;
const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;

const ENDING_PHRASE = "That concludes our interview today. Thank you for your time."
const INTERVIEW_DURATION_MINUTES = 20
const WARNING_TIME_MINUTES = 5
const FINAL_WARNING_MINUTES = 1
const RESPONSE_TIMEOUT = 15000 // 15 seconds for response timeout
const SCREENSHOT_INTERVAL = 90000 // 1.5 minutes (90 seconds) in milliseconds
const MAX_SCREENSHOTS = 3

export function useInterviewState(questions, interviewId) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [displayedQuestion, setDisplayedQuestion] = useState(questions.length > 0 ? questions[0] : "")
    const [progress, setProgress] = useState({
        current: 1,
        total: questions.length,
    })
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isInterviewComplete, setIsInterviewComplete] = useState(false)
    const [isInterviewStarted, setIsInterviewStarted] = useState(false)
    const [isAITalking, setIsAITalking] = useState(false)
    const [isUserTalking, setIsUserTalking] = useState(false)
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
    const [screenshotError, setScreenshotError] = useState(null)
    const [debugMode, setDebugMode] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION_MINUTES * 60)
    const [timerWarningGiven, setTimerWarningGiven] = useState(false)
    const [finalWarningGiven, setFinalWarningGiven] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [lastSpeakerTranscript, setLastSpeakerTranscript] = useState({
        role: null,
        content: "",
    })

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

    // Initialize VAPI client
    useEffect(() => {
        if (!vapiClientRef.current && typeof Vapi !== "undefined") {
            vapiClientRef.current = new Vapi(VAPI_API_KEY)
            if (debugMode)
                console.log("VAPI client initialized with API key", {
                    timestamp: new Date().toISOString(),
                })

            vapiClientRef.current.on("call-state", (state) => {
                if (debugMode)
                    console.log("VAPI call state changed:", {
                        state,
                        timestamp: new Date().toISOString(),
                    })
                if (state === "disconnected" && callStatus === CallStatus.ACTIVE) {
                    setError("WebRTC connection lost. Ending call...")
                    endCallImmediately()
                }
            })
        } else if (!Vapi) {
            setError("VAPI SDK failed to load")
        }
    }, [debugMode, callStatus])

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => {
            if (debugMode)
                console.log("Network restored", {
                    timestamp: new Date().toISOString(),
                })
        }

        const handleOffline = () => {
            if (callStatus === CallStatus.ACTIVE) {
                if (debugMode)
                    console.log("Network lost, ending call", {
                        timestamp: new Date().toISOString(),
                    })
                setError("Network connection lost. Ending call...")
                endCallImmediately()
            }
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [callStatus, debugMode])

    // Synchronize question states and progress
    useEffect(() => {
        if (questions.length > 0) {
            setQuestionStates((prevStates) => {
                const newStates = questions.map((question, idx) => {
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
                    progress: {
                        current: currentQuestionIndex + 1,
                        total: questions.length,
                    },
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
                        setIsUserTalking(true)
                        setIsAITalking(false)
                        if (debugMode)
                            console.log("User message received, isUserTalking: true, isAITalking: false", {
                                timestamp: new Date().toISOString(),
                            })
                        if (responseTimeoutRef.current) {
                            clearTimeout(responseTimeoutRef.current)
                            responseTimeoutRef.current = null
                            if (debugMode)
                                console.log("Response timeout cleared due to user response", {
                                    timestamp: new Date().toISOString(),
                                })
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
                        setIsAITalking(true)
                        setIsUserTalking(false)
                        if (debugMode)
                            console.log("Assistant message received, isAITalking: true, isUserTalking: false", {
                                timestamp: new Date().toISOString(),
                            })
                    }

                    return newStates
                })
            }
        }
    }, [messages, currentQuestionIndex, debugMode])

    // Duration timer
    useEffect(() => {
        if (isInterviewStarted && callStatus === CallStatus.ACTIVE) {
            durationTimerRef.current = setInterval(() => {
                setInterviewDuration((prev) => prev + 1)
                if (debugMode)
                    console.log("Duration timer tick", {
                        interviewDuration: interviewDuration + 1,
                        timestamp: new Date().toISOString(),
                    })
            }, 1000)
        }
        return () => {
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current)
                durationTimerRef.current = null
                if (debugMode)
                    console.log("Duration timer cleared", {
                        timestamp: new Date().toISOString(),
                    })
            }
        }
    }, [isInterviewStarted, callStatus, debugMode])

    // Interview timer (for warnings and time remaining)
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
                        if (debugMode)
                            console.log("5-minute warning given", {
                                timestamp: new Date().toISOString(),
                            })
                    }

                    if (newTime <= FINAL_WARNING_MINUTES * 60 && !finalWarningGiven && canSpeak) {
                        vapiClientRef.current.say(`We have one minute remaining. Please conclude your current response.`)
                        setFinalWarningGiven(true)
                        if (debugMode)
                            console.log("1-minute warning given", {
                                timestamp: new Date().toISOString(),
                            })
                    }

                    if (debugMode)
                        console.log("Time remaining timer tick", {
                            timeRemaining: newTime,
                            timestamp: new Date().toISOString(),
                        })

                    return newTime
                })
            }, 1000)
        }
        return () => {
            if (interviewTimerRef.current) {
                clearInterval(interviewTimerRef.current)
                interviewTimerRef.current = null
                if (debugMode)
                    console.log("Interview timer cleared", {
                        timestamp: new Date().toISOString(),
                    })
            }
        }
    }, [isInterviewStarted, callStatus, debugMode])

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

                setMessages((prev) => [...prev, {...message, content: messageContent}])
                if (message.role === "assistant" || message.role === "user") {
                    setLastSpeakericester({
                        role: message.role,
                        content: messageContent,
                    })
                    setTranscript(messageContent)
                }

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
                if (responseTimeoutRef.current) {
                    clearTimeout(responseTimeoutRef.current)
                    responseTimeoutRef.current = null
                    if (debugMode)
                        console.log("Response timeout cleared during question transition", {
                            timestamp: new Date().toISOString(),
                        })
                }

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
                        progress: {current: newIndex + 1, total: questions.length},
                        timestamp: new Date().toISOString(),
                    })
                }
            }

            const handleSpeechStart = () => {
                setIsAITalking(true)
                setIsUserTalking(false)
                setLastSpeakingRole("assistant")
                if (responseTimeoutRef.current) {
                    clearTimeout(responseTimeoutRef.current)
                    responseTimeoutRef.current = null
                    if (debugMode)
                        console.log("Response timeout cleared due to AI speech start", {
                            timestamp: new Date().toISOString(),
                        })
                }
                if (debugMode)
                    console.log("AI speech started, isAITalking: true, isUserTalking: false", {
                        questionIndex: currentQuestionIndex,
                        timestamp: new Date().toISOString(),
                    })
            }

            const handleSpeechEnd = () => {
                setIsAITalking(false)
                if (debugMode)
                    console.log("AI speech ended, isAITalking: false", {
                        questionIndex: currentQuestionIndex,
                        timestamp: new Date().toISOString(),
                    })

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
                                    content: `The candidate has not responded after 15 seconds. Moving to question ${
                                        nextIndex + 1
                                    }: "${questions[nextIndex]}"`,
                                },
                            })
                            updateQuestionState(nextIndex)
                        } else {
                            if (debugMode)
                                console.log("Reached last question, ending interview", {
                                    timestamp: new Date().toISOString(),
                                })
                            vapiClientRef.current.say(ENDING_PHRASE, true)
                        }
                    }, RESPONSE_TIMEOUT)
                }
            }

            const handleUserSpeechStart = () => {
                setIsUserTalking(true)
                setIsAITalking(false)
                setLastSpeakingRole("user")
                if (responseTimeoutRef.current) {
                    clearTimeout(responseTimeoutRef.current)
                    responseTimeoutRef.current = null
                    if (debugMode)
                        console.log("Response timeout cleared due to user speech start", {
                            timestamp: new Date().toISOString(),
                        })
                }
                if (debugMode)
                    console.log("User speech started, isUserTalking: true, isAITalking: false", {
                        timestamp: new Date().toISOString(),
                    })
            }

            const handleUserSpeechEnd = () => {
                setIsUserTalking(false)
                if (debugMode)
                    console.log("User speech ended, isUserTalking: false", {
                        timestamp: new Date().toISOString(),
                    })
            }

            const handleError = (error) => {
                let errorMessage = error?.response?.data?.message || "Unknown error"
                if (errorMessage.includes("microphone")) {
                    errorMessage =
                        "Microphone access issue. Please ensure your microphone is enabled and permissions are granted."
                } else if (errorMessage.includes("Meeting has ended")) {
                    if (debugMode)
                        console.log("Meeting ended error detected, ensuring interview completion", {
                            timestamp: new Date().toISOString(),
                        })
                    setIsInterviewComplete(true)
                    setConclusionDetected(true)
                    setCallStatus(CallStatus.FINISHED)
                    setIsAITalking(false)
                    setIsUserTalking(false)
                    setIsLoading(false)
                    setMessages([])
                    setTranscript("")
                    clearAllTimers()
                    if (debugMode)
                        console.error("Detailed VAPI error:", {
                            message: error?.response?.data?.message,
                            stack: error.stack,
                            callStatus,
                            isAITalking,
                            isUserTalking,
                            timestamp: new Date().toISOString(),
                        })
                    return
                }
                setError(`VAPI error: ${errorMessage}`)
                setIsAITalking(false)
                setIsUserTalking(false)
                if (debugMode)
                    console.error("Detailed VAPI error:", {
                        message: error?.response?.data?.message,
                        stack: error.stack,
                        callStatus,
                        isAITalking,
                        isUserTalking,
                        timestamp: new Date().toISOString(),
                    })
            }

            if (debugMode)
                console.log("Registering VAPI event listeners", {
                    timestamp: new Date().toISOString(),
                })
            vapiClientRef.current.on("message", handleMessage)
            vapiClientRef.current.on("speech-start", handleSpeechStart)
            vapiClientRef.current.on("speech-end", handleSpeechEnd)
            vapiClientRef.current.on("user-speech-start", handleUserSpeechStart)
            vapiClientRef.current.on("user-speech-end", handleUserSpeechEnd)
            vapiClientRef.current.on("error", handleError)

            return () => {
                if (debugMode)
                    console.log("Cleaning up VAPI event listeners", {
                        timestamp: new Date().toISOString(),
                    })
                vapiClientRef.current.off("message", handleMessage)
                vapiClientRef.current.off("speech-start", handleSpeechStart)
                vapiClientRef.current.off("speech-end", handleSpeechEnd)
                vapiClientRef.current.off("user-speech-start", handleUserSpeechStart)
                vapiClientRef.current.off("user-speech-end", handleUserSpeechEnd)
                vapiClientRef.current.off("error", handleError)
                if (responseTimeoutRef.current) {
                    clearTimeout(responseTimeoutRef.current)
                    if (debugMode)
                        console.log("Response timeout cleared on cleanup", {
                            timestamp: new Date().toISOString(),
                        })
                }
            }
        }
    }, [vapiClientRef.current, currentQuestionIndex, questions, callStatus, debugMode])

    useEffect(() => {
        if (lastSpeakerTranscript.role && lastSpeakerTranscript.content) {
            setTranscript(lastSpeakerTranscript.content)
            if (debugMode)
                console.log("Transcript updated", {
                    role: lastSpeakerTranscript.role,
                    content: lastSpeakerTranscript.content,
                    timestamp: new Date().toISOString(),
                })
        }
    }, [lastSpeakerTranscript, debugMode])

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
            const screenshotData = {
                interviewId,
                screenshot,
                timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`interview_screenshot_${interviewId}_${screenshots.length}`, JSON.stringify(screenshotData))
            if (debugMode)
                console.log("Screenshot captured and saved", {
                    screenshotIndex: screenshots.length + 1,
                    timestamp: new Date().toISOString(),
                })
            return screenshot
        } catch (error) {
            setScreenshotError(`Screenshot error: ${error?.message || "Unknown error"}`)
            if (debugMode)
                console.error("Screenshot capture error:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
            return null
        }
    }

    // Manual screenshot
    const takeManualScreenshot = () => {
        if (screenshots.length < MAX_SCREENSHOTS) {
            captureScreenshot()
        }
    }

    // Setup screenshot capture
    useEffect(() => {
        if (isInterviewStarted && callStatus === CallStatus.ACTIVE && videoRef.current) {
            // Clear any existing interval
            if (screenshotIntervalRef.current) {
                clearInterval(screenshotIntervalRef.current)
                screenshotIntervalRef.current = null
                if (debugMode)
                    console.log("Cleared previous screenshot interval", {
                        timestamp: new Date().toISOString(),
                    })
            }

            // Take first screenshot immediately if none exist
            if (screenshots.length === 0) {
                captureScreenshot()
            }

            // Only set up interval if we haven't reached max screenshots
            if (screenshots.length < MAX_SCREENSHOTS) {
                const intervalId = setInterval(() => {
                    if (screenshots.length < MAX_SCREENSHOTS) {
                        captureScreenshot()
                    }

                    // Clear interval if max screenshots reached
                    if (screenshots.length >= MAX_SCREENSHOTS) {
                        clearInterval(screenshotIntervalRef.current)
                        screenshotIntervalRef.current = null
                        if (debugMode)
                            console.log("Screenshot interval cleared after reaching max screenshots", {
                                totalScreenshots: screenshots.length,
                                timestamp: new Date().toISOString(),
                            })
                    }
                }, SCREENSHOT_INTERVAL)

                screenshotIntervalRef.current = intervalId

                if (debugMode)
                    console.log("Screenshot interval set up", {
                        interval: SCREENSHOT_INTERVAL,
                        maxScreenshots: MAX_SCREENSHOTS,
                        timestamp: new Date().toISOString(),
                    })

                return () => {
                    if (screenshotIntervalRef.current) {
                        clearInterval(screenshotIntervalRef.current)
                        screenshotIntervalRef.current = null
                        if (debugMode)
                            console.log("Screenshot interval cleared on cleanup", {
                                timestamp: new Date().toISOString(),
                            })
                    }
                }
            }
        }
    }, [isInterviewStarted, callStatus, screenshots.length, debugMode])

    // Monitor conclusion
    useEffect(() => {
        if (conclusionDetected && !isInterviewComplete) {
            if (screenshots.length < MAX_SCREENSHOTS) captureScreenshot()
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
                if (debugMode)
                    console.warn("VAPI client is not available", {
                        timestamp: new Date().toISOString(),
                    })
            } else if (callStatus === CallStatus.FINISHED) {
                if (debugMode)
                    console.log("Call already finished", {
                        timestamp: new Date().toISOString(),
                    })
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
            if (debugMode)
                console.error("Stop VAPI call error:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
        }
    }

    const endCallImmediately = async () => {
        if (callStatus === CallStatus.FINISHED) {
            if (debugMode)
                console.log("Call already finished, skipping end call", {
                    timestamp: new Date().toISOString(),
                })
            return
        }
        try {
            if (vapiClientRef.current) {
                await vapiClientRef.current.stop()
            }
            if (screenshots.length < MAX_SCREENSHOTS) {
                captureScreenshot()
            }

            const transcriptData = saveAndGetTranscript(interviewId)

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
            if (debugMode)
                console.log("Call status changed to FINISHED", {
                    timestamp: new Date().toISOString(),
                })
            setIsAITalking(false)
            setIsUserTalking(false)
            setConclusionDetected(true)
            setIsLoading(false)
            clearAllTimers()

            if (debugMode)
                console.log("Interview completed with transcript data", {
                    transcriptData,
                    timestamp: new Date().toISOString(),
                })
        } catch (error) {
            setError(`Call termination error: ${error?.message || "Unknown error"}`)
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            if (debugMode)
                console.log("Call status changed to FINISHED", {
                    timestamp: new Date().toISOString(),
                })
            setIsAITalking(false)
            setIsUserTalking(false)
            setIsLoading(false)
            setMessages([])
            setTranscript("")
            clearAllTimers()
            if (debugMode)
                console.error("End call error:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
        }
    }

    const clearAllTimers = () => {
        if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current)
            durationTimerRef.current = null
            if (debugMode)
                console.log("Duration timer cleared", {
                    timestamp: new Date().toISOString(),
                })
        }
        if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current)
            responseTimeoutRef.current = null
            if (debugMode)
                console.log("Response timeout cleared", {
                    timestamp: new Date().toISOString(),
                })
        }
        if (screenshotIntervalRef.current) {
            clearInterval(screenshotIntervalRef.current)
            screenshotIntervalRef.current = null
            if (debugMode)
                console.log("Screenshot interval cleared", {
                    timestamp: new Date().toISOString(),
                })
        }
        if (interviewTimerRef.current) {
            clearInterval(interviewTimerRef.current)
            interviewTimerRef.current = null
            if (debugMode)
                console.log("Interview timer cleared", {
                    timestamp: new Date().toISOString(),
                })
        }
        if (debugMode)
            console.log("All timers cleared", {
                timestamp: new Date().toISOString(),
            })
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
                console.log("Cannot start VAPI call", {
                    callStatus,
                    isLoading,
                    timestamp: new Date().toISOString(),
                })
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            setCallStatus(CallStatus.CONNECTING)
            if (debugMode)
                console.log("Call status changed to CONNECTING", {
                    timestamp: new Date().toISOString(),
                })
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
                if (debugMode)
                    console.log("Intro message added", {
                        timestamp: new Date().toISOString(),
                    })
            }

            const formattedQuestions = questions.map((q, i) => `Question ${i + 1}: ${q}`).join("\n\n")

            const interviewer = {
                name: "AI Technical Interviewer",
                firstMessage: `Hello! I'm TaleX AI, your interviewer today. I'll be asking you ${questions.length} technical questions to assess your skills. The interview will last up to ${INTERVIEW_DURATION_MINUTES} minutes. Are you ready?!"`,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en",
                },
                voice: {
                    provider: "11labs",
                    voiceId: "MF3mGyEYCl7XYWbV9V6O",
                },
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `You're a professional interviewer conducting a live voice interview to evaluate a candidate's qualifications, motivation, and role fit.

**Guidelines:**
- Follow the structured question flow: ${{questions}}
- Ask the ${questions.length} technical questions in order, one at a time, starting with question 1.
- Engage naturally:
  - Listen actively, acknowledge responses, and ask brief follow-ups if needed for clarity.
  - Provide hints, not detailed explanations.
  - Keep the conversation smooth and controlled.
- Be professional yet friendly:
  - Use concise, official, and warm language.
  - Sound natural, not robotic.
- Address candidate questions:
  - Answer clearly about the role or company.
  - Redirect to HR if unsure.
- Conclude:
  - Thank the candidate and say the company will follow up.
  - End with: ${ENDING_PHRASE}

**Questions**: ${formattedQuestions}

**Notes:**
- Stay polite and professional.
- Keep responses short, simple, and conversational for voice interaction.
- Avoid long explanations.`,
                        },
                    ],
                },
                endCallPhrases: [ENDING_PHRASE],
            }
            if (debugMode)
                console.log("Starting VAPI call", {
                    timestamp: new Date().toISOString(),
                })
            await vapiClientRef.current.start(VAPI_ASSISTANT_ID, interviewer)
            if (debugMode)
                console.log("VAPI call started successfully", {
                    timestamp: new Date().toISOString(),
                })

            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (callStatus === CallStatus.ACTIVE && vapiClientRef.current) {
                try {
                    vapiClientRef.current.setMuted(false)
                    setIsAudioOn(true)
                    if (debugMode)
                        console.log("Microphone unmuted after call start", {
                            timestamp: new Date().toISOString(),
                        })
                } catch (muteError) {
                    if (debugMode)
                        console.warn("Failed to unmute microphone", {
                            error: muteError,
                            timestamp: new Date().toISOString(),
                        })
                    setError(`Warning: Could not unmute microphone: ${muteError.message}`)
                }
            }

            setCallStatus(CallStatus.ACTIVE)
            if (debugMode)
                console.log("Call status changed to ACTIVE", {
                    timestamp: new Date().toISOString(),
                })
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
            setError(`Failed to start the interview: ${error?.message || "Unknown error"}`)
            setIsAITalking(false)
            setIsUserTalking(false)
            setCallStatus(CallStatus.INACTIVE)
            if (debugMode)
                console.log("Call status changed to INACTIVE", {
                    timestamp: new Date().toISOString(),
                })
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
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            stream.getTracks().forEach((track) => track.stop())
            if (debugMode)
                console.log("Microphone permission granted", {
                    timestamp: new Date().toISOString(),
                })
        } catch (err) {
            setError("Microphone access denied. Please allow microphone access in your browser settings.")
            if (debugMode)
                console.error("Microphone permission error:", {
                    error: err,
                    timestamp: new Date().toISOString(),
                })
            return
        }

        setIsInterviewStarted(true)
        setScreenshots([])
        setScreenshotTimes([])
        setProgress({current: 1, total: questions.length})
        setTimeRemaining(INTERVIEW_DURATION_MINUTES * 60)
        setTimerWarningGiven(false)
        setFinalWarningGiven(false)

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
        if (debugMode) console.log("Interview started", {timestamp: new Date().toISOString()})
    }

    // Handle end interview
    const handleEndInterview = () => {
        stopVAPICall()
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach((track) => track.stop())
        }

        if (debugMode)
            console.log("Interview ended manually", {
                timestamp: new Date().toISOString(),
            })
    }

    const formatTranscriptForSubmission = () => {
        return messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
    }

    const saveTranscriptToLocalStorage = (interviewId) => {
        try {
            const transcript = formatTranscriptForSubmission()
            const transcriptData = {
                interviewId,
                transcript,
                timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`interview_transcript_${interviewId}`, JSON.stringify(transcriptData))
            if (debugMode)
                console.log("Full transcript saved to localStorage", {
                    interviewId,
                    timestamp: new Date().toISOString(),
                })
            return transcriptData
        } catch (error) {
            if (debugMode)
                console.error("Failed to save full transcript to localStorage:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
            return null
        }
    }

    // Force next question
    const forceNextQuestion = () => {
        if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
            setError("Cannot move to next question: Call is not active or VAPI client is unavailable.")
            if (debugMode)
                console.log("Next question aborted", {
                    callStatus,
                    timestamp: new Date().toISOString(),
                })
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
            if (debugMode)
                console.log("Forced next question", {
                    nextIndex,
                    timestamp: new Date().toISOString(),
                })
        } else {
            vapiClientRef.current.say(ENDING_PHRASE, true)
            if (debugMode)
                console.log("Forced interview end on last question", {
                    timestamp: new Date().toISOString(),
                })
        }
    }

    // Toggle transcript visibility
    const toggleTranscript = () => {
        if (showTranscript && transcriptContainerRef.current) {
            import("gsap").then(({gsap}) => {
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
    const toggleAudio = useCallback(() => {
        if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
            if (debugMode)
                console.log("Audio toggle aborted: Call not active or VAPI client unavailable", {
                    callStatus,
                    hasVapiClient: !!vapiClientRef.current,
                    timestamp: new Date().toISOString(),
                })
            return
        }

        try {
            const currentMuted = vapiClientRef.current.isMuted()
            vapiClientRef.current.setMuted(!currentMuted)

            const peerConnection = vapiClientRef.current.getPeerConnection?.() || null

            if (peerConnection) {
                const senders = peerConnection.getSenders() || []
                senders.forEach((sender) => {
                    if (sender.track && sender.track.kind === "audio") {
                        sender.track.enabled = currentMuted
                        if (debugMode)
                            console.log(`Audio track ${currentMuted ? "enabled" : "disabled"}`, {
                                trackId: sender.track.id,
                                timestamp: new Date().toISOString(),
                            })
                    }
                })
            } else {
                navigator.mediaDevices
                    .getUserMedia({audio: true})
                    .then((stream) => {
                        const audioTracks = stream.getAudioTracks()
                        if (audioTracks && audioTracks.length > 0) {
                            audioTracks.forEach((track) => {
                                track.enabled = currentMuted
                                if (debugMode)
                                    console.log(`Audio track ${currentMuted ? "enabled" : "disabled"} (direct)`, {
                                        trackId: track.id,
                                        timestamp: new Date().toISOString(),
                                    })
                            })
                        }
                        if (!currentMuted) {
                            audioTracks.forEach((track) => track.stop())
                        }
                    })
                    .catch((err) => {
                        if (debugMode)
                            console.error("Error accessing microphone for muting:", {
                                error: err,
                                timestamp: new Date().toISOString(),
                            })
                    })
            }

            setIsAudioOn(currentMuted)
            if (debugMode)
                console.log("Audio toggled completely", {
                    newAudioState: !currentMuted,
                    timestamp: new Date().toISOString(),
                })
        } catch (error) {
            setError(`Warning: Could not toggle microphone: ${error?.message || "Unknown error"}`)
            if (debugMode)
                console.error("Error toggling audio:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
        }
    }, [vapiClientRef, callStatus, debugMode])

    const getInterviewTranscript = () => {
        const validMessages = messages.filter(
            (msg) => msg.content && msg.content.trim() !== "" && ["assistant", "user"].includes(msg.role),
        )

        const deduplicatedMessages = []
        const seenContent = new Set()

        for (const msg of validMessages) {
            const key = `${msg.role}:${msg.content.trim()}`
            if (!seenContent.has(key)) {
                seenContent.add(key)
                deduplicatedMessages.push(msg)
            }
        }

        const transcript = deduplicatedMessages
            .map((msg) => {
                const speaker = msg.role === "assistant" ? "AI" : "Candidate"
                return `${speaker}: ${msg.content.trim()}`
            })
            .join("\n")

        if (debugMode) {
            console.log("Generated clean transcript:", {
                transcript,
                originalMessageCount: messages.length,
                validMessageCount: validMessages.length,
                deduplicatedMessageCount: deduplicatedMessages.length,
                timestamp: new Date().toISOString(),
            })
        }

        return transcript
    }

    const saveCleanTranscriptToLocalStorage = (interviewId) => {
        try {
            const transcript = getInterviewTranscript()
            const transcriptData = {
                interviewId,
                transcript,
                timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`interview_clean_transcript_${interviewId}`, JSON.stringify(transcriptData))
            if (debugMode)
                console.log("Clean transcript saved to localStorage", {
                    interviewId,
                    transcriptLength: transcript.length,
                    timestamp: new Date().toISOString(),
                })
            return transcriptData
        } catch (error) {
            if (debugMode)
                console.error("Failed to save clean transcript to localStorage:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
            return null
        }
    }

    const getCompleteTranscript = () => {
        const validMessages = messages.filter(
            (msg) => msg.content && msg.content.trim() !== "" && ["assistant", "user"].includes(msg.role),
        )

        const deduplicatedMessages = []
        const seenContent = new Set()

        for (const msg of validMessages) {
            const key = `${msg.role}:${msg.content.trim()}`
            if (!seenContent.has(key)) {
                seenContent.add(key)
                deduplicatedMessages.push(msg)
            }
        }

        const transcript = deduplicatedMessages
            .map((msg) => {
                const speaker = msg.role === "assistant" ? "AI" : "Candidate"
                return `${speaker}: ${msg.content.trim()}`
            })
            .join("\n\n")

        if (debugMode) {
            console.log("Generated complete transcript:", {
                transcriptLength: transcript.length,
                originalMessageCount: messages.length,
                validMessageCount: validMessages.length,
                deduplicatedMessageCount: deduplicatedMessages.length,
                timestamp: new Date().toISOString(),
            })
        }

        return transcript
    }

    const getStructuredTranscript = () => {
        const validMessages = messages.filter(
            (msg) => msg.content && msg.content.trim() !== "" && ["assistant", "user"].includes(msg.role),
        )

        const deduplicatedMessages = []
        const seenContent = new Set()

        for (const msg of validMessages) {
            const key = `${msg.role}:${msg.content.trim()}`
            if (!seenContent.has(key)) {
                seenContent.add(key)
                deduplicatedMessages.push(msg)
            }
        }

        return deduplicatedMessages.map((msg) => ({
            role: msg.role,
            speaker: msg.role === "assistant" ? "AI" : "Candidate",
            content: msg.content.trim(),
            timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
        }))
    }

    const saveAndGetTranscript = (interviewId) => {
        try {
            const plainTextTranscript = getCompleteTranscript()
            const structuredTranscript = getStructuredTranscript()

            const transcriptData = {
                interviewId,
                plainText: plainTextTranscript,
                structured: structuredTranscript,
                timestamp: new Date().toISOString(),
                metadata: {
                    questionCount: questions.length,
                    completedQuestions: getCompletedQuestionsSummary().length,
                    interviewDuration: interviewDuration,
                },
            }

            localStorage.setItem(`interview_transcript_${interviewId}`, JSON.stringify(transcriptData))

            if (debugMode) {
                console.log("Complete transcript saved and ready to send:", {
                    interviewId,
                    transcriptLength: plainTextTranscript.length,
                    messageCount: structuredTranscript.length,
                    timestamp: new Date().toISOString(),
                })
            }

            return transcriptData
        } catch (error) {
            if (debugMode) {
                console.error("Failed to save/get transcript:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
            }
            return null
        }
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
        setProgress({current: 1, total: questions.length})
        if (debugMode)
            console.log("Question states reset", {
                timestamp: new Date().toISOString(),
            })
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
            setProgress({current: questionIndex + 1, total: questions.length})

            if (vapiClientRef.current) {
                vapiClientRef.current.send({
                    type: "add-message",
                    message: {
                        role: "system",
                        content: `Retrying question ${questionIndex + 1}: "${questions[questionIndex]}"`,
                    },
                })
                if (debugMode)
                    console.log("Retrying question", {
                        questionIndex,
                        timestamp: new Date().toISOString(),
                    })
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

    const retrieveInterviewData = (interviewId) => {
        try {
            const fullTranscriptData = JSON.parse(localStorage.getItem(`interview_transcript_${interviewId}`))
            const cleanTranscriptData = JSON.parse(localStorage.getItem(`interview_clean_transcript_${interviewId}`))
            const screenshotData = []
            for (let i = 0; i < MAX_SCREENSHOTS; i++) {
                const data = JSON.parse(localStorage.getItem(`interview_screenshot_${interviewId}_${i}`))
                if (data) screenshotData.push(data)
            }
            return {
                fullTranscript: fullTranscriptData,
                cleanTranscript: cleanTranscriptData,
                screenshots: screenshotData,
            }
        } catch (error) {
            setError(`Failed to retrieve interview data: ${error?.message || "Unknown error"}`)
            if (debugMode)
                console.error("Retrieve interview data error:", {
                    error,
                    timestamp: new Date().toISOString(),
                })
            return null
        }
    }

    // Monitor interview completion state
    useEffect(() => {
        if (isInterviewComplete && conclusionDetected) {
            if (debugMode)
                console.log("Interview completed, should show completion dialog", {
                    timestamp: new Date().toISOString(),
                })

            const event = new CustomEvent("interviewCompleted", {
                detail: {
                    transcript: getInterviewTranscript(),
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
            lastSpeakerTranscript,
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
            setLastSpeakerTranscript,
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
            getInterviewTranscript,
            forceNextQuestion,
            resetQuestionStates,
            saveAndGetTranscript,
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