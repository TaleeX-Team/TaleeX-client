"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Mic,
    MicOff,
    PhoneOff,
    MessageSquare,
    Clock,
    FileQuestion,
    AlertCircle,
    Timer
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function InterviewHeader({
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

    const progressPercentage = progress?.current && progress?.total > 0
        ? Math.min((progress.current / progress.total) * 100, 100)
        : 0;

    // Reference for progress element to add animations
    const progressRef = useRef(null);

    // State to show animated pulse on progress changes
    const [showPulse, setShowPulse] = useState(false);

    // State to show question preview
    const [showQuestionPreview, setShowQuestionPreview] = useState(false);

    // Effect to animate progress bar when progress changes
    useEffect(() => {
        if (progressRef.current && progress?.current) {
            setShowPulse(true);
            const timer = setTimeout(() => setShowPulse(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [progress?.current, questionStates]);

    // Derive current question display (1-indexed for UI)
    const currentQuestion = currentQuestionSummary?.index != null
        ? currentQuestionSummary.index + 1
        : progress?.current || 1;
    const totalQuestions = progress?.total || questionStates?.length || 1;

    // Status variant based on call status
    const getStatusVariant = () => {
        if (callStatus === "ACTIVE") return "success";
        if (callStatus === "CONNECTING") return "warning";
        if (callStatus === "ERROR") return "destructive";
        return "secondary";
    };

    // Determine timer styling based on remaining time
    const getTimerClass = () => {
        if (timeRemaining <= 60) return "text-destructive animate-pulse";
        if (timeRemaining <= 300) return "text-amber-500";
        return "text-muted-foreground";
    };

    // Early return if no questions are available
    if (!questionStates?.length || !progress?.total) {
        return (
            <header className="bg-gradient-to-r from-background to-muted/30 dark:from-background dark:to-slate-800/20 border-b border-border shadow-sm backdrop-blur-sm sticky top-0 py-3 px-4 sm:px-6 z-10">
                <div className="text-center text-muted-foreground">No questions available</div>
            </header>
        );
    }

    return (
        <header className="bg-gradient-to-r from-background to-muted/30 dark:from-background dark:to-slate-800/20 border-b border-border shadow-sm backdrop-blur-sm sticky top-0 py-3 px-4 sm:px-6 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <FileQuestion className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Technical Interview</h1>
                        <div className="flex items-center mt-1 gap-2">
                            <Badge
                                variant={getStatusVariant()}
                                className={cn(
                                    "text-xs font-medium",
                                    callStatus === "ACTIVE" && "animate-pulse"
                                )}
                            >
                                <span className={cn(
                                    "inline-block w-1.5 h-1.5 rounded-full mr-1",
                                    callStatus === "ACTIVE" ? "bg-green-500" :
                                        callStatus === "CONNECTING" ? "bg-amber-500" :
                                            "bg-red-500"
                                )}></span>
                                {callStatus === "ACTIVE" ? "Live" :
                                    callStatus === "CONNECTING" ? "Connecting" :
                                        callStatus === "ERROR" ? "Error" : "Ready"}
                            </Badge>

                            {isInterviewStarted && (
                                <div className="interview-timer flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1 text-muted-foreground/70" />
                                    {formatDuration(interviewDuration)}
                                </div>
                            )}

                            {isInterviewStarted && timeRemaining !== null && (
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={cn(
                                                "timer flex items-center text-sm",
                                                getTimerClass()
                                            )}>
                                                <Timer className="h-3 w-3 mr-1" />
                                                {formatDuration(timeRemaining)} remaining
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            Time remaining in the interview
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto items-end">
                    <div className="flex items-center gap-2">
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={showTranscript ? "default" : "outline"}
                                        size="icon"
                                        onClick={toggleTranscript}
                                        className={cn(
                                            "transition-all duration-200 rounded-full",
                                            showTranscript ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                                                "hover:bg-primary/10 hover:text-primary"
                                        )}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">{showTranscript ? "Hide transcript" : "Show transcript"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={isAudioOn ? "outline" : "secondary"}
                                        size="icon"
                                        onClick={toggleAudio}
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all duration-200 rounded-full",
                                            isAudioOn ?
                                                "hover:bg-primary/10 hover:text-primary border-primary/20" :
                                                "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        {isAudioOn ? (
                                            <Mic className="h-4 w-4" />
                                        ) : (
                                            <MicOff className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">{isAudioOn ? "Mute microphone" : "Unmute microphone"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={handleEndInterview}
                                        className="transition-all duration-200 rounded-full hover:bg-destructive/90"
                                        disabled={isLoading}
                                    >
                                        <PhoneOff className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">End interview</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-64 mt-1">
                        <div
                            className="text-xs font-medium text-muted-foreground"
                            onMouseEnter={() => setShowQuestionPreview(true)}
                            onMouseLeave={() => setShowQuestionPreview(false)}
                        >
                            {currentQuestion}/{totalQuestions}
                        </div>
                        <div className="relative w-full">
                            <Progress
                                ref={progressRef}
                                value={progressPercentage}
                                className={cn(
                                    "h-2 transition-all bg-muted",
                                    showPulse && "progress-pulse"
                                )}
                            />
                            <div className="progress-gradient absolute top-0 left-0 h-2 w-full opacity-30 rounded-full"></div>

                            {showQuestionPreview && displayedQuestion && (
                                <div className="absolute -top-20 left-0 right-0 bg-popover text-popover-foreground p-2 rounded-md text-xs shadow-md border border-border z-20 max-w-xs">
                                    <div className="font-medium mb-1 flex items-center">
                                        <FileQuestion className="h-3 w-3 mr-1 text-primary" />
                                        Question {currentQuestion}:
                                    </div>
                                    <p className="whitespace-pre-wrap break-words">{displayedQuestion}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {callStatus === "ERROR" && (
                <div className="mt-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-2 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Connection issues detected. Try refreshing the page or check your internet connection.</span>
                </div>
            )}

            <style jsx global>{`
                .progress-bar {
                    transition: width 0.5s ease-in-out;
                }
                .progress-pulse {
                    animation: progress-highlight    animation: progress-highlight 1.5s ease-in-out;
                }
                .progress-gradient {
                    background: linear-gradient(90deg,
                    rgba(var(--primary-rgb), 0) 0%,
                    rgba(var(--primary-rgb), 0.3) 50%,
                    rgba(var(--primary-rgb), 0) 100%);
                    animation: progress-flow 2s infinite linear;
                }
                @keyframes progress-highlight {
                    0% { opacity: 0.7; }
                    50% { opacity: 1; }
                    100% { opacity: 0.7; }
                }
                @keyframes progress-flow {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </header>
    );
}