"use client";

import { forwardRef, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    X,
    User,
    Bot,
    Mic,
    Clock
} from "lucide-react";
import gsap from "gsap";

export const TranscriptPanel = forwardRef(
    (
        {
            toggleTranscript,
            callStatus,
            lastSpeakerTranscript,
            isAITalking,
            isUserTalking,
            lastSpeakingRole,
            transcriptExpanded,
            toggleTranscriptExpanded,
        },
        ref,
    ) => {
        // Refs for GSAP animations
        const messageRef = useRef(null);

        // Determine if someone is currently speaking
        const isSpeaking = isAITalking || isUserTalking;

        // Time formatter
        const formatTime = () => {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // Set up GSAP animations when the displayed message changes
        useEffect(() => {
            if (messageRef.current && lastSpeakerTranscript.content) {
                // Animate the message coming in
                gsap.fromTo(
                    messageRef.current,
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                );
            }
        }, [lastSpeakerTranscript]);

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

                // Cleanup animation on unmount or when speaking stops
                return () => {
                    gsap.killTweensOf(speakingDots);
                };
            }
        }, [isSpeaking]);

        return (
            <div
                ref={ref}
                className="w-full border-t border-border h-auto mt-2"
            >
                <div className="p-4 flex items-center justify-center">
                    {lastSpeakerTranscript.content ? (
                        <div
                            ref={messageRef}
                            className={`w-full max-w-7xl rounded-xl border shadow-md transition-all duration-300 ${lastSpeakerTranscript.role === "assistant"
                                ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-800/40"
                                : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/40"
                                }`}
                        >
                            <div
                                className={`flex items-center gap-2 p-3 border-b ${lastSpeakerTranscript.role === "assistant"
                                    ? "border-blue-200/70 dark:border-blue-800/40 bg-blue-100/30 dark:bg-blue-900/20"
                                    : "border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-100/30 dark:bg-emerald-900/20"
                                    } rounded-t-xl`}
                            >
                                <div
                                    className={`flex items-center justify-center rounded-full w-8 h-8 ${lastSpeakerTranscript.role === "assistant"
                                        ? "bg-blue-500 dark:bg-blue-600"
                                        : "bg-emerald-500 dark:bg-emerald-600"
                                        }`}
                                >
                                    {lastSpeakerTranscript.role === "assistant" ? (
                                        <Bot className="h-4 w-4 text-white" />
                                    ) : (
                                        <User className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <span className="font-medium text-foreground">
                                    {lastSpeakerTranscript.role === "assistant" ? "TaleeX (AI Interviewer)" : "You"}
                                </span>

                                {/* Speaking indicator */}
                                {isSpeaking && lastSpeakingRole === lastSpeakerTranscript.role && (
                                    <div className="speaking-indicator ml-2 flex gap-[3px] items-end h-3">
                                        <span
                                            className={`speaking-dot block w-1 h-2 rounded-full ${lastSpeakerTranscript.role === "assistant"
                                                ? "bg-blue-500 dark:bg-blue-400"
                                                : "bg-emerald-500 dark:bg-emerald-400"
                                                }`}
                                        ></span>
                                        <span
                                            className={`speaking-dot block w-1 h-3 rounded-full ${lastSpeakerTranscript.role === "assistant"
                                                ? "bg-blue-500 dark:bg-blue-400"
                                                : "bg-emerald-500 dark:bg-emerald-400"
                                                }`}
                                        ></span>
                                        <span
                                            className={`speaking-dot block w-1 h-1 rounded-full ${lastSpeakerTranscript.role === "assistant"
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
                                        className={`text-xs ${lastSpeakerTranscript.role === "assistant"
                                            ? "bg-blue-100/50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300"
                                            : "bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300"
                                            }`}
                                    >
                                        {lastSpeakerTranscript.role === "assistant" ? "AI" : "You"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4 text-foreground">
                                <p className="whitespace-pre-wrap">
                                    {lastSpeakerTranscript.content}
                                </p>

                                {/* Speaking status indicator */}
                                {isSpeaking && lastSpeakingRole === lastSpeakerTranscript.role && (
                                    <div
                                        className={`mt-3 text-xs font-medium flex items-center gap-1.5 ${lastSpeakerTranscript.role === "assistant"
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
                            <div className="bg-muted p-4 rounded-full">
                                <MessageSquare className="h-8 w-8 opacity-50" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">No transcript available</p>
                                <p className="text-sm text-muted-foreground">The interview transcript will appear here once started</p>
                            </div>
                            <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" /> Waiting for conversation to begin
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

TranscriptPanel.displayName = "TranscriptPanel";