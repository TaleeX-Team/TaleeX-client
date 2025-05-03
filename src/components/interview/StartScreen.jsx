"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Mic, Loader2, Calendar, Briefcase, Building, CheckCircle } from "lucide-react"
import { useState } from "react"

export function StartScreen({
                                interviewHeaderData,
                                errorInterview,
                                isVideoOn,
                                isAudioOn,
                                isLoading,
                                totalQuestions,
                                setIsVideoOn,
                                setIsAudioOn,
                                handleStartInterview,
                            }) {
    const [showDetails, setShowDetails] = useState(false);

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl p-8 shadow-xl rounded-xl glass-card animate-float">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* User Profile Section */}
                    <div className="w-full mb-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {interviewHeaderData?.image ? (
                                    <img
                                        src={interviewHeaderData.image}
                                        alt={interviewHeaderData.userName}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                                        {interviewHeaderData?.userName?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div className="text-left">
                                    <h3 className="text-xl font-bold">{interviewHeaderData?.userName || "Candidate"}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        {interviewHeaderData?.jobTitle || "Position"}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        {interviewHeaderData?.companyName || "Company"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-left">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Interview Details</p>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="capitalize">{interviewHeaderData?.interviewType?.[0] || "Technical"} Interview</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span>Expires: {formatDate(interviewHeaderData?.expiryDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2"></div>

                    {/* Interview Info Section */}
                    <div className="w-full space-y-4">
                        <div
                            className="rounded-full bg-blue-500/10 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-2 transition-all duration-300 hover:scale-105 animate-pulse-subtle">
                            <Video className="h-12 w-12 text-blue-500"/>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            Ready for your interview?
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            You'll be interviewed by our AI assistant about your technical experience. The interview
                            consists of {interviewHeaderData?.questionCount || totalQuestions} questions.
                        </p>

                        <div className="w-full space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Mic className="h-4 w-4"/> Microphone:
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Initializing...
                                </>
                            ) : (
                                "Start Interview"
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}