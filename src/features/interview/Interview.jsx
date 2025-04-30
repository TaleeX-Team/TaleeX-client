import {useState, useEffect, useRef} from "react"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    MessageSquare,
    X,
    Loader2,
    User,
    Clock,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Bot
} from "lucide-react"
import {gsap} from "gsap"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Alert, AlertDescription} from "@/components/ui/alert"

import Vapi from "@vapi-ai/web"
import {useNavigate} from "react-router-dom"
import {InterviewCompletedDialog} from "@/components/interview/InterviewCompletedDialog.jsx"
import {Progress} from "@/components/ui/progress"
import SplineComponent from "@/components/interview/3dLoading.jsx";
import {globalStyles} from "@/lib/globalStyles.js";

// Mock questions data - now more conversational
const questions = [
    "Could you walk me through your experience with React.js? I'm particularly interested in a challenging project you've worked on.",
    "What's been your approach when facing challenges with RESTful APIs? Can you share a specific example?",
    "I'd like to understand your perspective on React's virtual DOM. How have you seen it impact application performance?",
    "When it comes to optimizing HTML and CSS for performance, what strategies have you found most effective?",
    "How do you typically manage version control in your projects? I'm curious about your Git workflow.",
]

// VAPI API configuration
const VAPI_API_KEY = "d4ecde21-8c7d-4f5c-9996-5c2b306d9ccf"
const VAPI_ASSISTANT_ID = "a7939f6e-e04e-4bce-ac30-c6e7e35655a6"

// Call status for better state management
const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
}

