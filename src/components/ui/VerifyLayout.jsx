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
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
      <Alert
        variant="warning"
        className="max-w-2xl mb-6 bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700"
      >
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-medium">
          Account verification required
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          Your account needs to be verified to access the full company
          management features. Verification helps us maintain security and
          provide you with all available functionality.
        </AlertDescription>
      </Alert>

      <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center mb-6 border-2 border-amber-300 dark:border-amber-700">
        <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
      </div>

      <h3 className="text-2xl font-se bold mb-3 text-amber-800 dark:text-amber-300">
        Limited Access
      </h3>
      <p className="text-amber-700 dark:text-amber-400 max-w-md mb-6">
        You can browse the basic information, but you'll need to verify your
        account to manage companies.
      </p>
      <Button
        onClick={handleVerifyNow}
        disabled={verificationMutation.isPending}
        className="bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 dark:border-amber-600"
      >
        {verificationMutation.isPending ? "Sending..." : "Verify Account"}
        {!verificationMutation.isPending && (
          <ChevronRight className="h-4 w-4 ml-1" />
        )}
      </Button>
    </div>
  );
}
