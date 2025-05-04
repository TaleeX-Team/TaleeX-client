import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Video,
    Mic,
    Loader2,
    Building,
    User,
    Calendar,
    FileQuestion,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useInterviewData, useStartInterview } from "@/hooks/useInterviewData.js";
import { format, isAfter } from "date-fns";
import { toast } from "sonner";

export function StartScreen() {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [isAudioOn, setIsAudioOn] = useState(true);

    // Fetch interview header data
    const {
        data: interviewHeaderData,
        isLoading: isLoadingInterview,
        error: errorInterview
    } = useInterviewData(interviewId);

    // Set up the interview questions query that we'll trigger manually
    const {
        refetch: fetchQuestions,
        data: interviewQuestions,
        isLoading: isLoadingQuestions,
        error: questionsError
    } = useStartInterview(interviewId);

    // Check if interview is expired and calculate time left
    useEffect(() => {
        if (interviewHeaderData?.expiryDate) {
            const expiryDate = new Date(interviewHeaderData.expiryDate);
            const now = new Date();
            setIsExpired(isAfter(now, expiryDate));

            // Calculate time left
            if (!isAfter(now, expiryDate)) {
                const diffTime = Math.abs(expiryDate - now);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 0) {
                    setTimeLeft(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
                } else {
                    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    setTimeLeft(`${diffHours} hour${diffHours > 1 ? 's' : ''}`);
                }
            }
        }
    }, [interviewHeaderData]);

    // Format expiry date
    const formattedExpiryDate = interviewHeaderData?.expiryDate
        ? format(new Date(interviewHeaderData.expiryDate), "MMM dd, yyyy")
        : "Not set";

    // Handle start interview button click
    const handleStartInterview = async () => {
        setIsStarting(true);

        try {
            const result = await fetchQuestions();
            console.log(result.data,"Questions")
            if (result.data) {
                // Navigate to the live interview page with questions data
                navigate(`/interviews/${interviewId}/live`, {
                    state: {
                        isAudioOn,
                        questions: result.data
                    }
                });
            } else {
                throw new Error("Failed to load interview questions");
            }
        } catch (error) {
            console.error("Error starting interview:", error);

            // Extract error message from API response if available
            let errorMessage = "Failed to start the interview. Please try again.";

            if (error.response?.data) {
                const responseData = error.response.data;

                // Check if it's an expired interview (status 410)
                if (responseData.status === 410) {
                    errorMessage = responseData.message || "Interview has expired";
                    // Also update the UI state to show as expired
                    setIsExpired(true);
                } else if (responseData.message) {
                    // Use the API's error message if available
                    errorMessage = responseData.message;
                }
            } else if (error.message) {
                // Use the error object's message if available
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm p-4 px-6">
                {interviewHeaderData && (
                    <div className="flex items-center space-x-3">
                        {interviewHeaderData.image && (
                            <img
                                src={interviewHeaderData.image}
                                alt={`${interviewHeaderData.companyName} logo`}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        )}
                        <div className="font-medium">{interviewHeaderData.companyName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">|</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {interviewHeaderData.jobTitle} Interview
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6">
                {/* Left Side - Interview Details */}
                <div className="w-full md:w-1/3">
                    <Card className="h-full p-6 shadow-lg border-t-4 border-blue-500">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                            Interview Details
                        </h3>

                        {isLoadingInterview ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : errorInterview ? (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-md">
                                <AlertCircle className="h-5 w-5 mb-2" />
                                <h4 className="font-medium">Error Loading Interview</h4>
                                <p className="text-sm mt-1">Please refresh the page to try again.</p>
                            </div>
                        ) : interviewHeaderData ? (
                            <div className="space-y-6">
                                {/* Status */}
                                <div className={`rounded-md p-3 ${isExpired
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
                                    <div className="flex items-center">
                                        {isExpired ? (
                                            <AlertCircle className="h-5 w-5 mr-2" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 mr-2" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {isExpired ? 'Interview Expired' : 'Interview Active'}
                                            </p>
                                            {!isExpired && timeLeft && (
                                                <p className="text-sm">Expires in {timeLeft}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Candidate Info */}
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Candidate
                                    </h4>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <User className="h-5 w-5 text-blue-500 mr-3" />
                                        <span className="font-medium">{interviewHeaderData.userName}</span>
                                    </div>
                                </div>

                                {/* Job Info */}
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Position
                                    </h4>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <Building className="h-5 w-5 text-blue-500 mr-3" />
                                        <div>
                                            <div className="font-medium">{interviewHeaderData.jobTitle}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                at {interviewHeaderData.companyName}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Type */}
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Type
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {interviewHeaderData.interviewType.map((type, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full capitalize text-sm"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Questions and Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Questions
                                        </h4>
                                        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                            <FileQuestion className="h-5 w-5 text-blue-500 mr-2" />
                                            <span className="font-medium">{interviewHeaderData.questionCount}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Expires
                                        </h4>
                                        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                            <span className="font-medium text-sm">{formattedExpiryDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Card>
                </div>

                {/* Right Side - Start Screen */}
                <div className="w-full md:w-2/3">
                    <Card className="h-full flex flex-col p-8 shadow-xl rounded-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/40">
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                            {/* Icon */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                                <div className="rounded-full bg-blue-500/10 p-8 relative z-10">
                                    <Video className="h-16 w-16 text-blue-500"/>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-3">
                                    Ready for your interview?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                                    You'll be interviewed by our AI assistant about your technical experience.
                                    {interviewHeaderData && (
                                        <span className="block mt-2 font-medium">
                                            This interview has {interviewHeaderData.questionCount} questions.
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Settings */}
                            <div className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-4">
                                    Interview Settings
                                </h3>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                    <span className="flex items-center gap-2">
                                        <Mic className="h-5 w-5 text-blue-500" />
                                        <span>Microphone Access</span>
                                    </span>
                                    <Button
                                        variant={isAudioOn ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsAudioOn(!isAudioOn)}
                                        className="transition-all duration-200"
                                    >
                                        {isAudioOn ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <span className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <span>Estimated Duration</span>
                                    </span>
                                    <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                                        ~{interviewHeaderData ? Math.round(interviewHeaderData.questionCount * 2.5) : 30} mins
                                    </span>
                                </div>

                                {questionsError && (
                                    <div className="mt-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-start">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Failed to start interview</p>
                                            <p className="mt-1">
                                                {questionsError.response?.data?.message ||
                                                    questionsError.message ||
                                                    "Please try again"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Start Button */}
                            <div className="w-full max-w-md">
                                <Button
                                    onClick={handleStartInterview}
                                    className="w-full py-6 text-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
                                    disabled={isStarting || isLoadingQuestions || isLoadingInterview || isExpired}
                                >
                                    {isStarting || isLoadingQuestions ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Preparing Your Interview...
                                        </>
                                    ) : isExpired ? (
                                        "Interview Expired"
                                    ) : questionsError ? (
                                        "Try Again"
                                    ) : (
                                        "Begin Interview"
                                    )}
                                </Button>

                                {isExpired && (
                                    <p className="text-sm text-red-500 mt-2">
                                        This interview has expired. Please contact the recruiter for assistance.
                                    </p>
                                )}

                                {!isExpired && !questionsError && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Click the button above when you're ready to start your interview
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}