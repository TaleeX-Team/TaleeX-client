import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LoadingDialog({ isOpen, title, description }) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title || "Processing..."}</DialogTitle>
                    <DialogDescription>
                        {description || "Please wait while we process your request."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center py-6">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">This may take a moment</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
