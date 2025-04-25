import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanySkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          {/* Logo skeleton */}
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2">
            {/* Company name skeleton */}
            <Skeleton className="h-5 w-32" />
            {/* Website skeleton */}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="space-y-2">
          {/* Description skeleton - 3 lines */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Location skeleton */}
          <div className="flex items-center mt-4">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 mt-auto">
        {/* Button skeletons */}
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}
