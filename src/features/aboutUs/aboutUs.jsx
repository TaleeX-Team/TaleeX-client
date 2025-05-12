import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Target,
  Users,
  MessageSquare,
  Brain,
  Shield,
  Mail,
  Zap,
  BarChart,
  FileText,
} from "lucide-react"

export default function AboutPage() {
  const targetAudience = [
    {
      icon: Users,
      title: "Business Owners",
      description: "Streamline your hiring process and find the right talent faster.",
    },
    {
      icon: Heart,
      title: "HR Professionals & Recruiters",
      description: "Get AI-powered tools that enhance your expertise, not replace it.",
    },
    {
      icon: Target,
      title: "Growing Startups & Mid-sized Companies",
      description: "Scale your recruitment efforts without scaling your team.",
    },
  ]

  const features = [
    {
      icon: FileText,
      title: "Company Profile Management",
      description: "Shape AI evaluation based on your company values and hiring criteria.",
    },
    {
      icon: Brain,
      title: "AI CV Reviewing",
      description: "Goes beyond keyword-matching to analyze true relevance and culture fit.",
    },
    {
      icon: MessageSquare,
      title: "AI-powered Interview",
      description: "Real-time, adaptive interviews personalized for each role.",
    },
    {
      icon: BarChart,
      title: "AI Feedback",
      description: "Behavioral insights, technical clarity, and structured hiring feedback.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Verified companies, candidate protections, and full control.",
    },
    {
      icon: Mail,
      title: "Smarter Communication",
      description: "One-click rejections, follow-ups, and branded engagement emails.",
    },
    {
      icon: Zap,
      title: "Talent Re-Routing",
      description: "Easily reassign candidates to more suitable roles.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-background dark:to-muted text-foreground">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-muted dark:to-muted/60 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              "We're not replacing the recruiter. We're giving them superpowers."
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              An AI-driven platform that makes recruitment faster, smarter, and fairer for everyone.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 px-8">
              Transform Your Hiring
            </Button>
          </div>
        </div>
      </section>

      {/* What is Taleex */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">What is Taleex?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            An AI hiring platform that simplifies job management, screening, and communication—all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Job Application Management",
                desc: "Filter, organize, and respond to applicants effortlessly.",
              },
              {
                title: "AI CV Matching & Interviews",
                desc: "Use AI for smarter screening and personalized interviews.",
              },
              {
                title: "Candidate Communication",
                desc: "Update, reject, or engage candidates with minimal effort.",
              },
            ].map((item, i) => (
              <Card key={i} className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Who Taleex Empowers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Designed for modern teams and hiring professionals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targetAudience.map(({ icon: Icon, title, description }, i) => (
              <Card key={i} className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-muted dark:to-muted flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-muted dark:to-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Unlock your recruiting potential with these intelligent tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Card key={i} className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-muted dark:to-muted flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">What’s Coming Next</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            A glimpse of what we’re building for tomorrow’s recruiters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Brain, label: "AI Assessments & Exams" },
              { icon: MessageSquare, label: "Tone & Body Language Analysis" },
              { icon: Zap, label: "Slack, Zoom, ATS Integrations" },
              { icon: FileText, label: "Job Description Curation" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-muted dark:to-muted rounded-lg">
                <Icon className="h-10 w-10 text-blue-600 mb-4" />
                <p className="text-center font-medium text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
