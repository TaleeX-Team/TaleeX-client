"use client"

import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, ChevronDown, ChevronUp, User, Bot } from "lucide-react"

export const TranscriptPanel = forwardRef(
    (
        {
            transcriptExpanded,
            toggleTranscriptExpanded,
            toggleTranscript,
            callStatus,
            lastMessage,
            isAITalking,
            transcript,
        },
        ref,
    ) => {
        // Determine who is currently speaking (if anyone)
        const isSpeaking = isAITalking || (transcript && !isAITalking);
        const currentSpeaker = isAITalking ? "assistant" : "user";

        // Determine what message to display
        const displayMessage = lastMessage || { role: "assistant", content: "" };

        return (
            <div
                ref={ref}
                className={`w-full border-t border-border transition-all duration-300 bg-card shadow-lg ${
                    transcriptExpanded ? "h-96" : "h-auto max-h-72"
                }`}
            >
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <div className="flex items-center gap-2 font-medium">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>Interview Transcript</span>
                        {callStatus === "ACTIVE" && (
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
                    {displayMessage ? (
                        <div
                            className={`rounded-xl border shadow-md transition-all duration-300 ${
                                displayMessage.role === "assistant"
                                    ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800"
                                    : "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800"
                            }`}
                        >
                            <div
                                className={`flex items-center gap-2 p-3 border-b ${
                                    displayMessage.role === "assistant"
                                        ? "border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/40"
                                        : "border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/40"
                                } rounded-t-xl`}
                            >
                                <div
                                    className={`flex items-center justify-center rounded-full w-8 h-8 ${
                                        displayMessage.role === "assistant" ? "bg-blue-600" : "bg-green-600"
                                    }`}
                                >
                                    {displayMessage.role === "assistant" ? (
                                        <Bot className="h-4 w-4 text-white" />
                                    ) : (
                                        <User className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <span className="font-medium">
                                    {displayMessage.role === "assistant" ? "Alex (Interviewer)" : "You"}
                                </span>

                                {/* Speaking indicator - only shows when someone is actively speaking */}
                                {isSpeaking && currentSpeaker === displayMessage.role && (
                                    <div className={`speaking-indicator ml-2 ${
                                        displayMessage.role === "assistant"
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-green-600 dark:text-green-400"
                                    }`}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}

                                <Badge
                                    variant="outline"
                                    className={`ml-auto text-xs ${
                                        displayMessage.role === "assistant"
                                            ? "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
                                            : "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700"
                                    }`}
                                >
                                    {displayMessage.role === "assistant" ? "AI" : "You"}
                                </Badge>
                            </div>
                            <div className="p-4">
                                {/* Show either live transcript or last complete message */}
                                <p>
                                    {isSpeaking && currentSpeaker === displayMessage.role && transcript
                                        ? transcript
                                        : displayMessage.content}
                                </p>

                                {/* Speaking status indicator */}
                                {isSpeaking && currentSpeaker === displayMessage.role && (
                                    <div
                                        className={`mt-3 text-xs font-medium flex items-center ${
                                            displayMessage.role === "assistant"
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-green-600 dark:text-green-400"
                                        }`}
                                    >
                                        <span className="pulse-dot mr-1"></span> Speaking...
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-2">
                            <MessageSquare className="h-8 w-8 opacity-50" />
                            <p>The interview transcript will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        )
    },
)

TranscriptPanel.displayName = "TranscriptPanel"