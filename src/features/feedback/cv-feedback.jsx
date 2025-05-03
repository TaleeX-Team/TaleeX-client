import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Briefcase,
  ThumbsUp,
} from "lucide-react";

export default function CVFeedbackPage({ feedback }) {
  // const feedback = {
  //   matchScore: 38,
  //   summary:
  //     "Junior web developer with MEARN stack training, strong in frontend basics, seeking entry-level roles.",
  //   requirementMatch: [
  //     {
  //       requirement: "3+ years experience with React.js",
  //       match: "No",
  //       reasoning: "No professional experience with React.js stated.",
  //       cvSectionSource: "skills",
  //     },
  //     {
  //       requirement: "Strong understanding of HTML, CSS, and JavaScript",
  //       match: "Partial",
  //       reasoning: "Skills listed but no professional work examples provided.",
  //       cvSectionSource: "skills",
  //     },
  //     {
  //       requirement: "Experience with RESTful APIs",
  //       match: "Partial",
  //       reasoning: "Backend skills suggest knowledge but no explicit project evidence.",
  //       cvSectionSource: "skills",
  //     },
  //     {
  //       requirement: "Familiarity with Git and version control workflows",
  //       match: "Yes",
  //       reasoning: "Git and GitHub experience stated clearly.",
  //       cvSectionSource: "skills",
  //     },
  //     {
  //       requirement: "Ability to work collaboratively in a team environment",
  //       match: "Partial",
  //       reasoning: "Internship experience implies teamwork but not elaborated.",
  //       cvSectionSource: "experience",
  //     },
  //   ],
  //   seniorityFit: {
  //     match: "No",
  //     reasoning: "Applicant is entry-level, position requires mid-senior experience.",
  //   },
  //   recommendation: {
  //     verdict: "No",
  //     reasoning:
  //       "Significant experience gap for role; better suited for junior or entry-level openings.",
  //   },
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-6xl space-y-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          CV Evaluation Results
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <ScoreCard score={feedback.matchScore} />
            <Section
              title="Candidate Summary"
              icon={<User className="text-primary h-5 w-5" />}
            >
              <p className="text-muted-foreground">{feedback.summary}</p>
            </Section>
            <Section
              title="Requirements Analysis"
              icon={<FileText className="text-primary h-5 w-5" />}
            >
              <RequirementsList requirements={feedback.requirementMatch} />
            </Section>
            <Section
              title="Seniority Assessment"
              icon={<Briefcase className="text-primary h-5 w-5" />}
            >
              <SeniorityCard seniorityFit={feedback.seniorityFit} />
            </Section>
          </CardContent>
        </Card>

        <RecommendationCard recommendation={feedback.recommendation} />
      </div>
    </div>
  );
}

function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 70) return "bg-green-600";
    if (score >= 40) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="text-muted-foreground">
            <div className="text-sm uppercase font-semibold">Match Score</div>
            <div className="text-xs">Overall compatibility with position</div>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="flex justify-between text-xs mb-1">
            <span>Low Match</span>
            <span>High Match</span>
          </div>
          <Progress
            value={score}
            className="h-3"
            indicatorClassName={getScoreBackground(score)}
          />
        </div>
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

function RequirementsList({ requirements }) {
  const getMatchDetails = (match) => {
    switch (match) {
      case "Yes":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          badge: <Badge className="bg-green-100 text-green-700">Meets</Badge>,
        };
      case "Partial":
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          badge: <Badge className="bg-amber-100 text-amber-700">Partial</Badge>,
        };
      default:
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          badge: <Badge className="bg-red-100 text-red-700">Missing</Badge>,
        };
    }
  };

  return (
    <div className="space-y-4">
      {requirements.map((req, idx) => {
        const { icon, badge } = getMatchDetails(req.match);
        return (
          <div
            key={idx}
            className="rounded-lg border p-4 hover:bg-muted/5 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{req.requirement}</h4>
                  {badge}
                </div>
                <p className="text-sm text-muted-foreground">{req.reasoning}</p>
                {req.cvSectionSource && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Source: {req.cvSectionSource}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SeniorityCard({ seniorityFit }) {
  const getMatchIcon = (match) => {
    switch (match) {
      case "Yes":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Partial":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{getMatchIcon(seniorityFit.match)}</div>
      <div>
        <h4 className="font-medium mb-1">
          {seniorityFit.match === "Yes"
            ? "Appropriate Seniority Level"
            : "Seniority Mismatch"}
        </h4>
        <p className="text-muted-foreground">{seniorityFit.reasoning}</p>
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

          {!isRecommended && (
            <div className="mt-4 p-3 bg-white rounded-md border border-red-100">
              <h4 className="text-sm font-medium mb-1">
                Alternative Suggestions
              </h4>
              <p className="text-sm text-muted-foreground">
                Consider this candidate for junior developer positions or
                internship opportunities where they can grow their React skills.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
