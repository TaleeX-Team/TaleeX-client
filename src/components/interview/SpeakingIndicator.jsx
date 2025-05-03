import { cn } from "@/lib/utils"


export function SpeakingIndicator({ className }) {
    return (
        <div className={cn("speaking-indicator", className)}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}
