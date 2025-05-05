import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ActionButton({ children, isLoading, icon, loadingText = "Processing...", ...props }) {
    return (
        <Button {...props} disabled={isLoading || props.disabled}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </Button>
    )
}
