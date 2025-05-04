import {
    Badge,
  } from "@/components/ui/badge";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Separator,
  } from "@/components/ui/separator";
  import {
    Progress,
  } from "@/components/ui/progress";
  import {
    UserCheck,
    MessageSquare,
    Code2,
    Users,
    ThumbsUp,
  } from "lucide-react";
  
  export default function TechnicalFeedbackPage() {
    const feedback = {
      type: "technical",
      rating: {
        technicalSkills: "2",
        communication: "2",
        experience: "3",
        teamwork: "3",
      },
      overallScore: "2.5",
      summary: "Candidate showed minimal technical detail and avoided core questions. Communication lacked clarity and engagement.",
      technicalSkills: {
        keywords: ["React", "CSS", "UI", "Selenium", "Jest"],
      },
      redflag: "Avoided key questions, unclear responses.",
      recommendation: {
        verdict: "No",
        reasoning:
          "Insufficient demonstration of technical depth, poor engagement, and unclear communication raise concerns about job readiness.",
      },
    };
  
    const scoreValue = parseFloat(feedback.overallScore);
  
    const getColor = (score) => {
      if (score >= 4) return "green";
      if (score >= 3) return "amber";
      return "red";
    };
  
    const color = getColor(scoreValue);
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-4xl space-y-6 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Technical Interview Feedback
          </h1>
  
          <Card>
            <CardHeader>
              <CardTitle>Candidate Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Overall Score */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`text-5xl font-bold text-${color}-600`}>
                    {scoreValue}
                  </div>
                  <div className="text-muted-foreground">
                    <div className="text-sm uppercase font-semibold">
                      Overall Score
                    </div>
                    <div className="text-xs">Based on technical assessment</div>
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
                    indicatorClassName={`bg-${color}-600`}
                  />
                </div>
              </div>
  
              {/* Summary */}
              <Section title="Summary" icon={<MessageSquare className="h-5 w-5 text-primary" />}>
                <p className="text-muted-foreground">{feedback.summary}</p>
              </Section>
  
              {/* Ratings */}
              <Section title="Category Ratings" icon={<Users className="h-5 w-5 text-primary" />}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(feedback.rating).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b pb-1">
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
                <Section title="Concerns" icon={<UserCheck className="h-5 w-5 text-destructive" />}>
                  <p className="text-destructive">{feedback.redflag}</p>
                </Section>
              )}
            </CardContent>
          </Card>
  
          {/* Final Recommendation */}
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
  
  function RecommendationCard({ recommendation }) {
    const isRecommended = recommendation.verdict === "Yes";
  
    return (
      <Card
        className={
          isRecommended ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
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
          <Separator
            className={isRecommended ? "bg-green-200" : "bg-red-200"}
          />
          <div className="mt-3">
            <p className={isRecommended ? "text-green-800" : "text-red-800"}>
              {recommendation.reasoning}
            </p>
            {!isRecommended && (
              <div className="mt-4 p-3 bg-white rounded-md border border-red-100">
                <h4 className="text-sm font-medium mb-1">Considerations</h4>
                <p className="text-sm text-muted-foreground">
                  Consider further training or mentorship before placement in a technical role.
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
  