import {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {useReportJob} from "@/hooks/useReportJob";
import {
    AlertCircle,
    Flag,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    Zap
} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {toast} from "sonner";
import {useTheme} from "@/layouts/theme_provider/ThemeProvider.jsx";

const REPORT_REASONS = [
    {
        value: "spam",
        label: "Spam / Promotional Content",
        description: "Job posting is primarily advertising products or services",
        icon: <Zap className="h-5 w-5 text-amber-500"/>
    },
    {
        value: "scam",
        label: "Scam or Fraud",
        description: "Job posting appears to be fraudulent or deceptive",
        icon: <ShieldAlert className="h-5 w-5 text-red-500"/>
    },
    {
        value: "inappropriate",
        label: "Inappropriate Content",
        description: "Job contains offensive, illegal or harmful content",
        icon: <AlertCircle className="h-5 w-5 text-orange-500"/>
    },
    {
        value: "misleading",
        label: "Misleading Information",
        description: "Job details are inaccurate or misleading",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500"/>
    },
    {
        value: "discrimination",
        label: "Discrimination",
        description: "Job contains discriminatory requirements or language",
        icon: <AlertCircle className="h-5 w-5 text-purple-500"/>
    },
    {
        value: "other",
        label: "Other",
        description: "Other concerns not listed above",
        icon: <Flag className="h-5 w-5 text-slate-500"/>
    },
];

/**
 * Enhanced dialog component for reporting job listings with improved scrolling
 * @param {Object} props - Component props
 * @param {string} props.jobId - ID of the job being reported
 * @param {string} [props.defaultName=""] - Default name value
 * @param {string} [props.defaultEmail=""] - Default email value
 * @param {Function} [props.onSuccess] - Callback after successful submission
 */
export function ReportJobDialog({
                                    jobId,
                                    defaultName = "",
                                    defaultEmail = "",
                                    onSuccess
                                }) {
    const { theme } = useTheme(); // Get current theme
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState("reason"); // "reason", "details", "success"
    const [formData, setFormData] = useState({
        jobId,
        name: defaultName,
        email: defaultEmail,
        reason: "",
        description: "",
    });
    const [errors, setErrors] = useState({});

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            // Reset state when dialog closes
            setTimeout(() => {
                setStep("reason");
                resetForm();
            }, 300);
        }
    }, [open]);

    // Reset form when jobId changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            jobId
        }));
    }, [jobId]);

    const reportJobMutation = useReportJob();

    const validateReasonStep = () => {
        if (!formData.reason) {
            setErrors({reason: "Please select a reason for reporting"});
            return false;
        }
        return true;
    };

    const validateDetailsStep = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.reason === "other" && !formData.description.trim()) {
            newErrors.description = "Please provide details for 'Other' reason";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));

        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleReasonSelect = (value) => {
        setFormData((prev) => ({...prev, reason: value}));

        // Clear reason error
        if (errors.reason) {
            setErrors(prev => ({...prev, reason: null}));
        }
    };

    const resetForm = () => {
        setFormData({
            jobId,
            name: defaultName,
            email: defaultEmail,
            reason: "",
            description: "",
        });
        setErrors({});
    };

    const handleNextStep = () => {
        if (step === "reason" && validateReasonStep()) {
            setStep("details");
        }
    };

    const handleBackStep = () => {
        setStep("reason");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateDetailsStep()) {
            return;
        }

        try {
            await reportJobMutation.mutateAsync(formData);
            setStep("success");
            toast.success("Thank you for your report. We'll review it shortly.");

            // Reset form data but keep the dialog open to show success state
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Submission error:", error);
            // Error handling is managed by the mutation
        }
    };

    const selectedReason = REPORT_REASONS.find(r => r.value === formData.reason);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 ${theme === 'dark'
                        ? 'border-red-900 bg-gray-800 hover:bg-red-950 text-red-400'
                        : 'border-red-200 bg-white hover:bg-red-50 text-red-700'}`}
                    data-report-trigger
                >
                    <Flag className="h-4 w-4"/>
                    Report Job
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Flag className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}/>
                        Report this job listing
                    </DialogTitle>
                    <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                        Help us maintain a safe platform by reporting suspicious or inappropriate job listings
                    </DialogDescription>
                </DialogHeader>

                {reportJobMutation.isError && (
                    <Alert variant="destructive" className="mx-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {reportJobMutation.error instanceof Error
                                ? reportJobMutation.error.message
                                : "Failed to submit report. Please try again."}
                        </AlertDescription>
                    </Alert>
                )}

                {step === "reason" && (
                    <>
                        <div className="px-6 pt-2 pb-4 max-h-[400px] overflow-y-auto">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} mb-4`}>Select a reason for reporting this job:</p>

                            {errors.reason && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errors.reason}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 gap-3">
                                {REPORT_REASONS.map((reason) => (
                                    <Card
                                        key={reason.value}
                                        className={`cursor-pointer transition-all border ${
                                            formData.reason === reason.value
                                                ? theme === 'dark'
                                                    ? 'border-blue-600 ring-2 ring-blue-900'
                                                    : 'border-blue-500 ring-2 ring-blue-100'
                                                : theme === 'dark'
                                                    ? 'hover:border-blue-800 border-gray-700'
                                                    : 'hover:border-blue-200'
                                        } ${theme === 'dark' ? 'bg-gray-800' : ''}`}
                                        onClick={() => handleReasonSelect(reason.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {reason.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{reason.label}</h3>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                                        {reason.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-slate-50 border-t'}`}>
                            <Button
                                onClick={handleNextStep}
                                disabled={!formData.reason}
                                className="w-full sm:w-auto"
                            >
                                Continue
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "details" && (
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                            <div className={`flex items-center gap-3 p-3 rounded-md mb-4 ${
                                theme === 'dark' ? 'bg-blue-950' : 'bg-blue-50'
                            }`}>
                                {selectedReason && selectedReason.icon}
                                <div>
                                    <p className="font-medium">{selectedReason?.label}</p>
                                    <p className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                                    }`}>{selectedReason?.description}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className={theme === 'dark' ? 'text-gray-200' : ''}>Your Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`${errors.name ? "border-red-500" : ""} ${
                                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                                        }`}
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-200' : ''}>Your Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`${errors.email ? "border-red-500" : ""} ${
                                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                                        }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className={theme === 'dark' ? 'text-gray-200' : ''}>
                                        Additional Details
                                        {formData.reason === "other" && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Please provide any additional details about this report"
                                        rows={4}
                                        className={`${errors.description ? "border-red-500" : ""} ${
                                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">{errors.description}</p>
                                    )}
                                    {formData.reason === "other" && !errors.description && (
                                        <p className={theme === 'dark' ? "text-blue-400 text-sm" : "text-blue-500 text-sm"}>
                                            Please provide details for your report
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className={`p-4 gap-2 ${
                            theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-slate-50 border-t'
                        }`}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBackStep}
                                disabled={reportJobMutation.isPending}
                                className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={reportJobMutation.isPending}
                            >
                                {reportJobMutation.isPending ? "Submitting..." : "Submit Report"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === "success" && (
                    <div className="px-6 py-8 flex flex-col items-center justify-center text-center">
                        <div className={theme === 'dark' ? "bg-green-900 p-3 rounded-full mb-4" : "bg-green-100 p-3 rounded-full mb-4"}>
                            <CheckCircle2 className={theme === 'dark' ? "h-10 w-10 text-green-400" : "h-10 w-10 text-green-600"}/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Report Submitted</h3>
                        <p className={`mb-6 max-w-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                            Thank you for helping us maintain a safe platform. Our team will review your report as soon
                            as possible.
                        </p>
                        <Button
                            onClick={() => setOpen(false)}
                            className="min-w-[150px]"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}