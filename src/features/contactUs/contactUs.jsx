import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Phone } from "lucide-react";
import Footer from "../footer";
import AboutContactHeader from "../about-contact-header/Header";
import { useTranslation } from "react-i18next";  // Import i18n hook

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const { t } = useTranslation(); // Initialize translation hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <AboutContactHeader />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-muted/40 to-muted text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t("contactPage.heroTitle")}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t("contactPage.heroDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("contactPage.contactOptionsTitle")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("contactPage.contactOptionsDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
              {[
                {
                  icon: Phone,
                  label: t("contactPage.callUs"),
                  text: t("contactPage.callUsDescription"),
                  href: "tel:+201004198987",
                },
                {
                  icon: Mail,
                  label: t("contactPage.emailUs"),
                  text: t("contactPage.emailUsDescription"),
                  href: "mailto:taleex.app@gmail.com",
                },
              ].map(({ icon: Icon, label, text, href }, i) => (
                <Card
                  key={i}
                  className="shadow-sm hover:shadow-md transition-shadow text-center bg-background border border-border"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{label}</h3>
                    <p className="text-muted-foreground mb-2">{text}</p>
                    <a
                      href={href}
                      className="text-primary font-medium hover:underline"
                    >
                      {href.replace(/mailto:|tel:/, "")}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form Section */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {t("contactPage.formTitle")}
              </h2>
              {formSubmitted ? (
                <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                    {t("contactPage.messageSent")}
                  </h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    {t("contactPage.messageSentDescription", { email: formData.email })}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFormSubmitted(false)}
                  >
                    {t("contactPage.sendAnotherMessage")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contactPage.nameLabel")}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contactPage.emailLabel")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t("contactPage.companyLabel")}</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contactPage.subjectLabel")}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contactPage.messageLabel")}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  >
                    {t("contactPage.sendMessageButton")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
