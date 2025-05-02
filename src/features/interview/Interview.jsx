import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import Vapi from "@vapi-ai/web"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {X, Camera} from 'lucide-react'
import {VideoContainer} from "@/components/interview/VideoContainer"
import {TranscriptPanel} from "@/components/interview/TranscriptPanel"
import {StartScreen} from "@/components/interview/StartScreen"
import {InterviewCompletedDialog} from "@/components/interview/InterviewCompletedDialog"
import {useInterviewState} from "@/hooks/useInterviewState"
import {globalStyles} from "@/lib/globalStyles"
import {toast} from "sonner"
import InterviewHeader from "@/components/interview/InterviewHeader.jsx";

// VAPI API configuration
const VAPI_API_KEY = "d4ecde21-8c7d-4f5c-9996-5c2b306d9ccf"
const VAPI_ASSISTANT_ID = "a7939f6e-e04e-4bce-ac30-c6e7e35655a6"

// Mock questions data - now more conversational
const questions = [
    "Could you walk me through your experience with React.js? I'm particularly interested in a challenging project you've worked on.",

]

export default function Interview() {
    const {state, actions, refs} = useInterviewState(questions)

    const {
        currentQuestionIndex,
        displayedQuestion,
        isVideoOn,
        isAudioOn,
        progress,
        isInterviewComplete,
        isInterviewStarted,
        isAITalking,
        isUserTalking,
        showAIUI,
        showUserUI,
        transcript,
        messages,
        lastMessage,
        showTranscript,
        callStatus,
        isLoading,
        error,
        interviewDuration,
        transcriptExpanded,
        conclusionDetected,
        timeRemaining,
        lastUserResponseTime,
        questionStates,
        currentQuestionSummary,
        lastSpeakingRole,
        screenshots,
        lastCapturedScreenshot,
    } = state

    const {
        setError,
        setIsVideoOn,
        setIsAudioOn,
        setShowTranscript,
        setTranscriptExpanded,
        handleStartInterview,
        handleEndInterview,
        toggleTranscript,
        toggleTranscriptExpanded,
        toggleAudio,
        stopVAPICall,
        setIsInterviewComplete,
        setConclusionDetected,
        captureScreenshot,
    } = actions

    const {
        videoRef,
        aiVideoContainerRef,
        userVideoContainerRef,
        transcriptContainerRef,
        mainContentRef,
        vapiClientRef,
    } = refs

    const navigate = useNavigate()

    // Initialize VAPI client
    useEffect(() => {
        try {
            vapiClientRef.current = new Vapi(VAPI_API_KEY)
            console.log("VAPI client initialized successfully")

            setupVapiEventListeners()

            return () => {
                if (vapiClientRef.current) {
                    vapiClientRef.current.removeAllListeners()
                    stopVAPICall()
                }
            }
        } catch (err) {
            console.error("Error initializing VAPI client:", err)
            setError("Failed to initialize the interview system. Please try again.")
        }
    }, [])

    // Show toast notification when a screenshot is captured
    useEffect(() => {
        if (lastCapturedScreenshot) {
            toast.success(`${screenshots.length} of 3 screenshots taken`)
        }
    }, [lastCapturedScreenshot, screenshots.length])

    // Setup VAPI event listeners
    const setupVapiEventListeners = () => {
        if (!vapiClientRef.current) return

        vapiClientRef.current.on("call-start", () => {
            console.log("Call started")
            actions.setCallStatus("ACTIVE")
            actions.setIsLoading(false)
            actions.setIsAITalking(true)
        })

        vapiClientRef.current.on("call-end", () => {
            console.log("Call ended")
            actions.setCallStatus("FINISHED")
            actions.setIsAITalking(false)
            actions.setIsLoading(false)
            actions.setIsInterviewComplete(true)

            if (actions.durationTimerRef?.current) {
                clearInterval(actions.durationTimerRef.current)
            }
        })

        vapiClientRef.current.on("speech-start", () => {
            console.log("AI started speaking")
            actions.setIsAITalking(true)
            actions.setLastSpeakingRole("assistant")
            actions.setAiSilentTime(0)
        })

        vapiClientRef.current.on("speech-end", () => {
            console.log("AI stopped speaking")
            actions.setIsAITalking(false)
        })

        vapiClientRef.current.on("user-speech-start", () => {
            console.log("User started speaking")
            actions.setLastSpeakingRole("user")
            actions.setTranscript("")
        })

        vapiClientRef.current.on("user-speech-end", () => {
            console.log("User stopped speaking")
        })

        vapiClientRef.current.on("message", handleVapiMessage)
    }

    // Handle messages from VAPI
    const handleVapiMessage = (msg) => {
        console.log("Received message:", msg)

        if (msg.type === "transcript") {
            handleTranscriptMessage(msg)
        } else if (msg.role === "assistant" && msg.content) {
            handleAssistantMessage(msg)
        }
    }

    // Handle transcript messages
    const handleTranscriptMessage = (msg) => {
        if (msg.transcriptType === "partial") {
            if (msg.transcript) {
                actions.setTranscript(msg.transcript)
            }
        } else if (msg.transcriptType === "final") {
            if (msg.transcript && msg.transcript.trim()) {
                const newMessage = {
                    id: Date.now().toString(),
                    role: "user",
                    content: msg.transcript,
                    timestamp: new Date(),
                }
                actions.setMessages((prev) => [...prev, newMessage])
                actions.setTranscript("")
                actions.setLastUserResponseTime(new Date())
                actions.setLastSpeakingRole("user")
            }
        }
    }

    // Handle assistant messages
    const handleAssistantMessage = (msg) => {
        const newMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: msg.content,
            timestamp: new Date(),
        }
        actions.setMessages((prev) => [...prev, newMessage])
        actions.setIsAITalking(true)
        actions.setLastSpeakingRole("assistant")

        const messageContent = msg.content.toLowerCase()

        if (isInterviewConclusionMessage(messageContent)) {
            console.log("Detected interview conclusion message")
            actions.setConclusionDetected(true)

            setTimeout(() => {
                if (vapiClientRef.current) {
                    vapiClientRef.current.say(
                        "Thank you for completing all the interview questions. I'll end our call now.",
                        true,
                    )
                    stopVAPICall().then(() => {
                        setIsInterviewComplete(true)
                    })
                } else {
                    stopVAPICall().then(() => {
                        setIsInterviewComplete(true)
                    })
                }
            }, 2000)
        }

        detectQuestionInMessage(messageContent)
    }

    // Check if a message is a conclusion message
    const isInterviewConclusionMessage = (messageContent) => {
        return (
            (messageContent.includes("thank you") &&
                (messageContent.includes("concludes") ||
                    messageContent.includes("end") ||
                    messageContent.includes("complete"))) ||
            messageContent.includes("that concludes our interview") ||
            messageContent.includes("this concludes our interview") ||
            messageContent.includes("end of our interview") ||
            messageContent.includes("interview is complete") ||
            (currentQuestionIndex === questions.length - 1 && messageContent.includes("thank you for your time"))
        )
    }

    // Detect if a message contains a question
    const detectQuestionInMessage = (messageContent) => {
        let foundNewQuestion = false

        for (let i = 0; i < questions.length; i++) {
            if (i === currentQuestionIndex) continue

            const questionWords = questions[i].toLowerCase().split(" ").slice(0, 6).join(" ")

            if (messageContent.includes(questionWords)) {
                console.log(`Detected question ${i + 1}: ${questions[i].substring(0, 30)}...`)
                actions.setCurrentQuestionIndex(i)
                foundNewQuestion = true
                break
            }
        }

        if (
            !foundNewQuestion &&
            !conclusionDetected &&
            (messageContent.includes("?") ||
                messageContent.includes("could you") ||
                messageContent.includes("can you") ||
                messageContent.includes("tell me"))
        ) {
            if (currentQuestionIndex < questions.length - 1) {
                const nextIndex = currentQuestionIndex + 1
                console.log(`Moving to next question ${nextIndex + 1}`)
                actions.setCurrentQuestionIndex(nextIndex)
            }
        }
    }

    // Effect to check if this is the final question
    useEffect(() => {
        if (currentQuestionIndex === questions.length - 1 && vapiClientRef.current && isInterviewStarted) {
            console.log("Final question detected - sending system message to AI")
            vapiClientRef.current.send({
                type: "add-message",
                message: {
                    role: "system",
                    content:
                        "This is the final question. After the user responds, thank them and conclude the interview clearly with a phrase like 'That concludes our interview today. Thank you for your time.' Then end the call."
                }
            })
        }
    }, [currentQuestionIndex, questions.length, isInterviewStarted])

    // Monitor for conclusion detection
    useEffect(() => {
        if (conclusionDetected && !isInterviewComplete) {
            console.log("Conclusion detected, interview ending soon")
            stopVAPICall().then(() => {
                setIsInterviewComplete(true)
            })
        }
    }, [conclusionDetected, isInterviewComplete])

    return (
        <div
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <style jsx>{globalStyles}</style>

            <InterviewHeader
                callStatus={callStatus}
                isInterviewStarted={isInterviewStarted}
                interviewDuration={interviewDuration}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                isAudioOn={isAudioOn}
                progress={progress}
                timeRemaining={timeRemaining}
                isVideoOn={isVideoOn}
                questionStates={questionStates}
                currentQuestionSummary={currentQuestionSummary}
                showTranscript={showTranscript}
                isLoading={isLoading}
                toggleAudio={toggleAudio}
                toggleVideo={() => setIsVideoOn(!isVideoOn)}
                toggleTranscript={toggleTranscript}
                handleEndInterview={handleEndInterview}
            />

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
                <StartScreen
                    isVideoOn={isVideoOn}
                    isAudioOn={isAudioOn}
                    isLoading={isLoading}
                    totalQuestions={questions.length}
                    setIsVideoOn={setIsVideoOn}
                    setIsAudioOn={setIsAudioOn}
                    handleStartInterview={handleStartInterview}
                />
            ) : (
                <main ref={mainContentRef} className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
                        <VideoContainer
                            isUser={true}
                            ref={userVideoContainerRef}
                            videoRef={videoRef}
                            isVideoOn={isVideoOn}
                            isAudioOn={isAudioOn}
                            isAITalking={isAITalking}
                            isUserTalking={isUserTalking}
                            transcript={transcript}
                            callStatus={callStatus}
                            lastCapturedScreenshot={lastCapturedScreenshot}
                            screenshotCount={screenshots.length}
                            sessionDuration={interviewDuration}
                            interviewProgress={progress.current / progress.total}
                        />

                        <VideoContainer
                            isUser={false}
                            ref={aiVideoContainerRef}
                            isAITalking={isAITalking}
                            isUserTalking={isUserTalking}
                            callStatus={callStatus}
                            sessionDuration={interviewDuration}
                            interviewProgress={progress.current / progress.total}
                        />
                    </div>

                    {showTranscript && (
                        <TranscriptPanel
                            ref={transcriptContainerRef}
                            transcriptExpanded={transcriptExpanded}
                            toggleTranscriptExpanded={toggleTranscriptExpanded}
                            toggleTranscript={toggleTranscript}
                            callStatus={callStatus}
                            lastMessage={lastMessage}
                            isAITalking={isAITalking}
                            transcript={transcript}
                            messages={messages}
                            conclusionDetected={conclusionDetected}
                        />
                    )}
                </main>
            )}

            <InterviewCompletedDialog
                open={isInterviewComplete}
                onOpenChange={setIsInterviewComplete}
                onClose={handleEndInterview}
                interviewDuration={interviewDuration}
                questionsAsked={progress.current}
                totalQuestions={questions.length}
                screenshots={screenshots}
            />
        </div>
    )
}