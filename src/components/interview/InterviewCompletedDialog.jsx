import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"


export function InterviewCompletedDialog({ open, onOpenChange, onClose }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <DialogTitle className="text-center text-2xl">Interview Completed</DialogTitle>
                    <DialogDescription className="text-center">
                        Your interview has been successfully completed. Thank you for participating!
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-center text-gray-700">
                        The hiring team will review your interview responses and get back to you with feedback or next steps.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={onClose} className="w-full">
                        Return to Dashboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
