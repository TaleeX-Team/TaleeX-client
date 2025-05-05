import React, { useState } from "react";
import { Search, FolderPlus, Building2, AlertTriangle, ShieldAlert } from "lucide-react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser.js";

export default function Companies() {
  const {
    companyData: { data: companies, isLoading, isError },
    deleteCompanyMutation,
  } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState(null);

  const { data: user } = useUser();

  const handleDelete = (company) => {
    setSelectedCompany(company);
  };

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

  // Function to render the content based on loading, error, verification status
  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompanySkeleton />
            <CompanySkeleton />
            <CompanySkeleton />
          </div>
      );
    }

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
              There was an error fetching your company data. Please try again or contact support.
            </p>
            <Button variant="outline" className="mx-auto">
              Retry
            </Button>
          </div>
      );
    }

    if (!user?.isVerified) {
      return (
          <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
            <Alert variant="warning" className="max-w-2xl mb-6 bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-medium">Account verification required</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Your account needs to be verified to access the full company management features.
                Verification helps us maintain security and provide you with all available functionality.
              </AlertDescription>
            </Alert>

            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center mb-6 border-2 border-amber-300 dark:border-amber-700">
              <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
            </div>

            <h3 className="text-2xl font-semibold mb-3 text-amber-800 dark:text-amber-300">
              Limited Access
            </h3>
            <p className="text-amber-700 dark:text-amber-400 max-w-md mb-6">
              You can browse the basic information, but you'll need to verify your account to manage companies.
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 dark:border-amber-600">
              Verify Account
            </Button>
          </div>
      );
    }

    return (
        <>
          {companies?.companies?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.companies.map((company) => (
                    <div key={company._id}>
                      <CompanyCard
                          company={company}
                          handleDelete={handleDelete}
                      />
                    </div>
                ))}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-xl border border-dashed border-muted-foreground/20">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <FolderPlus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  No companies yet
                </h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  Your company directory is empty. Add your first company to
                  get started tracking clients, partners, and opportunities.
                </p>
                <AddCompany />
              </div>
          )}
        </>
    );
  };

  return (
      <div className="bg-background p-4 md:p-8 min-h-screen">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-12 rounded-xl">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg mr-4 hidden sm:flex">
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
              <AddCompany isDisabled={!user?.isVerified} />
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-lg shadow-sm border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search companies..." className="pl-10 w-full" />
            </div>
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="favorite">Favorites</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                >
                  <path
                      d="M3.5 8.5L7.5 12.5L11.5 8.5M3.5 2.5L7.5 6.5L11.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  ></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* Company Cards */}
          <div className="relative min-h-[300px]">
            {renderContent()}
          </div>
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
  );
}