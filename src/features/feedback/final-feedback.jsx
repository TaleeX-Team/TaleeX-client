import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, MessageSquare, AlertTriangle, Sparkles } from "lucide-react";

export default function FinalFeedbackPage({ feedback }) {
  // const feedback = {
  //   overallRating: "7",
  //   summary:
  //     "The candidate demonstrates strong adaptability and teamwork but lacks depth in technical leadership. Suitable for mid-level roles with growth potential.",
  //   finalVerdict: "Maybe",
  //   reasoning:
  //     "Shows promise but needs mentorship to bridge gaps in architecture-level decision making.",
  //   riskFactors: [
  //     "Limited experience with large-scale systems.",
  //     "May require close onboarding supervision.",
  //   ],
  //   highlights: [
  //     "Collaborative and team-focused.",
  //     "Quick learner with growth mindset.",
  //   ],
  // };

  const score = parseFloat(feedback.overallRating);
  const getColor = (val) => {
    if (val >= 8) return "green";
    if (val >= 5) return "amber";
    return "red";
  };
  const color = getColor(score);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Final Candidate Feedback
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Score */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`text-5xl font-bold text-${color}-600`}>
                  {score}
                </div>
                <div className="text-muted-foreground">
                  <div className="text-sm uppercase font-semibold">
                    Overall Rating
                  </div>
                  <div className="text-xs">Evaluator's numeric assessment</div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <Progress
                  value={(score / 10) * 100}
                  className="h-3"
                  indicatorClassName={`bg-${color}-600`}
                />
              </div>
            </div>

            {/* Summary */}
            <Section
              title="Summary"
              icon={<MessageSquare className="h-5 w-5 text-primary" />}
            >
              <p className="text-muted-foreground text-sm">
                {feedback.summary}
              </p>
            </Section>

            {/* Verdict */}
            <Section
              title="Final Verdict"
              icon={<ThumbsUp className="h-5 w-5 text-primary" />}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`bg-${color}-200 text-${color}-800 capitalize`}
                >
                  {feedback.finalVerdict}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {feedback.reasoning}
              </p>
            </Section>

            {/* Risks */}
            {feedback.riskFactors?.length > 0 && (
              <Section
                title="Risk Factors"
                icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
              >
                <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                  {feedback.riskFactors.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Highlights */}
            {feedback.highlights?.length > 0 && (
              <Section
                title="Highlights"
                icon={<Sparkles className="h-5 w-5 text-green-600" />}
              >
                <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                  {feedback.highlights.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* AI Note */}
            <div className="text-xs text-muted-foreground text-center mt-6">
              TaleeX AI can make mistakes.
            </div>
          </CardContent>
        </Card>
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
