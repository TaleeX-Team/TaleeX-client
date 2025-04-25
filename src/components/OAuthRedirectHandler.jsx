import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const OAuthRedirectHandler = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
            toast.error(`OAuth failed: ${errorDescription || error}`);
        }
    }, [searchParams]);

    return null;
};
