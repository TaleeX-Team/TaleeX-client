"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";

const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
}

const VAPI_ASSISTANT_ID = "a7939f6e-e04e-4bce-ac30-c6e7e35655a6"

export function useInterviewState(questions) {
    // State variables
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
    const [lastSpeakingRole, setLastSpeakingRole] = useState(null) // Track who spoke last
    const navigate = useNavigate()

    // Refs
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
    const aiSpeechEndTimerRef = useRef(null) // Timer to detect when AI speech ends

    // Update last message when messages change
    useEffect(() => {
        if (messages.length > 0) {
            const newLastMessage = messages[messages.length - 1]
            setLastMessage(newLastMessage)

            // If the last message is from the user, update the last user response time
            if (newLastMessage.role === "user") {
                setLastUserResponseTime(new Date())
                setLastSpeakingRole("user")
            }

            // If the last message is from the assistant, set isAITalking to true
            if (newLastMessage.role === "assistant") {
                setIsAITalking(true)
                setLastSpeakingRole("assistant")

                // Clear any existing AI speech end timer
                if (aiSpeechEndTimerRef.current) {
                    clearTimeout(aiSpeechEndTimerRef.current);
                }
            }

            // Add to message history (keeping last 5 messages)
            setMessageHistory((prev) => {
                const updatedHistory = [...prev, newLastMessage]
                return updatedHistory.slice(-5) // Keep only the last 5 messages
            })
        }
    }, [messages])

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
    }, [currentQuestionIndex, questions])

    // Setup VAPI client listeners when it's available
    useEffect(() => {
        if (vapiClientRef.current) {
            // Listen for transcript updates
            vapiClientRef.current.on("transcript", (text) => {
                setTranscript(text)

                // When transcript is updating, the AI is talking
                if (callStatus === CallStatus.ACTIVE) {
                    setIsAITalking(true)
                    setLastSpeakingRole("assistant")

                    // Clear any existing AI speech end timer
                    if (aiSpeechEndTimerRef.current) {
                        clearTimeout(aiSpeechEndTimerRef.current);
                    }

                    // Set a new timer to detect when AI speech ends (after 2 seconds of no new transcript)
                    aiSpeechEndTimerRef.current = setTimeout(() => {
                        console.log("AI speech appears to have ended");
                        setIsAITalking(false);
                        setTranscript("");
                    }, 2000);
                }
            });

            // Listen for user speech start
            vapiClientRef.current.on("userSpeechStart", () => {
                setIsAITalking(false);
                setLastSpeakingRole("user");
            });

            // Listen for user speech end
            vapiClientRef.current.on("userSpeechEnd", () => {
                setTranscript("");
            });

            // Listen for message updates (from the AI)
            vapiClientRef.current.on("message", (message) => {
                if (message.role === "assistant") {
                    // When a message arrives, add it to the messages
                    setMessages((prevMessages) => [...prevMessages, message]);

                    // Check for conclusion phrases in AI responses
                    const conclusionPhrases = [
                        "thank you for your time",
                        "that concludes our interview",
                        "that's all the questions",
                        "interview is complete",
                        "end our call",
                        "this concludes our interview"
                    ];

                    if (currentQuestionIndex === questions.length - 1 &&
                        conclusionPhrases.some(phrase =>
                            message.content.toLowerCase().includes(phrase)
                        )) {
                        console.log("Conclusion phrase detected, preparing to end call");
                        setConclusionDetected(true);

                        // End the call after the AI finishes speaking this final message
                        setTimeout(() => {
                            stopVAPICall();
                        }, 5000);
                    }
                }
            });

            // Listen for call status updates
            vapiClientRef.current.on("callStatus", (status) => {
                console.log("Call status updated:", status);
                setCallStatus(status);

                if (status === CallStatus.ACTIVE) {
                    setIsLoading(false);
                } else if (status === CallStatus.FINISHED) {
                    setIsAITalking(false);
                    setIsInterviewComplete(true);
                }
            });
        }
    }, [vapiClientRef.current, currentQuestionIndex, questions.length]);

    // Animation effect for elements appearing on the page
    useEffect(() => {
        if (isInterviewStarted) {
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
    }, [isInterviewStarted])

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
            !isAITalking &&
            lastSpeakingRole === "user"
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
    }, [callStatus, currentQuestionIndex, questions.length, lastUserResponseTime, isAITalking, lastSpeakingRole])

    // Check if we should end the call due to AI silence
    useEffect(() => {
        // If AI has been silent for more than 10 seconds after the last question and user response
        if (aiSilentTime > 10 && currentQuestionIndex === questions.length - 1 && lastUserResponseTime) {
            console.log("AI has been silent for too long after the last question - ending call")

            // Use say method to gracefully end the call
            if (vapiClientRef.current) {
                vapiClientRef.current.say("Thank you for completing the interview. I'll end our call now.", true)

                // Force end the call after a short delay if it doesn't end naturally
                setTimeout(() => {
                    stopVAPICall()
                }, 5000)
            } else {
                stopVAPICall()
            }
        }
    }, [aiSilentTime, currentQuestionIndex, questions.length, lastUserResponseTime])

    // Monitor for conclusion detection
    useEffect(() => {
        if (conclusionDetected && !isInterviewComplete) {
            console.log("Conclusion detected, interview ending soon");
            // Small delay to ensure the AI finishes speaking
            setTimeout(() => {
                stopVAPICall();
            }, 3000);
        }
    }, [conclusionDetected, isInterviewComplete]);

    // Handle camera access
    useEffect(() => {
        if (isVideoOn && videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: isAudioOn })
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
                setTranscript("") // Clear any remaining transcript

                // Stop the duration timer
                if (durationTimerRef.current) {
                    clearInterval(durationTimerRef.current)
                }

                // Clear other timers
                if (silenceTimerRef.current) {
                    clearInterval(silenceTimerRef.current)
                }
                if (aiSpeechEndTimerRef.current) {
                    clearTimeout(aiSpeechEndTimerRef.current)
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
                    content: "Welcome to your interview. I'll be asking you questions shortly.",
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
            setLastSpeakingRole("assistant") // AI speaks first
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
                            "This is the final question. After the user responds, thank them and conclude the interview clearly with a phrase like 'That concludes our interview today. Thank you for your time.' Then end the call.",
                    },
                })
            }
        }
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
            const gsapImport = import("gsap").then(({ gsap }) => {
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
            // Use VAPI's setMuted method
            const currentMuted = vapiClientRef.current.isMuted()
            vapiClientRef.current.setMuted(!currentMuted)
            setIsAudioOn(currentMuted) // Note the inversion - isMuted() true means audio is off
        } else {
            // Fallback to our original implementation
            setIsAudioOn(!isAudioOn)
        }
    }

    return {
        state: {
            currentQuestionIndex,
            displayedQuestion,
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
        },
        actions: {
            setCurrentQuestionIndex,
            setDisplayedQuestion,
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