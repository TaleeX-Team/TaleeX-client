import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmationModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      description,
                                      confirmText = "Confirm",
                                      cancelText = "Cancel",
                                      variant = "destructive", // Can be 'destructive', 'warning', or 'info'
                                  }) {
    // Refs for animations
    const contentRef = useRef(null);
    const iconRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonsRef = useRef(null);

    // Map variants to colors
    const variantStyles = {
        destructive: {
            icon: "text-destructive",
            iconBg: "bg-destructive/10",
            button: "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        },
        warning: {
            icon: "text-yellow-600 dark:text-yellow-500",
            iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
            button: "bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600"
        },
        info: {
            icon: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            button: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.destructive;

    // Animation when modal opens
    useEffect(() => {
        if (isOpen && contentRef.current) {
            // Reset to initial state
            gsap.set([titleRef.current, descriptionRef.current, buttonsRef.current], {
                opacity: 0,
                y: 20
            });

            gsap.set(iconRef.current, {
                scale: 0.5,
                opacity: 0,
                rotation: -30
            });

            // Animate icon first
            gsap.to(iconRef.current, {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });

            // Then animate content elements with staggered timing
            gsap.to([titleRef.current, descriptionRef.current, buttonsRef.current], {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out"
            });

            // Subtle pulse animation for the modal itself
            gsap.fromTo(
                contentRef.current,
                { scale: 0.95 },
                { scale: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [isOpen]);

    // Handle confirm with animation
    const handleConfirm = () => {
        // Play a quick animation before confirming
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                onComplete: onConfirm
            });
        } else {
            onConfirm();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent
                ref={contentRef}
                className="max-w-md border border-border/50 shadow-lg"
            >
                <div className="flex items-center justify-center mb-6">
                    <div ref={iconRef} className={`w-16 h-16 rounded-full ${currentVariant.iconBg} flex items-center justify-center`}>
                        <AlertTriangle className={`h-8 w-8 ${currentVariant.icon}`} />
                    </div>
                </div>

                <AlertDialogHeader>
                    <AlertDialogTitle ref={titleRef} className="text-center text-xl">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription ref={descriptionRef} className="text-center">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter ref={buttonsRef} className="sm:justify-center sm:space-x-4 pt-4">
                    <AlertDialogCancel asChild>
                        <Button
                            variant="outline"
                            className="sm:w-32 border-border hover:bg-muted"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            className={`sm:w-32 ${currentVariant.button}`}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}