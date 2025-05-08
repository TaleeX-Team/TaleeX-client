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
    AlertCircle,
    Building2
} from "lucide-react";
import { useInterviewData, useStartInterview } from "@/hooks/useInterviewData.js";
import { format, isAfter } from "date-fns";
import { toast } from "sonner";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx";


export function StartScreen() {
    const { theme } = useTheme(); // Get current theme

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
            // if (!isAfter(now, expiryDate)) {
            //     const diffTime = Math.abs(expiryDate - now);
            //     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            //     if (diffDays > 0) {
            //         setTimeLeft(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
            //     } else {
            //         const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            //         setTimeLeft(`${diffHours} hour${diffHours > 1 ? 's' : ''}`);
            //     }
            // }
            if (!isAfter(now, expiryDate)) {
                const diffTime = Math.abs(expiryDate - now);

                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

                let timeLeftStr = '';

                if (diffDays > 0) {
                    timeLeftStr += `${diffDays} day${diffDays > 1 ? 's' : ''}`;
                    if (diffHours > 0) {
                        timeLeftStr += ` ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                    }
                } else if (diffHours > 0) {
                    timeLeftStr += `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                    if (diffMinutes > 0) {
                        timeLeftStr += ` ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
                    }
                } else {
                    timeLeftStr += `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
                }

                setTimeLeft(timeLeftStr);
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
            console.log(result.data, "Questions")
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

            // Extract error?.response?.data?.message from API response if available
            let errorMessage = "Failed to start the interview. Please try again.";

            if (error.response?.data) {
                const responseData = error.response.data;

                // Check if it's an expired interview (status 410)
                if (responseData.status === 410) {
                    errorMessage = responseData.message || "Interview has expired";
                    // Also update the UI state to show as expired
                    setIsExpired(true);
                } else if (responseData.message) {
                    // Use the API's error?.response?.data?.message if available
                    errorMessage = responseData.message;
                }
            } else if (error.response?.data?.message) {
                // Use the error object's message if available
                errorMessage = error.response?.data?.message;
                toast.error(error.response?.data?.message)
            }
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="shadow-sm p-4 px-6 border-b border-border">
                {interviewHeaderData && (
                    <div className="flex items-center space-x-3">
                        {interviewHeaderData.image && (
                            <img
                                src={interviewHeaderData.image}
                                alt={`${interviewHeaderData.companyName} logo`}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        )}
                        <div className="font-medium text-gray-900 dark:text-gray-100">{interviewHeaderData.companyName}</div>
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
                    <Card className="h-full p-6 shadow-lg border-b-4 border-l-2">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                            Interview Details
                        </h3>

                        {isLoadingInterview ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
                            </div>
                        ) : errorInterview ? (
                            <div className="bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 p-4 rounded-md border border-red-300 dark:border-red-700/30">
                                <AlertCircle className="h-5 w-5 mb-2" />
                                <h4 className="font-medium">Error Loading Interview</h4>
                                <p className="text-sm mt-1">Please refresh the page to try again.</p>
                            </div>
                        ) : interviewHeaderData ? (
                            <div className="space-y-6">
                                {/* Status */}
                                <div className={`rounded-md p-3 border  ${isExpired
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/30'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700/30'}`}>
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
                                    <div className="flex items-center p-3 bg-input/50 rounded-md border border-input">
                                        <User className="h-5 w-5 text-blue-500 dark:text-primary mr-3" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{interviewHeaderData.userName}</span>
                                    </div>
                                </div>

                                {/* Job Info */}
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Position
                                    </h4>
                                    <div className="flex items-center p-3 bg-input/50 rounded-md border border-input">
                                        <Building2 className="h-5 w-5 text-blue-500 dark:text-primary mr-3" />
                                        <div>
                                            <div className="font-medium text-gray-800 dark:text-gray-200">{interviewHeaderData.jobTitle}</div>
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
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-foreground rounded-full capitalize text-sm"
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
                                        <div className="flex items-center p-3 pb-2 bg-input/50 rounded-md border border-input">
                                            <FileQuestion className="h-5 w-5 text-blue-500 dark:text-primary mr-2" />
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{interviewHeaderData.questionCount}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Expires
                                        </h4>
                                        <div className="flex items-center p-3 bg-input/50 rounded-md border border-input">
                                            <Calendar className="h-5 w-5 text-blue-500 dark:text-primary mr-2" />
                                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{formattedExpiryDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Card>
                </div>

                {/* Right Side - Start Screen */}
                <div className="w-full md:w-2/3">
                    <Card className="h-full flex flex-col p-8 shadow-xl rounded-xl bg-gradient-to-br from-white to-blue-50 border border-input" style={{
                        background: theme === 'dark' ? '#1b1b1b' : undefined,
                    }}>
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                            {/* Icon */}
                            <div className="relative">
                                {/* <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-xl animate-pulse-slow"></div> */}
                                <div className="rounded-full bg-blue-500/10 dark:bg-secondary/70 p-8 relative z-10">
                                    <Video className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-3">
                                    Ready for your interview?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-200 max-w-lg">
                                    You'll be interviewed by TaleeX AI Assistant on behalf of {interviewHeaderData?.companyName}
                                    {/* {interviewHeaderData && (
                                        <span className="block mt-2 font-medium">
                                            This interview has {interviewHeaderData.questionCount} questions.
                                        </span>
                                    )} */}
                                </p>
                            </div>

                            {/* Settings */}
                            <div className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-muted rounded-lg shadow-inner border border-gray-100 dark:border-input mt-3">
                                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-4">
                                    Interview Settings
                                </h3>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Mic className="h-5 w-5 text-blue-500 dark:text-primary" />
                                        <span>Microphone Access</span>
                                    </span>
                                    <Button
                                        variant={isAudioOn ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsAudioOn(!isAudioOn)}
                                        className={`transition-all duration-200 ${isAudioOn ? 'bg-blue-500 hover:bg-blue-600 dark:bg-primary/50 dark:hover:bg-primary/30 text-white' : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                                    >
                                        {isAudioOn ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Clock className="h-5 w-5 text-blue-500 dark:text-primary" />
                                        <span>Estimated Duration</span>
                                    </span>
                                    <span className="text-sm font-medium bg-blue-100 dark:bg-primary/50 text-blue-800 dark:text-white px-3 py-1 rounded-full">
                                        ~{interviewHeaderData ? Math.round(interviewHeaderData.questionCount * 2.5) : 30} mins
                                    </span>
                                </div>

                                {questionsError && (
                                    <div className="mt-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-start border border-red-100 dark:border-red-800">
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
                            <p className="bg-blue-500/10 dark:bg-secondary/30 border-primary border-l-10 dark:border-primary/50 w-full max-w-md">
                                <p className="text-sm border border-dotted border-primary/50 p-2 rounded-r-sm shadow-inner dark:border-primary/30">

                                    During the interview, TaleeX will capture up to 3 camera images to assist the hiring company in verifying your identity.
                                </p>
                            </p>
                            {/* Start Button */}
                            <div className="w-full max-w-md">
                                <Button
                                    onClick={handleStartInterview}
                                    className="w-full py-6 text-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-primary text-white mt-2"
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
                                    <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                                        This interview link is no longer valid.
                                    </p>
                                )}

                                {!isExpired && !questionsError && (
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                        Click the button above when you're ready to start your interview
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}