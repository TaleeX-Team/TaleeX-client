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
const VAPI_API_KEY =  "d4ecde21-8c7d-4f5c-9996-5c2b306d9ccf"

export function useInterviewState(questions) {
    // State variables
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [displayedQuestion, setDisplayedQuestion] = useState(questions[0])
    const [progress, setProgress] = useState({ current: 1, total: questions.length }) // For progress bar
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isInterviewComplete, setIsInterviewComplete] = useState(false)
    const [isInterviewStarted, setIsInterviewStarted] = useState(false)
    const [isAITalking, setIsAITalking] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [messages, setMessages] = useState([])
    const [lastMessage, setLastMessage] = useState(null)
    const [showTranscript, setShowTranscript] = useState(true)
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(0)
    const [nextQuestion, setNextQuestion] = useState("")
    const [showNextQuestion, setShowNextQuestion] = useState(false)
    const [conclusionDetected, setConclusionDetected] = useState(false)
    const [lastUserResponseTime, setLastUserResponseTime] = useState(null)
    const [aiSilentTime, setAiSilentTime] = useState(0)
    const [interviewDuration, setInterviewDuration] = useState(0)
    const [transcriptExpanded, setTranscriptExpanded] = useState(true)
    const [questionTransitions, setQuestionTransitions] = useState([])
    const [messageHistory, setMessageHistory] = useState([])
    const [lastSpeakingRole, setLastSpeakingRole] = useState(null)
    const [detectedEmotions, setDetectedEmotions] = useState([])
    const [nervousnessScore, setNervousnessScore] = useState(0)
    const [screenshots, setScreenshots] = useState([])
    const [screenshotTimes, setScreenshotTimes] = useState([])
    const [lastCapturedScreenshot, setLastCapturedScreenshot] = useState(null)
    const [screenshotInterval, setScreenshotInterval] = useState(null)
    const [screenshotError, setScreenshotError] = useState(null)
    const [latestEmotion, setLatestEmotion] = useState(null)
    const navigate = useNavigate()
    const [debugMode, setDebugMode] = useState(true)

    const maxScreenshots = 3
    const ENDING_PHRASE = "That concludes our interview today. Thank you for your time."

    // Refs
    const videoRef = useRef(null)
    const aiVideoContainerRef = useRef(null)
    const userVideoContainerRef = useRef(null)
    const transcriptContainerRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const mainContentRef = useRef(null)
    const vapiClientRef = useRef(null)
    const messagesEndRef = useRef(null)
    const lastMessageRef = useRef(null)
    const silenceTimerRef = useRef(null)
    const durationTimerRef = useRef(null)
    const aiSpeechEndTimerRef = useRef(null)

    // Initialize VAPI client
    useEffect(() => {
        if (!vapiClientRef.current && typeof Vapi !== "undefined") {
            vapiClientRef.current = new Vapi(VAPI_API_KEY)
            console.log("VAPI client initialized with API key")
        } else if (!Vapi) {
            setError("VAPI SDK failed to load")
        }
    }, [])

    // Update last message
    useEffect(() => {
        if (messages.length > 0) {
            const newLastMessage = messages[messages.length - 1]
            setLastMessage(newLastMessage)
            if (newLastMessage.role === "user") {
                setLastUserResponseTime(new Date())
                setLastSpeakingRole("user")
            }
            if (newLastMessage.role === "assistant") {
                setIsAITalking(true)
                setLastSpeakingRole("assistant")
                if (aiSpeechEndTimerRef.current) clearTimeout(aiSpeechEndTimerRef.current)
            }
            setMessageHistory((prev) => [...prev, newLastMessage].slice(-5))
        }
    }, [messages])

    // Update displayed question and progress
    useEffect(() => {
        setDisplayedQuestion(questions[currentQuestionIndex])
        setProgress({ current: currentQuestionIndex + 1, total: questions.length })
        if (currentQuestionIndex < questions.length - 1) {
            setNextQuestion(questions[currentQuestionIndex + 1])
            setShowNextQuestion(true)
        } else {
            setShowNextQuestion(false)
            checkIfFinalQuestion()
        }
        setQuestionTransitions((prev) => [
            ...prev,
            {
                timestamp: new Date(),
                from: prev.length > 0 ? prev[prev.length - 1].to : 0,
                to: currentQuestionIndex,
            },
        ])
        console.log(`Question updated to index ${currentQuestionIndex + 1}/${questions.length}`)
    }, [currentQuestionIndex, questions])

    // Setup screenshot capture
    useEffect(() => {
        if (isInterviewStarted && callStatus === CallStatus.ACTIVE && videoRef.current) {
            console.log("Setting up screenshot capture system (every 1.5 minutes)...")
            if (screenshotInterval) clearInterval(screenshotInterval)
            const intervalTime = 90000 // 1.5 minutes
            const intervalId = setInterval(() => {
                if (screenshots.length < maxScreenshots) {
                    console.log(`Taking scheduled screenshot ${screenshots.length + 1}/${maxScreenshots}`)
                    captureScreenshot()
                    if (screenshots.length >= maxScreenshots - 1) {
                        console.log("Max screenshots reached, clearing interval")
                        clearInterval(intervalId)
                    }
                }
            }, intervalTime)
            setScreenshotInterval(intervalId)
            return () => clearInterval(intervalId)
        }
        return () => {
            if (screenshotInterval) clearInterval(screenshotInterval)
        }
    }, [isInterviewStarted, callStatus, screenshots.length])

    // Calculate nervousness score
    useEffect(() => {
        const nervousInstances = detectedEmotions.filter((e) => e.isNervous).length
        const totalEmotions = detectedEmotions.length
        const score = totalEmotions > 0 ? (nervousInstances / totalEmotions) * 100 : 0
        setNervousnessScore(Math.round(score))
        console.log(`Nervousness score updated: ${score}%`)
        const interviewId = Date.now().toString()
        const emotionData = {
            interviewId,
            detectedEmotions,
            nervousnessScore: score,
            timestamp: new Date().toISOString(),
        }
        localStorage.setItem(`interview_emotions_${interviewId}`, JSON.stringify(emotionData))
    }, [detectedEmotions])

    // Save transcript
    useEffect(() => {
        if (transcript) {
            const interviewId = Date.now().toString()
            const transcriptData = {
                interviewId,
                transcript,
                timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`interview_transcript_${interviewId}`, JSON.stringify(transcriptData))
            console.log("Transcript saved to localStorage")
        }
    }, [transcript])

    // Capture screenshot
    const captureScreenshot = () => {
        console.log("Attempting to capture screenshot...")
        if (!videoRef.current) {
            console.error("Video reference not available for screenshot")
            setScreenshotError("Video reference not available")
            return null
        }
        try {
            const screenshot = videoRef.current.getScreenshot()
            if (!screenshot) {
                console.error("Failed to capture screenshot - got null/empty result")
                setScreenshotError("Failed to capture screenshot - empty result")
                return null
            }
            console.log(`Screenshot captured successfully (${screenshots.length + 1}/${maxScreenshots})`)
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
            console.log("Screenshot saved to localStorage")
            return screenshot
        } catch (error) {
            console.error("Error capturing screenshot:", error)
            setScreenshotError(`Screenshot error: ${error.message}`)
            return null
        }
    }

    // Manual screenshot
    const takeManualScreenshot = () => {
        if (screenshots.length < maxScreenshots) {
            const screenshot = captureScreenshot()
            if (screenshot) console.log("Manual screenshot taken successfully")
        } else {
            console.warn(`Maximum number of screenshots (${maxScreenshots}) reached`)
        }
    }

    // Setup VAPI client listeners
    useEffect(() => {
        if (vapiClientRef.current) {
            console.log("Setting up VAPI client listeners")
            const handleMessage = (message) => {
                console.log("VAPI message received:", message.role, message.content?.substring(0, 50) + "...")
                if (message.role === "assistant") {
                    setMessages((prev) => [...prev, message])
                    if (message.content?.trim() === ENDING_PHRASE) {
                        console.log("ENDING PHRASE DETECTED - INITIATING CALL TERMINATION")
                        setConclusionDetected(true)
                        endCallImmediately()
                    }
                    // Detect question transitions
                    const nextIndex = currentQuestionIndex + 1
                    const isQuestionTransition = message.content.match(/Next question|Question \d+|Moving on to/i) ||
                        (nextIndex < questions.length && message.content.includes(questions[nextIndex]))
                    if (isQuestionTransition && nextIndex < questions.length) {
                        console.log(`Detected transition to question ${nextIndex + 1}`)
                        setCurrentQuestionIndex(nextIndex)
                        setTotalQuestionsAsked((prev) => prev + 1)
                        setProgress({ current: nextIndex + 1, total: questions.length })
                    }
                }
                if (message.role === "user" && message.emotion) {
                    const isNervous = message.emotion.includes("frustration") ||
                        message.emotion.includes("urgency") ||
                        message.emotion.includes("stress")
                    const emotionData = {
                        timestamp: new Date(),
                        emotions: message.emotion,
                        isNervous,
                        questionIndex: currentQuestionIndex,
                        confidence: message.confidence || 0.5,
                    }
                    setDetectedEmotions((prev) => [...prev, emotionData])
                    setLatestEmotion(emotionData)
                    setTranscript((prev) =>
                        `${prev}\n[Emotion Analysis at ${emotionData.timestamp.toLocaleTimeString()} for Q${currentQuestionIndex + 1}]: ` +
                        `${isNervous ? "Nervous" : "Not Nervous"} (Emotions: ${message.emotion}, Confidence: ${emotionData.confidence.toFixed(2)})`
                    )
                    console.log("Tone/Emotion Analysis:", {
                        question: questions[currentQuestionIndex],
                        response: message.content?.substring(0, 100) + "...",
                        emotions: message.emotion,
                        isNervous,
                        confidence: emotionData.confidence.toFixed(2),
                        timestamp: emotionData.timestamp.toLocaleString(),
                    })
                    if (message.relevanceScore && message.relevanceScore < 0.4) {
                        console.warn("Evasive response detected (relevanceScore:", message.relevanceScore, ")")
                        vapiClientRef.current.send({
                            type: "add-message",
                            message: {
                                role: "system",
                                content: `The candidate's response seems off-topic or unclear. Politely rephrase the question: "${questions[currentQuestionIndex]}" and ask for a specific answer.`,
                            },
                        })
                    }
                }
            }
            const handleSpeechStart = () => {
                console.log("Assistant speech started")
                setIsAITalking(true)
            }
            const handleSpeechEnd = () => {
                console.log("Assistant speech ended")
                setIsAITalking(false)
                aiSpeechEndTimerRef.current = setTimeout(() => setLastSpeakingRole("user"), 1000)
            }
            const handleError = (error) => {
                console.error("VAPI error:", {
                    message: error.message,
                    response: error.response ? JSON.stringify(error.response, null, 2) : "No response data",
                    stack: error.stack,
                })
                setError(`VAPI error: ${error.message || "Unknown error"}. ${error.response ? `Details: ${JSON.stringify(error.response)}` : "No details"}`)
            }
            const handleVolumeLevel = (volume) => {
                if (debugMode) console.log("Volume level:", volume)
            }
            vapiClientRef.current.on("message", handleMessage)
            vapiClientRef.current.on("speech-start", handleSpeechStart)
            vapiClientRef.current.on("speech-end", handleSpeechEnd)
            vapiClientRef.current.on("error", handleError)
            vapiClientRef.current.on("volume-level", handleVolumeLevel)
            return () => {
                console.log("Cleaning up VAPI client listeners")
                vapiClientRef.current.off("message", handleMessage)
                vapiClientRef.current.off("speech-start", handleSpeechStart)
                vapiClientRef.current.off("speech-end", handleSpeechEnd)
                vapiClientRef.current.off("error", handleError)
                vapiClientRef.current.off("volume-level", handleVolumeLevel)
            }
        }
    }, [vapiClientRef.current, currentQuestionIndex, questions, debugMode])

    const endCallImmediately = async () => {
        console.log("Executing immediate call termination")
        if (callStatus === CallStatus.FINISHED) {
            console.log("Call already finished")
            return
        }
        try {
            if (vapiClientRef.current) {
                await vapiClientRef.current.stop()
                console.log("VAPI client stopped successfully")
            }
            if (screenshots.length < maxScreenshots) {
                console.log("Taking final screenshot")
                captureScreenshot()
            }
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            setIsAITalking(false)
            setConclusionDetected(true)
            clearAllTimers()
            console.log("Interview completed")
        } catch (error) {
            console.error("Error during call termination:", error)
            setError(`Call termination error: ${error.message}`)
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            clearAllTimers()
        }
    }

    const stopVAPICall = async () => {
        console.log("stopVAPICall called")
        try {
            if (!vapiClientRef.current) {
                console.warn("VAPI client is not available")
            } else if (callStatus === CallStatus.FINISHED) {
                console.log("Call already finished")
            } else {
                await endCallImmediately()
            }
        } catch (error) {
            console.error("Error in stopVAPICall:", error)
            setIsInterviewComplete(true)
            setCallStatus(CallStatus.FINISHED)
            clearAllTimers()
        }
    }

    const clearAllTimers = () => {
        console.log("Clearing all timers")
        if (durationTimerRef.current) clearInterval(durationTimerRef.current)
        if (silenceTimerRef.current) clearInterval(silenceTimerRef.current)
        if (aiSpeechEndTimerRef.current) clearTimeout(aiSpeechEndTimerRef.current)
        if (screenshotInterval) clearInterval(screenshotInterval)
        durationTimerRef.current = null
        silenceTimerRef.current = null
        aiSpeechEndTimerRef.current = null
        setScreenshotInterval(null)
    }

    // Duration timer
    useEffect(() => {
        if (isInterviewStarted) {
            durationTimerRef.current = setInterval(() => {
                setInterviewDuration((prev) => prev + 1)
            }, 1000)
        }
        return () => {
            if (durationTimerRef.current) clearInterval(durationTimerRef.current)
        }
    }, [isInterviewStarted])

    // Monitor AI silence
    useEffect(() => {
        if (silenceTimerRef.current) clearInterval(silenceTimerRef.current)
        if (
            callStatus === CallStatus.ACTIVE &&
            currentQuestionIndex === questions.length - 1 &&
            lastUserResponseTime &&
            !isAITalking &&
            lastSpeakingRole === "user"
        ) {
            silenceTimerRef.current = setInterval(() => {
                setAiSilentTime((prev) => prev + 1)
            }, 1000)
        }
        return () => {
            if (silenceTimerRef.current) clearInterval(silenceTimerRef.current)
        }
    }, [callStatus, currentQuestionIndex, questions.length, lastUserResponseTime, isAITalking, lastSpeakingRole])

    // End call on silence
    useEffect(() => {
        if (aiSilentTime > 10 && currentQuestionIndex === questions.length - 1 && lastUserResponseTime) {
            console.log("AI silent for too long - ending call")
            if (vapiClientRef.current) {
                vapiClientRef.current.say(ENDING_PHRASE, true)
                setTimeout(() => stopVAPICall(), 5000)
            } else {
                stopVAPICall()
            }
        }
    }, [aiSilentTime, currentQuestionIndex, questions.length, lastUserResponseTime])

    // Monitor conclusion
    useEffect(() => {
        if (conclusionDetected && !isInterviewComplete) {
            console.log("Conclusion detected, ensuring call ends")
            if (screenshots.length < maxScreenshots) captureScreenshot()
            setTimeout(() => stopVAPICall(), 3000)
        }
    }, [conclusionDetected, isInterviewComplete, screenshots.length])

    const gracefullyEndCall = () => {
        console.log("Gracefully ending call")
        if (callStatus === CallStatus.FINISHED) {
            console.log("Call already finished")
            return
        }
        setCallStatus(CallStatus.FINISHED)
        if (screenshots.length < maxScreenshots) captureScreenshot()
        if (vapiClientRef.current) {
            vapiClientRef.current.stop()
                .then(() => {
                    console.log("VAPI call stopped successfully")
                    completeInterviewCleanup()
                })
                .catch((error) => {
                    console.error("Error stopping VAPI call:", error)
                    completeInterviewCleanup()
                })
        } else {
            completeInterviewCleanup()
        }
    }

    const completeInterviewCleanup = () => {
        setIsAITalking(false)
        setIsInterviewComplete(true)
        clearAllTimers()
        console.log("Interview completed and cleaned up")
        const transcriptData = formatTranscriptForSubmission()
        console.log("Transcript prepared for submission")
    }

    // Format transcript
    const formatTranscriptForSubmission = () => {
        const formattedTranscript = messages
            .map((msg, index) => {
                const speaker = msg.role === "assistant" ? "AI Interviewer" : "Candidate"
                const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "unknown time"
                const emotion = detectedEmotions.find((e) => e.timestamp.toLocaleTimeString() === timestamp)
                const emotionText = emotion ? ` [Emotion: ${emotion.isNervous ? "Nervous" : "Not Nervous"}, Confidence: ${emotion.confidence.toFixed(2)}]` : ""
                return `[${timestamp}] ${speaker}: ${msg.content || "[No content]"}${emotionText}`
            })
            .join("\n\n")
        const header =
            `Interview Transcript\n` +
            `Date: ${new Date().toLocaleDateString()}\n` +
            `Duration: ${formatDuration(interviewDuration)}\n` +
            `Questions: ${totalQuestionsAsked} of ${questions.length}\n` +
            `Nervousness Score: ${nervousnessScore}%\n` +
            `--------------------------------\n\n`
        return header + formattedTranscript
    }

    // Format duration
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Retrieve saved data
    const retrieveInterviewData = (interviewId) => {
        try {
            const transcriptData = JSON.parse(localStorage.getItem(`interview_transcript_${interviewId}`))
            const emotionData = JSON.parse(localStorage.getItem(`interview_emotions_${interviewId}`))
            const screenshotData = []
            for (let i = 0; i < maxScreenshots; i++) {
                const data = JSON.parse(localStorage.getItem(`interview_screenshot_${interviewId}_${i}`))
                if (data) screenshotData.push(data)
            }
            const result = {
                transcript: transcriptData,
                emotions: emotionData,
                screenshots: screenshotData,
            }
            console.log("Interview data retrieved from localStorage:", result)
            return result
        } catch (error) {
            console.error("Error retrieving interview data:", error)
            setError(`Failed to retrieve interview data: ${error.message}`)
            return null
        }
    }

    // Start VAPI call
    const startVAPICall = async () => {
        if (!vapiClientRef.current || callStatus === CallStatus.ACTIVE || isLoading) {
            console.warn("Cannot start VAPI call: client not initialized or call already active")
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            setCallStatus(CallStatus.CONNECTING)

            console.log("Starting VAPI call with variables:", {
                questions,
                currentQuestionIndex,
                totalQuestions: questions.length,
                isFirstQuestion: currentQuestionIndex === 0,
                isLastQuestion: currentQuestionIndex === questions.length - 1,
            })

            if (currentQuestionIndex === 0 && messages.length === 0) {
                const introMessage = {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: "Welcome to your technical interview. I'll begin with the first question shortly.",
                    timestamp: new Date(),
                }
                setMessages([introMessage])
            }

            const formattedQuestions = questions.map((q, i) => `Question ${i + 1}: ${q}`).join("\n\n")

            const assistantOverrides = {
                name: "AI Technical Interviewer",
                firstMessage: `Hello! I'm TaleX AI, your interviewer today. I'll be asking you ${questions.length} technical questions to assess your skills. Let's begin with the first question. Are you ready?!`,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en-US",
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
                            content: `You are a senior technical interviewer at a leading tech company, conducting a structured, professional, and rigorous interview to evaluate a candidate's technical expertise, problem-solving ability, and communication skills. Your goal is to create a realistic, engaging, and fair interview experience.

**OBJECTIVES**:
1. Ask the ${questions.length} predefined technical questions in order, one at a time, to assess the candidate's knowledge and reasoning.
2. Maintain a professional, friendly, yet firm tone to simulate a real-world technical interview.
3. Analyze responses for technical accuracy, depth, clarity, and relevance.
4. Detect and address evasive, vague, or off-topic responses with polite redirection.
5. Ask adaptive follow-up questions if the candidate's response is incomplete or shallow (e.g., "Can you elaborate on X?" or "How would you handle Y scenario?").
6. Provide minimal, constructive feedback after each response to maintain flow (e.g., "That's a good start, but could you dive deeper into X?").

**INTERVIEW GUIDELINES**:
- **Introduction**: Begin with a professional greeting, state the number of questions, and set expectations (e.g., "We'll cover ${questions.length} questions to evaluate your technical skills").
- **Question Delivery**:
  - Ask one question at a time, using the exact wording: "${questions[currentQuestionIndex]}".
  - Introduce each question with a natural transition (e.g., "Moving on to question ${currentQuestionIndex + 1}...").
  - If it's the first question, start with: "Let's begin with our first question."
- **Response Handling**:
  - Wait for the candidate to complete their response before responding or moving to the next question.
  - If the response is incomplete or lacks depth, ask a targeted follow-up question (e.g., "Can you explain how you would implement that?" or "What challenges might arise?").
  - If the candidate asks for clarification, provide a concise explanation without giving away the answer.
  - If the candidate is silent for more than 5 seconds, gently prompt: "Would you like me to repeat the question, or do you need a moment to think?"
- **Deception and Evasion Detection**:
  - Identify evasive or off-topic responses (e.g., vague terms like "stuff" or "things," excessive tangents, or irrelevant anecdotes).
  - Politely redirect with: "Thank you, but could you focus on the question: ${questions[currentQuestionIndex]}?" or "Can you provide a more specific answer?"
  - If the candidate tries to derail the interview (e.g., playful avoidance or excessive questions), firmly redirect: "Let's stay on track with the question."
- **Feedback**:
  - Provide brief, neutral feedback after each response (e.g., "Thank you for your answer" or "That's helpful, let's move on").
  - Avoid giving away whether the answer was correct or incorrect.
- **Conclusion**:
  - After the final question, summarize: "Thank you for your responses. You've provided valuable insights into your skills."
  - End with the EXACT phrase: "${ENDING_PHRASE}".
  - Terminate the call immediately after the ending phrase.

**COMMUNICATION STYLE**:
- Use clear, concise, and professional language.
- Maintain a warm but authoritative tone to keep the interview structured.
- Use natural transitions between questions (e.g., "Great, let's move to the next question").
- Avoid lengthy explanations or unsolicited advice unless clarifying.

**RESTRICTIONS**:
- Do NOT answer questions outside the provided list unless clarifying the current question.
- Do NOT engage in casual conversation or respond to attempts to derail the interview.
- Do NOT provide hints or solutions unless the candidate explicitly says they don’t understand.
- Do NOT move to the next question until the candidate has responded or explicitly declines to answer.

**QUESTIONS**:
${formattedQuestions}

**CURRENT QUESTION**:
${questions[currentQuestionIndex]}

**FINAL QUESTION INSTRUCTION**:
${currentQuestionIndex === questions.length - 1 ? `This is the final question. After the candidate's response, provide a brief summary and conclude with: "${ENDING_PHRASE}".` : ""}
`,
                        },
                    ],
                },
                recordingEnabled: true,
                endCallPhrases: [ENDING_PHRASE],
                // Re-enable these after confirming 400 error is resolved:
                // emotionDetection: true,
                // silenceTimeoutSeconds: 10,
            }

            console.log("Assistant overrides:", JSON.stringify(assistantOverrides, null, 2))
            await vapiClientRef.current.start(VAPI_ASSISTANT_ID, assistantOverrides)
            console.log("VAPI call started successfully with PlayHT TTS")
            setIsAITalking(true)
            setLastSpeakingRole("assistant")
            setCallStatus(CallStatus.ACTIVE)
            setIsLoading(false)
        } catch (error) {
            console.error("Error starting VAPI call:", {
                message: error.message,
                response: error.response ? JSON.stringify(error.response, null, 2) : "No response data",
                stack: error.stack,
            })
            setError(`Failed to start the interview: ${error.message || "Unknown error"}. ${error.response ? `Details: ${JSON.stringify(error.response)}` : "No details"}`)
            setIsAITalking(false)
            setCallStatus(CallStatus.INACTIVE)
            setIsLoading(false)
        }
    }

    const checkIfFinalQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            console.log("Final question detected")
            if (vapiClientRef.current) {
                vapiClientRef.current.send({
                    type: "add-message",
                    message: {
                        role: "system",
                        content: `This is the final question. After the candidate's response, provide a brief summary and conclude with: "${ENDING_PHRASE}".`,
                    },
                })
            }
        }
    }

    const handleStartInterview = async () => {
        setIsInterviewStarted(true)
        setTotalQuestionsAsked(1)
        setScreenshots([])
        setScreenshotTimes([])
        setProgress({ current: 1, total: questions.length })
        await startVAPICall()
    }

    const handleEndInterview = () => {
        stopVAPICall()
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach((track) => track.stop())
        }
        navigate("/")
    }


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

    const toggleTranscriptExpanded = () => {
        setTranscriptExpanded(!transcriptExpanded)
    }

    const toggleAudio = () => {
        if (vapiClientRef.current) {
            const currentMuted = vapiClientRef.current.isMuted()
            vapiClientRef.current.setMuted(!currentMuted)
            setIsAudioOn(currentMuted)
        } else {
            setIsAudioOn(!isAudioOn)
        }
    }

    return {
        state: {
            currentQuestionIndex,
            displayedQuestion,
            progress, // Expose for progress bar
            isVideoOn,
            isAudioOn,
            isInterviewComplete,
            isInterviewStarted,
            isAITalking,
            transcript,
            messages,
            lastMessage,
            showTranscript,
            callStatus,
            isLoading,
            error,
            totalQuestionsAsked,
            nextQuestion,
            showNextQuestion,
            conclusionDetected,
            lastUserResponseTime,
            aiSilentTime,
            interviewDuration,
            transcriptExpanded,
            questionTransitions,
            messageHistory,
            lastSpeakingRole,
            screenshots,
            screenshotTimes,
            lastCapturedScreenshot,
            detectedEmotions,
            nervousnessScore,
            latestEmotion,
            debugMode,
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
            setTranscript,
            setMessages,
            setLastMessage,
            setShowTranscript,
            setCallStatus,
            setIsLoading,
            setError,
            setTotalQuestionsAsked,
            setNextQuestion,
            setShowNextQuestion,
            setConclusionDetected,
            setLastUserResponseTime,
            setAiSilentTime,
            setInterviewDuration,
            setTranscriptExpanded,
            setQuestionTransitions,
            setMessageHistory,
            setLastSpeakingRole,
            handleStartInterview,
            handleEndInterview,
            toggleTranscript,
            toggleTranscriptExpanded,
            toggleAudio,
            stopVAPICall,
            startVAPICall,
            checkIfFinalQuestion,
            captureScreenshot,
            takeManualScreenshot,
            retrieveInterviewData,
            setDebugMode,
        },
        refs: {
            videoRef,
            aiVideoContainerRef,
            userVideoContainerRef,
            transcriptContainerRef,
            messagesContainerRef,
            mainContentRef,
            vapiClientRef,
            messagesEndRef,
            lastMessageRef,
            durationTimerRef,
            silenceTimerRef,
            aiSpeechEndTimerRef,
        },
    }
}