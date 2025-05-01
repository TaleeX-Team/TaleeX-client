import { useState, useEffect } from "react";
import { Check, Mail, Upload, Loader2, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useCompanies } from "../../features";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function VerifyCompany({}) {
  const queryClient = useQueryClient();

  // Dialog state
  const [open, setOpen] = useState(false);

  // Get the company data and domain verification mutations from our hook
  const {
    requestDomainVerificationMutation,
    confirmDomainVerificationMutation,
  } = useCompanies();
  const { companyId } = useParams();
  // Find the company with the matching ID
  const companies = queryClient.getQueryData(["companies"])?.companies || [];
  const company = companies.find((company) => company._id === companyId);
  const companyName = company.name || "Your Company";
  const isAwaitingDomainVerification = company?.verification?.method || false;

  // State for email verification
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [domainError, setDomainError] = useState(null);

  // State for document verification
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileError, setFileError] = useState(null);

  // Set domain from company data if available
  useEffect(() => {
    if (company.domain) {
      setDomain(company.domain);
    }
  }, [company]);

  // Update state when request verification is successful
  useEffect(() => {
    if (requestDomainVerificationMutation.isSuccess) {
      setOtpSent(true);
      toast.success(`Verification code sent to ${email}`);
    }
  }, [requestDomainVerificationMutation.isSuccess, email]);

  // Update state when confirmation is successful
  useEffect(() => {
    if (confirmDomainVerificationMutation.isSuccess) {
      setEmailVerified(true);
      toast.success("Email verified successfully!");

      // Close dialog after a delay
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    }
  }, [confirmDomainVerificationMutation.isSuccess]);

  // Handle email submission
  const handleSendOtp = () => {
    // Reset any previous errors
    setEmailError(null);
    setDomainError(null);

    // Validate email
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate domain
    if (!domain || domain.trim() === "") {
      setDomainError("Please enter a company domain");
      return;
    }

    // Check if domain format is valid (simple validation)
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      setDomainError("Please enter a valid domain (e.g., company.com)");
      return;
    }

    // Call the mutation to request domain verification
    requestDomainVerificationMutation.mutate({
      companyId,
      data: { domain, email },
    });
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    // Reset any previous errors
    setEmailError(null);

    if (!otp || otp.length < 6) {
      setEmailError("Please enter a valid verification code");
      return;
    }

    // Call the mutation to confirm domain verification
    confirmDomainVerificationMutation.mutate({
      companyId,
      data: { code: otp },
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFileError("Please upload a PDF document");
        setFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setFileError("File size should be less than 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setFileError(null);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!file) {
      setFileError("Please select a file to upload");
      return;
    }

    // This would be connected to a document verification API
    // For now, we'll just simulate it like before
    setTimeout(() => {
      setFileError(null);
      setFileUploaded(true);
      toast.success("Document uploaded successfully!");

      // Close dialog after a delay
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    }, 1500);
  };

  // Reset form state
  const resetForm = () => {
    setEmail("");
    setDomain(company.domain || "");
    setOtp("");
    setOtpSent(false);
    setEmailVerified(false);
    setEmailError(null);
    setDomainError(null);
    setFile(null);
    setFileUploaded(false);
    setFileError(null);
  };

  // Handle errors from mutations
  useEffect(() => {
    if (requestDomainVerificationMutation.isError) {
      toast.error("Failed to send verification code");
      setEmailError(
        requestDomainVerificationMutation.error?.message || "An error occurred"
      );
    }

    if (confirmDomainVerificationMutation.isError) {
      toast.error("Failed to verify code");
      setEmailError(
        confirmDomainVerificationMutation.error?.message ||
          "Invalid verification code"
      );
    }
  }, [
    requestDomainVerificationMutation.isError,
    requestDomainVerificationMutation.error,
    confirmDomainVerificationMutation.isError,
    confirmDomainVerificationMutation.error,
  ]);

  const isLoadingRequest = requestDomainVerificationMutation.isLoading;
  const isLoadingConfirm = confirmDomainVerificationMutation.isLoading;
  const isLoading = isLoadingRequest || isLoadingConfirm;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Shield className="h-4 w-4" /> Verify Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              Verify Company Ownership
            </DialogTitle>
          </div>
          <DialogDescription>
            Verify that you are part of {companyName} to manage its profile and
            job listings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Verification</TabsTrigger>
              <TabsTrigger value="document">Document Upload</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Email Verification Tab */}
            <TabsContent value="email" className="space-y-4">
              {company?.verification?.method === "domain" ? (
                <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900">
                  <Check className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Email verified successfully! Your account is awaiting admin
                    approval to manage {companyName}.
                  </AlertDescription>
                </Alert>
              ) : emailVerified ? (
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
                  <Check className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Email verified successfully! You now have access to manage{" "}
                    {companyName}.
                  </AlertDescription>
                </Alert>
              ) : otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">
                      Enter the 6-digit code sent to {email}
                    </Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                    {emailError && (
                      <p className="text-sm text-destructive">{emailError}</p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleSendOtp}
                      disabled={isLoadingRequest}
                    >
                      Resend
                    </button>
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    className="w-full bg-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoadingConfirm && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoadingConfirm ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Company Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="you@company.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-destructive">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Company Domain</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="domain"
                        placeholder="company.com"
                        className="pl-10"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                      />
                    </div>
                    {domainError && (
                      <p className="text-sm text-destructive">{domainError}</p>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    We'll send a verification code to your company email
                    address. The domain will be used to verify your company
                    ownership.
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    className="w-full bg-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoadingRequest && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoadingRequest ? "Sending..." : "Send Verification Code"}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Document Upload Tab */}
            <TabsContent value="document" className="space-y-4">
              {fileUploaded ? (
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
                  <Check className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Document uploaded successfully! We'll review your document
                    and verify your company ownership.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">
                      Upload Verification Document
                    </Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">
                        {file ? file.name : "Drag and drop or click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Upload a document that proves your affiliation with{" "}
                        {companyName}
                      </p>
                      <input
                        id="document"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="document">
                        <Button type="button" variant="outline" size="sm">
                          Select PDF
                        </Button>
                      </label>
                    </div>
                    {fileError && (
                      <p className="text-sm text-destructive">{fileError}</p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accepted documents: Company ID, Business card, Employment
                    letter, or any official document with your name and the
                    company name.
                  </div>
                  <Button
                    onClick={handleFileUpload}
                    className="w-full bg-primary text-primary-foreground"
                    disabled={!file || isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Uploading..." : "Upload Document"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>

          <DialogFooter className="p-6 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
