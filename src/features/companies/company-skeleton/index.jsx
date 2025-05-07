import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { gsap } from "gsap";

export function CompanySkeleton() {
  const cardRef = useRef(null);
  const elementsRef = useRef([]);

  // Add element to refs array
  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Create pulse animation
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    // Animate all skeleton elements with a staggered pulse effect
    tl.to(elementsRef.current, {
      opacity: 0.5,
      duration: 0.8,
      stagger: 0.03,
      ease: "sine.inOut"
    });

    // Initial card animation
    gsap.fromTo(
      cardRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden flex flex-col relative border border-border/60 shadow-sm bg-gradient-to-b from-background to-muted/30"
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>

      <CardHeader className="pb-1 relative">
        <div className="flex items-start gap-4">
          {/* Logo skeleton with shadow */}
          <Skeleton
            ref={addToRefs}
            className="h-14 w-14 rounded-lg shadow-sm"
          />
          <div className="space-y-2 flex-1">
            {/* Company name skeleton */}
            <Skeleton
              ref={addToRefs}
              className="h-5 w-32 rounded-md"
            />
            {/* Website skeleton */}
            <div className="flex items-center">
              <Skeleton
                ref={addToRefs}
                className="h-4 w-4 mr-2 rounded-full"
              />
              <Skeleton
                ref={addToRefs}
                className="h-4 w-24 rounded-md"
              />
            </div>
          </div>
          {/* Action buttons skeleton */}
          <div className="flex gap-1">
            <Skeleton
              ref={addToRefs}
              className="h-6 w-6 rounded-full"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 relative">
        <div className="space-y-2">
          {/* Description skeleton - 3 lines with varied width */}
          <Skeleton
            ref={addToRefs}
            className="h-4 w-full rounded-md"
          />
          <Skeleton
            ref={addToRefs}
            className="h-4 w-3/4 rounded-md"
          />


          {/* Location skeleton */}
          <div className="flex items-center">
            <Skeleton
              ref={addToRefs}
              className="h-4 w-4 mr-2 rounded-full"
            />
            <Skeleton
              ref={addToRefs}
              className="h-4 w-32 rounded-md"
            />
          </div>

          {/* Badge skeleton */}
          <div className="flex items-center mt-3">
            <Skeleton
              ref={addToRefs}
              className="h-5 w-16 rounded-full"
            />
            <Skeleton
              ref={addToRefs}
              className="h-5 w-16 rounded-full mx-2"
            />
            <Skeleton
              ref={addToRefs}
              className="h-5 w-16 rounded-full"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        {/* Button skeletons */}
        <Skeleton
          ref={addToRefs}
          className="h-9 w-20 rounded-md"
        />
      </CardFooter>

      <style jsx>{`
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          animation: shimmer 2s infinite;
          transform: skewX(-20deg);
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </Card>
  );
}