import { useState, useEffect } from "react";
import { Check, Mail, Upload, Loader2, Building2 } from "lucide-react";
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

export default function VerifyCompany({ companyId }) {
  // Dialog state
  const [open, setOpen] = useState(false);

  // Company information (would be fetched in a real app)
  const [companyName, setCompanyName] = useState("Acme Inc.");
  const [isLoading, setIsLoading] = useState(false);

  // State for email verification
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // State for document verification
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileError, setFileError] = useState(null);

  // Simulate fetching company data
  useEffect(() => {
    // In a real app, you would fetch company information based on companyId
    // For demo purposes, we're using a static value
    if (companyId) {
      setCompanyName(`Acme Corp #${companyId}`);
    }
  }, [companyId]);

  // Handle email submission
  const handleSendOtp = () => {
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEmailError(null);
      setOtpSent(true);
      setIsLoading(false);
      toast.success(`Verification code sent to ${email}`);
    }, 1500);
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      setEmailError("Please enter a valid verification code");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would verify the OTP with your backend
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setEmailError(null);
        setEmailVerified(true);
        setIsLoading(false);
        toast.success("Email verified successfully!");

        // Close dialog after a delay
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 2000);
      } else {
        setEmailError("Invalid verification code. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
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

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setFileError(null);
      setFileUploaded(true);
      setIsLoading(false);
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
    setOtp("");
    setOtpSent(false);
    setEmailVerified(false);
    setEmailError(null);
    setFile(null);
    setFileUploaded(false);
    setFileError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground">
          <Building2 className="mr-2 h-4 w-4" /> Verify Company
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
              {emailVerified ? (
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
                    >
                      Resend
                    </button>
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    className="w-full bg-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Verifying..." : "Verify Code"}
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
                  <div className="text-sm text-muted-foreground">
                    We'll send a verification code to your company email
                    address.
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    className="w-full bg-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Sending..." : "Send Verification Code"}
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
