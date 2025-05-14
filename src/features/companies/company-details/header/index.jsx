import { Button } from "@/components/ui/button";
import { Edit, Globe, MapPin } from "lucide-react";
import React from "react";
import VerifyCompany from "../../modals/verify-company";
import { Badge } from "@/components/ui/badge";
import { statusBadgeStyles } from "@/utils/statusBadgeStyles";
import { StatusIcon } from "@/components/StatusIcon";
import { useTranslation } from "react-i18next";

export default function Header({
  image,
  name,
  address,
  website,
  verification,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="h-20 w-20 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl">
          {image ? (
            <img
              src={image}
              alt={`${name} logo`}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            name.substring(0, 2)
          )}
        </div>

        <div className="flex-1 flex-row items-center ">
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">{name}</h1>
            {verification?.status && (
              <Badge className={statusBadgeStyles[verification?.status]}>
                <StatusIcon status={verification?.status} />
                {t(`companies.verificationStatus.${verification?.status}`)}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {address}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {verification.status === "pending" && <VerifyCompany />}
        </div>
      </div>
    </div>
  );
}
