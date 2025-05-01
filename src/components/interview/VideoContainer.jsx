import { forwardRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MicOff, Bot, Camera } from 'lucide-react'
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
         screenshotCount
     }, ref) => {
        const [showScreenshotEffect, setShowScreenshotEffect] = useState(false);

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

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full lg:w-1/2 h-[40vh] lg:h-auto relative rounded-lg transition-all duration-300",
                    isUser ? "bg-black video-container user" : "flex flex-col items-center justify-center video-container ai",
                    isUser && transcript && !isAITalking && "border-4 border-green-500/50",
                    !isUser && isAITalking && "ring-4 ring-green-500 ring-opacity-50",
                )}
            >
                {isUser ? (
                    // User video container
                    <>
                        {isVideoOn ? (
                            <>
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
                                    className="w-full h-full object-cover rounded-lg"
                                />

                                {/* Screenshot counter badge */}
                                {screenshotCount > 0 && (
                                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-2 backdrop-blur-sm">
                                        <Camera className="h-4 w-4 mr-1" />
                                        <span>{screenshotCount}/3</span>
                                    </div>
                                )}

                                {/* Screenshot flash effect */}
                                {showScreenshotEffect && (
                                    <div className="absolute inset-0 bg-white/30 animate-flash rounded-lg z-10"></div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
                                <Avatar className="h-24 w-24 border-4 border-emerald-500/20 animate-float">
                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="You" />
                                    <AvatarFallback className="text-xl bg-emerald-500/20 text-emerald-600">You</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-2 backdrop-blur-sm">
                            <User className="h-4 w-4 mr-1" />
                            <span>You</span>
                            {!isAudioOn && <MicOff className="h-3 w-3 text-red-400 ml-2" />}
                        </div>

                        {/* Live indicator for user when they are speaking */}
                        {callStatus === "ACTIVE" && transcript && !isAITalking && (
                            <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2 backdrop-blur-sm animate-pulse">
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
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                            <SplineComponent />
                        </div>
                        <h3 className={cn("text-xl font-medium text-white", isAITalking && "speaking-animation")}>
                            TaleeX (Interviewer)
                        </h3>
                        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full">
                            <div
                                className={cn(
                                    "w-3 h-3 rounded-full",
                                    isAITalking
                                        ? "bg-green-500 animate-pulse"
                                        : callStatus === "ACTIVE"
                                            ? "bg-blue-400"
                                            : callStatus === "CONNECTING"
                                                ? "bg-yellow-400"
                                                : "bg-gray-400",
                                )}
                            ></div>
                            <p className="text-sm text-gray-200">
                                {isAITalking
                                    ? "Speaking..."
                                    : callStatus === "ACTIVE"
                                        ? "Listening..."
                                        : callStatus === "CONNECTING"
                                            ? "Connecting..."
                                            : "Waiting..."}
                            </p>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                            <Bot className="h-4 w-4 mr-1 inline-block" />
                            Interviewer
                        </div>
                    </div>
                )}
            </div>
        )
    },
)

VideoContainer.displayName = "VideoContainer"
