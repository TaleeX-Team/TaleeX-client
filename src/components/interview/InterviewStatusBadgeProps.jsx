import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function InterviewStatusBadgeProps({ isAI, isLive = false, className }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "text-xs",
                isAI
                    ? "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
                    : "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700",
                className,
            )}
        >
            {isAI ? "AI" : "You"}
            {isLive ? " (Live)" : ""}
        </Badge>
    )
}
