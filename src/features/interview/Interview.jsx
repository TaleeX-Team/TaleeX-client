"use client";

import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VideoContainer } from "@/components/interview/VideoContainer";
import { TranscriptPanel } from "@/components/interview/TranscriptPanel";
import { InterviewCompletedDialog } from "@/components/interview/InterviewCompletedDialog";
import { globalStyles } from "@/lib/globalStyles";
import { toast } from "sonner";
import InterviewHeader from "@/components/interview/InterviewHeader.jsx";
import { useStartInterview } from "@/hooks/useInterviewData.js";
import { useInterviewState } from "@/hooks/useInterviewState.js";
import FormAndInterviewHeader from "../interview-appform-header/Header";

const questions = [
  "Can you explain the difference between HTML, CSS, and JavaScript and how they work together in front-end development?",

  "What are some common performance issues you might encounter in a front-end application, and how would you address them?",

  "What tools and frameworks are you familiar with that can aid in front-end development, and can you describe",
  "Can you walk me through the process of debugging a front-end application? What tools do you typically use?",
  "Describe how you would approach making a website responsive. What techniques or frameworks would you use?",
];

export default function Interview() {
  const { interviewId } = useParams();
  const { state: navState } = useLocation();
  const navigate = useNavigate();

  const questionsFromNav = navState?.questions || [];

  const {
    data: questionsData,
    isFetching: isStartingInterview,
    error: startError,
  } = useStartInterview(interviewId, !questionsFromNav?.length);

  const {
    state: {
      currentQuestionIndex,
      displayedQuestion,
      isVideoOn,
      isAudioOn,
      progress,
      isInterviewComplete,
      isInterviewStarted,
      isAITalking,
      isUserTalking,
      transcript,
      messages,
      lastMessage,
      showTranscript,
      callStatus,
      isLoading,
      error,
      interviewDuration,
      transcriptExpanded,
      conclusionDetected,
      timeRemaining,
      lastUserResponseTime,
      questionStates,
      currentQuestionSummary,
      lastSpeakingRole,
      screenshots,
      lastCapturedScreenshot,
      lastSpeakerTranscript,
      audioRecordingUrl,
      callId,
    },
    actions: {
      setError,
      setIsVideoOn,
      setIsAudioOn,
      setShowTranscript,
      setTranscriptExpanded,
      handleStartInterview,
      handleEndInterview,
      toggleTranscript,
      toggleTranscriptExpanded,
      retrieveInterviewData,
      toggleAudio,
      stopVAPICall,
      setIsInterviewComplete,
      setConclusionDetected,
      captureScreenshot,
      getInterviewTranscript,
      saveAndGetTranscript,
    },
    refs: {
      videoRef,
      aiVideoContainerRef,
      userVideoContainerRef,
      transcriptContainerRef,
      mainContentRef,
      vapiClientRef,
    },
  } = useInterviewState(questionsData || [], interviewId);

  // Start interview automatically if not started and questions are available
  useEffect(() => {
    if (
      !isInterviewStarted &&
      questionsData?.length > 0 &&
      !isStartingInterview
    ) {
      console.log("Starting interview", {
        timestamp: new Date().toISOString(),
      });
      handleStartInterview();
    }
  }, [
    isInterviewStarted,
    questionsData?.length,
    isStartingInterview,
    handleStartInterview,
  ]);

  // Show toast notification when a screenshot is captured
  useEffect(() => {
    if (lastCapturedScreenshot) {
      console.log("Screenshot captured", {
        count: screenshots.length,
        timestamp: new Date().toISOString(),
      });
      // toast.success(`${screenshots.length} of 3 screenshots taken`);
    }
  }, [lastCapturedScreenshot, screenshots.length]);

  // Handle errors from startInterview
  useEffect(() => {
    if (startError) {
      console.log("Start interview error", {
        error: startError.message,
        timestamp: new Date().toISOString(),
      });
      setError(`Failed to load interview questions: ${startError.message}`);
    }
  }, [startError, setError]);

  // Handle dialog close and navigation
  const handleDialogClose = () => {
    setIsInterviewComplete(false);
    handleEndInterview();
    navigate("/");
  };

  // Handle case where no questions are available
  if (!questionsData?.length && !isStartingInterview) {
    return (
      <div className="flex flex-col min-h-screen">
        <style jsx>{globalStyles}</style>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No questions available for this interview. Please go back and try
              again.
            </p>
            <Button
              onClick={() => navigate(`/interviews/${interviewId}`)}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx>{globalStyles}</style>
      <FormAndInterviewHeader />
      <InterviewHeader
        interviewId={interviewId}
        callStatus={callStatus}
        isInterviewStarted={isInterviewStarted}
        interviewDuration={interviewDuration}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questionsData?.length}
        isAudioOn={isAudioOn}
        progress={progress}
        timeRemaining={timeRemaining}
        isVideoOn={isVideoOn}
        questionStates={questionStates}
        currentQuestionSummary={currentQuestionSummary}
        showTranscript={showTranscript}
        isLoading={isLoading || isStartingInterview}
        toggleAudio={toggleAudio}
        toggleVideo={() => setIsVideoOn(!isVideoOn)}
        toggleTranscript={toggleTranscript}
        handleEndInterview={handleEndInterview}
      />

      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <main
        ref={mainContentRef}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="mt-2 flex flex-col sm:flex-row p-4 gap-6 lg:justify-center">
          <VideoContainer
            isUser={true}
            ref={userVideoContainerRef}
            videoRef={videoRef}
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            isAITalking={isAITalking}
            isUserTalking={isUserTalking}
            transcript={transcript}
            callStatus={callStatus}
            lastCapturedScreenshot={lastCapturedScreenshot}
            screenshotCount={screenshots.length}
            sessionDuration={interviewDuration}
            interviewProgress={progress.current / progress.total}
          />

          <VideoContainer
            isUser={false}
            ref={aiVideoContainerRef}
            isAITalking={isAITalking}
            isUserTalking={isUserTalking}
            callStatus={callStatus}
            sessionDuration={interviewDuration}
            interviewProgress={progress.current / progress.total}
          />
        </div>

        {showTranscript && (
          <TranscriptPanel
            ref={transcriptContainerRef}
            transcriptExpanded={transcriptExpanded}
            toggleTranscriptExpanded={toggleTranscriptExpanded}
            toggleTranscript={toggleTranscript}
            callStatus={callStatus}
            lastSpeakerTranscript={lastSpeakerTranscript}
            isAITalking={isAITalking}
            isUserTalking={isUserTalking}
            lastSpeakingRole={lastSpeakingRole}
          />
        )}
      </main>

      <InterviewCompletedDialog
        open={isInterviewComplete}
        interviewId={interviewId}
        onOpenChange={setIsInterviewComplete}
        onClose={handleDialogClose}
        interviewDuration={interviewDuration}
        questionsAsked={progress.current}
        totalQuestions={questionsData?.length}
        screenshots={screenshots}
        transcript={saveAndGetTranscript(interviewId)}
        vapiCallId={callId}
      />
    </div>
  );
}
