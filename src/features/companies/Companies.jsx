import React, { useState } from "react";
import { Search, FolderPlus, Building2, AlertCircle, AlertTriangle, FileX } from "lucide-react";
import { Input } from "@/components/ui/input";
import CompanyCard from "./company-card/CompanyCard";
import AddCompany from "./modals/add-company";
import { useCompanies } from "./features";
import { CompanySkeleton } from "./company-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CompaniesHeader from "./companies-header";
import VerifyLayout from "@/components/ui/VerifyLayout";

export default function Companies() {
  const {
    companyData: { data: companies, isLoading, isError },
    deleteCompanyMutation,
  } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useUser();

  const handleDelete = (company) => setSelectedCompany(company);

  const confirmDelete = () => {
    if (selectedCompany) {
      deleteCompanyMutation.mutate(selectedCompany._id, {
        onSuccess: () => {
          toast.success("Company deleted successfully!");
          setSelectedCompany(null);
        },
        onError: (error) => {
          console.error("Error deleting company:", error);
          toast.error(
            error.response?.data?.message ||
            "Failed to delete company. Please try again."
          );
        },
      });
    }
  };

  const filteredCompanies =
    companies?.companies?.filter((company) => {
      const matchesStatus =
        selectedStatus === "all" ||
        company.verification?.status === selectedStatus;
      const matchesSearch = company.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];
  if (isError && user.isVerified) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 rounded-lg border border-destructive/20 p-4 z-50">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-destructive mb-2">
          Error loading companies
        </h2>
        <p className="text-muted-foreground mb-4">
          There was an error fetching your company data. Please try again or
          contact support.
        </p>
        <Button variant="outline" className="mx-auto">
          Retry
        </Button>
      </div>
    );
  }
  if (!user?.isVerified) {
    return (
      <div className="bg-background p-4 md:p-8 min-h-screen">
        <div className="mx-auto max-w-7xl">
          <CompaniesHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
          <VerifyLayout />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-12  rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/10 dark:bg-secondary/50 p-3 rounded-lg mr-4 hidden sm:flex">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Companies
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your company directory
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
              placeholder="Search companies..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Company Cards */}
        <div className="relative min-h-[300px]">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CompanySkeleton />
              <CompanySkeleton />
              <CompanySkeleton />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center bg-destructive/5 rounded-lg border border-dashed border-destructive/20 z-50 pt-9 pb-6">
              <div className="mx-auto w-17 h-17 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-9 w-9 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Error loading companies
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xs">
                There was an error fetching your company data. Please try again or
                contact support.
              </p>
              <Button variant="outline" className="mx-auto">
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <CompanyCard
                      key={company._id}
                      company={company}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <FileX className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No companies found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    No companies match your current filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog
          open={!!selectedCompany}
          onOpenChange={() => setSelectedCompany(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedCompany?.name || "this company"}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                company and all related data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
