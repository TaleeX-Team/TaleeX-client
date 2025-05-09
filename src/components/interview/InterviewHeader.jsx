"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Mic,
    MicOff,
    PhoneOff,
    MessageSquare,
    Clock,
    FileQuestion,
    AlertCircle,
    Timer,
    ChevronRight,
    ChevronLeft,
    Building,
    User,
} from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useInterviewData } from "@/hooks/useInterviewData.js"

export default function InterviewHeader({
    interviewId,
    callStatus,
    isInterviewStarted,
    interviewDuration,
    progress, // { current, total }
    questionStates, // From useInterviewState
    currentQuestionSummary, // From useInterviewState
    isAudioOn,
    isVideoOn,
    showTranscript,
    isLoading,
    toggleAudio,
    toggleVideo,
    toggleTranscript,
    handleEndInterview,
    displayedQuestion,
    timeRemaining,
}) {
    const progressPercentage =
        progress?.current && progress?.total > 0 ? Math.min((progress.current / progress.total) * 100, 100) : 0
    const {
        data: interviewHeaderData,
        isLoading: isLoadingInterview,
        error: errorInterview,
    } = useInterviewData(interviewId)

    // Reference for progress element to add animations
    const progressRef = useRef(null)
    const progressBarRef = useRef(null)

    // Audio context and audio stream references
    const audioContextRef = useRef(null)
    const micStreamRef = useRef(null)

    // State to show animated pulse on progress changes
    const [showPulse, setShowPulse] = useState(false)
    const [isProgressHovered, setIsProgressHovered] = useState(false)
    const [isMicInitialized, setIsMicInitialized] = useState(false)

    // Handle actual audio muting - initialize audio context on first toggle
    const handleAudioToggle = () => {
        // Call the toggleAudio function from the hook
        toggleAudio()

        // No need to manipulate audio tracks directly here anymore
        // as the hook's implementation will handle that
        console.log("Audio toggle requested via header UI")
    }

    // Effect to animate progress bar when progress changes
    useEffect(() => {
        if (progressRef.current && progress?.current) {
            setShowPulse(true)
            const timer = setTimeout(() => setShowPulse(false), 1500)
            return () => clearTimeout(timer)
        }
    }, [progress?.current, questionStates])

    // Animate progress bar on mount and when progress changes
    useEffect(() => {
        if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progressPercentage}%`
            progressBarRef.current.style.transition = "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }
    }, [progressPercentage])

    // Clean up audio resources on unmount
    useEffect(() => {
        return () => {
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach((track) => track.stop())
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    // Derive current question display (1-indexed for UI)
    const currentQuestion =
        currentQuestionSummary?.index != null ? currentQuestionSummary.index + 1 : progress?.current || 1
    const totalQuestions = progress?.total || questionStates?.length || 1

    // Status variant based on call status
    const getStatusVariant = () => {
        if (callStatus === "ACTIVE") return "success"
        if (callStatus === "CONNECTING") return "warning"
        if (callStatus === "ERROR") return "destructive"
        return "secondary"
    }

    // Determine timer styling based on remaining time
    const getTimerClass = () => {
        if (timeRemaining <= 60) return "text-red-500 dark:text-red-400 animate-pulse"
        if (timeRemaining <= 300) return "text-amber-500 dark:text-amber-400"
        return "text-muted-foreground"
    }

    // Early return if no questions are available
    if (!questionStates?.length || !progress?.total) {
        return (
            <div
                className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border-b border-slate-300 dark:border-slate-700 shadow-md py-4 px-6 text-center text-slate-700 dark:text-slate-300">
                <div className="flex justify-center items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>No questions available</span>
                </div>
            </div>
        )
    }

    // Extract user data from interviewHeaderData
    const userData = interviewHeaderData || {
        userName: "Loading...",
        jobTitle: "Loading...",
        companyName: "Loading...",
        interviewType: ["technical"],
        questionCount: 0,
        image: null,
    }

    // Format interview type for display
    const formattedInterviewType = (() => {
        if (!userData.interviewType?.length) return "Interview"
        const validTypes = userData.interviewType.filter(type => ["technical", "behavioral"].includes(type))
        if (!validTypes.length) return "Interview"
        const formatted = validTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1))
        return formatted.length > 1 ? `${formatted.join(" & ")} Interview` : `${formatted[0]} Interview`
    })()

    // Generate question markers for the progress bar
    const renderQuestionMarkers = () => {
        return Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCompleted = idx < currentQuestion - 1
            const isCurrent = idx === currentQuestion - 1

            return (
                <div
                    key={`marker-${idx}`}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 z-20",
                        isCompleted
                            ? "bg-emerald-500 dark:bg-emerald-400 scale-100"
                            : isCurrent
                                ? "bg-blue-600 dark:bg-blue-500 scale-125 shadow-lg shadow-blue-500/50"
                                : "bg-slate-400 dark:bg-slate-500 scale-75 opacity-50",
                    )}
                    style={{ left: `${(idx / (totalQuestions - 1)) * 100}%` }}
                />
            )
        })
    }

    return (
        <div
            className="bg-background border-b border-border shadow-lg backdrop-blur-lg sticky top-0 pt-4 px-6 z-30">

            {/* Top section with title and controls */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                        <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-600">
                            {userData.image ? (
                                <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.userName} />
                            ) : null}
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                {userData.userName ? userData.userName.charAt(0).toUpperCase() :
                                    <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {formattedInterviewType}
                            {/* {userData.questionCount > 0 && (
                                <span
                                    className="text-slate-500 dark:text-slate-400 text-base font-normal ml-2">({userData.questionCount} questions)</span>
                            )} */}
                        </h1>
                        <div className="flex items-center mt-1 gap-3">
                            <Badge
                                variant={getStatusVariant()}
                                className={cn("text-xs font-medium px-2 py-0.5", callStatus === "ACTIVE" && "animate-pulse")}
                            >
                                <span
                                    className={cn(
                                        "inline-block w-2 h-2 rounded-full mr-1.5",
                                        callStatus === "ACTIVE"
                                            ? "bg-green-400"
                                            : callStatus === "CONNECTING"
                                                ? "bg-amber-400"
                                                : "bg-red-400",
                                    )}
                                ></span>
                                {callStatus === "ACTIVE"
                                    ? "Live"
                                    : callStatus === "CONNECTING"
                                        ? "Connecting"
                                        : callStatus === "ERROR"
                                            ? "Error"
                                            : "Ready"}
                            </Badge>

                            {/* {isInterviewStarted && (
                                <div
                                    className="interview-timer flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                                    <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
                                    {formatDuration(interviewDuration)}
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={300}>
                        {isInterviewStarted && timeRemaining !== null && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "timer flex items-center text-sm font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700",
                                            getTimerClass(),
                                        )}
                                    >
                                        <Timer className="h-4 w-4 mr-2" />
                                        {formatDuration(timeRemaining)}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                    Time remaining in the interview
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={showTranscript ? "default" : "outline"}
                                    size="icon"
                                    onClick={toggleTranscript}
                                    className={cn(
                                        "transition-all duration-300 rounded-full ml-2",
                                        showTranscript
                                            ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                            : "hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600",
                                    )}
                                >
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                {showTranscript ? "Hide transcript" : "Show transcript"}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isAudioOn ? "outline" : "secondary"}
                                    size="icon"
                                    onClick={handleAudioToggle}
                                    disabled={isLoading}
                                    className={cn(
                                        "transition-all duration-300 rounded-full",
                                        isAudioOn
                                            ? "hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                                            : "bg-slate-200 dark:bg-slate-700 text-red-500 dark:text-red-400 hover:bg-slate-300 dark:hover:bg-slate-700/80",
                                    )}
                                >
                                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                {isAudioOn ? "Mute microphone" : "Unmute microphone"}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleEndInterview}
                                    className="transition-all duration-300 rounded-full hover:bg-red-600 bg-red-500"
                                    disabled={isLoading}
                                >
                                    <PhoneOff className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                End interview
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Middle progress section */}
            {/* <div className="relative py-2 px-2 mb-3">
                <div
                    className="flex justify-between mb-1.5 px-1"
                    onMouseEnter={() => setIsProgressHovered(true)}
                    onMouseLeave={() => setIsProgressHovered(false)}
                >
                    <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                        <ChevronLeft
                            className={cn("w-4 h-4 mr-1 transition-opacity", currentQuestion === 1 ? "opacity-20" : "opacity-100")}
                        />
                        <span>Previous</span>
                    </div>
                    <div
                        className="text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/70 px-3 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                        {currentQuestion} of {totalQuestions}
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span>Next</span>
                        <ChevronRight
                            className={cn(
                                "w-4 h-4 ml-1 transition-opacity",
                                currentQuestion === totalQuestions ? "opacity-20" : "opacity-100",
                            )}
                        />
                    </div>
                </div> */}

            {/* <div
                    ref={progressRef}
                    className="relative h-3 bg-slate-200 dark:bg-slate-700/40 rounded-full overflow-hidden"
                    onMouseEnter={() => setIsProgressHovered(true)}
                    onMouseLeave={() => setIsProgressHovered(false)}
                > */}
            {/* Progress bar fill */}
            {/* <div
                        ref={progressBarRef}
                        className={cn(
                            "absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-400 rounded-full",
                            showPulse && "pulse-animation",
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    > */}
            {/* Animated gradient overlay */}
            {/* <div className="absolute inset-0 w-full h-full shimmer-animation"></div>
                    </div> */}

            {/* Progress markers */}
            {/* {renderQuestionMarkers()} */}

            {/* Current position highlight */}
            {/* <div
                        className="absolute h-7 w-7 rounded-full border-2 border-white dark:border-slate-200 bg-blue-100 dark:bg-blue-500/20 top-1/2 -translate-y-1/2 transition-all duration-300 z-10"
                        style={{
                            left: `${progressPercentage}%`,
                            transform: "translate(-50%, -50%)",
                            opacity: isProgressHovered ? 1 : 0,
                            scale: isProgressHovered ? 1 : 0.5,
                        }}
                    />
                </div>
            </div> */}

            {/* Current question display */}
            {displayedQuestion && (
                <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg p-3 shadow-inner flex items-start">
                    <div className="mr-3 mt-1 p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-full flex-shrink-0">
                        <FileQuestion className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Current Question:</div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{displayedQuestion}</p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {callStatus === "ERROR" && (
                <div
                    className="mt-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-md p-3 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>Connection issues detected. Check your internet connection.</span>
                </div>
            )}

            {/* Add global styles for animations */}
            {/* <style jsx global>{`
                .pulse-animation {
                    animation: pulse 1.5s ease-in-out;
                }

                .shimmer-animation {
                    background: linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite linear;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `}</style> */}
        </div>
    )
}