import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import AboutContactHeader from "../about-contact-header/Header";
import Footer from "../footer";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  const targetAudience = [
    {
      icon: Users,
      title: t("aboutPage.targetAudience.businessOwners.title"),
      description: t("aboutPage.targetAudience.businessOwners.description"),
    },
    {
      icon: Heart,
      title: t("aboutPage.targetAudience.hrProfessionals.title"),
      description: t("aboutPage.targetAudience.hrProfessionals.description"),
    },
    {
      icon: Target,
      title: t("aboutPage.targetAudience.startups.title"),
      description: t("aboutPage.targetAudience.startups.description"),
    },
  ];

  const features = [
    {
      icon: FileText,
      title: t("aboutPage.features.companyProfile.title"),
      description: t("aboutPage.features.companyProfile.description"),
    },
    {
      icon: Brain,
      title: t("aboutPage.features.aiCV.title"),
      description: t("aboutPage.features.aiCV.description"),
    },
    {
      icon: MessageSquare,
      title: t("aboutPage.features.aiInterview.title"),
      description: t("aboutPage.features.aiInterview.description"),
    },
    {
      icon: BarChart,
      title: t("aboutPage.features.aiFeedback.title"),
      description: t("aboutPage.features.aiFeedback.description"),
    },
    {
      icon: Shield,
      title: t("aboutPage.features.trustTransparency.title"),
      description: t("aboutPage.features.trustTransparency.description"),
    },
    {
      icon: Mail,
      title: t("aboutPage.features.smarterCommunication.title"),
      description: t("aboutPage.features.smarterCommunication.description"),
    },
    {
      icon: Zap,
      title: t("aboutPage.features.talentReRouting.title"),
      description: t("aboutPage.features.talentReRouting.description"),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-background dark:to-muted text-foreground">
        <AboutContactHeader />
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-muted dark:to-muted/60 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("aboutPage.heroQuote")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t("aboutPage.heroDescription")}
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 px-8">
                {t("aboutPage.transformButton")}
              </Button>
            </div>
          </div>
        </section>

        {/* What is Taleex */}
        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{t("aboutPage.whatIsTaleexTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              {t("aboutPage.whatIsTaleexDescription")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: t("aboutPage.featuress.jobApplicationManagement.title"),
                  desc: t("aboutPage.featuress.jobApplicationManagement.desc"),
                },
                {
                  title: t("aboutPage.featuress.aiCVMatching.title"),
                  desc: t("aboutPage.featuress.aiCVMatching.desc"),
                },
                {
                  title: t("aboutPage.featuress.candidateCommunication.title"),
                  desc: t("aboutPage.featuress.candidateCommunication.desc"),
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow"
                >
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
            <h2 className="text-3xl font-bold mb-4">{t("aboutPage.targetAudienceTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t("aboutPage.targetAudienceDescription")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {targetAudience.map(({ icon: Icon, title, description }, i) => (
                <Card
                  key={i}
                  className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow"
                >
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
            <h2 className="text-3xl font-bold mb-4">{t("aboutPage.featuresTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t("aboutPage.featuresDescription")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map(({ icon: Icon, title, description }, i) => (
                <Card
                  key={i}
                  className="bg-white dark:bg-muted border shadow-sm hover:shadow-md transition-shadow"
                >
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
            <h2 className="text-3xl font-bold mb-4">{t("aboutPage.comingSoonTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t("aboutPage.comingSoonDescription")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Brain, label: t("aboutPage.comingSoon.aiAssessments") },
                { icon: MessageSquare, label: t("aboutPage.comingSoon.toneAnalysis") },
                { icon: Zap, label: t("aboutPage.comingSoon.slackZoomIntegrations") },
                { icon: FileText, label: t("aboutPage.comingSoon.jobDescription") },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-muted dark:to-muted rounded-lg"
                >
                  <Icon className="h-10 w-10 text-blue-600 mb-4" />
                  <p className="text-center font-medium text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
