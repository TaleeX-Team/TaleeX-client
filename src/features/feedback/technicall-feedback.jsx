import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  MessageSquare,
  Code2,
  Users,
  ThumbsUp,
  Image,
  ExternalLink,
  HeartHandshake,
  Smile,
  FileText,
  Mic,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TechnicalFeedbackPage({
  screenshots = [],
  feedback,
  audio,
  summary,
  transcriptText,
}) {
  const [activeTab, setActiveTab] = useState("results");

  const scoreValue = parseFloat(feedback.overallScore);

  const getColor = (score) => {
    if (score >= 4) return "green";
    if (score >= 3) return "amber";
    return "red";
  };

  const color = getColor(scoreValue);
  const parseTranscript = (text) => {
    if (!text || typeof text !== "string") {
      return [{ speaker: "System", text: "No transcript available." }];
    }

    const lines = text.trim().split("\n");
    const formatted = lines
      .map((line, index) => {
        // Skip empty lines
        if (!line.trim()) return null;

        // Split on the first colon followed by a space
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (!match) {
          // Handle malformed lines
          return {
            speaker: "Unknown",
            text: line.trim(),
            key: `line-${index}`,
          };
        }

        const [, speaker, text] = match;
        return {
          speaker: speaker.trim(),
          text: text.trim(),
          key: `line-${index}`,
        };
      })
      .filter(Boolean); // Remove null entries

    return formatted.length > 0
      ? formatted
      : [{ speaker: "System", text: "Transcript is empty.", key: "empty" }];
  };

  const formattedTranscript = parseTranscript(transcriptText);

  return (
    <div className="min-h-screen flex  bg-background px-4">
      <div className="w-full max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Technical Interview Feedback
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="results">Evaluation Results</TabsTrigger>
            <TabsTrigger value="details">Interview Details</TabsTrigger>
            <TabsTrigger value="transcript">Interview Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Evaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Overall Score */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-5xl font-bold text-${color}-600 dark:text-${color}-500`}
                    >
                      {scoreValue}
                    </div>
                    <div className="text-muted-foreground">
                      <div className="text-sm uppercase font-semibold">
                        Overall Score
                      </div>
                      <div className="text-xs">
                        Based on technical assessment
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <Progress
                      value={(scoreValue / 5) * 100}
                      className="h-3"
                      indicatorClassName={`bg-${color}-600 dark:bg-${color}-500`}
                    />
                  </div>
                </div>

                {/* Summary */}
                <Section
                  title="Summary"
                  icon={<MessageSquare className="h-5 w-5 text-primary" />}
                >
                  <p className="text-muted-foreground">{feedback.summary}</p>
                </Section>

                {/* Ratings */}
                <Section
                  title="Category Ratings"
                  icon={<Users className="h-5 w-5 text-primary" />}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(feedback.rating).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b dark:border-gray-700 pb-1"
                      >
                        <span className="capitalize">{key}</span>
                        <span className="font-semibold">{val}/5</span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Skills */}
                {feedback.technicalSkills?.keywords?.length > 0 && (
                  <Section
                    title="Mentioned Technical Keywords"
                    icon={<Code2 className="h-5 w-5 text-primary" />}
                  >
                    <div className="flex flex-wrap gap-2">
                      {feedback.technicalSkills.keywords.map((skill, idx) => (
                        <Badge
                          key={idx}
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Red Flag */}
                {feedback.redflag && (
                  <Section
                    title="Concerns"
                    icon={<UserCheck className="h-5 w-5 text-destructive" />}
                  >
                    <p className="text-destructive">{feedback.redflag}</p>
                  </Section>
                )}
              </CardContent>
            </Card>

            {/* Final Recommendation */}
            <RecommendationCard recommendation={feedback.recommendation} />
          </TabsContent>

          <TabsContent value="screenshots">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="text-primary h-5 w-5" />
                  <CardTitle>Technical Interview Screenshots</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  View screenshots taken during key moments of the technical
                  interview.
                </p>

                <ul className="space-y-3">
                  {screenshots.length > 0 ? (
                    screenshots.map((screenshot, index) => (
                      <li
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <a
                          href={screenshot.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-blue-600 dark:text-blue-400 
                           hover:underline"
                        >
                          <span className="truncate">
                            {screenshot.title ||
                              `Technical Screenshot #${index + 1}`}
                          </span>
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-8 text-muted-foreground">
                      No screenshots available for this interview.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-[#121212]">
              <CardHeader className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className=" rounded-full ">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Interview Details</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Main content area with responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                  {/* Left Column: Summary & Voice Recording */}
                  <div className="space-y-8">
                    {/* Summary Section */}
                    <div className="bg-white dark:bg-gray-900/30 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-base font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          Interview Summary
                        </h3>
                      </div>
                      <div className="p-4">
                        <ScrollArea className="h-[200px] pr-4">
                          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {summary}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>

                    {/* Voice Recording Section */}
                    <div className="bg-white dark:bg-gray-900/30 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-base font-medium flex items-center gap-2">
                          <Mic className="h-4 w-4 text-indigo-500" />
                          Voice Recording
                        </h3>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/80">
                        {/* Audio player with styled controls */}
                        <div className="rounded-lg overflow-hidden">
                          <audio
                            controls
                            className="w-full"
                            src={audio}
                            style={{
                              borderRadius: "0.5rem",
                              backgroundColor: "rgba(249, 250, 251, 0.8)",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
                            }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Screenshots */}
                  <div className="bg-white dark:bg-gray-900/30 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="text-base font-medium flex items-center gap-2">
                        <Image className="h-4 w-4 text-indigo-500" />
                        Interview Screenshots
                      </h3>
                    </div>

                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 gap-4 p-4">
                        {screenshots?.map((screenshot, index) => (
                          <div
                            key={index}
                            className="group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800"
                          >
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                  src={screenshot.url}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                              <a
                                href={screenshot?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 
                                            hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:underline"
                              >
                                <span className="flex items-center gap-2 text-sm">
                                  <span className="truncate">
                                    Screenshot #{index + 1}
                                  </span>
                                </span>
                                <ChevronRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            </div>
                          </div>
                        ))}

                        {screenshots.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-3">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              No screenshots were captured during this interview
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transcript">
            <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-[#121212] font-mono">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                      <FileText className="text-amber-600 dark:text-amber-400 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base uppercase tracking-wider">
                        Interview Transcript
                      </h3>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px]">
                  <div className="py-6 px-8 bg-[#fcfcf9] dark:bg-[#121212]">
                    <div className="max-w-3xl mx-auto space-y-5">
                      {formattedTranscript.map((entry) => {
                        const isAI = entry.speaker === "AI";
                        const isUser = entry.speaker === "User";
                        const isModerator = !isAI && !isUser;
                        return (
                          <div key={entry.key} className="space-y-1">
                            {!isModerator ? (
                              <>
                                <div className="flex">
                                  <div
                                    className={`w-1/4 pr-4 uppercase font-bold text-sm ${
                                      isAI
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-green-600 dark:text-green-400"
                                    }`}
                                  >
                                    {entry.speaker}
                                  </div>
                                  <div className="w-3/4 text-sm text-gray-800 dark:text-gray-300">
                                    {entry.text}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full text-center italic text-xs text-gray-500 dark:text-gray-400 py-1 px-3 border-t border-b border-dashed border-gray-200 dark:border-gray-700">
                                ({entry.text})
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Separator className="mb-4" />
      {children}
    </div>
  );
}

function RecommendationCard({ recommendation }) {
  const isRecommended = recommendation.verdict === "Yes";

  return (
    <Card
      className={
        isRecommended
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
      }
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <ThumbsUp
            className={`h-5 w-5 ${
              isRecommended
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          />
          <CardTitle className="text-lg">Final Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <h3
            className={`text-xl font-semibold ${
              isRecommended
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {isRecommended ? "Recommended for Hire" : "Not Recommended"}
          </h3>
          <Badge
            className={
              isRecommended
                ? "bg-green-200 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                : "bg-red-200 text-red-800 dark:bg-red-800/30 dark:text-red-300"
            }
          >
            {recommendation.verdict}
          </Badge>
        </div>
        <Separator
          className={
            isRecommended
              ? "bg-green-200 dark:bg-green-700"
              : "bg-red-200 dark:bg-red-700"
          }
        />
        <div className="mt-3">
          <p
            className={
              isRecommended
                ? "text-green-800 dark:text-green-300"
                : "text-red-800 dark:text-red-300"
            }
          >
            {recommendation.reasoning}
          </p>
          {!isRecommended && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md border border-red-100 dark:border-red-900/50">
              <h4 className="text-sm font-medium mb-1">Considerations</h4>
              <p className="text-sm text-muted-foreground">
                Consider further training or mentorship before placement in a
                technical role.
              </p>
            </div>
          )}
        </div>
        {/* AI Note */}
        <div className="text-xs text-muted-foreground text-center mt-6">
          TaleeX AI can make mistakes.
        </div>
      </CardContent>
    </Card>
  );
}
