"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./about-tab";
import JobsTab from "./jobs-tab";
import Header from "./header";
import { useCompanies } from "../features";
import { useJobs } from "@/features/jobs/useJobs";
import { useTranslation } from "react-i18next";

export default function CompanyDetails() {
  const queryClient = useQueryClient();
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("about");
  const { companyData } = useCompanies();
  const { jobsQuery } = useJobs();

  // Get current company by finding it using the companyId
  const companies = queryClient.getQueryData(["companies"])?.companies || [];
  const company = companies.find((company) => company?._id === companyId);

  const jobs2 =
    jobsQuery.data?.jobs?.filter((job) => job?.company?._id === companyId) ||
    [];

  // Loading state
  const isLoading = !queryClient.getQueryData(["companies"]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-64 bg-muted animate-pulse rounded-lg mb-8"></div>
          <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("companies.backToCompanies")}
          </Button>

          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">{t("companies.companyNotFound")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("companies.companyNotExist")}
            </p>
            <Button onClick={() => navigate("/")}>{t("companies.returnToDirectory")}</Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    name = "",
    _id,
    description = "",
    website = "",
    image = null,
    address = {},
    values = [],
    verification = {},
  } = company;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8 mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("companies.backToCompanies")}
          </Button>
        </div>

        {/* Company header */}
        <Header
          name={name}
          image={image}
          website={website}
          address={address}
          verification={verification}
        />

        {/* Tabs for company info and jobs */}
        <Tabs
          defaultValue="about"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 dark:bg-card">
            <TabsTrigger value="about">{t("companies.aboutTab")}</TabsTrigger>
            <TabsTrigger value="jobs">
              {t("companies.jobsTab")} ({jobs2?.length})
            </TabsTrigger>
          </TabsList>

          <AboutTab
            description={description}
            values={values}
            website={website}
            address={address}
            name={name}
            verification={verification}
          />
          {/* Jobs tab */}
          <JobsTab jobs={jobs2} verification={verification} />
        </Tabs>
      </div>
    </div>
  );
}
