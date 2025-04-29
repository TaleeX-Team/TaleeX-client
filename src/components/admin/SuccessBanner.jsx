import { Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SuccessBanner({ title = "Success", message, className = "" }) {
    return (
        <Alert className={`bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 ${className}`}>
            <div className="flex items-start">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="ml-2">
                    <AlertTitle className="text-green-800 dark:text-green-300 font-medium">{title}</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400 mt-1">{message}</AlertDescription>
                </div>
            </div>
        </Alert>
    )
}
