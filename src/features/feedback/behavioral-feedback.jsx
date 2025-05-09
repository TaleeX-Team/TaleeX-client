import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  UserCheck,
  ThumbsUp,
  MessageSquare,
  HeartHandshake,
  Smile,
  Users,
  Image,
  ExternalLink,
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BehavioralFeedbackPage({
  feedback,
  screenshots = [],
  transcriptText,
}) {
  const [activeTab, setActiveTab] = useState("results");
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
  const getSpeakerBadgeStyle = (speaker) => {
    switch (speaker) {
      case "AI":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "User":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  return (
    <div className="min-h-screen flex bg-background px-4">
      <div className="w-full max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Behavioral Evaluation Results
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="results">Evaluation Results</TabsTrigger>
            <TabsTrigger value="transcript">Interview Transcript</TabsTrigger>
            <TabsTrigger value="screenshots">Interview Screenshots</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Behavioral Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <ScoreCard score={feedback.overallScore} />

                <Section
                  title="Candidate Summary"
                  icon={<UserCheck className="text-primary h-5 w-5" />}
                >
                  <p className="text-muted-foreground">{feedback.summary}</p>
                </Section>

                <Section
                  title="Attribute Ratings"
                  icon={<Users className="text-primary h-5 w-5" />}
                >
                  <AttributeList rating={feedback.rating} />
                </Section>

                <Section
                  title="Red Flags"
                  icon={<MessageSquare className="text-primary h-5 w-5" />}
                >
                  <p className="text-sm text-muted-foreground">
                    {feedback.redflag}
                  </p>
                </Section>
              </CardContent>
            </Card>

            <RecommendationCard recommendation={feedback.recommendation} />
          </TabsContent>

          <TabsContent value="transcript">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Interview Transcript</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete transcript of the candidate's interview session.
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {formattedTranscript.map((entry) => (
                      <div key={entry.key} className="group">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`${getSpeakerBadgeStyle(entry.speaker)}`}
                          >
                            {entry.speaker}
                          </Badge>
                        </div>
                        <div className="pl-1 text-sm">{entry.text}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="screenshots">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="text-primary h-5 w-5" />
                  <CardTitle>Interview Screenshots</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  View screenshots taken during key moments of the interview.
                </p>

                <ul className="space-y-3">
                  {screenshots?.map((screenshot, index) => (
                    <li
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 
               hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <a
                        href={screenshot?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-blue-600 dark:text-blue-400 
                 hover:underline"
                      >
                        <span className="truncate">
                          View Screenshot #{index + 1}
                        </span>
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </li>
                  ))}
                </ul>
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

function AttributeList({ rating }) {
  const attributes = {
    communication: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
    professionalism: (
      <HeartHandshake className="h-4 w-4 text-muted-foreground" />
    ),
    attitude: <Smile className="h-4 w-4 text-muted-foreground" />,
    culturalFit: <Users className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(rating).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between border rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            {attributes[key]}
            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
          </div>
          <Badge className="bg-primary/10 text-primary">{value}/10</Badge>
        </div>
      ))}
    </div>
  );
}

function ScoreCard({ score }) {
  const num = parseFloat(score);
  const getColor = (val) => {
    if (val >= 8) return "text-green-600";
    if (val >= 6) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (val) => {
    if (val >= 8) return "bg-green-600";
    if (val >= 6) return "bg-amber-600";
    return "bg-red-600";
  };

  const color = getColor(num);
  const progressColor = getProgressColor(num);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`text-5xl font-bold ${color}`}>{score}</div>
        <div className="text-muted-foreground">
          <div className="text-sm uppercase font-semibold">Overall Score</div>
          <div className="text-xs">Behavioral compatibility</div>
        </div>
      </div>
      <div className="w-full md:w-2/3">
        <div className="flex justify-between text-xs mb-1">
          <span>Needs Work</span>
          <span>Excellent</span>
        </div>
        <Progress
          value={num * 10}
          className="h-3"
          indicatorClassName={progressColor}
        />
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }) {
  const isRecommended = recommendation.verdict === "Yes";

  return (
    <Card
      className={
        isRecommended
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <ThumbsUp
            className={`h-5 w-5 ${
              isRecommended ? "text-green-600" : "text-red-600"
            }`}
          />
          <CardTitle className="text-lg">Final Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <h3
            className={`text-xl font-semibold ${
              isRecommended ? "text-green-700" : "text-red-700"
            }`}
          >
            {isRecommended ? "Recommended for Hire" : "Not Recommended"}
          </h3>
          <Badge
            className={
              isRecommended
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }
          >
            {recommendation.verdict}
          </Badge>
        </div>

        <Separator className={isRecommended ? "bg-green-200" : "bg-red-200"} />

        <div className="mt-3">
          <p className={isRecommended ? "text-green-800" : "text-red-800"}>
            {recommendation.reasoning}
          </p>
        </div>
      </CardContent>
      {/* AI Note */}
      <div className="text-xs text-muted-foreground text-center mt-6">
        TaleeX AI can make mistakes.
      </div>
    </Card>
  );
}

function Badge({ className, children }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}

function Progress({ value, className, indicatorClassName }) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/10 ${className}`}
    >
      <div
        className={`h-full ${indicatorClassName}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
