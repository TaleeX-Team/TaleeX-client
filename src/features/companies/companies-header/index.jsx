import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCompany from "../modals/add-company";
import { useTranslation } from "react-i18next";

export default function CompaniesHeader({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-12 rounded-xl">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-lg mr-4 hidden sm:flex">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {t("companies.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("companies.description")}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <AddCompany />
        </div>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-lg shadow-sm border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("companies.searchPlaceholder")}
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("companies.filter.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("companies.filter.all")}</SelectItem>
            <SelectItem value="verified">{t("companies.filter.verified")}</SelectItem>
            <SelectItem value="pending">{t("companies.filter.pending")}</SelectItem>
            <SelectItem value="rejected">{t("companies.filter.rejected")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
