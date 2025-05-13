import { forwardRef, useEffect, useState, ForwardedRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserRound,
  MicOff,
  Bot,
  Volume2,
  Sun,
  Moon,
  Video,
  VideoOff,
  MessageCircle,
  Clock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Webcam from "react-webcam";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider";


export const VideoContainer = forwardRef(
    (
        {
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
          onThemeToggle,
          sessionDuration = 0,
          interviewProgress = 0,
        },
        ref
    ) => {
      const [showScreenshotEffect, setShowScreenshotEffect] = useState(false);
      const [audioLevel, setAudioLevel] = useState(0);
      const { theme } = useTheme();
      const isDarkMode = theme === "dark";

      // Determine speaking state
      const isSpeaking = isUser ? isUserTalking : isAITalking;

      // Enhanced colors using Tailwind's color system
      const colors = {
        user: {
          primary: "text-emerald-500 dark:text-emerald-400",
          secondary: "text-emerald-600 dark:text-emerald-300",
          background: "bg-emerald-50/90 dark:bg-emerald-900/30",
          backgroundActive: "bg-emerald-100/90 dark:bg-emerald-800/50",
          glow: "emerald-300/50 dark:emerald-500/30",
          speakingRing: "ring-emerald-500/70",
          speakingGlow: "shadow-emerald-400/50 dark:shadow-emerald-500/40",
          gradientFrom: "from-emerald-50 dark:from-emerald-900/40",
          gradientTo: "to-emerald-200/50 dark:to-emerald-800/20",
          lightBg: "bg-emerald-100",
          darkBg: "bg-emerald-700/40",
          lightText: "text-emerald-600",
          darkText: "text-emerald-300",
          avatarFallback:
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/60 dark:text-emerald-200",
          pulseColor: "bg-emerald-200 dark:bg-emerald-700",
          highlightBg: "bg-emerald-100/90 dark:bg-emerald-500/30",
          border: "border-emerald-300 dark:border-emerald-500/40",
          statusBg: "bg-emerald-50/80 dark:bg-emerald-900/50",
          statusText: "text-emerald-700 dark:text-emerald-300",
        },
        ai: {
          primary: "text-primary dark:text-primary-foreground",
          secondary: "text-primary-foreground dark:text-primary",
          background: "bg-primary/10 dark:bg-primary/30",
          backgroundActive: "bg-primary/20 dark:bg-primary/40",
          glow: "primary/50 dark:primary/30",
          speakingRing: "ring-primary/70",
          speakingGlow: "shadow-primary/50 dark:shadow-primary/40",
          gradientFrom: "from-primary/5 dark:from-primary/40",
          gradientTo: "to-primary/10 dark:to-primary/20",
          lightBg: "bg-primary/10",
          darkBg: "bg-primary/40",
          lightText: "text-primary",
          darkText: "text-primary-foreground",
          avatarFallback:
              "bg-primary/10 text-primary dark:bg-primary/60 dark:text-primary-foreground",
          pulseColor: "bg-primary/20 dark:bg-primary/70",
          highlightBg: "bg-primary/10 dark:bg-primary/30",
          border: "border-primary/30 dark:border-primary/40",
          statusBg: "bg-primary/5 dark:bg-primary/50",
          statusText: "text-primary dark:text-primary-foreground",
        },
        bg: isDarkMode ? "bg-gray-950" : "bg-gray-50",
        text: isDarkMode ? "text-gray-100" : "text-gray-800",
        subtle: isDarkMode ? "text-gray-400" : "text-gray-600",
        statuses: {
          active: "text-green-500",
          connecting: "text-amber-500",
          waiting: "text-blue-500",
        },
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
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      };

      // Get the appropriate color set
      const activeColors = isUser ? colors.user : colors.ai;

      // Status indicators
      const getStatusIndicator = () => {
        if (callStatus === "ACTIVE") {
          return {
            color: "bg-green-500",
            text: isSpeaking ? "Speaking" : "Listening",
            icon: isSpeaking ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            ),
          };
        } else if (callStatus === "CONNECTING") {
          return {
            color: "bg-amber-500",
            text: "Connecting",
            icon: <Activity className="h-3.5 w-3.5" aria-hidden="true" />,
          };
        } else {
          return {
            color: "bg-blue-500",
            text: "Ready",
            icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
          };
        }
      };

      const status = getStatusIndicator();

      return (
          <div
              ref={ref}
              className={cn(
                  "w-full lg:w-[40%] h-[40vh] lg:h-[400px] relative rounded-xl overflow-hidden transition-all duration-300",
                  isDarkMode
                      ? "bg-gray-900 shadow-xl border border-gray-800"
                      : "bg-white shadow-lg border border-gray-200",
                  isUser ? "video-container-user" : "video-container-ai",
                  isSpeaking && activeColors.speakingRing,
                  isSpeaking && "ring-2 shadow-lg",
                  isSpeaking ? "z-10 scale-[1.05]" : "z-0",
                  !isSpeaking && "opacity-95"
              )}
              style={{
                boxShadow: isSpeaking
                    ? `0 0 20px var(--${activeColors.glow})`
                    : "none",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
          >

            {/* Theme toggle button */}
            {onThemeToggle && (
                <button
                    onClick={onThemeToggle}
                    className={cn(
                        "absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300",
                        isDarkMode
                            ? "bg-gray-800/80 text-amber-400 hover:bg-gray-700 hover:text-amber-300"
                            : "bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:text-gray-700",
                        "backdrop-blur-sm"
                    )}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                  ) : (
                      <Moon className="h-4 w-4" />
                  )}
                </button>
            )}

            {/* Screenshot effect overlay */}
            {showScreenshotEffect && (
                <div className="absolute inset-0 bg-white z-50 animate-flash opacity-0 pointer-events-none"></div>
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
                              facingMode: "user",
                            }}
                            className="w-full h-full object-cover"
                        />

                        {/* Gradient overlay */}
                        <div className={cn(
                            "absolute inset-0 pointer-events-none",
                            "bg-gradient-to-t from-black/60 via-transparent to-black/30"
                        )}></div>

                        {/* Speaking indicator */}
                        {isSpeaking && (
                            <div className="absolute inset-0 pointer-events-none border-4 border-emerald-500/40 animate-pulse rounded-lg"></div>
                        )}


                      </div>
                  ) : (
                      // Avatar fallback when video is off
                      <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          isDarkMode
                              ? "bg-gradient-to-br from-gray-800 to-gray-900"
                              : "bg-gradient-to-br from-gray-50 to-gray-100"
                      )}>
                        <div className="relative">
                          {/* Avatar glow effect */}
                          <div className={cn(
                              "absolute -inset-8 rounded-full blur-xl opacity-70 transition-opacity duration-700",
                              isDarkMode
                                  ? isSpeaking ? "bg-emerald-700/50" : "bg-emerald-900/30"
                                  : isSpeaking ? "bg-emerald-200" : "bg-emerald-100/60",
                              isSpeaking && "animate-pulse-slow"
                          )}></div>

                          <div className="relative flex flex-col items-center gap-4">
                            <Avatar className={cn(
                                "h-28 w-28 border-4 transition-all duration-300",
                                isSpeaking
                                    ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                                    : "border-emerald-400/30"
                            )}>
                              <AvatarImage
                                  src="/placeholder.svg?height=112&width=112"
                                  alt="You"
                              />
                              <AvatarFallback
                                  className={cn(
                                      "text-2xl font-medium",
                                      activeColors.avatarFallback
                                  )}
                              >
                                You
                              </AvatarFallback>
                            </Avatar>

                            <div className={cn(
                                "px-4 py-2 rounded-full backdrop-blur-md",
                                isDarkMode
                                    ? "bg-gray-800/80 text-gray-200"
                                    : "bg-white/80 text-gray-700",
                                "flex items-center gap-2"
                            )}>
                              <VideoOff className="h-4 w-4 text-red-400" />
                              <span className="text-sm font-medium">Camera Off</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* User status badge */}
                  <div className={cn(
                      "absolute bottom-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2.5 transition-all",
                      isDarkMode
                          ? "bg-gray-800/90 text-white"
                          : "bg-white/90 text-gray-800",
                      isSpeaking && "ring-1 ring-emerald-500"
                  )}>
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        isDarkMode
                            ? isSpeaking ? "bg-emerald-600/40" : "bg-emerald-700/20"
                            : isSpeaking ? "bg-emerald-100" : "bg-gray-100",
                        "transition-colors duration-300"
                    )}>
                      <UserRound
                          className={cn(
                              "h-4.5 w-4.5",
                              isDarkMode ? "text-emerald-200" : "text-emerald-700"
                          )}
                      />
                    </div>
                    <div>
                      <span className="font-medium text-sm">You</span>
                      {!isAudioOn && (
                          <span className="ml-1.5">
                    <MicOff className="h-3.5 w-3.5 text-red-400 inline-block" />
                  </span>
                      )}
                      {isSpeaking && (
                          <span className={cn(
                              "ml-1.5 text-xs font-medium",
                              "text-emerald-500 dark:text-emerald-400"
                          )}>
                    • Speaking
                  </span>
                      )}
                    </div>
                  </div>

                  {/* Audio visualization */}
                  {isAudioOn && isSpeaking && audioLevel > 0 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-2.5 animate-fadeIn">
                        <div className={cn(
                            "audio-wave",
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                        )}>
                          {[...Array(5)].map((_, i) => (
                              <span
                                  key={i}
                                  style={{
                                    height: `${Math.min(8 + i * 3, 20) * audioLevel}px`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                  className="bg-current"
                              />
                          ))}
                        </div>
                        <div className={cn(
                            "p-2 rounded-full transition-all",
                            isDarkMode
                                ? "bg-gray-800/90 text-emerald-400 ring-1 ring-emerald-500/50"
                                : "bg-white/90 text-emerald-600 ring-1 ring-emerald-400/50",
                            "backdrop-blur-sm"
                        )}>
                          <Volume2 className="h-4 w-4" />
                        </div>
                      </div>
                  )}
                </>
            ) : (
                // AI interviewer container
                <>
                  <div className={cn(
                      "flex flex-col items-center justify-center h-full w-full relative",
                      isDarkMode
                          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-primary/40"
                          : "bg-gradient-to-br from-gray-50 via-gray-100 to-primary/10"
                  )}>
                    {/* Background effects */}
                    <div className={cn(
                        "absolute inset-0 overflow-hidden",
                        isDarkMode ? "opacity-30" : "opacity-15"
                    )}>
                      <div className={cn(
                          "absolute -inset-[100%]",
                          isSpeaking
                              ? "bg-[radial-gradient(40%_40%_at_50%_50%,var(--primary)50_0%,transparent_75%)]"
                              : "bg-[radial-gradient(40%_40%_at_50%_50%,var(--primary)50_0%,transparent_75%)]",
                          isSpeaking && "animate-pulse-slow"
                      )}></div>
                    </div>

                    {/* AI Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center flex-grow space-y-7 w-full px-4">
                      <div className="relative">
                        {/* Glow effect */}
                        <div className={cn(
                            "absolute -inset-8 rounded-full blur-xl transition-all duration-500",
                            isDarkMode
                                ? isSpeaking ? "bg-primary/40" : "bg-primary/20"
                                : isSpeaking ? "bg-primary/30" : "bg-primary/10",
                            isSpeaking && "animate-pulse-slow"
                        )}></div>

                        {/* AI Avatar */}
                        <div className={cn(
                            "relative z-10 flex items-center justify-center rounded-full p-6",
                            isDarkMode
                                ? isSpeaking ? "bg-primary/50" : "bg-primary/30"
                                : isSpeaking ? "bg-primary/20" : "bg-primary/10",
                            "transition-colors duration-300 border-2",
                            isDarkMode
                                ? isSpeaking ? "border-primary/70" : "border-primary/30"
                                : isSpeaking ? "border-primary/30" : "border-primary/20"
                        )}>
                          <Bot className={cn(
                              "h-12 w-12 transition-colors duration-300",
                              isDarkMode
                                  ? isSpeaking ? "text-primary-foreground" : "text-primary-foreground/80"
                                  : isSpeaking ? "text-primary" : "text-primary/80"
                          )} />
                        </div>
                      </div>

                      {/* AI Name and Status */}
                      <div className="flex flex-col items-center space-y-2">
                        <h3 className={cn(
                            "text-2xl font-semibold tracking-tight transition-colors duration-300",
                            isDarkMode
                                ? isSpeaking ? "text-white" : "text-gray-200"
                                : isSpeaking ? "text-gray-900" : "text-gray-700",
                            isSpeaking && "speaking-animation"
                        )}>
                          TaleeX
                        </h3>
                        <div className={cn(
                            "text-xs uppercase tracking-wider font-medium",
                            isDarkMode
                                ? isSpeaking ? "text-primary-foreground" : "text-primary-foreground/80"
                                : isSpeaking ? "text-primary" : "text-primary/80"
                        )}>
                          AI Interviewer
                        </div>
                      </div>

                      {/* Transcript preview (if available) */}
                      {transcript && (
                          <div className={cn(
                              "max-w-[90%] px-4 py-2 rounded-lg text-sm text-center",
                              isDarkMode
                                  ? "bg-gray-800/80 text-gray-200"
                                  : "bg-gray-100/80 text-gray-700",
                              "backdrop-blur-sm line-clamp-2"
                          )}>
                            "{transcript}"
                          </div>
                      )}

                      {/* Status indicator */}
                      <div className={cn(
                          "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-full",
                          isDarkMode
                              ? "bg-gray-900/70 text-gray-300"
                              : "bg-white/90 text-gray-700",
                          "backdrop-blur-md border",
                          isDarkMode
                              ? isSpeaking ? "border-primary/50" : "border-gray-800"
                              : isSpeaking ? "border-primary/30" : "border-gray-200",
                          "transition-all duration-300",
                          isSpeaking && "ring-1 ring-primary/50"
                      )}>
                        <div className={cn(
                            "w-2.5 h-2.5 rounded-full animate-pulse",
                            status.color
                        )}></div>
                        <div className="flex items-center gap-1.5">
                          {status.icon}
                          <p className="text-sm font-medium">{status.text}</p>
                        </div>
                      </div>
                    </div>

                    {/* Audio visualization for AI */}
                    {isSpeaking && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2.5 animate-fadeIn">
                          <div className={cn(
                              "audio-wave",
                              isDarkMode ? "text-primary-foreground" : "text-primary"
                          )}>
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                      height: `${Math.min(8 + i * 3, 20)}px`,
                                      animationDelay: `${i * 0.1}s`,
                                    }}
                                    className="bg-current"
                                />
                            ))}
                          </div>
                          <div className={cn(
                              "p-2 rounded-full",
                              isDarkMode
                                  ? "bg-gray-800/90 text-primary-foreground ring-1 ring-primary/50"
                                  : "bg-white/90 text-primary ring-1 ring-primary/50",
                              "backdrop-blur-sm"
                          )}>
                            <Volume2 className="h-4 w-4" />
                          </div>
                        </div>
                    )}
                  </div>
                </>
            )}
          </div>
      );
    }
);

VideoContainer.displayName = "VideoContainer";