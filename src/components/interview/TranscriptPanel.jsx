"use client"

import { forwardRef, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    X,
    ChevronDown,
    ChevronUp,
    User,
    Bot,
    Mic,
    Clock,
    ArrowDownCircle
} from "lucide-react"

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
            messages = [],
        },
        ref,
    ) => {
        // Determine who is currently speaking (if anyone)
        const isSpeaking = isAITalking || (transcript && !isAITalking);
        const currentSpeaker = isAITalking ? "assistant" : "user";

        // Determine what message to display
        const displayMessage = lastMessage || { role: "assistant", content: "" };

        // Auto-scroll to bottom on new messages
        const messagesEndRef = useRef(null);

        useEffect(() => {
            if (messagesEndRef.current && transcriptExpanded) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [transcript, transcriptExpanded, messages.length]);

        // Time formatter
        const formatTime = () => {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <div
                ref={ref}
                className={`w-full border-t border-border transition-all duration-300 bg-gradient-to-b from-card to-background shadow-lg rounded-b-xl ${
                    transcriptExpanded ? "h-96" : "h-auto max-h-72"
                }`}
            >
                <div className="flex justify-between items-center p-3 border-b border-border bg-muted/30 backdrop-blur-sm rounded-t-lg">
                    <div className="flex items-center gap-2 font-medium">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground/90 font-semibold">Interview Transcript</span>
                        {callStatus === "ACTIVE" && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-2 animate-pulse flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                Live
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTranscriptExpanded}
                            className="text-xs flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            {transcriptExpanded ? (
                                <>
                                    <ChevronDown className="h-3 w-3" /> Minimize
                                </>
                            ) : (
                                <>
                                    <ChevronUp className="h-3 w-3" /> Expand
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTranscript}
                            className="hover:bg-destructive/10 hover:text-destructive rounded-full transition-all"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className={`transcript-body overflow-y-auto p-4 ${transcriptExpanded ? "space-y-4" : ""}`}>
                    {transcriptExpanded && messages.length > 0 ? (
                        // Show full conversation history when expanded
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl border shadow-sm transition-all duration-300 ${
                                        message.role === "assistant"
                                            ? "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200/70 dark:border-blue-800/70"
                                            : "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/70 dark:border-emerald-800/70"
                                    }`}
                                >
                                    <div
                                        className={`flex items-center gap-2 p-3 border-b ${
                                            message.role === "assistant"
                                                ? "border-blue-200/70 dark:border-blue-800/70 bg-blue-100/30 dark:bg-blue-900/30"
                                                : "border-emerald-200/70 dark:border-emerald-800/70 bg-emerald-100/30 dark:bg-emerald-900/30"
                                        } rounded-t-xl`}
                                    >
                                        <div
                                            className={`flex items-center justify-center rounded-full w-8 h-8 ${
                                                message.role === "assistant"
                                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
                                                    : "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700"
                                            }`}
                                        >
                                            {message.role === "assistant" ? (
                                                <Bot className="h-4 w-4 text-white" />
                                            ) : (
                                                <User className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <span className="font-medium">
                      {message.role === "assistant" ? "Alex (Interviewer)" : "You"}
                    </span>

                                        {/* Speaking indicator */}
                                        {isSpeaking && currentSpeaker === message.role && message === lastMessage && (
                                            <div className="speaking-indicator ml-2 flex gap-[3px] items-end h-3">
                        <span className={`block w-1 rounded-full animate-soundwave-1 ${
                            message.role === "assistant"
                                ? "bg-blue-500 dark:bg-blue-400"
                                : "bg-emerald-500 dark:bg-emerald-400"
                        }`}></span>
                                                <span className={`block w-1 rounded-full animate-soundwave-2 ${
                                                    message.role === "assistant"
                                                        ? "bg-blue-500 dark:bg-blue-400"
                                                        : "bg-emerald-500 dark:bg-emerald-400"
                                                }`}></span>
                                                <span className={`block w-1 rounded-full animate-soundwave-3 ${
                                                    message.role === "assistant"
                                                        ? "bg-blue-500 dark:bg-blue-400"
                                                        : "bg-emerald-500 dark:bg-emerald-400"
                                                }`}></span>
                                            </div>
                                        )}

                                        <div className="ml-auto flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{formatTime()}</span>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    message.role === "assistant"
                                                        ? "bg-blue-100/80 dark:bg-blue-900/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                                        : "bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                                }`}
                                            >
                                                {message.role === "assistant" ? "AI" : "You"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4 text-foreground/90">
                                        <p className="whitespace-pre-wrap">
                                            {message === lastMessage && isSpeaking && currentSpeaker === message.role && transcript
                                                ? transcript
                                                : message.content}
                                        </p>

                                        {/* Speaking status indicator */}
                                        {message === lastMessage && isSpeaking && currentSpeaker === message.role && (
                                            <div
                                                className={`mt-3 text-xs font-medium flex items-center gap-1.5 ${
                                                    message.role === "assistant"
                                                        ? "text-blue-600 dark:text-blue-400"
                                                        : "text-emerald-600 dark:text-emerald-400"
                                                }`}
                                            >
                                                <Mic className="h-3 w-3 animate-pulse" />
                                                Speaking...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />

                            {/* Scroll to bottom button */}
                            {transcriptExpanded && messages.length > 2 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="fixed bottom-4 right-4 rounded-full shadow-lg opacity-80 hover:opacity-100 bg-background/80 backdrop-blur-sm z-10"
                                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    <ArrowDownCircle className="h-4 w-4 mr-1" /> Latest
                                </Button>
                            )}
                        </div>
                    ) : (
                        // Show just the latest message when collapsed
                        displayMessage ? (
                            <div
                                className={`rounded-xl border shadow-md transition-all duration-300 ${
                                    displayMessage.role === "assistant"
                                        ? "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200/70 dark:border-blue-800/70"
                                        : "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/70 dark:border-emerald-800/70"
                                }`}
                            >
                                <div
                                    className={`flex items-center gap-2 p-3 border-b ${
                                        displayMessage.role === "assistant"
                                            ? "border-blue-200/70 dark:border-blue-800/70 bg-blue-100/30 dark:bg-blue-900/30"
                                            : "border-emerald-200/70 dark:border-emerald-800/70 bg-emerald-100/30 dark:bg-emerald-900/30"
                                    } rounded-t-xl`}
                                >
                                    <div
                                        className={`flex items-center justify-center rounded-full w-8 h-8 ${
                                            displayMessage.role === "assistant"
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
                                                : "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700"
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

                                    {/* Speaking indicator */}
                                    {isSpeaking && currentSpeaker === displayMessage.role && (
                                        <div className="speaking-indicator ml-2 flex gap-[3px] items-end h-3">
                      <span className={`block w-1 rounded-full animate-soundwave-1 ${
                          displayMessage.role === "assistant"
                              ? "bg-blue-500 dark:bg-blue-400"
                              : "bg-emerald-500 dark:bg-emerald-400"
                      }`}></span>
                                            <span className={`block w-1 rounded-full animate-soundwave-2 ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-500 dark:bg-blue-400"
                                                    : "bg-emerald-500 dark:bg-emerald-400"
                                            }`}></span>
                                            <span className={`block w-1 rounded-full animate-soundwave-3 ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-500 dark:bg-blue-400"
                                                    : "bg-emerald-500 dark:bg-emerald-400"
                                            }`}></span>
                                        </div>
                                    )}

                                    <div className="ml-auto flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{formatTime()}</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-100/80 dark:bg-blue-900/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                                    : "bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                            }`}
                                        >
                                            {displayMessage.role === "assistant" ? "AI" : "You"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4 text-foreground/90">
                                    <p className="whitespace-pre-wrap">
                                        {isSpeaking && currentSpeaker === displayMessage.role && transcript
                                            ? transcript
                                            : displayMessage.content}
                                    </p>

                                    {/* Speaking status indicator */}
                                    {isSpeaking && currentSpeaker === displayMessage.role && (
                                        <div
                                            className={`mt-3 text-xs font-medium flex items-center gap-1.5 ${
                                                displayMessage.role === "assistant"
                                                    ? "text-blue-600 dark:text-blue-400"
                                                    : "text-emerald-600 dark:text-emerald-400"
                                            }`}
                                        >
                                            <Mic className="h-3 w-3 animate-pulse" />
                                            Speaking...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-3">
                                <div className="bg-muted/50 p-4 rounded-full">
                                    <MessageSquare className="h-8 w-8 opacity-50" />
                                </div>
                                <div>
                                    <p className="font-medium">No transcript available</p>
                                    <p className="text-sm text-muted-foreground">The interview transcript will appear here once started</p>
                                </div>
                                <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3" /> Waiting for conversation to begin
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    },
)

TranscriptPanel.displayName = "TranscriptPanel"

