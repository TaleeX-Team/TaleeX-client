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
import {useNavigate} from "react-router-dom";

export function InterviewCompletedDialog({
                                             open,
                                             onOpenChange,
                                             onClose,
                                             interviewDuration,
                                             questionsAsked,
                                             totalQuestions,
                                             screenshots,
                                         }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const  navigate = useNavigate()
    // Format duration from seconds to minutes:seconds
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // Simulate submission to backend
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
        }, 1500)

        // In a real implementation, you would send the data to your backend
        // const result = await submitInterviewData('https://your-api-endpoint.com/interviews');
        navigate("/")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                            src={screenshot || "/placeholder.svg"}
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
                        <>
                            <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
                                Close
                            </Button>
                            <Button onClick={handleSubmit} className="sm:w-auto w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Interview Data"}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onClose} className="sm:w-auto w-full">
                            Done
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
