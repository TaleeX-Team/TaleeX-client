"use client"

import { X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function ErrorBanner({ title = "Error", message, onRetry = null, className = "" }) {
    return (
        <Alert
            variant="destructive"
            className={`border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 ${className}`}
        >
            <div className="flex items-start">
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="ml-2 flex-1">
                    <AlertTitle className="text-red-800 dark:text-red-300 font-medium">{title}</AlertTitle>
                    <AlertDescription className="text-red-700 dark:text-red-400 mt-1">{message}</AlertDescription>
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="mt-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                            Try Again
                        </Button>
                    )}
                </div>
            </div>
        </Alert>
    )
}
