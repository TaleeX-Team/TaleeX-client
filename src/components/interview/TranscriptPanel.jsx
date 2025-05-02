"use client"

import { forwardRef, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    X,
    User,
    Bot,
    Mic,
    Clock
} from "lucide-react"
import gsap from "gsap"

export const TranscriptPanel = forwardRef(
    (
        {
            toggleTranscript,
            callStatus,
            lastMessage,
            isAITalking,
            transcript,
        },
        ref,
    ) => {
        // Refs for GSAP animations
        const messageRef = useRef(null);

        // Determine who is currently speaking (if anyone)
        const isSpeaking = isAITalking || (transcript && !isAITalking);
        const currentSpeaker = isAITalking ? "assistant" : "user";

        // Determine what message to display
        const displayMessage = lastMessage || { role: "assistant", content: "" };

        // Time formatter
        const formatTime = () => {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // Set up GSAP animations when the message changes
        useEffect(() => {
            if (messageRef.current) {
                // Animate the message coming in
                gsap.fromTo(messageRef.current,
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                );
            }
        }, [displayMessage, transcript]);

        // Animate the speaking indicator
        useEffect(() => {
            if (isSpeaking && messageRef.current) {
                const speakingDots = messageRef.current.querySelectorAll('.speaking-dot');

                gsap.to(speakingDots, {
                    y: -4,
                    stagger: 0.1,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    duration: 0.4
                });
            }
        }, [isSpeaking]);

        return (
            <div
                ref={ref}
                className="w-full border-t border-border bg-card/90 backdrop-blur-sm shadow-lg rounded-b-xl h-auto"
            >
                <div className="p-4 flex items-center justify-center">
                    {displayMessage && displayMessage.content ? (
                        <div
                            ref={messageRef}
                            className={`w-full max-w-2xl rounded-xl border shadow-md transition-all duration-300 ${
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
                                        <span
                                            className={`speaking-dot block w-1 h-2 rounded-full ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-500 dark:bg-blue-400"
                                                    : "bg-emerald-500 dark:bg-emerald-400"
                                            }`}
                                        ></span>
                                        <span
                                            className={`speaking-dot block w-1 h-3 rounded-full ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-500 dark:bg-blue-400"
                                                    : "bg-emerald-500 dark:bg-emerald-400"
                                            }`}
                                        ></span>
                                        <span
                                            className={`speaking-dot block w-1 h-1 rounded-full ${
                                                displayMessage.role === "assistant"
                                                    ? "bg-blue-500 dark:bg-blue-400"
                                                    : "bg-emerald-500 dark:bg-emerald-400"
                                            }`}
                                        ></span>
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
                        <div
                            ref={messageRef}
                            className="text-center text-muted-foreground py-6 flex flex-col items-center gap-3"
                        >
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
                    )}
                </div>
            </div>
        )
    },
)

TranscriptPanel.displayName = "TranscriptPanel"