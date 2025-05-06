import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { toast } from "sonner";
import { Button } from "./button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useVerificationEmail } from "@/hooks/useVerificationEmail";
import { useUser } from "@/hooks/useUser";
export default function VerifyLayout() {
  const verificationMutation = useVerificationEmail();
  const { data: user } = useUser();

  const handleVerifyNow = () => {
    if (user?.email) {
      verificationMutation.mutate({
        email: user.email,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-8 text-center bg-amber-50/50 dark:bg-amber-900/10 border border-dashed border-amber-200 dark:border-amber-600/30 rounded-xl shadow-sm">
      <div className="w-17 h-17 rounded-full bg-amber-100 dark:bg-amber-700/10 flex items-center justify-center mb-6 border-2 border-amber-300 dark:border-amber-800">
        <AlertTriangle className="h-9 w-9 text-amber-600 dark:text-amber-600" />
      </div>

      <h3 className="text-xl font-se bold mb-3 text-amber-800 dark:text-amber-500">
        Account verification required
      </h3>
      <p className="text-md text-amber-700 dark:text-amber-500/80 max-w-xs mb-8">
        To access all features without restrictions, please verify your email address.
      </p>
      <Button
        onClick={handleVerifyNow}
        disabled={verificationMutation.isPending}
        className="bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 dark:bg-amber-800 dark:hover:bg-amber-900 dark:border-amber-900/10"
      >
        {verificationMutation.isPending ? "Sending..." : "Verify Account"}
        {!verificationMutation.isPending && (
          <ChevronRight className="h-4 w-4 ml-1" />
        )}
      </Button>
    </div>
  );
}