export default function Interview() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [displayedQuestion, setDisplayedQuestion] = useState(questions[0])
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isInterviewComplete, setIsInterviewComplete] = useState(false)
    const [isInterviewStarted, setIsInterviewStarted] = useState(false)
    const [isAITalking, setIsAITalking] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [messages, setMessages] = useState([])
    const [lastMessage, setLastMessage] = useState(null)
    const [showTranscript, setShowTranscript] = useState(true) // Default to showing transcript
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

    const videoRef = useRef(null)
    const aiVideoContainerRef = useRef(null)
    const userVideoContainerRef = useRef(null)
    const transcriptContainerRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const mainContentRef = useRef(null)
    const vapiClientRef = useRef(null)
    const messagesEndRef = useRef(null)
    const silenceTimerRef = useRef(null)
    const durationTimerRef = useRef(null)
    const lastMessageRef = useRef(null)
    const navigate = useNavigate()
    console.log(messages)
    // Update last message when messages change
    useEffect(() => {
        if (messages.length > 0) {
            const newLastMessage = messages[messages.length - 1]
            setLastMessage(newLastMessage)

            // If the last message is from the user, update the last user response time
            if (newLastMessage.role === "user") {
                setLastUserResponseTime(new Date())
            }

            // Add to message history (keeping last 5 messages)
            setMessageHistory((prev) => {
                const updatedHistory = [...prev, newLastMessage]
                return updatedHistory.slice(-5) // Keep only the last 5 messages
            })
        }
    }, [messages])

    // Scroll to the last message
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [lastMessage])

    // Update displayed question when currentQuestionIndex changes
    useEffect(() => {
        setDisplayedQuestion(questions[currentQuestionIndex])

        // Set next question for preview (if not the last question)
        if (currentQuestionIndex < questions.length - 1) {
            setNextQuestion(questions[currentQuestionIndex + 1])
            setShowNextQuestion(true)
        } else {
            setShowNextQuestion(false)
            // Check if this is the final question
            checkIfFinalQuestion()
        }

        // Log question transitions for debugging
        setQuestionTransitions((prev) => [
            ...prev,
            {
                timestamp: new Date(),
                from: prev.length > 0 ? prev[prev.length - 1].to : 0,
                to: currentQuestionIndex,
            },
        ])

        console.log(`Question updated to index ${currentQuestionIndex + 1}/${questions.length}`)
    }, [currentQuestionIndex])

    // Animation effect for elements appearing on the page
    useEffect(() => {
        if (isInterviewStarted) {
            // Animate AI and user video containers
            gsap.fromTo(
                [aiVideoContainerRef.current, userVideoContainerRef.current],
                {opacity: 0, y: 20},
                {opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out"},
            )

            // Animate transcript container if visible
            if (showTranscript && transcriptContainerRef.current) {
                gsap.fromTo(
                    transcriptContainerRef.current,
                    {opacity: 0, y: 20},
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.3,
                        ease: "power3.out",
                    },
                )
            }

            // Start interview duration timer
            durationTimerRef.current = setInterval(() => {
                setInterviewDuration((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current)
            }
        }
    }, [isInterviewStarted, showTranscript])

    // Animation for new messages
    useEffect(() => {
        if (lastMessage && lastMessageRef.current) {
            gsap.fromTo(
                lastMessageRef.current,
                {opacity: 0, y: 10},
                {opacity: 1, y: 0, duration: 0.4, ease: "power2.out"},
            )
        }
    }, [lastMessage])

    // Handle the pulsing effect when AI is talking
    useEffect(() => {
        if (isAITalking && aiVideoContainerRef.current) {
            const pulseAnimation = gsap.to(aiVideoContainerRef.current, {
                boxShadow: "0 0 25px 10px rgba(59, 130, 246, 0.7)",
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
            })

            return () => pulseAnimation.kill()
        }
    }, [isAITalking])

    // Monitor for AI silence after user response
    useEffect(() => {
        // Clear any existing timer
        if (silenceTimerRef.current) {
            clearInterval(silenceTimerRef.current)
            silenceTimerRef.current = null
        }

        // If we're on the last question, the user has responded, and the AI is not talking
        if (
            callStatus === CallStatus.ACTIVE &&
            currentQuestionIndex === questions.length - 1 &&
            lastUserResponseTime &&
            !isAITalking
        ) {
            // Start a timer to track silence
            silenceTimerRef.current = setInterval(() => {
                setAiSilentTime((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (silenceTimerRef.current) {
                clearInterval(silenceTimerRef.current)
            }
        }
    }, [callStatus, currentQuestionIndex, questions.length, lastUserResponseTime, isAITalking])

    // Check if we should end the call due to AI silence
    useEffect(() => {
        // If AI has been silent for more than 10 seconds after the last question and user response
        if (aiSilentTime > 10 && currentQuestionIndex === questions.length - 1 && lastUserResponseTime) {
            console.log("AI has been silent for too long after the last question - ending call")

            // Use say method to gracefully end the call
            if (vapiClientRef.current) {
                vapiClientRef.current.say("Thank you for completing the interview. I'll end our call now.", true)
            } else {
                stopVAPICall()
            }
        }
    }, [aiSilentTime, currentQuestionIndex, questions.length, lastUserResponseTime])

    // Initialize VAPI client
    useEffect(() => {
        try {
            // Initialize VAPI according to documentation
            vapiClientRef.current = new Vapi(VAPI_API_KEY)
            console.log("VAPI client initialized successfully")

            // Set up event listeners
            vapiClientRef.current.on("call-start", () => {
                console.log("Call started")
                setCallStatus(CallStatus.ACTIVE)
                setIsLoading(false)
                setIsAITalking(true) // Set AI as talking when call starts
            })

            // Improved call-end event handler to properly end the interview
            vapiClientRef.current.on("call-end", () => {
                console.log("Call ended")
                setCallStatus(CallStatus.FINISHED)
                setIsAITalking(false)
                setIsLoading(false)

                // Always set interview complete when call ends
                setIsInterviewComplete(true)

                // Stop the duration timer
                if (durationTimerRef.current) {
                    clearInterval(durationTimerRef.current)
                }
            })

            // Speech events to track when AI is talking
            vapiClientRef.current.on("speech-start", () => {
                console.log("AI started speaking")
                setIsAITalking(true)
                // Reset AI silent time when it starts speaking
                setAiSilentTime(0)
            })

            vapiClientRef.current.on("speech-end", () => {
                console.log("AI stopped speaking")
                setIsAITalking(false)
            })

            // Improved message event handler to better track questions and update progress
            vapiClientRef.current.on("message", (msg) => {
                console.log("Received message:", msg)

                // Handle transcript messages
                if (msg.type === "transcript") {
                    if (msg.transcriptType === "partial") {
                        // Update live transcript
                        if (msg.transcript) {
                            setTranscript(msg.transcript)
                        }
                    } else if (msg.transcriptType === "final") {
                        // Add final transcript to messages and update lastMessage
                        if (msg.transcript && msg.transcript.trim()) {
                            const newMessage = {
                                id: Date.now().toString(),
                                role: "user",
                                content: msg.transcript,
                                timestamp: new Date(),
                            }
                            setMessages((prev) => [...prev, newMessage])
                            setTranscript("")
                            setLastUserResponseTime(new Date())
                        }
                    }
                }
                // Handle assistant messages
                else if (msg.role === "assistant" && msg.content) {
                    // Add the assistant message to the messages array and update lastMessage
                    const newMessage = {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: msg.content,
                        timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, newMessage])
                    setIsAITalking(true) // Set AI as talking when a new message arrives

                    // Check for conclusion phrases in the message
                    const messageContent = msg.content.toLowerCase()
                    if (
                        (messageContent.includes("thank you") &&
                            (messageContent.includes("concludes") ||
                                messageContent.includes("end") ||
                                messageContent.includes("complete"))) ||
                        messageContent.includes("that concludes our interview") ||
                        messageContent.includes("this concludes our interview") ||
                        messageContent.includes("end of our interview") ||
                        messageContent.includes("interview is complete") ||
                        (currentQuestionIndex === questions.length - 1 && messageContent.includes("thank you for your time"))
                    ) {
                        console.log("Detected interview conclusion message")
                        setConclusionDetected(true)

                        // Stop the call after a short delay to allow the AI to finish speaking
                        setTimeout(() => {
                            if (vapiClientRef.current) {
                                // Use say method to gracefully end the call
                                vapiClientRef.current.say(
                                    "Thank you for completing all the interview questions. I'll end our call now.",
                                    true,
                                )
                            } else {
                                stopVAPICall()
                            }
                        }, 2000)
                    }

                    // Check if this message contains one of our questions
                    let foundNewQuestion = false
                    for (let i = 0; i < questions.length; i++) {
                        // Skip the current question to avoid false positives
                        if (i === currentQuestionIndex) continue

                        // Get the first few words of the question to use as a signature
                        const questionWords = questions[i].toLowerCase().split(" ").slice(0, 6).join(" ")

                        if (messageContent.includes(questionWords)) {
                            console.log(`Detected question ${i + 1}: ${questions[i].substring(0, 30)}...`)
                            setCurrentQuestionIndex(i)
                            setTotalQuestionsAsked((prev) => Math.max(prev, i + 1))
                            foundNewQuestion = true
                            break
                        }
                    }

                    // If we didn't find a new question but the message seems like it's asking something
                    if (
                        !foundNewQuestion &&
                        !conclusionDetected &&
                        (messageContent.includes("?") ||
                            messageContent.includes("could you") ||
                            messageContent.includes("can you") ||
                            messageContent.includes("tell me"))
                    ) {
                        // Move to the next question if we haven't reached the end
                        if (currentQuestionIndex < questions.length - 1) {
                            const nextIndex = currentQuestionIndex + 1
                            console.log(`Moving to next question ${nextIndex + 1}`)
                            setCurrentQuestionIndex(nextIndex)
                            setTotalQuestionsAsked((prev) => Math.max(prev, nextIndex + 1))
                        }
                    }
                }
            })
        } catch (err) {
            console.error("Error initializing VAPI client:", err)
            setError("Failed to initialize the interview system. Please try again.")
        }

        return () => {
            if (vapiClientRef.current) {
                vapiClientRef.current.removeAllListeners()
                stopVAPICall()
            }
        }
    }, [])

    // Handle camera access
    useEffect(() => {
        if (isVideoOn && videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({video: true, audio: isAudioOn})
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                    }
                })
                .catch((err) => {
                    console.error("Error accessing camera:", err)
                    setIsVideoOn(false)
                    setError("Could not access camera. Please check your permissions.")
                })
        } else if (!isVideoOn && videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach((track) => track.stop())
            videoRef.current.srcObject = null
        }
    }, [isVideoOn, isAudioOn])

    // Improved stopVAPICall function to properly handle interview completion
    const stopVAPICall = async () => {
        if (vapiClientRef.current) {
            try {
                console.log("Stopping VAPI call")
                await vapiClientRef.current.stop()
                console.log("VAPI call stopped successfully")
                setCallStatus(CallStatus.FINISHED)
                setIsAITalking(false)
                setIsInterviewComplete(true)

                // Stop the duration timer
                if (durationTimerRef.current) {
                    clearInterval(durationTimerRef.current)
                }
            } catch (error) {
                console.error("Error stopping VAPI call:", error)
                // Even if there's an error, we should still set the interview as complete
                setCallStatus(CallStatus.FINISHED)
                setIsInterviewComplete(true)

                // Stop the duration timer
                if (durationTimerRef.current) {
                    clearInterval(durationTimerRef.current)
                }
            }
        }
    }

    // Improved startVAPICall function to simplify the workflow integration
    const startVAPICall = async () => {
        if (!vapiClientRef.current || callStatus === CallStatus.ACTIVE || isLoading) return

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

            // Add the first AI message if this is the start of the interview
            if (currentQuestionIndex === 0 && messages.length === 0) {
                const introMessage = {
                    id: Date.now().toString(),
                    role: "assistant",
                    timestamp: new Date(),
                }
                setMessages([introMessage])
            }

            // Format questions for the AI
            const formattedQuestions = questions.map((q, i) => `Question ${i + 1}: ${q}`).join("\n\n")

            // Updated assistantOverrides with complete configuration
            const assistantOverrides = {
                name: "AI Recruiter",
                firstMessage: `Hi there! Welcome to your technical interview. I'll be asking you ${questions.length} questions about your technical experience.`,
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
                            content: `You are an AI voice assistant conducting technical interviews.

Your primary job is to ask candidates the provided interview questions and assess their responses.

IMPORTANT GUIDELINES:
1. Begin with a brief, friendly introduction mentioning you'll ask ${questions.length} questions.
2. Ask one question at a time and wait for the candidate's response.
3. Keep your questions clear, concise, and direct.
4. Only offer explanations or hints if the candidate explicitly says they don't understand or asks for clarification.
5. Provide very brief, encouraging feedback after each answer before moving to the next question.
6. Keep the conversation natural but focused - avoid lengthy explanations or tangents.
7. After all questions, briefly summarize and end on a positive note.
8. Use a warm, friendly tone throughout the interview to make the candidate comfortable.
9. IMPORTANT: After asking the final question and receiving a response, clearly indicate the interview is complete with a phrase like "That concludes our interview today. Thank you for your time."

COMMUNICATION STYLE:
✅ Be friendly and professional
✅ Keep your responses short and direct
✅ Focus on asking questions, not explaining concepts
✅ Only elaborate when the candidate needs clarification
✅ Ensure the interview remains focused on the technical topics
✅ Use natural transitions between questions
✅ Acknowledge the candidate's responses briefly before moving on

Here are the questions to ask in order:
${formattedQuestions}

The current question is: "${questions[currentQuestionIndex]}"
${currentQuestionIndex === questions.length - 1 ? "\nThis is the final question. After the candidate answers, thank them and conclude the interview." : ""}
`,
                        },
                    ],
                },
                variableValues: {
                    questions: formattedQuestions,
                    currentQuestionIndex,
                    totalQuestions: questions.length,
                    isFirstQuestion: currentQuestionIndex === 0,
                    isLastQuestion: currentQuestionIndex === questions.length - 1,
                },
                recordingEnabled: true,
            }

            await vapiClientRef.current.start(VAPI_ASSISTANT_ID, assistantOverrides)
            console.log("VAPI call started successfully")
            setIsAITalking(true) // Set AI as talking when call starts
        } catch (error) {
            console.error("Error starting VAPI call:", error)
            setIsAITalking(false)
            setCallStatus(CallStatus.INACTIVE)
            setIsLoading(false)
            setError(`Failed to start the interview: ${error.message || "Unknown error"}`)
        }
    }

    // Add this function after the startVAPICall function
    const checkIfFinalQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            console.log("Final question detected, preparing to end interview soon")

            // Send a system message to inform the AI this is the final question
            if (vapiClientRef.current) {
                vapiClientRef.current.send({
                    type: "add-message",
                    message: {
                        role: "system",
                        content:
                            "This is the final question. After the user responds, thank them and conclude the interview clearly.",
                    },
                })
            }
        }
    }

    // Format duration time as MM:SS
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const handleStartInterview = async () => {
        setIsInterviewStarted(true)
        setTotalQuestionsAsked(1) // Start with at least 1 question
        // Start the first VAPI call when the interview begins
        await startVAPICall()
    }

    const handleEndInterview = () => {
        // Stop the VAPI call
        stopVAPICall()

        // Stop video tracks
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach((track) => track.stop())
        }

        navigate("/")
    }

    const toggleTranscript = () => {
        // Create exit animation for transcript before hiding it
        if (showTranscript && transcriptContainerRef.current) {
            gsap.to(transcriptContainerRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => setShowTranscript(false),
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
            // Use VAPI's setMuted method
            const currentMuted = vapiClientRef.current.isMuted()
            vapiClientRef.current.setMuted(!currentMuted)
            setIsAudioOn(currentMuted) // Note the inversion - isMuted() true means audio is off
        } else {
            // Fallback to our original implementation
            setIsAudioOn(!isAudioOn)
        }
    }

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100



    return (
        <div
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <style jsx>{globalStyles}</style>
            {/* Header with controls */}
            <header
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 shadow-sm z-10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Technical Interview</h1>
                        {callStatus === CallStatus.ACTIVE && (
                            <Badge variant="success" className="animate-pulse">
                                Live
                            </Badge>
                        )}
                        {isInterviewStarted && (
                            <div className="interview-timer ml-4">
                                <Clock className="h-4 w-4 mr-2"/>
                                {formatDuration(interviewDuration)}
                            </div>
                        )}
                    </div>

                    {isInterviewStarted && (
                        <div className="w-full sm:w-1/2 md:w-1/3 flex items-center gap-2">
                            <span className="text-xs text-gray-500">Progress</span>
                            <Progress value={progressPercentage} className="h-2"/>
                            <span className="text-xs font-medium">
                {currentQuestionIndex + 1}/{questions.length} Questions
              </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={showTranscript ? "secondary" : "outline"}
                                        size="icon"
                                        onClick={toggleTranscript}
                                        className="transition-all duration-200"
                                    >
                                        <MessageSquare className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{showTranscript ? "Hide transcript" : "Show transcript"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={isAudioOn ? "outline" : "secondary"}
                                        size="icon"
                                        onClick={toggleAudio}
                                        disabled={isLoading}
                                        className="transition-all duration-200"
                                    >
                                        {isAudioOn ? <Mic className="h-4 w-4"/> : <MicOff className="h-4 w-4"/>}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isAudioOn ? "Mute microphone" : "Unmute microphone"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={isVideoOn ? "outline" : "secondary"}
                                        size="icon"
                                        onClick={() => setIsVideoOn(!isVideoOn)}
                                        className="transition-all duration-200"
                                    >
                                        {isVideoOn ? <Video className="h-4 w-4"/> : <VideoOff className="h-4 w-4"/>}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="destructive" size="icon" onClick={handleEndInterview}>
                                        <Phone className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>End interview</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </header>

            {error && (
                <Alert variant="destructive" className="mx-4 mt-4">
                    <AlertDescription className="flex justify-between items-center">
                        <span>{error}</span>
                        <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {!isInterviewStarted ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <Card className="w-full max-w-md p-8 shadow-xl rounded-xl glass-card animate-float">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div
                                className="rounded-full bg-blue-500/10 p-6 mb-2 transition-all duration-300 hover:scale-105 animate-pulse-subtle">
                                <Video className="h-12 w-12 text-blue-500"/>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Ready for your interview?
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                You'll be interviewed by our AI assistant about your technical experience. The interview
                                consists of{" "}
                                {questions.length} questions.
                            </p>
                            <div className="w-full space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Video className="h-4 w-4"/> Camera:
                  </span>
                                    <Button
                                        variant={isVideoOn ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsVideoOn(!isVideoOn)}
                                        className="transition-all duration-200"
                                    >
                                        {isVideoOn ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Mic className="h-4 w-4"/> Microphone:
                  </span>
                                    <Button
                                        variant={isAudioOn ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsAudioOn(!isAudioOn)}
                                        className="transition-all duration-200"
                                    >
                                        {isAudioOn ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={handleStartInterview}
                                className="mt-4 w-full transition-all duration-300 hover:scale-105 gradient-bg text-white animate-glow"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Initializing...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            ) : (
                <main ref={mainContentRef} className="flex-1 flex flex-col">
                    {/* Main interview area - always in a row */}
                    <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
                        {/* Candidate video */}
                        <div
                            ref={userVideoContainerRef}
                            className={cn(
                                "w-full lg:w-1/2 h-[40vh] lg:h-auto bg-black relative border-4 border-transparent transition-all duration-300 video-container user",
                                transcript && !isAITalking && "border-green-500/50",
                            )}
                        >
                            {isVideoOn ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted={!isAudioOn}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
                                    <Avatar className="h-24 w-24 border-4 border-emerald-500/20 animate-float">
                                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="You"/>
                                        <AvatarFallback
                                            className="text-xl bg-emerald-500/20 text-emerald-600">You</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                            <div
                                className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-2 backdrop-blur-sm">
                                <User className="h-4 w-4 mr-1"/>
                                <span>You</span>
                                {!isAudioOn && <MicOff className="h-3 w-3 text-red-400 ml-2"/>}
                            </div>

                            {/* Live indicator for user when they are speaking */}
                            {callStatus === CallStatus.ACTIVE && transcript && !isAITalking && (
                                <div
                                    className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2 backdrop-blur-sm animate-pulse">
                                    <div className="speaking-indicator mr-1">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span>Speaking</span>
                                </div>
                            )}
                        </div>

                        {/* AI interviewer */}
                        <div
                            ref={aiVideoContainerRef}
                            className={cn(
                                "w-full lg:w-1/2 h-[40vh] lg:h-auto flex flex-col items-center justify-center relative rounded-lg transition-all duration-300 video-container ai",
                                isAITalking && "ring-4 ring-green-500 ring-opacity-50",
                            )}
                        >
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                    <SplineComponent/>
                                    {/*              {isAITalking && (*/}
                                    {/*                  <div className="absolute -bottom-2 -right-2 flex h-6 w-6">*/}
                                    {/*                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>*/}
                                    {/*                      <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 items-center justify-center">*/}
                                    {/*  <span className="text-white text-xs">🎤</span>*/}
                                    {/*</span>*/}
                                    {/*                  </div>*/}
                                    {/*              )}*/}
                                </div>
                                <h3 className={cn("text-xl font-medium text-white", isAITalking && "speaking-animation")}>
                                    Alex (Interviewer)
                                </h3>
                                <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            isAITalking
                                                ? "bg-green-500 animate-pulse"
                                                : callStatus === CallStatus.ACTIVE
                                                    ? "bg-blue-400"
                                                    : callStatus === CallStatus.CONNECTING
                                                        ? "bg-yellow-400"
                                                        : "bg-gray-400",
                                        )}
                                    ></div>
                                    <p className="text-sm text-gray-200">
                                        {isAITalking
                                            ? "Speaking..."
                                            : callStatus === CallStatus.ACTIVE
                                                ? "Listening..."
                                                : callStatus === CallStatus.CONNECTING
                                                    ? "Connecting..."
                                                    : "Waiting..."}
                                    </p>
                                </div>

                                {/* Current question display */}
                                {/*              <div className="mt-2 max-w-md px-4 py-3 bg-black/30 rounded-lg text-sm text-gray-200 text-center">*/}
                                {/*<span className="font-semibold text-blue-300">*/}
                                {/*  Current Question ({currentQuestionIndex + 1}/{questions.length}):*/}
                                {/*</span>*/}
                                {/*                  <p className="mt-1 text-gray-300 italic">{displayedQuestion}</p>*/}

                                {/*                  /!* Next question preview *!/*/}
                                {/*                  {showNextQuestion && (*/}
                                {/*                      <div className="next-question-preview mt-3 text-xs">*/}
                                {/*                          <span className="font-semibold text-blue-300/80">Next Question:</span>*/}
                                {/*                          <p className="text-gray-400">{nextQuestion}</p>*/}
                                {/*                      </div>*/}
                                {/*                  )}*/}
                                {/*              </div>*/}
                            </div>
                            <div
                                className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                                <User className="h-4 w-4 mr-1 inline-block"/>
                                Interviewer
                            </div>
                        </div>
                    </div>

                    {/* Transcript panel - always at the bottom */}

                    {showTranscript && (
                        <div
                            ref={transcriptContainerRef}
                            className={`w-full border-t border-border transition-all duration-300 bg-card shadow-lg ${
                                transcriptExpanded ? "h-96" : "h-auto max-h-72"
                            }`}
                        >
                            <div className="flex justify-between items-center p-4 border-b border-border">
                                <div className="flex items-center gap-2 font-medium">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span>Interview Transcript</span>
                                    {callStatus === CallStatus.ACTIVE && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary ml-2">
                  <span className="w-2 h-2 mr-1 bg-primary rounded-full animate-pulse"></span>
                  Live
                </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleTranscriptExpanded}
                                        className="text-xs flex items-center gap-1"
                                    >
                                        {transcriptExpanded ? (
                                            <>
                                                <ChevronDown className="h-3 w-3" /> Collapse
                                            </>
                                        ) : (
                                            <>
                                                <ChevronUp className="h-3 w-3" /> Expand
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={toggleTranscript} className="theme-toggle-glass">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="transcript-body overflow-y-auto p-4">
                                {lastMessage ? (
                                    <div className="px-4 py-2">
                                        <div className={`rounded-xl border shadow-md transition-all duration-300 ${
                                            lastMessage.role === "assistant"
                                                ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800"
                                                : "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800"
                                        }`}>
                                            <div className={`flex items-center gap-2 p-3 border-b ${
                                                lastMessage.role === "assistant"
                                                    ? "border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/40"
                                                    : "border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/40"
                                            } rounded-t-xl`}>
                                                <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
                                                    lastMessage.role === "assistant" ? "bg-blue-600" : "bg-green-600"
                                                }`}>
                                                    {lastMessage.role === "assistant" ? (
                                                        <Bot className="h-4 w-4 text-white" />
                                                    ) : (
                                                        <User className="h-4 w-4 text-white" />
                                                    )}
                                                </div>
                                                <span className="font-medium">
                      {lastMessage.role === "assistant" ? "Alex (Interviewer)" : "You"}
                    </span>
                                                <span className="text-xs opacity-70 ml-auto">
                      {lastMessage.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                                                {(isAITalking && lastMessage.role === "assistant") && (
                                                    <div className="speaking-indicator ml-2 text-blue-600 dark:text-blue-400">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                )}
                                                {(!isAITalking && lastMessage.role === "user") && (
                                                    <div className="speaking-indicator ml-2 text-green-600 dark:text-green-400">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p>{lastMessage.content}</p>
                                                {(isAITalking && lastMessage.role === "assistant") && (
                                                    <div className="mt-3 text-xs font-medium flex items-center text-blue-600 dark:text-blue-400">
                                                        <span className="pulse-dot"></span> Speaking
                                                    </div>
                                                )}
                                                {(!isAITalking && lastMessage.role === "user") && (
                                                    <div className="mt-3 text-xs font-medium flex items-center text-green-600 dark:text-green-400">
                                                        <span className="pulse-dot"></span> Speaking
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Show live transcript separately if it's not already the last message */}
                                        {isAITalking && lastMessage.role === "user" && (
                                            <div className="rounded-xl border shadow-md transition-all duration-300 mt-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center gap-2 p-3 border-b border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/40 rounded-t-xl">
                                                    <div className="flex items-center justify-center rounded-full w-8 h-8 bg-blue-600">
                                                        <Bot className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-medium">Alex (Interviewer)</span>
                                                    <span className="text-xs opacity-70 ml-auto">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                                                    <div className="speaking-indicator ml-2 text-blue-600 dark:text-blue-400">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="italic">{transcript}</p>
                                                    <div className="mt-3 text-xs font-medium flex items-center text-blue-600 dark:text-blue-400">
                                                        <span className="pulse-dot"></span> Speaking
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!isAITalking && lastMessage.role === "assistant" && (
                                            <div className="rounded-xl border shadow-md transition-all duration-300 mt-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-2 p-3 border-b border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/40 rounded-t-xl">
                                                    <div className="flex items-center justify-center rounded-full w-8 h-8 bg-green-600">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-medium">You</span>
                                                    <span className="text-xs opacity-70 ml-auto">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                                                    <div className="speaking-indicator ml-2 text-green-600 dark:text-green-400">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="italic">{transcript}</p>
                                                    <div className="mt-3 text-xs font-medium flex items-center text-green-600 dark:text-green-400">
                                                        <span className="pulse-dot"></span> Speaking
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-2">
                                        <MessageSquare className="h-8 w-8 opacity-50" />
                                        <p>The interview transcript will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            )}

            <InterviewCompletedDialog
                open={isInterviewComplete}
                onOpenChange={setIsInterviewComplete}
                onClose={handleEndInterview}
            />
        </div>
    )
}
