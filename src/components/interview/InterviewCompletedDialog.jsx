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
import {
    CheckCircle,
    ArrowRight
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEndInterview } from "@/hooks/useInterviewData.js"
import { toast } from "sonner"
import {useTheme} from "@/layouts/theme_provider/ThemeProvider.jsx";

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
                                             vapiCallId
                                         }) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()
    const { mutateAsync, isPending, isError, error } = useEndInterview()
    const { theme } = useTheme() // Get current theme
    const debugMode = true // Enable debug logging for verification

    // Clear localStorage entries for transcript and screenshots
    const clearLocalStorage = () => {
        try {
            // Remove full transcript
            localStorage.removeItem(`interview_transcript_${interviewId}`)
            // Remove clean transcript
            localStorage.removeItem(`interview_clean_transcript_${interviewId}`)
            // Remove screenshots
            for (let i = 0; i < screenshots?.length; i++) {
                localStorage.removeItem(`interview_screenshot_${interviewId}_${i}`)
            }
            if (debugMode) {
                console.log("Cleared localStorage entries", {
                    interviewId,
                    clearedItems: [
                        `interview_transcript_${interviewId}`,
                        `interview_clean_transcript_${interviewId}`,
                        ...screenshots?.map((_, i) => `interview_screenshot_${interviewId}_${i}`) || [],
                    ],
                    timestamp: new Date().toISOString(),
                })
            }
        } catch (error) {
            toast.error("Error clearing local storage")
        }
    }

    const handleSubmit = async () => {
        try {
            // Check if transcript is available and has the expected structure
            const transcriptText =
                transcript && typeof transcript === "object" && transcript.plainText
                    ? transcript.plainText
                    : typeof transcript === "string"
                        ? transcript
                        : ""

            await mutateAsync({
                interviewId,
                images: screenshots || [],
                vapiCallId: vapiCallId,
            })

            clearLocalStorage()
            setIsSubmitted(true)
            toast.success("Interview data submitted successfully")

            if (debugMode) {
                console.log("Interview data submitted successfully", {
                    interviewId,
                    timestamp: new Date().toISOString(),
                })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit interview data")
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
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-2xl font-semibold text-center">
                        {isSubmitted ? "Success!" : "Interview Completed"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {isSubmitted
                            ? "Your interview data has been processed and saved."
                            : "Thank you for completing your interview."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex justify-center">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-center text-lg font-medium">
                                Your submission was successful
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
                                <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-center text-lg font-medium">
                                Ready to submit your interview
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
                    {isError && (
                        <p className="text-sm text-red-500 dark:text-red-400 w-full text-center mb-2">
                            {error?.message || "Failed to submit interview data. Please try again."}
                        </p>
                    )}

                    {!isSubmitted ? (
                        <Button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto"
                            disabled={isPending}
                            size="lg"
                        >
                            {isPending ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Submit Interview
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                onClose()
                                // Optionally navigate somewhere after submission
                                navigate("/")
                            }}
                            className="w-full sm:w-auto"
                            size="lg"
                            variant="default"
                        >
                            Return to Dashboard
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}