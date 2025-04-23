import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useOAuth } from "../hooks/useOAuth";

export const SocialButtons = ({ disabled }) => {
    const { initiateOAuthLogin, isProcessingOAuth } = useOAuth();

    const handleClick = (provider) => {
        initiateOAuthLogin(provider);
    };

    return (
        <div className="flex flex-col gap-4 w-full mt-2">
            <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 border-t border-gray-300 dark:border-gray-700" />
                <span className="relative px-4 text-sm text-muted-foreground bg-background dark:bg-background">
                    Or continue with
                </span>
            </div>

            <div className="flex gap-3 mt-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 glass-card border bg-white/40 dark:bg-[#2C2744]/80 hover:bg-white/60 dark:hover:bg-[#2C2744]/90 transition-all"
                    onClick={() => handleClick('google')}
                    disabled={disabled || isProcessingOAuth}
                >
                    <FcGoogle size={20} />
                    <span className="font-medium">Google</span>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 glass-card border bg-white/40 dark:bg-[#2C2744]/80 hover:bg-white/60 dark:hover:bg-[#2C2744]/90 transition-all"
                    onClick={() => handleClick('linkedin')}
                    disabled={disabled || isProcessingOAuth}
                >
                    <Linkedin size={20} className="text-[#0077B5]" />
                    <span className="font-medium">LinkedIn</span>
                </Button>
            </div>

            {isProcessingOAuth && (
                <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-primary"></div>
                </div>
            )}
        </div>
    );
};