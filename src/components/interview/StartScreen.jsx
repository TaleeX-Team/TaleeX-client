"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Mic, Loader2 } from "lucide-react"

export function StartScreen({
                                isVideoOn,
                                isAudioOn,
                                isLoading,
                                totalQuestions,
                                setIsVideoOn,
                                setIsAudioOn,
                                handleStartInterview,
                            }) {
    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-8 shadow-xl rounded-xl glass-card animate-float">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full bg-blue-500/10 p-6 mb-2 transition-all duration-300 hover:scale-105 animate-pulse-subtle">
                        <Video className="h-12 w-12 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        Ready for your interview?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        You'll be interviewed by our AI assistant about your technical experience. The interview consists of{" "}
                        {totalQuestions} questions.
                    </p>
                    <div className="w-full space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {/*          <div className="flex items-center justify-between">*/}
              {/*<span className="text-sm flex items-center gap-2">*/}
              {/*  <Video className="h-4 w-4" /> Camera:*/}
              {/*</span>*/}
              {/*              <Button*/}
              {/*                  variant={isVideoOn ? "default" : "outline"}*/}
              {/*                  size="sm"*/}
              {/*                  onClick={() => setIsVideoOn(!isVideoOn)}*/}
              {/*                  className="transition-all duration-200"*/}
              {/*              >*/}
              {/*                  {isVideoOn ? "Enabled" : "Disabled"}*/}
              {/*              </Button>*/}
              {/*          </div>*/}
                        <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Mic className="h-4 w-4" /> Microphone:
              </span>
                            <Button
                                variant={isAudioOn ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsAudioOn(!isAudioOn)}
                                className="transition-all duration-200"
                            >
                                {isAudioOn ? "Enabled" : "Disabled"}
                            </Button>
                        </div>
                    </div>
                    <Button
                        onClick={handleStartInterview}
                        className="mt-4 w-full transition-all duration-300 hover:scale-105 gradient-bg text-white animate-glow"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            "Start Interview"
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
