"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Camera } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEndInterview } from "@/hooks/useInterviewData.js"

export function InterviewCompletedDialog({
                                             interviewId,
                                             open,
                                             onOpenChange,
                                             onClose,
                                             interviewDuration,
                                             questionsAsked,
                                             totalQuestions,
                                             screenshots,
                                             transcript,
                                         }) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()
    const { mutateAsync, isPending, isError, error } = useEndInterview()
    const debugMode = true // Enable debug logging for verification

    // Format duration from seconds to minutes:seconds
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    // Clear localStorage entries for transcript and screenshots
    const clearLocalStorage = () => {
        try {
            // Remove full transcript
            localStorage.removeItem(`interview_transcript_${interviewId}`)
            // Remove clean transcript
            localStorage.removeItem(`interview_clean_transcript_${interviewId}`)
            // Remove screenshots
            for (let i = 0; i < screenshots.length; i++) {
                localStorage.removeItem(`interview_screenshot_${interviewId}_${i}`)
            }
            if (debugMode) {
                console.log("Cleared localStorage entries", {
                    interviewId,
                    clearedItems: [
                        `interview_transcript_${interviewId}`,
                        `interview_clean_transcript_${interviewId}`,
                        ...screenshots.map((_, i) => `interview_screenshot_${interviewId}_${i}`),
                    ],
                    timestamp: new Date().toISOString(),
                })
            }
        } catch (error) {
            console.error("Failed to clear localStorage:", {
                error: error.message,
                timestamp: new Date().toISOString(),
            })
        }
    }

    const handleSubmit = async () => {
        try {
            if (debugMode) {
                console.log("Submitting interview data:", {
                    interviewId,
                    transcript: transcript,
                    screenshotCount: screenshots?.length || 0,
                    timestamp: new Date().toISOString(),
                })
            }

            // Check if transcript is available and has the expected structure
            const transcriptText =
                transcript && typeof transcript === "object" && transcript.plainText
                    ? transcript.plainText
                    : typeof transcript === "string"
                        ? transcript
                        : ""

            if (debugMode) {
                console.log("Processed transcript for submission:", {
                    transcriptLength: transcriptText.length,
                    transcriptType: typeof transcriptText,
                    timestamp: new Date().toISOString(),
                })
            }

            await mutateAsync({
                interviewId,
                transcript: transcriptText,
                images: screenshots || [],
            })

            clearLocalStorage()
            setIsSubmitted(true)

            if (debugMode) {
                console.log("Interview data submitted successfully", {
                    interviewId,
                    timestamp: new Date().toISOString(),
                })
            }
        } catch (error) {
            console.error("Error submitting interview data:", {
                error: error.message,
                interviewId,
                timestamp: new Date().toISOString(),
            })
            // Error is handled by the hook and displayed in UI
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                // Only allow closing if submitted or through the buttons
                if (newOpen === false && !isSubmitted) {
                    return // Prevent dialog from closing
                }
                onOpenChange(newOpen)
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Interview Completed</DialogTitle>
                    <DialogDescription>Your interview session has been completed successfully.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-sm text-gray-500">{formatDuration(interviewDuration)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <CheckCircle className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="font-medium">Questions</p>
                            <p className="text-sm text-gray-500">
                                {questionsAsked} of {totalQuestions} questions completed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Camera className="h-5 w-5 text-gray-500" />
                        <div>
                            <p className="font-medium">Screenshots</p>
                            <p className="text-sm text-gray-500">{screenshots?.length || 0} screenshots captured</p>
                        </div>
                    </div>

                    {screenshots && screenshots.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {screenshots.map((screenshot, index) => (
                                    <div
                                        key={index}
                                        className="relative min-w-[100px] h-[75px] rounded-md overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={typeof screenshot === "string" ? screenshot : URL.createObjectURL(screenshot)}
                                            alt={`Screenshot ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {!isSubmitted ? (
                        <Button onClick={handleSubmit} className="sm:w-auto w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Interview Data"
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                onClose()
                                // Optionally navigate somewhere after submission
                                // navigate("/dashboard")
                            }}
                            className="sm:w-auto w-full"
                        >
                            Done
                        </Button>
                    )}

                    {isError && (
                        <p className="text-sm text-red-500 mt-2">
                            {error?.message || "Failed to submit interview data. Please try again."}
                        </p>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
