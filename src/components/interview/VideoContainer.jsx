import { forwardRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MicOff, Bot, Camera, Volume2, Sun, Moon } from 'lucide-react'
import { cn } from "@/lib/utils"
import SplineComponent from "@/components/interview/3dLoading"
import Webcam from "react-webcam"

export const VideoContainer = forwardRef(
    ({
         isUser,
         videoRef,
         isVideoOn,
         isAudioOn,
         isAITalking,
         transcript,
         callStatus,
         lastCapturedScreenshot,
         screenshotCount,
         theme = "dark",
         onThemeToggle,
         sessionDuration = 0,
         interviewProgress = 0,
     }, ref) => {
        const [showScreenshotEffect, setShowScreenshotEffect] = useState(false);
        const [audioLevel, setAudioLevel] = useState(0);
        const isDarkMode = theme === "dark";

        // Show screenshot capture effect when a screenshot is taken
        useEffect(() => {
            if (lastCapturedScreenshot) {
                setShowScreenshotEffect(true);
                const timer = setTimeout(() => {
                    setShowScreenshotEffect(false);
                }, 1500);
                return () => clearTimeout(timer);
            }
        }, [lastCapturedScreenshot]);

        // Simulate audio level detection
        useEffect(() => {
            if (isAudioOn && isUser && transcript && !isAITalking) {
                const interval = setInterval(() => {
                    setAudioLevel(Math.random() * 0.7 + 0.3); // Random value between 0.3 and 1
                }, 100);
                return () => clearInterval(interval);
            } else {
                setAudioLevel(0);
            }
        }, [isAudioOn, isUser, transcript, isAITalking]);

        // Format session time
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full lg:w-1/2 h-[40vh] lg:h-auto relative rounded-xl transition-all duration-500 overflow-hidden",
                    isDarkMode
                        ? "bg-gray-900 shadow-xl shadow-emerald-900/20"
                        : "bg-gray-100 shadow-lg shadow-emerald-200/30",
                    isUser ? "video-container user" : "flex flex-col items-center justify-center video-container ai",
                    isUser && transcript && !isAITalking && "ring-4 ring-emerald-500/50",
                    !isUser && isAITalking && "ring-4 ring-emerald-500/50",
                )}
            >
                {/* Theme toggle button */}
                {onThemeToggle && (
                    <button
                        onClick={onThemeToggle}
                        className={cn(
                            "absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300",
                            isDarkMode
                                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                )}

                {/* Session timer and progress */}


                {isUser ? (
                    // User video container
                    <>
                        {isVideoOn ? (
                            <div className="relative w-full h-full">
                                <Webcam
                                    ref={videoRef}
                                    audio={isAudioOn}
                                    muted={true}
                                    mirrored={true}
                                    screenshotFormat="image/jpeg"
                                    screenshotQuality={0.85}
                                    videoConstraints={{
                                        width: 1280,
                                        height: 720,
                                        facingMode: "user"
                                    }}
                                    className="w-full h-full object-cover"
                                />

                                {/* Video overlay gradient */}
                                <div className={cn(
                                    "absolute inset-0 pointer-events-none",
                                    isDarkMode
                                        ? "bg-gradient-to-t from-black/60 to-transparent"
                                        : "bg-gradient-to-t from-white/40 to-transparent"
                                )}></div>
                            </div>
                        ) : (
                            <div className={cn(
                                "w-full h-full flex items-center justify-center",
                                isDarkMode
                                    ? "bg-gradient-to-br from-gray-800 to-gray-900"
                                    : "bg-gradient-to-br from-gray-50 to-gray-200"
                            )}>
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -inset-4 rounded-full blur-xl opacity-40",
                                        isDarkMode ? "bg-emerald-800" : "bg-emerald-200"
                                    )}></div>
                                    <Avatar className="h-28 w-28 border-4 border-emerald-500/20 animate-float">
                                        <AvatarImage src="/placeholder.svg?height=112&width=112" alt="You" />
                                        <AvatarFallback className={cn(
                                            "text-2xl",
                                            isDarkMode
                                                ? "bg-emerald-700/20 text-emerald-400"
                                                : "bg-emerald-100 text-emerald-600"
                                        )}>
                                            You
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        )}

                        {/* User badge */}
                        <div className={cn(
                            "absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm flex items-center space-x-2 backdrop-blur-md",
                            isDarkMode
                                ? "bg-gray-800/80 text-white"
                                : "bg-white/80 text-gray-800"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                isDarkMode ? "bg-emerald-700/40" : "bg-emerald-100"
                            )}>
                                <User className={cn("h-4 w-4", isDarkMode ? "text-emerald-300" : "text-emerald-600")} />
                            </div>
                            <div>
                                <span className="font-medium">You</span>
                                {!isAudioOn && (
                                    <span className="ml-2">
                                        <MicOff className="h-3 w-3 text-red-400 inline-block" />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Screenshot counter badge */}
                        {screenshotCount > 0 && (
                            <div className={cn(
                                "absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm flex items-center space-x-2 backdrop-blur-md",
                                isDarkMode
                                    ? "bg-gray-800/80 text-white"
                                    : "bg-white/80 text-gray-800"
                            )}>
                                <Camera className={cn("h-4 w-4 mr-1", isDarkMode ? "text-blue-300" : "text-blue-600")} />
                                <span>{screenshotCount}/3</span>
                            </div>
                        )}

                        {/* Screenshot flash effect */}
                        {showScreenshotEffect && (
                            <div className="absolute inset-0 bg-white animate-flash rounded-lg z-10"></div>
                        )}

                        {/* Audio level indicator */}
                        {isAudioOn && audioLevel > 0 && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <div className={cn(
                                    "audio-wave",
                                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                                )}>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                height: `${Math.min(8 + i * 3, 20) * audioLevel}px`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className={cn(
                                    "p-2 rounded-full",
                                    isDarkMode
                                        ? "bg-gray-800/80 text-emerald-400"
                                        : "bg-white/80 text-emerald-600"
                                )}>
                                    <Volume2 className="h-4 w-4" />
                                </div>
                            </div>
                        )}

                        {/* Live indicator for user when they are speaking */}
                        {callStatus === "ACTIVE" && transcript && !isAITalking && (
                            <div className={cn(
                                "absolute top-16 right-4 px-3 py-1.5 rounded-full text-xs flex items-center space-x-2 backdrop-blur-md animate-pulse",
                                isDarkMode
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            )}>
                                <div className="speaking-indicator mr-1">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span>Speaking</span>
                            </div>
                        )}
                    </>
                ) : (
                    // AI interviewer container
                    <div className={cn(
                        "flex flex-col items-center justify-center h-full w-full relative",
                        isDarkMode
                            ? "bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/30"
                            : "bg-gradient-to-br from-gray-50 via-gray-100 to-emerald-50"
                    )}>
                        {/* Background effect */}
                        <div className={cn(
                            "absolute inset-0 overflow-hidden",
                            isDarkMode ? "opacity-20" : "opacity-10"
                        )}>
                            <div className="absolute -inset-[100%] bg-[radial-gradient(40%_40%_at_50%_50%,#4ade8050_0%,transparent_75%)] animate-pulse-slow"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                {/* Glow effect */}
                                <div className={cn(
                                    "absolute -inset-8 rounded-full blur-xl",
                                    isDarkMode ? "bg-emerald-900/30" : "bg-emerald-200/50"
                                )}></div>
                                <div className="relative z-10">
                                    <SplineComponent />
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-3">
                                <h3 className={cn(
                                    "text-2xl font-semibold tracking-tight",
                                    isAITalking && "speaking-animation",
                                    isDarkMode ? "text-white" : "text-gray-800"
                                )}>
                                    TaleeX
                                </h3>
                                <div className={cn(
                                    "text-xs uppercase tracking-wider font-medium",
                                    isDarkMode ? "text-emerald-400" : "text-emerald-700"
                                )}>
                                    AI Interviewer
                                </div>
                            </div>

                            <div className={cn(
                                "flex items-center space-x-2 px-4 py-2 rounded-full",
                                isDarkMode
                                    ? "bg-gray-800/80 text-gray-200"
                                    : "bg-white/80 text-gray-700",
                                "backdrop-blur-md"
                            )}>
                                <div
                                    className={cn(
                                        "w-3 h-3 rounded-full",
                                        isAITalking
                                            ? "bg-emerald-500 animate-pulse"
                                            : callStatus === "ACTIVE"
                                                ? "bg-blue-400"
                                                : callStatus === "CONNECTING"
                                                    ? "bg-yellow-400"
                                                    : "bg-gray-400",
                                    )}
                                ></div>
                                <p className="text-sm">
                                    {isAITalking
                                        ? "Speaking..."
                                        : callStatus === "ACTIVE"
                                            ? "Listening..."
                                            : callStatus === "CONNECTING"
                                                ? "Connecting..."
                                                : "Waiting..."}
                                </p>
                            </div>
                        </div>

                        {/* AI badge */}
                        <div className={cn(
                            "absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm flex items-center space-x-2",
                            isDarkMode
                                ? "bg-gray-800/80 text-white"
                                : "bg-white/80 text-gray-800",
                            "backdrop-blur-md"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                isDarkMode ? "bg-blue-700/40" : "bg-blue-100"
                            )}>
                                <Bot className={cn("h-4 w-4", isDarkMode ? "text-blue-300" : "text-blue-600")} />
                            </div>
                            <span className="font-medium">Interviewer</span>
                        </div>

                        {/* Audio wave animation when AI is talking */}
                        {isAITalking && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <div className={cn(
                                    "audio-wave",
                                    isDarkMode ? "text-blue-400" : "text-blue-600"
                                )}>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                height: `${Math.min(8 + i * 3, 20)}px`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className={cn(
                                    "p-2 rounded-full",
                                    isDarkMode
                                        ? "bg-gray-800/80 text-blue-400"
                                        : "bg-white/80 text-blue-600"
                                )}>
                                    <Volume2 className="h-4 w-4" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    },
)

VideoContainer.displayName = "VideoContainer"