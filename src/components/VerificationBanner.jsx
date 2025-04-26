import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Bell, ChevronRight, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {useVerificationEmail} from "@/hooks/useVerificationEmail.js";
import {useUser} from "@/hooks/useUser.js";

export default function VerificationBanner() {
    const [dismissed, setDismissed] = useState(false);
    const bannerRef = useRef(null);
    const iconRef = useRef(null);
    const textRef = useRef(null);
    const { data: user } = useUser();
    const verificationMutation = useVerificationEmail()
    ;

    useEffect(() => {
        // Simple animation sequence for the banner
        if (!dismissed) {
            // Animate the banner sliding in from the top
            const banner = bannerRef.current;
            if (banner) {
                banner.style.transform = 'translateY(-100%)';
                banner.style.opacity = '0';

                setTimeout(() => {
                    banner.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
                    banner.style.transform = 'translateY(0)';
                    banner.style.opacity = '1';
                }, 100);
            }

            // Animate the icon with a gentle pulse
            const icon = iconRef.current;
            if (icon) {
                const pulseAnimation = () => {
                    icon.style.transition = 'transform 1.2s ease-in-out';
                    icon.style.transform = 'scale(1.2)';

                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 600);
                };

                pulseAnimation();
                const interval = setInterval(pulseAnimation, 2400);
                return () => clearInterval(interval);
            }
        }
    }, [dismissed]);

    const handleDismiss = () => {
        const banner = bannerRef.current;
        if (banner) {
            banner.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
            banner.style.transform = 'translateY(-100%)';
            banner.style.opacity = '0';

            setTimeout(() => {
                setDismissed(true);
                // You might want to set this in localStorage to prevent showing again in the same session
                localStorage.setItem('verification_banner_dismissed', 'true');
            }, 500);
        }
    };

    const handleVerifyNow = () => {
        if (user?.email) {
            verificationMutation.mutate(user.email);
        } else {
            // Handle case where user email is not available
            alert('Unable to determine your email address. Please try again later or contact support.');
        }
    };

    // Don't show banner if already dismissed or user is already verified
    if (dismissed || (user && user.isVerified)) {
        return null;
    }

    return (
        <div
            ref={bannerRef}
            className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-4xl p-4"
        >
            <Alert className="flex items-center justify-between bg-blue-600 dark:bg-blue-700 text-white shadow-lg border-none">
                <div className="flex items-center space-x-4">
                    <div
                        ref={iconRef}
                        className="flex-shrink-0 rounded-full bg-white text-primary bg-opacity-20 p-2"
                    >
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div ref={textRef}>
                        <AlertTitle className="text-lg font-bold mb-1">Account Verification Required</AlertTitle>
                        <AlertDescription className="text-sm font-medium text-white text-opacity-90">
                            Please verify your account to unlock all features and enhance your security.
                        </AlertDescription>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDismiss}
                        className="text-xs text-white text-opacity-80 hover:text-opacity-100 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        className="flex items-center bg-white text-blue-600 dark:text-blue-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleVerifyNow}
                        disabled={verificationMutation.isPending}
                    >
                        {verificationMutation.isPending ? 'Sending...' : 'Verify Now'}
                        {!verificationMutation.isPending && <ChevronRight className="h-4 w-4 ml-1" />}
                    </button>
                </div>
            </Alert>
        </div>
    );
}