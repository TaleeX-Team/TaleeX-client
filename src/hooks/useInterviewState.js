"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Vapi from "@vapi-ai/web";

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const VAPI_ASSISTANT_ID = "a7939f6e-e04e-4bce-ac30-c6e7e35655a6";
const VAPI_API_KEY = "d4ecde21-8c7d-4f5c-9996-5c2b306d9ccf";
const ENDING_PHRASE = "That concludes our interview today Thank you for your time";
const INTERVIEW_DURATION_MINUTES = 20;
const WARNING_TIME_MINUTES = 5;
const FINAL_WARNING_MINUTES = 1;
const RESPONSE_TIMEOUT = 15000; // 15 seconds for response timeout

export function useInterviewState(questions, interviewId) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [displayedQuestion, setDisplayedQuestion] = useState(
    questions.length > 0 ? questions[0] : ""
  );
  const [progress, setProgress] = useState({
    current: 1,
    total: questions.length,
  });
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAITalking, setIsAITalking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conclusionDetected, setConclusionDetected] = useState(false);
  const [lastUserResponseTime, setLastUserResponseTime] = useState(null);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [lastSpeakingRole, setLastSpeakingRole] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotTimes, setScreenshotTimes] = useState([]);
  const [lastCapturedScreenshot, setLastCapturedScreenshot] = useState(null);
  const [screenshotInterval, setScreenshotInterval] = useState(null);
  const [screenshotError, setScreenshotError] = useState(null);
  const [debugMode, setDebugMode] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(
    INTERVIEW_DURATION_MINUTES * 60
  );
  const [timerWarningGiven, setTimerWarningGiven] = useState(false);
  const [finalWarningGiven, setFinalWarningGiven] = useState(false);

  // Question tracking system
  const [questionStates, setQuestionStates] = useState(
    questions.map((question, idx) => ({
      question,
      index: idx,
      status: idx === 0 ? "current" : "pending",
      startTime: null,
      endTime: null,
      duration: 0,
      userResponses: [],
      aiResponses: [],
    }))
  );

  const maxScreenshots = 3;
  const navigate = useNavigate();

  // Refs
  const videoRef = useRef(null);
  const aiVideoContainerRef = useRef(null);
  const userVideoContainerRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const vapiClientRef = useRef(null);
  const durationTimerRef = useRef(null);
  const interviewTimerRef = useRef(null);
  const responseTimeoutRef = useRef(null);
  const screenshotIntervalRef = useRef(null);

  // Initialize VAPI client
  useEffect(() => {
    if (!vapiClientRef.current && typeof Vapi !== "undefined") {
      vapiClientRef.current = new Vapi(VAPI_API_KEY);
      if (debugMode)
        console.log("VAPI client initialized with API key", {
          timestamp: new Date().toISOString(),
        });

      // Add WebRTC connection state listener
      vapiClientRef.current.on("call-state", (state) => {
        if (debugMode)
          console.log("VAPI call state changed:", {
            state,
            timestamp: new Date().toISOString(),
          });
        if (state === "disconnected" && callStatus === CallStatus.ACTIVE) {
          setError("WebRTC connection lost. Ending call...");
          endCallImmediately();
        }
      });
    } else if (!Vapi) {
      setError("VAPI SDK failed to load");
    }
  }, [debugMode, callStatus]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      if (debugMode)
        console.log("Network restored", {
          timestamp: new Date().toISOString(),
        });
    };

    const handleOffline = () => {
      if (callStatus === CallStatus.ACTIVE) {
        if (debugMode)
          console.log("Network lost, ending call", {
            timestamp: new Date().toISOString(),
          });
        setError("Network connection lost. Ending call...");
        endCallImmediately();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [callStatus, debugMode]);

  // Synchronize question states and progress
  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStates((prevStates) => {
        const newStates = questions.map((question, idx) => {
          const existingState = prevStates.find((qs) => qs.index === idx) || {};
          return {
            question,
            index: idx,
            status:
              idx === currentQuestionIndex
                ? "current"
                : idx < currentQuestionIndex
                ? "completed"
                : "pending",
            startTime:
              idx === currentQuestionIndex && !existingState.startTime
                ? new Date()
                : existingState.startTime,
            endTime: existingState.endTime || null,
            duration: existingState.duration || 0,
            userResponses: existingState.userResponses || [],
            aiResponses: existingState.aiResponses || [],
          };
        });
        return newStates;
      });

      setDisplayedQuestion(questions[currentQuestionIndex] || "");
      setProgress({
        current: currentQuestionIndex + 1,
        total: questions.length,
      });

      if (debugMode) {
        console.log("Question state updated:", {
          currentQuestionIndex,
          displayedQuestion: questions[currentQuestionIndex],
          progress: {
            current: currentQuestionIndex + 1,
            total: questions.length,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, [questions, currentQuestionIndex, debugMode]);

  // Update messages and track responses
  useEffect(() => {
    if (messages.length > 0) {
      const newLastMessage = messages[messages.length - 1];
      setLastMessage(newLastMessage);

      if (
        currentQuestionIndex >= 0 &&
        currentQuestionIndex < questionStates.length
      ) {
        setQuestionStates((prevStates) => {
          const newStates = [...prevStates];
          const currentState = newStates[currentQuestionIndex];

          if (newLastMessage.role === "user") {
            currentState.userResponses = [
              ...currentState.userResponses,
              {
                content: newLastMessage.content || "",
                timestamp: new Date(),
              },
            ];
            setLastUserResponseTime(new Date());
            setLastSpeakingRole("user");
            setIsUserTalking(true);
            setIsAITalking(false);
            if (debugMode)
              console.log(
                "User message received, isUserTalking: true, isAITalking: false",
                {
                  timestamp: new Date().toISOString(),
                }
              );
            if (responseTimeoutRef.current) {
              clearTimeout(responseTimeoutRef.current);
              responseTimeoutRef.current = null;
              if (debugMode)
                console.log("Response timeout cleared due to user response", {
                  timestamp: new Date().toISOString(),
                });
            }
          }

          if (newLastMessage.role === "assistant") {
            currentState.aiResponses = [
              ...currentState.aiResponses,
              {
                content: newLastMessage.content || "",
                timestamp: new Date(),
              },
            ];
            setLastSpeakingRole("assistant");
            setIsAITalking(true);
            setIsUserTalking(false);
            if (debugMode)
              console.log(
                "Assistant message received, isAITalking: true, isUserTalking: false",
                {
                  timestamp: new Date().toISOString(),
                }
              );
          }

          return newStates;
        });
      }
    }
  }, [messages, currentQuestionIndex, debugMode]);

  // Duration timer
  useEffect(() => {
    if (isInterviewStarted && callStatus === CallStatus.ACTIVE) {
      durationTimerRef.current = setInterval(() => {
        setInterviewDuration((prev) => prev + 1);
        if (debugMode)
          console.log("Duration timer tick", {
            interviewDuration: interviewDuration + 1,
            timestamp: new Date().toISOString(),
          });
      }, 1000);
    }
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
        if (debugMode)
          console.log("Duration timer cleared", {
            timestamp: new Date().toISOString(),
          });
      }
    };
  }, [isInterviewStarted, callStatus, debugMode]);

  // Interview timer (for warnings and time remaining)
  useEffect(() => {
    if (isInterviewStarted && callStatus === CallStatus.ACTIVE) {
      interviewTimerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          const canSpeak =
            !isAITalking &&
            !isUserTalking &&
            (!lastUserResponseTime || new Date() - lastUserResponseTime > 2000);

          if (
            newTime <= WARNING_TIME_MINUTES * 60 &&
            !timerWarningGiven &&
            canSpeak
          ) {
            vapiClientRef.current.say(
              `We have five minutes remaining in the interview. Please continue with your response or prepare to wrap up.`
            );
            setTimerWarningGiven(true);
            if (debugMode)
              console.log("5-minute warning given", {
                timestamp: new Date().toISOString(),
              });
          }

          if (
            newTime <= FINAL_WARNING_MINUTES * 60 &&
            !finalWarningGiven &&
            canSpeak
          ) {
            vapiClientRef.current.say(
              `We have one minute remaining. Please conclude your current response.`
            );
            setFinalWarningGiven(true);
            if (debugMode)
              console.log("1-minute warning given", {
                timestamp: new Date().toISOString(),
              });
          }

          if (debugMode)
            console.log("Time remaining timer tick", {
              timeRemaining: newTime,
              timestamp: new Date().toISOString(),
            });

          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
        interviewTimerRef.current = null;
        if (debugMode)
          console.log("Interview timer cleared", {
            timestamp: new Date().toISOString(),
          });
      }
    };
  }, [isInterviewStarted, callStatus, debugMode]);

  // Setup VAPI client listeners
  useEffect(() => {
    if (vapiClientRef.current) {
      const handleMessage = (message) => {
        const messageContent =
          message.content || message.transcript || message.text || "";
        const normalizedMessage = messageContent
          .replace(/[.,!?]/g, "")
          .toLowerCase()
          .trim();
        const normalizedEndingPhrase = ENDING_PHRASE.replace(/[.,!?]/g, "")
          .toLowerCase()
          .trim();

        if (debugMode) {
          console.log("VAPI message received:", {
            role: message.role,
            content: messageContent,
            normalized: normalizedMessage,
            questionIndex: currentQuestionIndex,
            isAITalking,
            isUserTalking,
            timestamp: new Date().toISOString(),
          });
        }

        setMessages((prev) => [
          ...prev,
          { ...message, content: messageContent },
        ]);

        // End call if the ending phrase is detected from the assistant
        if (
          message.role === "assistant" &&
          (normalizedMessage.includes(normalizedEndingPhrase) ||
            messageContent.includes(ENDING_PHRASE)) &&
          callStatus === CallStatus.ACTIVE
        ) {
          if (debugMode)
            console.log("Conclusion phrase detected, ending interview", {
              questionIndex: currentQuestionIndex,
              timestamp: new Date().toISOString(),
            });
          setConclusionDetected(true);
          setIsInterviewComplete(true);
          endCallImmediately();
          return;
        }

        // Question transition detection
        if (message.role === "assistant" && messageContent) {
          const transitionMatch = messageContent.match(
            /Moving to question\s*(\d+)|Next question\s*(\d+)|Question\s*(\d+)|Now for question\s*(\d+)/i
          );

          if (transitionMatch) {
            const questionNumber = Number.parseInt(
              transitionMatch[1] ||
                transitionMatch[2] ||
                transitionMatch[3] ||
                transitionMatch[4],
              10
            );
            const questionIndex = questionNumber - 1;

            if (
              questionIndex >= 0 &&
              questionIndex < questions.length &&
              questionIndex !== currentQuestionIndex
            ) {
              if (debugMode)
                console.log(
                  `Detected explicit transition to question ${questionNumber}`,
                  {
                    timestamp: new Date().toISOString(),
                  }
                );
              updateQuestionState(questionIndex);
              return;
            } else if (questionIndex === currentQuestionIndex) {
              if (debugMode)
                console.log("Transition to current question ignored", {
                  questionIndex,
                  timestamp: new Date().toISOString(),
                });
            } else {
              if (debugMode)
                console.log("Invalid question transition detected", {
                  questionNumber,
                  timestamp: new Date().toISOString(),
                });
            }
          }

          const nextIndex = currentQuestionIndex + 1;
          if (nextIndex < questions.length) {
            const nextQuestion = questions[nextIndex];

            const isQuestionMatch =
              messageContent
                .toLowerCase()
                .includes(nextQuestion.toLowerCase().slice(0, 50)) ||
              messageContent
                .toLowerCase()
                .includes(`question ${nextIndex + 1}`);

            if (isQuestionMatch && nextIndex !== currentQuestionIndex) {
              if (debugMode)
                console.log(
                  `Detected question content match for question ${
                    nextIndex + 1
                  }`,
                  {
                    timestamp: new Date().toISOString(),
                  }
                );
              updateQuestionState(nextIndex);
              return;
            }
          }
        }
      };

      const updateQuestionState = (newIndex) => {
        // Only clear response timeout timer, not duration or interview timers
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
          if (debugMode)
            console.log("Response timeout cleared during question transition", {
              timestamp: new Date().toISOString(),
            });
        }

        setQuestionStates((prevStates) => {
          const newStates = [...prevStates];
          const prevIndex = currentQuestionIndex;

          if (prevIndex >= 0 && prevIndex < newStates.length) {
            newStates[prevIndex].status = "completed";
            newStates[prevIndex].endTime = new Date();
            newStates[prevIndex].duration = newStates[prevIndex].startTime
              ? (new Date() - newStates[prevIndex].startTime) / 1000
              : 0;
          }

          newStates[newIndex].status = "current";
          newStates[newIndex].startTime = new Date();
          return newStates;
        });

        setCurrentQuestionIndex(newIndex);
        setDisplayedQuestion(questions[newIndex]);
        setProgress({
          current: newIndex + 1,
          total: questions.length,
        });

        if (debugMode) {
          console.log("Question state updated:", {
            newQuestionIndex: newIndex,
            question: questions[newIndex],
            progress: { current: newIndex + 1, total: questions.length },
            timestamp: new Date().toISOString(),
          });
        }
      };

      const handleSpeechStart = () => {
        setIsAITalking(true);
        setIsUserTalking(false);
        setLastSpeakingRole("assistant");
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
          if (debugMode)
            console.log("Response timeout cleared due to AI speech start", {
              timestamp: new Date().toISOString(),
            });
        }
        if (debugMode)
          console.log(
            "AI speech started, isAITalking: true, isUserTalking: false",
            {
              questionIndex: currentQuestionIndex,
              timestamp: new Date().toISOString(),
            }
          );
      };

      const handleSpeechEnd = () => {
        setIsAITalking(false);
        setLastSpeakingRole(null);
        if (debugMode)
          console.log("AI speech ended, isAITalking: false", {
            questionIndex: currentQuestionIndex,
            timestamp: new Date().toISOString(),
          });

        if (callStatus === CallStatus.ACTIVE) {
          if (debugMode)
            console.log(`Setting response timeout for ${RESPONSE_TIMEOUT}ms`, {
              questionIndex: currentQuestionIndex,
              timestamp: new Date().toISOString(),
            });
          responseTimeoutRef.current = setTimeout(() => {
            if (callStatus !== CallStatus.ACTIVE) {
              if (debugMode)
                console.log("Timeout aborted due to inactive call status", {
                  questionIndex: currentQuestionIndex,
                  timestamp: new Date().toISOString(),
                });
              return;
            }

            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
              if (debugMode)
                console.log(
                  `No user response after ${RESPONSE_TIMEOUT}ms, moving to question ${
                    nextIndex + 1
                  }`,
                  {
                    timestamp: new Date().toISOString(),
                  }
                );
              vapiClientRef.current.send({
                type: "add-message",
                message: {
                  role: "system",
                  content: `The candidate has not responded after 15 seconds. Moving to question ${
                    nextIndex + 1
                  }: "${questions[nextIndex]}"`,
                },
              });
              updateQuestionState(nextIndex);
            } else {
              if (debugMode)
                console.log("Reached last question, ending interview", {
                  timestamp: new Date().toISOString(),
                });
              vapiClientRef.current.say(ENDING_PHRASE, true);
            }
          }, RESPONSE_TIMEOUT);
        }
      };

      const handleUserSpeechStart = () => {
        setIsUserTalking(true);
        setIsAITalking(false);
        setLastSpeakingRole("user");
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
          if (debugMode)
            console.log("Response timeout cleared due to user speech start", {
              timestamp: new Date().toISOString(),
            });
        }
        if (debugMode)
          console.log(
            "User speech started, isUserTalking: true, isAITalking: false",
            {
              timestamp: new Date().toISOString(),
            }
          );
      };

      const handleUserSpeechEnd = () => {
        setIsUserTalking(false);
        setLastSpeakingRole(null);
        if (debugMode)
          console.log("User speech ended, isUserTalking: false", {
            timestamp: new Date().toISOString(),
          });
      };

      const handleError = (error) => {
        let errorMessage = error?.response?.data?.message || "Unknown error";
        if (errorMessage.includes("microphone")) {
          errorMessage =
            "Microphone access issue. Please ensure your microphone is enabled and permissions are granted.";
        } else if (errorMessage.includes("Meeting has ended")) {
          // Handle "Meeting has ended" error by ensuring interview completion
          if (debugMode)
            console.log(
              "Meeting ended error detected, ensuring interview completion",
              {
                timestamp: new Date().toISOString(),
              }
            );
          setIsInterviewComplete(true);
          setConclusionDetected(true);
          setCallStatus(CallStatus.FINISHED);
          setIsAITalking(false);
          setIsUserTalking(false);
          setIsLoading(false);
          setMessages([]);
          setTranscript("");
          clearAllTimers();
          if (debugMode)
            console.error("Detailed VAPI error:", {
              message: error?.response?.data?.message,
              stack: error.stack,
              callStatus,
              isAITalking,
              isUserTalking,
              timestamp: new Date().toISOString(),
            });
          return;
        }
        setError(`VAPI error: ${errorMessage}`);
        setIsAITalking(false);
        setIsUserTalking(false);
        if (debugMode)
          console.error("Detailed VAPI error:", {
            message: error?.response?.data?.message,
            stack: error.stack,
            callStatus,
            isAITalking,
            isUserTalking,
            timestamp: new Date().toISOString(),
          });
      };

      if (debugMode)
        console.log("Registering VAPI event listeners", {
          timestamp: new Date().toISOString(),
        });
      vapiClientRef.current.on("message", handleMessage);
      vapiClientRef.current.on("speech-start", handleSpeechStart);
      vapiClientRef.current.on("speech-end", handleSpeechEnd);
      vapiClientRef.current.on("user-speech-start", handleUserSpeechStart);
      vapiClientRef.current.on("user-speech-end", handleUserSpeechEnd);
      vapiClientRef.current.on("error", handleError);

      return () => {
        if (debugMode)
          console.log("Cleaning up VAPI event listeners", {
            timestamp: new Date().toISOString(),
          });
        vapiClientRef.current.off("message", handleMessage);
        vapiClientRef.current.off("speech-start", handleSpeechStart);
        vapiClientRef.current.off("speech-end", handleSpeechEnd);
        vapiClientRef.current.off("user-speech-start", handleUserSpeechStart);
        vapiClientRef.current.off("user-speech-end", handleUserSpeechEnd);
        vapiClientRef.current.off("error", handleError);
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          if (debugMode)
            console.log("Response timeout cleared on cleanup", {
              timestamp: new Date().toISOString(),
            });
        }
      };
    }
  }, [
    vapiClientRef.current,
    currentQuestionIndex,
    questions,
    callStatus,
    debugMode,
  ]);

  // Capture screenshot
  const captureScreenshot = () => {
    if (!videoRef.current) {
      setScreenshotError("Video reference not available");
      return null;
    }
    try {
      const screenshot = videoRef.current.getScreenshot();
      if (!screenshot) {
        setScreenshotError("Failed to capture screenshot - empty result");
        return null;
      }
      setScreenshots((prev) => [...prev, screenshot]);
      setScreenshotTimes((prev) => [...prev, new Date()]);
      setLastCapturedScreenshot(screenshot);
      setTimeout(() => setLastCapturedScreenshot(null), 2000);
      const interviewId = Date.now().toString();
      const screenshotData = {
        interviewId,
        screenshot,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `interview_screenshot_${interviewId}_${screenshots.length}`,
        JSON.stringify(screenshotData)
      );
      return screenshot;
    } catch (error) {
      setScreenshotError(`Screenshot error: ${error?.response?.data?.message}`);
      return null;
    }
  };

  // Manual screenshot
  const takeManualScreenshot = () => {
    if (screenshots.length < maxScreenshots) {
      captureScreenshot();
    }
  };

  // Setup screenshot capture
  useEffect(() => {
    if (
      isInterviewStarted &&
      callStatus === CallStatus.ACTIVE &&
      videoRef.current
    ) {
      if (screenshotIntervalRef.current)
        clearInterval(screenshotIntervalRef.current);

      let screenshotCount = 0;
      const intervalTime = 90000; // 1.5 minutes
      const intervalId = setInterval(() => {
        if (screenshotCount < maxScreenshots) {
          captureScreenshot();
          screenshotCount++;
          if (screenshotCount >= maxScreenshots) {
            clearInterval(intervalId);
            setScreenshotInterval(null);
            if (debugMode)
              console.log("Screenshot interval cleared", {
                timestamp: new Date().toISOString(),
              });
          }
        }
      }, intervalTime);

      captureScreenshot();
      screenshotCount++;

      setScreenshotInterval(intervalId);
      return () => {
        clearInterval(intervalId);
        setScreenshotInterval(null);
        if (debugMode)
          console.log("Screenshot interval cleared on cleanup", {
            timestamp: new Date().toISOString(),
          });
      };
    }
  }, [isInterviewStarted, callStatus, debugMode]);

  // Monitor conclusion
  useEffect(() => {
    if (conclusionDetected && !isInterviewComplete) {
      if (screenshots.length < maxScreenshots) captureScreenshot();
      endCallImmediately();
    }
  }, [conclusionDetected, isInterviewComplete, screenshots.length]);

  // Reset isAITalking and isUserTalking when call is inactive or finished
  useEffect(() => {
    if (
      callStatus === CallStatus.INACTIVE ||
      callStatus === CallStatus.FINISHED
    ) {
      setIsAITalking(false);
      setIsUserTalking(false);
      if (debugMode)
        console.log(
          `Call status changed to ${callStatus}, isAITalking: false, isUserTalking: false`,
          {
            timestamp: new Date().toISOString(),
          }
        );
    }
  }, [callStatus, debugMode]);

  // Stop VAPI call
  const stopVAPICall = async () => {
    try {
      if (!vapiClientRef.current) {
        if (debugMode)
          console.warn("VAPI client is not available", {
            timestamp: new Date().toISOString(),
          });
      } else if (callStatus === CallStatus.FINISHED) {
        if (debugMode)
          console.log("Call already finished", {
            timestamp: new Date().toISOString(),
          });
      } else {
        await endCallImmediately();
      }
    } catch (error) {
      setIsInterviewComplete(true);
      setCallStatus(CallStatus.FINISHED);
      setIsAITalking(false);
      setIsUserTalking(false);
      setMessages([]);
      setTranscript("");
      clearAllTimers();
      if (debugMode)
        console.error("Stop VAPI call error:", {
          error,
          timestamp: new Date().toISOString(),
        });
    }
  };

  const endCallImmediately = async () => {
    if (callStatus === CallStatus.FINISHED) {
      if (debugMode)
        console.log("Call already finished, skipping end call", {
          timestamp: new Date().toISOString(),
        });
      return;
    }
    try {
      if (vapiClientRef.current) {
        await vapiClientRef.current.stop();
      }
      if (screenshots.length < maxScreenshots) {
        captureScreenshot();
      }

      // Save transcript data before completing the interview
      const transcriptData = saveAndGetTranscript(interviewId);

      setQuestionStates((prevStates) => {
        const newStates = [...prevStates];
        const currentState = newStates.find(
          (state) => state.status === "current"
        );

        if (currentState) {
          currentState.status = "completed";
          currentState.endTime = new Date();
          currentState.duration = currentState.startTime
            ? (new Date() - currentState.startTime) / 1000
            : 0;
        }

        return newStates;
      });

      setIsInterviewComplete(true);
      setCallStatus(CallStatus.FINISHED);
      if (debugMode)
        console.log("Call status changed to FINISHED", {
          timestamp: new Date().toISOString(),
        });
      setIsAITalking(false);
      setIsUserTalking(false);
      setConclusionDetected(true);
      setIsLoading(false);
      clearAllTimers();

      if (debugMode)
        console.log("Interview completed with transcript data", {
          transcriptData,
          timestamp: new Date().toISOString(),
        });
    } catch (error) {
      setError(`Call termination error: ${error?.response?.data?.message}`);
      setIsInterviewComplete(true);
      setCallStatus(CallStatus.FINISHED);
      if (debugMode)
        console.log("Call status changed to FINISHED", {
          timestamp: new Date().toISOString(),
        });
      setIsAITalking(false);
      setIsUserTalking(false);
      setIsLoading(false);
      setMessages([]);
      setTranscript("");
      clearAllTimers();
      if (debugMode)
        console.error("End call error:", {
          error,
          timestamp: new Date().toISOString(),
        });
    }
  };

  const clearAllTimers = () => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
      if (debugMode)
        console.log("Duration timer cleared", {
          timestamp: new Date().toISOString(),
        });
    }
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
      if (debugMode)
        console.log("Response timeout cleared", {
          timestamp: new Date().toISOString(),
        });
    }
    if (screenshotIntervalRef.current) {
      clearInterval(screenshotIntervalRef.current);
      screenshotIntervalRef.current = null;
      if (debugMode)
        console.log("Screenshot interval cleared", {
          timestamp: new Date().toISOString(),
        });
    }
    if (interviewTimerRef.current) {
      clearInterval(interviewTimerRef.current);
      interviewTimerRef.current = null;
      if (debugMode)
        console.log("Interview timer cleared", {
          timestamp: new Date().toISOString(),
        });
    }
    setScreenshotInterval(null);
    if (debugMode)
      console.log("All timers cleared", {
        timestamp: new Date().toISOString(),
      });
  };

  // Start VAPI call
  const startVAPICall = async () => {
    if (!navigator.onLine) {
      setError(
        "No internet connection. Please check your network and try again."
      );
      setIsLoading(false);
      return;
    }

    if (
      !vapiClientRef.current ||
      callStatus === CallStatus.ACTIVE ||
      isLoading
    ) {
      if (debugMode)
        console.log("Cannot start VAPI call", {
          callStatus,
          isLoading,
          timestamp: new Date().toISOString(),
        });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setCallStatus(CallStatus.CONNECTING);
      if (debugMode)
        console.log("Call status changed to CONNECTING", {
          timestamp: new Date().toISOString(),
        });
      setIsAITalking(false);
      setIsUserTalking(false);

      if (currentQuestionIndex === 0 && messages.length === 0) {
        const introMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Welcome to your technical interview. I'll begin with the first question shortly.",
          timestamp: new Date(),
        };
        setMessages([introMessage]);
        setLastSpeakingRole("assistant");
        if (debugMode)
          console.log("Intro message added", {
            timestamp: new Date().toISOString(),
          });
      }

      const formattedQuestions = questions
        .map((q, i) => `Question ${i + 1}: ${q}`)
        .join("\n\n");
      const assistantOverrides = {
        name: "AI Technical Interviewer",
        firstMessage: `Hello! I'm TaleX AI, your interviewer today. I'll be asking you ${questions.length} technical questions to assess your skills. The interview will last up to ${INTERVIEW_DURATION_MINUTES} minutes. Are you ready?!"`,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
          keywords: [],
          smartFormat: false,
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a senior technical interviewer conducting a structured, professional interview to evaluate a candidate's technical expertise, problem-solving ability, and communication skills. Your goal is to create a realistic, engaging, and fair interview experience.

**OBJECTIVES**:
1. Ask the ${questions.length} predefined technical questions in order, one at a time, starting with question 1.
2. Maintain a professional, friendly, yet firm tone.
3. Analyze responses for accuracy, depth, clarity, and relevance.
4. Detect evasive or off-topic responses and redirect politely with: "Could you focus on the question?"
5. Dont Explain any concepts  . you could just give small hints that  could help him and give small feedback on each candidate answer.
6. Ask follow-up questions if the response is incomplete (e.g., "Can you elaborate on X?").
7. After receiving a response, a declined answer, or exactly 10 seconds of silence, transition to the next question by saying: "Moving to question X: [question]".

**INTERVIEW GUIDELINES**:
- **Introduction**: Greet the candidate, state the number of questions, and set expectations for the interview duration.
- **Question Delivery**:
  - Ask one question at a time, using the exact wording provided.
  - Wait for a response or exactly 10 seconds of silence before moving to the next question.
  - Announce transitions with: "Moving to question X: [question]" for all questions except the last.
- **Response Handling**:
  - If the response is vague or off-topic, redirect with: "Could you focus on the question?"
  - If silent for 5 seconds, prompt: "Would you like me to repeat the question?"
  - After a response or 10 seconds of silence, move to the next question.
- **Conclusion**:
  - After asking the final question (question ${questions.length}) and receiving a response or 10 seconds of silence, say: "${ENDING_PHRASE}".
  - Terminate the call immediately after saying the ending phrase.
- **Timing**:
  - Monitor silence after asking a question or finishing a follow-up.
  - If 10 seconds of silence occur, immediately announce the next question or ending phrase.

**RESTRICTIONS**:
- Do NOT move to the next question until a response is received, the candidate declines to answer, or exactly 10 seconds of silence have passed.
- Do NOT end the interview until the final question is asked and the ending phrase is spoken.
- Do NOT engage in casual conversation or answer unrelated questions.
- Do NOT provide hints unless clarifying the current question.
- Do NOT interrupt the candidate's response to announce time warnings.
- ALWAYS announce question transitions with: "Moving to question X: [question]".
- NEVER terminate the call prematurely, even if the interview duration exceeds ${INTERVIEW_DURATION_MINUTES} minutes.

**QUESTIONS**:
${formattedQuestions}
`,
            },
          ],
        },
        recordingEnabled: false,
        endCallPhrases: [ENDING_PHRASE],
      };

      if (debugMode)
        console.log("Starting VAPI call", {
          timestamp: new Date().toISOString(),
        });
      await vapiClientRef.current.start(VAPI_ASSISTANT_ID, assistantOverrides);
      if (debugMode)
        console.log("VAPI call started successfully", {
          timestamp: new Date().toISOString(),
        });

      // Wait for call to be fully active before unmuting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (callStatus === CallStatus.ACTIVE && vapiClientRef.current) {
        try {
          vapiClientRef.current.setMuted(false);
          setIsAudioOn(true);
          if (debugMode)
            console.log("Microphone unmuted after call start", {
              timestamp: new Date().toISOString(),
            });
        } catch (muteError) {
          if (debugMode)
            console.warn("Failed to unmute microphone", {
              error: muteError,
              timestamp: new Date().toISOString(),
            });
          setError(
            `Warning: Could not unmute microphone: ${muteError.message}`
          );
        }
      }

      setCallStatus(CallStatus.ACTIVE);
      if (debugMode)
        console.log("Call status changed to ACTIVE", {
          timestamp: new Date().toISOString(),
        });
      setIsLoading(false);

      setQuestionStates((prevStates) => {
        const newStates = [...prevStates];
        if (newStates[0]) {
          newStates[0].startTime = new Date();
          newStates[0].status = "current";
        }
        return newStates;
      });
    } catch (error) {
      setError(
        `Failed to start the interview: ${error?.response?.data?.message || "Unknown error"}`
      );
      setIsAITalking(false);
      setIsUserTalking(false);
      setCallStatus(CallStatus.INACTIVE);
      if (debugMode)
        console.log("Call status changed to INACTIVE", {
          timestamp: new Date().toISOString(),
        });
      setIsLoading(false);
      if (debugMode)
        console.error(
          "Start VAPI call error, isAITalking: false, isUserTalking: false",
          {
            error,
            timestamp: new Date().toISOString(),
          }
        );
    }
  };

  // Handle start interview
  const handleStartInterview = async () => {
    try {
      // Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      if (debugMode)
        console.log("Microphone permission granted", {
          timestamp: new Date().toISOString(),
        });
    } catch (err) {
      setError(
        "Microphone access denied. Please allow microphone access in your browser settings."
      );
      if (debugMode)
        console.error("Microphone permission error:", {
          error: err,
          timestamp: new Date().toISOString(),
        });
      return;
    }

    setIsInterviewStarted(true);
    setScreenshots([]);
    setScreenshotTimes([]);
    setProgress({ current: 1, total: questions.length });
    setTimeRemaining(INTERVIEW_DURATION_MINUTES * 60);
    setTimerWarningGiven(false);
    setFinalWarningGiven(false);

    setQuestionStates(
      questions.map((question, idx) => ({
        question,
        index: idx,
        status: idx === 0 ? "current" : "pending",
        startTime: idx === 0 ? new Date() : null,
        endTime: null,
        duration: 0,
        userResponses: [],
        aiResponses: [],
      }))
    );

    await startVAPICall();
    if (debugMode)
      console.log("Interview started", { timestamp: new Date().toISOString() });
  };

  // Handle end interview
  const handleEndInterview = () => {
    stopVAPICall();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (debugMode)
      console.log("Interview ended manually", {
        timestamp: new Date().toISOString(),
      });
  };
  const formatTranscriptForSubmission = () => {
    // Implement your transcript formatting logic here
    // This is a placeholder, replace with your actual formatting
    return messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
  };
  const saveTranscriptToLocalStorage = (interviewId) => {
    try {
      const transcript = formatTranscriptForSubmission();
      const transcriptData = {
        interviewId,
        transcript,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `interview_transcript_${interviewId}`,
        JSON.stringify(transcriptData)
      );
      if (debugMode)
        console.log("Full transcript saved to localStorage", {
          interviewId,
          timestamp: new Date().toISOString(),
        });
      return transcriptData;
    } catch (error) {
      if (debugMode)
        console.error("Failed to save full transcript to localStorage:", {
          error,
          timestamp: new Date().toISOString(),
        });
      return null;
    }
  };
  // Force next question
  const forceNextQuestion = () => {
    if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
      setError(
        "Cannot move to next question: Call is not active or VAPI client is unavailable."
      );
      if (debugMode)
        console.log("Next question aborted", {
          callStatus,
          timestamp: new Date().toISOString(),
        });
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      vapiClientRef.current.send({
        type: "add-message",
        message: {
          role: "system",
          content: `Moving to question ${nextIndex + 1}: "${
            questions[nextIndex]
          }"`,
        },
      });
      if (debugMode)
        console.log("Forced next question", {
          nextIndex,
          timestamp: new Date().toISOString(),
        });
    } else {
      vapiClientRef.current.say(ENDING_PHRASE, true);
      if (debugMode)
        console.log("Forced interview end on last question", {
          timestamp: new Date().toISOString(),
        });
    }
  };

  // Toggle transcript visibility
  const toggleTranscript = () => {
    if (showTranscript && transcriptContainerRef.current) {
      import("gsap").then(({ gsap }) => {
        gsap.to(transcriptContainerRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => setShowTranscript(false),
        });
      });
    } else {
      setShowTranscript(true);
    }
  };

  // Toggle transcript expanded state
  const toggleTranscriptExpanded = () => {
    setTranscriptExpanded(!transcriptExpanded);
  };

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (!vapiClientRef.current || callStatus !== CallStatus.ACTIVE) {
      if (debugMode)
        console.log(
          "Audio toggle aborted: Call not active or VAPI client unavailable",
          {
            callStatus,
            hasVapiClient: !!vapiClientRef.current,
            timestamp: new Date().toISOString(),
          }
        );
      return;
    }

    try {
      // Get the current mute state from VAPI client
      const currentMuted = vapiClientRef.current.isMuted();

      // Toggle VAPI mute state
      vapiClientRef.current.setMuted(!currentMuted);

      // Get the WebRTC connection from VAPI client to access the actual audio tracks
      const peerConnection =
        vapiClientRef.current.getPeerConnection?.() || null;

      if (peerConnection) {
        // Get all senders (outgoing tracks)
        const senders = peerConnection.getSenders() || [];

        // Find audio tracks and disable/enable them
        senders.forEach((sender) => {
          if (sender.track && sender.track.kind === "audio") {
            // This actually stops the audio from being sent
            sender.track.enabled = currentMuted;

            if (debugMode)
              console.log(
                `Audio track ${currentMuted ? "enabled" : "disabled"}`,
                {
                  trackId: sender.track.id,
                  timestamp: new Date().toISOString(),
                }
              );
          }
        });
      } else if (videoRef.current && videoRef.current.srcObject) {
        // Fallback: If we can't access the peer connection, try to mute via the video element's stream
        const audioTracks = videoRef.current.srcObject.getAudioTracks();

        if (audioTracks && audioTracks.length > 0) {
          audioTracks.forEach((track) => {
            track.enabled = currentMuted;

            if (debugMode)
              console.log(
                `Audio track ${
                  currentMuted ? "enabled" : "disabled"
                } (fallback)`,
                {
                  trackId: track.id,
                  timestamp: new Date().toISOString(),
                }
              );
          });
        }
      }

      // Update state to reflect new audio status
      setIsAudioOn(!currentMuted);

      if (debugMode)
        console.log("Audio toggled completely", {
          newAudioState: !currentMuted,
          timestamp: new Date().toISOString(),
        });
    } catch (error) {
      setError(`Warning: Could not toggle microphone: ${error?.response?.data?.message}`);
      if (debugMode)
        console.error("Error toggling audio:", {
          error,
          timestamp: new Date().toISOString(),
        });
    }
  }, [vapiClientRef, callStatus, debugMode, videoRef]);

  const getInterviewTranscript = () => {
    const validMessages = messages.filter(
      (msg) =>
        msg.content &&
        msg.content.trim() !== "" &&
        ["assistant", "user"].includes(msg.role)
    );

    // Deduplicate messages based on role and content
    const deduplicatedMessages = [];
    const seenContent = new Set();

    for (const msg of validMessages) {
      const key = `${msg.role}:${msg.content.trim()}`;
      if (!seenContent.has(key)) {
        seenContent.add(key);
        deduplicatedMessages.push(msg);
      }
    }

    // Generate transcript
    const transcript = deduplicatedMessages
      .map((msg) => {
        const speaker = msg.role === "assistant" ? "AI" : "Candidate";
        return `${speaker}: ${msg.content.trim()}`;
      })
      .join("\n");

    if (debugMode) {
      console.log("Generated clean transcript:", {
        transcript,
        originalMessageCount: messages.length,
        validMessageCount: validMessages.length,
        deduplicatedMessageCount: deduplicatedMessages.length,
        timestamp: new Date().toISOString(),
      });
    }

    return transcript;
  };

  const saveCleanTranscriptToLocalStorage = (interviewId) => {
    try {
      const transcript = getInterviewTranscript();
      const transcriptData = {
        interviewId,
        transcript,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `interview_clean_transcript_${interviewId}`,
        JSON.stringify(transcriptData)
      );
      if (debugMode)
        console.log("Clean transcript saved to localStorage", {
          interviewId,
          transcriptLength: transcript.length,
          timestamp: new Date().toISOString(),
        });
      return transcriptData;
    } catch (error) {
      if (debugMode)
        console.error("Failed to save clean transcript to localStorage:", {
          error,
          timestamp: new Date().toISOString(),
        });
      return null;
    }
  };
  const getCompleteTranscript = () => {
    const validMessages = messages.filter(
      (msg) =>
        msg.content &&
        msg.content.trim() !== "" &&
        ["assistant", "user"].includes(msg.role)
    );

    // Deduplicate messages based on role and content
    const deduplicatedMessages = [];
    const seenContent = new Set();

    for (const msg of validMessages) {
      const key = `${msg.role}:${msg.content.trim()}`;
      if (!seenContent.has(key)) {
        seenContent.add(key);
        deduplicatedMessages.push(msg);
      }
    }

    // Generate transcript with timestamps
    const transcript = deduplicatedMessages
      .map((msg) => {
        const speaker = msg.role === "assistant" ? "AI" : "Candidate";
        return `${speaker}: ${msg.content.trim()}`;
      })
      .join("\n\n");

    if (debugMode) {
      console.log("Generated complete transcript:", {
        transcriptLength: transcript.length,
        originalMessageCount: messages.length,
        validMessageCount: validMessages.length,
        deduplicatedMessageCount: deduplicatedMessages.length,
        timestamp: new Date().toISOString(),
      });
    }

    return transcript;
  };

  // 2. Function to get a structured transcript (JSON format)
  const getStructuredTranscript = () => {
    const validMessages = messages.filter(
      (msg) =>
        msg.content &&
        msg.content.trim() !== "" &&
        ["assistant", "user"].includes(msg.role)
    );

    // Deduplicate messages based on role and content
    const deduplicatedMessages = [];
    const seenContent = new Set();

    for (const msg of validMessages) {
      const key = `${msg.role}:${msg.content.trim()}`;
      if (!seenContent.has(key)) {
        seenContent.add(key);
        deduplicatedMessages.push(msg);
      }
    }

    // Return structured data
    return deduplicatedMessages.map((msg) => ({
      role: msg.role,
      speaker: msg.role === "assistant" ? "AI" : "Candidate",
      content: msg.content.trim(),
      timestamp: msg.timestamp
        ? new Date(msg.timestamp).toISOString()
        : new Date().toISOString(),
    }));
  };

  const saveAndGetTranscript = (interviewId) => {
    try {
      const plainTextTranscript = getCompleteTranscript();
      const structuredTranscript = getStructuredTranscript();

      const transcriptData = {
        interviewId,
        plainText: plainTextTranscript,
        structured: structuredTranscript,
        timestamp: new Date().toISOString(),
        metadata: {
          questionCount: questions.length,
          completedQuestions: getCompletedQuestionsSummary().length,
          interviewDuration: interviewDuration,
        },
      };

      // Save to localStorage
      localStorage.setItem(
        `interview_transcript_${interviewId}`,
        JSON.stringify(transcriptData)
      );

      if (debugMode) {
        console.log("Complete transcript saved and ready to send:", {
          interviewId,
          transcriptLength: plainTextTranscript.length,
          messageCount: structuredTranscript.length,
          timestamp: new Date().toISOString(),
        });
      }

      return transcriptData;
    } catch (error) {
      if (debugMode) {
        console.error("Failed to save/get transcript:", {
          error,
          timestamp: new Date().toISOString(),
        });
      }
      return null;
    }
  };
  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Question state management
  const getCurrentQuestionSummary = () => {
    const currentState = questionStates.find(
      (state) => state.status === "current"
    );
    if (!currentState) return null;
    return {
      index: currentState.index,
      question: currentState.question,
      status: currentState.status,
      duration: currentState.duration
        ? formatDuration(currentState.duration)
        : "0:00",
      userResponses: currentState.userResponses,
      aiResponses: currentState.aiResponses,
    };
  };

  const getCompletedQuestionsSummary = () => {
    return questionStates
      .filter((state) => state.status === "completed")
      .map((state) => ({
        index: state.index,
        question: state.question,
        duration: formatDuration(state.duration),
        userResponseCount: state.userResponses.length,
        aiResponseCount: state.aiResponses.length,
      }));
  };

  const getPendingQuestionsCount = () => {
    return questionStates.filter((state) => state.status === "pending").length;
  };

  const resetQuestionStates = () => {
    setQuestionStates(
      questions.map((question, idx) => ({
        question,
        index: idx,
        status: idx === 0 ? "current" : "pending",
        startTime: idx === 0 ? new Date() : null,
        endTime: null,
        duration: 0,
        userResponses: [],
        aiResponses: [],
      }))
    );
    setCurrentQuestionIndex(0);
    setDisplayedQuestion(questions[0] || "");
    setProgress({ current: 1, total: questions.length });
    if (debugMode)
      console.log("Question states reset", {
        timestamp: new Date().toISOString(),
      });
  };

  const retryQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setQuestionStates((prevStates) => {
        const newStates = [...prevStates];
        newStates.forEach((state, idx) => {
          if (idx === questionIndex) {
            state.status = "current";
            state.startTime = new Date();
            state.endTime = null;
            state.duration = 0;
            state.userResponses = [];
            state.aiResponses = [];
          } else if (idx > questionIndex) {
            state.status = "pending";
            state.startTime = null;
            state.endTime = null;
            state.duration = 0;
            state.userResponses = [];
            state.aiResponses = [];
          } else if (state.status === "current") {
            state.status = "completed";
            state.endTime = new Date();
            state.duration = state.startTime
              ? (new Date() - state.startTime) / 1000
              : state.duration;
          }
        });
        return newStates;
      });
      setCurrentQuestionIndex(questionIndex);
      setDisplayedQuestion(questions[questionIndex]);
      setProgress({ current: questionIndex + 1, total: questions.length });

      if (vapiClientRef.current) {
        vapiClientRef.current.send({
          type: "add-message",
          message: {
            role: "system",
            content: `Retrying question ${questionIndex + 1}: "${
              questions[questionIndex]
            }"`,
          },
        });
        if (debugMode)
          console.log("Retrying question", {
            questionIndex,
            timestamp: new Date().toISOString(),
          });
      }
    }
  };

  const formatQuestionStateForUI = () => {
    return questionStates.map((state) => ({
      index: state.index,
      question: state.question,
      status: state.status,
      duration: state.duration ? formatDuration(state.duration) : "N/A",
      userResponseCount: state.userResponses.length,
      aiResponseCount: state.aiResponses.length,
      startTime: state.startTime
        ? new Date(state.startTime).toLocaleTimeString()
        : null,
      endTime: state.endTime
        ? new Date(state.endTime).toLocaleTimeString()
        : null,
      userResponses: state.userResponses.map((res) => ({
        content: res.content,
        timestamp: res.timestamp
          ? new Date(res.timestamp).toLocaleTimeString()
          : "unknown",
      })),
      aiResponses: state.aiResponses.map((res) => ({
        content: res.content,
        timestamp: res.timestamp
          ? new Date(res.timestamp).toLocaleTimeString()
          : "unknown",
      })),
    }));
  };

  const retrieveInterviewData = (interviewId) => {
    try {
      const fullTranscriptData = JSON.parse(
        localStorage.getItem(`interview_transcript_${interviewId}`)
      );
      const cleanTranscriptData = JSON.parse(
        localStorage.getItem(`interview_clean_transcript_${interviewId}`)
      );
      const screenshotData = [];
      for (let i = 0; i < maxScreenshots; i++) {
        const data = JSON.parse(
          localStorage.getItem(`interview_screenshot_${interviewId}_${i}`)
        );
        if (data) screenshotData.push(data);
      }
      return {
        fullTranscript: fullTranscriptData,
        cleanTranscript: cleanTranscriptData,
        screenshots: screenshotData,
      };
    } catch (error) {
      setError(`Failed to retrieve interview data: ${error?.response?.data?.message}`);
      if (debugMode)
        console.error("Retrieve interview data error:", {
          error,
          timestamp: new Date().toISOString(),
        });
      return null;
    }
  };
  // Monitor interview completion state
  useEffect(() => {
    if (isInterviewComplete && conclusionDetected) {
      if (debugMode)
        console.log("Interview completed, should show completion dialog", {
          timestamp: new Date().toISOString(),
        });

      const event = new CustomEvent("interviewCompleted", {
        detail: {
          transcript: getInterviewTranscript(),
          screenshots: screenshots,
          questionStates: formatQuestionStateForUI(),
        },
      });
      window.dispatchEvent(event);
    }
  }, [isInterviewComplete, conclusionDetected]);

  return {
    state: {
      currentQuestionIndex,
      displayedQuestion,
      progress,
      isVideoOn,
      isAudioOn,
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
      conclusionDetected,
      lastUserResponseTime,
      interviewDuration,
      transcriptExpanded,
      lastSpeakingRole,
      screenshots,
      screenshotTimes,
      lastCapturedScreenshot,
      debugMode,
      timeRemaining,
      questionStates: formatQuestionStateForUI(),
      currentQuestionSummary: getCurrentQuestionSummary(),
      completedQuestionsSummary: getCompletedQuestionsSummary(),
      pendingQuestionsCount: getPendingQuestionsCount(),
    },
    actions: {
      setCurrentQuestionIndex,
      setDisplayedQuestion,
      setProgress,
      setIsVideoOn,
      setIsAudioOn,
      setIsInterviewComplete,
      setIsInterviewStarted,
      setIsAITalking,
      setIsUserTalking,
      setTranscript,
      setMessages,
      setLastMessage,
      setShowTranscript,
      setCallStatus,
      setIsLoading,
      setError,
      setConclusionDetected,
      setLastUserResponseTime,
      setInterviewDuration,
      setTranscriptExpanded,
      setLastSpeakingRole,
      handleStartInterview,
      handleEndInterview,
      toggleTranscript,
      toggleTranscriptExpanded,
      toggleAudio,
      stopVAPICall,
      startVAPICall,
      captureScreenshot,
      takeManualScreenshot,
      retrieveInterviewData,
      setDebugMode,
      getInterviewTranscript,
      forceNextQuestion,
      resetQuestionStates,
      saveAndGetTranscript,
      retryQuestion,
    },
    refs: {
      videoRef,
      aiVideoContainerRef,
      userVideoContainerRef,
      transcriptContainerRef,
      mainContentRef,
      vapiClientRef,
      durationTimerRef,
      interviewTimerRef,
    },
  };
}
