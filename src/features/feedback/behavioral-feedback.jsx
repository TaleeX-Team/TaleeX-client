import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  UserCheck,
  ThumbsUp,
  MessageSquare,
  HeartHandshake,
  Smile,
  Users,
} from "lucide-react";

export default function BehavioralFeedbackPage() {
  const feedback = {
    type: "behavioral",
    rating: {
      communication: "9",
      professionalism: "9",
      attitude: "9",
      culturalFit: "8",
    },
    overallScore: "8.75",
    summary:
      "Strong communicator with proactive conflict resolution and ownership of mistakes. Demonstrates maturity and team alignment but could show more emphasis on user empathy in responses.",
    redflag: "None observed.",
    recommendation: {
      verdict: "Yes",
      reasoning:
        "The candidate shows professionalism, self-awareness, and collaborative strength, aligning well with team-oriented and ownership-driven company culture.",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Behavioral Evaluation Results
        </h1>

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
              <p className="text-sm text-muted-foreground">{feedback.redflag}</p>
            </Section>
          </CardContent>
        </Card>

        <RecommendationCard recommendation={feedback.recommendation} />
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
    professionalism: <HeartHandshake className="h-4 w-4 text-muted-foreground" />,
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
    if (val >= 8) return "green";
    if (val >= 6) return "amber";
    return "red";
  };

  const color = getColor(num);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`text-5xl font-bold text-${color}-600`}>
          {score}
        </div>
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
          indicatorClassName={`bg-${color}-600`}
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
            className={`h-5 w-5 ${isRecommended ? "text-green-600" : "text-red-600"}`}
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
