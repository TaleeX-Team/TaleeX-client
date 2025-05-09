import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  MessageSquare,
  Code2,
  Users,
  ThumbsUp,
  Image,
  ExternalLink,
  FlagIcon,
  FlagOff,
  Flag,
} from "lucide-react";
import { useState } from "react";

export default function TechnicalFeedbackPage({ screenshots = [], feedback }) {
  const [activeTab, setActiveTab] = useState("results");

  const scoreValue = parseFloat(feedback.overallScore);

  const getColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "amber";
    return "red";
  };
  const getProgressColor = (score) => {
    if (score >= 8) return "bg-green-600";
    if (score >= 6) return "bg-amber-600";
    return "bg-red-600";
  };

  const color = getColor(scoreValue);
  const progressColor = getProgressColor(scoreValue);

  return (
    <div className="min-h-screen flex  bg-background px-4">
      <div className="w-full max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Technical Interview Feedback
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="results">Evaluation Results</TabsTrigger>
            <TabsTrigger value="screenshots">Interview Screenshots</TabsTrigger>
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
                      value={scoreValue * 10}
                      className="h-3"
                      indicatorClassName={progressColor}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(feedback.rating).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between border rounded-lg p-3"
                      >
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <Badge className="bg-primary/10 text-primary">{val}/10</Badge>
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
                    icon={<MessageSquare className="h-5 w-5 text-red-700 dark:text-destructive/80" />}
                  >
                    <p className="text-red-700 dark:text-destructive/80">{feedback.redflag}</p>
                  </Section>
                )}
              </CardContent>
            </Card>

            {/* Final Recommendation */}
            <RecommendationCard recommendation={feedback.recommendation} />
            <div className="text-xs text-muted-foreground text-center mt-6">
              Generated by TaleeX AI. While we strive for accuracy, we recommend reviewing the interview overview for clarity and context.
            </div>
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
          : "border-red-200 bg-red-50 dark:border-destructive/30 dark:bg-destructive/10"
      }
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {/* <ThumbsUp
            className={`h-5 w-5 ${isRecommended
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
              }`}
          /> */}
          <CardTitle className="text-lg">Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <h3
            className={`text-xl ${isRecommended
              ? "text-green-700 dark:text-gray-200 font-semibold"
              : "text-red-700 dark:text-gray-200"
              }`}
          >
            {isRecommended ? "" : "Verdict"}
            {isRecommended ? "Recommended for Hire" : ""}
          </h3>
          <Badge
            className={
              isRecommended
                ? "bg-green-200 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                : "bg-red-200 text-red-800 dark:bg-red-700/30 dark:text-red-100"
            }
          >
            {recommendation.verdict}
          </Badge>
        </div>
        <Separator
          className={
            isRecommended
              ? "bg-green-200 dark:bg-green-100/10"
              : "bg-red-200 dark:bg-destructive/10"
          }
        />
        <div className="mt-3">
          <p
            className={
              isRecommended
                ? "text-green-800 dark:text-gray-200"
                : "text-red-800 dark:text-gray-300"
            }
          >
            {recommendation.reasoning}
          </p>
          {/* {!isRecommended && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md border border-red-100 dark:border-red-900/50">
              <h4 className="text-sm font-medium mb-1">Considerations</h4>
              <p className="text-sm text-muted-foreground">
                Consider further training or mentorship before placement in a
                technical role.
              </p>
            </div>
          )} */}
        </div>
        {/* AI Note */}
      </CardContent>
    </Card>
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