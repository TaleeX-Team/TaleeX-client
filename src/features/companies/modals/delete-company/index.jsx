"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AlertTriangle, X, Check, Info, HelpCircle } from "lucide-react";
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
                                    confirmText = "Delete",
                                    cancelText = "Cancel",
                                    intent = "destructive", // Options: "destructive", "warning", "info", "question"
                                    size = "default", // Options: "sm", "default", "lg"
                                  }) {
  // Refs for animations
  const contentRef = useRef(null);
  const backdropRef = useRef(null);
  const iconWrapperRef = useRef(null);
  const iconRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);

  // Intent configurations
  const intentConfig = {
    destructive: {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10 dark:bg-destructive/20",
      borderColor: "border-destructive/20 dark:border-destructive/30",
      buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      iconAnimation: "shake",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-warning-500 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
      borderColor: "border-warning-200 dark:border-warning-700",
      buttonClass: "bg-warning-500 dark:bg-warning-600 text-white hover:bg-warning-600 dark:hover:bg-warning-500",
      iconAnimation: "pulse",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      buttonClass: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
      iconAnimation: "bounce",
    },
    question: {
      icon: HelpCircle,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-700",
      buttonClass: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500",
      iconAnimation: "rotateIn",
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      containerClass: "max-w-sm",
      iconSize: "h-12 w-12",
      iconWrapperSize: "h-14 w-14",
      titleClass: "text-lg",
    },
    default: {
      containerClass: "max-w-md",
      iconSize: "h-14 w-14",
      iconWrapperSize: "h-16 w-16",
      titleClass: "text-xl",
    },
    lg: {
      containerClass: "max-w-lg",
      iconSize: "h-16 w-16",
      iconWrapperSize: "h-20 w-20",
      titleClass: "text-2xl",
    }
  };

  // Current configurations
  const currentIntent = intentConfig[intent] || intentConfig.destructive;
  const currentSize = sizeConfig[size] || sizeConfig.default;
  const IconComponent = currentIntent.icon;

  // Animation when modal opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Reset animations
      gsap.set([titleRef.current, descriptionRef.current, buttonsRef.current], {
        opacity: 0,
        y: 20
      });

      gsap.set(iconWrapperRef.current, {
        scale: 0.5,
        opacity: 0,
      });

      gsap.set(iconRef.current, {
        scale: 0.5,
        opacity: 0,
      });

      // Background animation
      gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
      );

      // Content animation
      gsap.fromTo(
          contentRef.current,
          { scale: 0.9, y: 20, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );

      // Icon wrapper animation
      gsap.to(iconWrapperRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: 0.1,
        ease: "back.out(1.7)"
      });

      // Icon animation based on intent
      const iconAnimations = {
        shake: () => {
          gsap.to(iconRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            onComplete: () => {
              gsap.to(iconRef.current, {
                rotation: "+=5",
                duration: 0.1,
                repeat: 5,
                yoyo: true,
              });
            }
          });
        },
        pulse: () => {
          gsap.to(iconRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            onComplete: () => {
              gsap.to(iconRef.current, {
                scale: 1.2,
                duration: 0.3,
                repeat: 1,
                yoyo: true,
              });
            }
          });
        },
        bounce: () => {
          gsap.to(iconRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            onComplete: () => {
              gsap.to(iconRef.current, {
                y: -10,
                duration: 0.3,
                repeat: 1,
                yoyo: true,
              });
            }
          });
        },
        rotateIn: () => {
          gsap.to(iconRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 360,
            duration: 0.5,
          });
        }
      };

      // Run icon animation
      if (iconAnimations[currentIntent.iconAnimation]) {
        iconAnimations[currentIntent.iconAnimation]();
      }

      // Text elements animation
      gsap.to([titleRef.current, descriptionRef.current, buttonsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out"
      });
    }
  }, [isOpen, intent]);

  // Handle confirm with animation
  const handleConfirm = () => {
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
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        />
        <AlertDialogContent
            ref={contentRef}
            className={`${currentSize.containerClass} border shadow-lg backdrop-blur-sm bg-card/95 p-0 overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="flex flex-col items-center px-6 pt-6">
            <div
                ref={iconWrapperRef}
                className={`${currentSize.iconWrapperSize} rounded-full ${currentIntent.bgColor} ${currentIntent.borderColor} border flex items-center justify-center mb-5`}
            >
              <IconComponent
                  ref={iconRef}
                  className={`${currentSize.iconSize} ${currentIntent.iconColor}`}
              />
            </div>
          </div>

          <AlertDialogHeader className="px-6 gap-2">
            <AlertDialogTitle
                ref={titleRef}
                className={`text-center font-semibold ${currentSize.titleClass}`}
            >
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription
                ref={descriptionRef}
                className="text-center text-muted-foreground"
            >
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter
              ref={buttonsRef}
              className="flex p-6 gap-3 sm:gap-3 border-t bg-muted/20 mt-4"
          >
            <AlertDialogCancel asChild className="m-0 sm:m-0">
              <Button
                  variant="outline"
                  className="flex-1 gap-2 border-muted-foreground/20"
                  onClick={onClose}
              >
                <X className="h-4 w-4" />
                {cancelText}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild className="m-0 sm:m-0">
              <Button
                  className={`flex-1 gap-2 ${currentIntent.buttonClass}`}
                  onClick={handleConfirm}
              >
                <Check className="h-4 w-4" />
                {confirmText}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}