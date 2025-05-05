import { LoaderCircle } from "lucide-react";

export const LoadingIndicator = ({ size = 16, className = "" }) => {
    return (
        <LoaderCircle className={`animate-spin ${className}`} size={size} />
    );
};

