import { forwardRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MicOff, Bot, Camera, Volume2, Sun, Moon } from 'lucide-react'
import { cn } from "@/lib/utils"
import SplineComponent from "@/components/interview/3dLoading"
import Webcam from "react-webcam"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

export const VideoContainer = forwardRef(
    ({
         isUser,
         videoRef,
         isVideoOn,
         isAudioOn,
         isAITalking,
         isUserTalking,
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

        // Determine speaking state
        const isSpeaking = isUser ? isUserTalking : isAITalking;

        // Enhanced colors using Tailwind's color system
        const colors = {
            user: {
                primary: "text-emerald-500 dark:text-emerald-400",
                secondary: "text-emerald-600 dark:text-emerald-300",
                background: "bg-emerald-100/70 dark:bg-emerald-900/30",
                glow: "emerald-300/50 dark:emerald-500/30",
                speakingRing: "ring-emerald-500",
                speakingGlow: "shadow-emerald-400/50 dark:shadow-emerald-500/40",
                gradientFrom: "from-emerald-50 dark:from-emerald-900/40",
                gradientTo: "to-emerald-200/50 dark:to-emerald-800/20",
                lightBg: "bg-emerald-100",
                darkBg: "bg-emerald-700/40",
                lightText: "text-emerald-600",
                darkText: "text-emerald-300",
                avatarFallback: "bg-emerald-100 text-emerald-600 dark:bg-emerald-700/20 dark:text-emerald-400",
                pulseColor: "bg-emerald-200 dark:bg-emerald-800",
                highlightBg: "bg-emerald-100/90 dark:bg-emerald-500/30",
                border: "border-emerald-300 dark:border-emerald-500/40",
            },
            ai: {
                primary: "text-indigo-500 dark:text-indigo-400",
                secondary: "text-indigo-600 dark:text-indigo-300",
                background: "bg-indigo-100/70 dark:bg-indigo-900/30",
                glow: "indigo-300/50 dark:indigo-500/30",
                speakingRing: "ring-indigo-500",
                speakingGlow: "shadow-indigo-400/50 dark:shadow-indigo-500/40",
                gradientFrom: "from-indigo-50 dark:from-indigo-900/40",
                gradientTo: "to-indigo-200/50 dark:to-indigo-800/20",
                lightBg: "bg-indigo-100",
                darkBg: "bg-indigo-700/40",
                lightText: "text-indigo-600",
                darkText: "text-indigo-300",
                pulseColor: "bg-indigo-200 dark:bg-indigo-800",
                highlightBg: "bg-indigo-100/90 dark:bg-indigo-500/30",
                border: "border-indigo-300 dark:border-indigo-500/40",
            },
            bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
            text: isDarkMode ? "text-white" : "text-gray-800",
            subtle: isDarkMode ? "text-gray-400" : "text-gray-600",
        };

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
            if (isAudioOn && isSpeaking) {
                const interval = setInterval(() => {
                    setAudioLevel(Math.random() * 0.7 + 0.3); // Random value between 0.3 and 1
                }, 100);
                return () => clearInterval(interval);
            } else {
                setAudioLevel(0);
            }
        }, [isAudioOn, isSpeaking]);

        // Format session time
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        // Get the appropriate color set
        const activeColors = isUser ? colors.user : colors.ai;

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full lg:w-1/2 h-[40vh] lg:h-auto relative rounded-xl transition-all duration-300 overflow-hidden",
                    isDarkMode
                        ? "bg-gray-900 shadow-xl"
                        : "bg-gray-100 shadow-lg",
                    isUser ? "video-container user" : "flex flex-col items-center justify-center video-container ai",
                    isSpeaking && activeColors.speakingRing,
                    isSpeaking && "ring-2 shadow-lg",
                    isSpeaking && "z-10",
                    !isSpeaking && "opacity-90"
                )}
                style={{
                    boxShadow: isSpeaking ? `0 0 20px var(--${activeColors.glow})` : 'none',
                    transition: "all 0.3s ease-in-out"
                }}
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
                                <div className={cn(
                                    "absolute inset-0 pointer-events-none",
                                    isDarkMode
                                        ? "bg-gradient-to-t from-black/60 to-transparent"
                                        : "bg-gradient-to-t from-white/40 to-transparent"
                                )}></div>
                                {isSpeaking && (
                                    <div className="absolute inset-0 pointer-events-none border-4 border-emerald-500/50 animate-pulse rounded-lg"></div>
                                )}
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
                                        "absolute -inset-4 rounded-full blur-xl",
                                        isSpeaking
                                            ? isDarkMode ? "bg-emerald-800 opacity-60" : "bg-emerald-200 opacity-70"
                                            : isDarkMode ? "bg-emerald-800 opacity-30" : "bg-emerald-200 opacity-40",
                                        isSpeaking && "animate-pulse"
                                    )}></div>
                                    <Avatar className={cn(
                                        "h-28 w-28 border-4",
                                        isSpeaking
                                            ? "border-emerald-500 animate-float"
                                            : "border-emerald-500/20"
                                    )}>
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

                        <div className={cn(
                            "absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm flex items-center space-x-2 backdrop-blur-md",
                            isDarkMode
                                ? "bg-gray-800/80 text-white"
                                : "bg-white/80 text-gray-800",
                            isSpeaking && "ring-2 ring-emerald-500/50"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                isDarkMode ? "bg-emerald-700/40" : "bg-emerald-100",
                                isSpeaking && "ring-1 ring-emerald-400"
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
                                {isSpeaking && (
                                    <span className="ml-2 text-xs font-medium text-emerald-400">SPEAKING</span>
                                )}
                            </div>
                        </div>

                        {screenshotCount > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "absolute top-4 left-4 px-3 py-2 rounded-lg flex items-center gap-2",
                                            isDarkMode
                                                ? "bg-slate-800 text-white border border-slate-700"
                                                : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                                        )}>
                                            <Camera className={cn(
                                                "h-4 w-4",
                                                screenshotCount === 3
                                                    ? "text-amber-500"
                                                    : "text-blue-500"
                                            )} />
                                            <div className="flex flex-col">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-sm">{screenshotCount}</span>
                                                    <span className="text-xs text-slate-500 ml-1">/ {3}</span>
                                                </div>
                                                <Progress
                                                    value={(screenshotCount / 3) * 100}
                                                    className={cn(
                                                        "h-1 w-16 mt-1",
                                                        screenshotCount === 3 ? "bg-amber-100" : "bg-blue-100"
                                                    )}
                                                    indicatorClassName={
                                                        screenshotCount === 3 ? "bg-amber-500" : "bg-blue-500"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">{`${screenshotCount} of ${3} screenshots taken`}</p>
                                        {screenshotCount === 3 && (
                                            <p className="text-xs text-amber-500">Maximum screenshots reached</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {showScreenshotEffect && (
                            <div className="absolute inset-0 bg-white animate-flash rounded-lg z-10"></div>
                        )}

                        {isAudioOn && isSpeaking && audioLevel > 0 && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 animate-fadeIn">
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
                                        : "bg-white/80 text-emerald-600",
                                    "ring-1 ring-emerald-500"
                                )}>
                                    <Volume2 className="h-4 w-4" />
                                </div>
                            </div>
                        )}

                        {isSpeaking && (
                            <div className={cn(
                                "absolute top-0 left-0 right-0 px-4 py-3 text-sm flex items-center justify-center space-x-2 backdrop-blur-md z-20 animate-fadeIn",
                                isDarkMode
                                    ? "bg-emerald-500/30 text-white border-b border-emerald-500/40 shadow-lg shadow-emerald-500/30"
                                    : "bg-emerald-100/90 text-emerald-800 border-b border-emerald-300 shadow-lg shadow-emerald-400/20"
                            )}>
                                <div className="speaking-indicator mr-2">
                                    <span className="bg-emerald-400"></span>
                                    <span className="bg-emerald-400"></span>
                                    <span className="bg-emerald-400"></span>
                                </div>
                                <span className="font-semibold tracking-wide">YOU ARE SPEAKING</span>
                            </div>
                        )}
                    </>
                ) : (
                    // AI interviewer container
                    <>
                        <div className={cn(
                            "flex flex-col items-center justify-center h-full w-full relative",
                            isDarkMode
                                ? "bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/30"
                                : "bg-gradient-to-br from-gray-50 via-gray-100 to-indigo-50"
                        )}>
                            <div className={cn(
                                "absolute inset-0 overflow-hidden",
                                isDarkMode ? "opacity-20" : "opacity-10"
                            )}>
                                <div className={cn(
                                    "absolute -inset-[100%]",
                                    isSpeaking
                                        ? "bg-[radial-gradient(40%_40%_at_50%_50%,#6366f150_0%,transparent_75%)]"
                                        : "bg-[radial-gradient(40%_40%_at_50%_50%,#4f46e550_0%,transparent_75%)]",
                                    isSpeaking && "animate-pulse-slow"
                                )}></div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -inset-8 rounded-full blur-xl transition-all duration-300",
                                        isDarkMode
                                            ? isSpeaking ? "bg-indigo-600/30" : "bg-indigo-900/20"
                                            : isSpeaking ? "bg-indigo-300/60" : "bg-indigo-200/30",
                                        isSpeaking && "animate-pulse-slow"
                                    )}></div>
                                    <div className="relative z-10">
                                        <SplineComponent />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center space-y-3">
                                    <h3 className={cn(
                                        "text-2xl font-semibold tracking-tight",
                                        isSpeaking && "speaking-animation",
                                        isDarkMode ? "text-white" : "text-gray-800"
                                    )}>
                                        TaleeX
                                    </h3>
                                    <div className={cn(
                                        "text-xs uppercase tracking-wider font-medium",
                                        isDarkMode
                                            ? isSpeaking ? "text-indigo-300" : "text-indigo-400"
                                            : isSpeaking ? "text-indigo-600" : "text-indigo-500"
                                    )}>
                                        AI Interviewer
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-full",
                                    isDarkMode
                                        ? "bg-gray-800/80 text-gray-200"
                                        : "bg-white/80 text-gray-700",
                                    "backdrop-blur-md",
                                    isSpeaking && "ring-2 ring-indigo-500/50"
                                )}>
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            isSpeaking
                                                ? "bg-indigo-500 animate-pulse"
                                                : callStatus === "ACTIVE"
                                                    ? "bg-blue-400"
                                                    : callStatus === "CONNECTING"
                                                        ? "bg-yellow-400"
                                                        : "bg-gray-400",
                                        )}
                                    ></div>
                                    <p className="text-sm">
                                        {isSpeaking
                                            ? "Speaking..."
                                            : callStatus === "ACTIVE"
                                                ? "Listening..."
                                                : callStatus === "CONNECTING"
                                                    ? "Connecting..."
                                                    : "Waiting..."}
                                    </p>
                                </div>
                            </div>

                            <div className={cn(
                                "absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm flex items-center space-x-2",
                                isDarkMode
                                    ? "bg-gray-800/80 text-white"
                                    : "bg-white/80 text-gray-800",
                                "backdrop-blur-md",
                                isSpeaking && "ring-2 ring-indigo-500/50"
                            )}>
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center",
                                    isDarkMode ? "bg-indigo-700/40" : "bg-indigo-100",
                                    isSpeaking && "ring-1 ring-indigo-400"
                                )}>
                                    <Bot className={cn("h-4 w-4", isDarkMode ? "text-indigo-300" : "text-indigo-600")} />
                                </div>
                                <div>
                                    <span className="font-medium">Interviewer</span>
                                    {isSpeaking && (
                                        <span className="ml-2 text-xs font-medium text-indigo-400">SPEAKING</span>
                                    )}
                                </div>
                            </div>

                            {isSpeaking && (
                                <div className="absolute bottom-4 right-4 flex items-center gap-2 animate-fadeIn">
                                    <div className={cn(
                                        "audio-wave",
                                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
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
                                            ? "bg-gray-800/80 text-indigo-400"
                                            : "bg-white/80 text-indigo-600",
                                        "ring-1 ring-indigo-500"
                                    )}>
                                        <Volume2 className="h-4 w-4" />
                                    </div>
                                </div>
                            )}

                            {isSpeaking && (
                                <div className={cn(
                                    "absolute top-0 left-0 right-0 px-4 py-3 text-sm flex items-center justify-center space-x-2 backdrop-blur-md z-20 animate-fadeIn",
                                    isDarkMode
                                        ? "bg-indigo-500/30 text-white border-b border-indigo-500/40 shadow-lg shadow-indigo-500/30"
                                        : "bg-indigo-100/90 text-indigo-800 border-b border-indigo-300 shadow-lg shadow-indigo-400/20"
                                )}>
                                    <div className="speaking-indicator mr-2">
                                        <span className="bg-indigo-400"></span>
                                        <span className="bg-indigo-400"></span>
                                        <span className="bg-indigo-400"></span>
                                    </div>
                                    <span className="font-semibold tracking-wide">AI IS SPEAKING</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        )
    },
)

VideoContainer.displayName = "VideoContainer"