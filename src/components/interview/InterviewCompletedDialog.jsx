import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Clock, CheckCircle, Camera} from "lucide-react"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useEndInterview} from "@/hooks/useInterviewData.js";

export function InterviewCompletedDialog({
                                             interviewId,
                                             open,
                                             onOpenChange,
                                             onClose,
                                             interviewDuration,
                                             questionsAsked,
                                             totalQuestions,
                                             screenshots,
                                             transcript, // Add transcript as a prop
                                         }) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()

    // Use the end interview hook with loading state and error handling
    const { mutateAsync, isPending, isError, error } = useEndInterview()

    // Format duration from seconds to minutes:seconds
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const handleSubmit = async () => {
        try {
            // Submit the interview data using the hook
            await mutateAsync({
                interviewId,
                transcript,
                images: screenshots || []
            })

            setIsSubmitted(true)
        } catch (error) {
            console.error("Error submitting interview data:", error)
            // Error is already handled by the hook and will be displayed in UI
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                // Only allow closing if submitted or through the buttons
                if (newOpen === false && !isSubmitted) {
                    return; // Prevent dialog from closing
                }
                onOpenChange(newOpen);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Interview Completed</DialogTitle>
                    <DialogDescription>Your interview session has been completed successfully.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-gray-500"/>
                        <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-sm text-gray-500">{formatDuration(interviewDuration)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <CheckCircle className="h-5 w-5 text-gray-500"/>
                        <div>
                            <p className="font-medium">Questions</p>
                            <p className="text-sm text-gray-500">
                                {questionsAsked} of {totalQuestions} questions completed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Camera className="h-5 w-5 text-gray-500"/>
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
                                            src={typeof screenshot === 'string' ? screenshot : URL.createObjectURL(screenshot)}
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
                        <Button
                            onClick={handleSubmit}
                            className="sm:w-auto w-full"
                            disabled={isPending}
                        >
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
                        <Button onClick={() => {
                            onClose();
                            // Optionally navigate somewhere after submission
                            // navigate("/dashboard");
                        }} className="sm:w-auto w-full">
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