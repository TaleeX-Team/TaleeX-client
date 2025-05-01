"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Clock } from "lucide-react"
import { formatDuration } from "@/lib/utils"

export function InterviewHeader({
                                    callStatus,
                                    isInterviewStarted,
                                    interviewDuration,
                                    currentQuestionIndex,
                                    totalQuestions,
                                    isAudioOn,
                                    isVideoOn,
                                    showTranscript,
                                    isLoading,
                                    toggleAudio,
                                    toggleVideo,
                                    toggleTranscript,
                                    handleEndInterview,
                                }) {
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 shadow-sm z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Technical Interview</h1>
                    {callStatus === "ACTIVE" && (
                        <Badge variant="success" className="animate-pulse">
                            Live
                        </Badge>
                    )}
                    {isInterviewStarted && (
                        <div className="interview-timer ml-4 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatDuration(interviewDuration)}
                        </div>
                    )}
                </div>

                {isInterviewStarted && (
                    <div className="w-full sm:w-1/2 md:w-1/3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Progress</span>
                        <Progress value={progressPercentage} className="h-2" />
                        <span className="text-xs font-medium">
              {currentQuestionIndex + 1}/{totalQuestions} Questions
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
                                    <MessageSquare className="h-4 w-4" />
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
                                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isAudioOn ? "Mute microphone" : "Unmute microphone"}</TooltipContent>
                        </Tooltip>

                        {/*<Tooltip>*/}
                        {/*    <TooltipTrigger asChild>*/}
                        {/*        <Button*/}
                        {/*            variant={isVideoOn ? "outline" : "secondary"}*/}
                        {/*            size="icon"*/}
                        {/*            onClick={toggleVideo}*/}
                        {/*            className="transition-all duration-200"*/}
                        {/*        >*/}
                        {/*            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}*/}
                        {/*        </Button>*/}
                        {/*    </TooltipTrigger>*/}
                        {/*    <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>*/}
                        {/*</Tooltip>*/}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={handleEndInterview}>
                                    <Phone className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>End interview</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </header>
    )
}
