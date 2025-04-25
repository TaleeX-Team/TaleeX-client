import { Search, FolderPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import CompanyCard from "./company-card/CompanyCard";
import AddCompany from "./modals/add-company";
import { useCompanies } from "./features";
import { CompanySkeleton } from "./company-skeleton";

export default function Companies() {
  const {
    companyData: { data: companies, isLoading, isError },
  } = useCompanies();

  return (
    <div className="bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Companies
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
              </svg>
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <AddCompany />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search companies..." className="pl-10 w-full" />
          </div>
        </div>

        {/* Company Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompanySkeleton />
            <CompanySkeleton />
            <CompanySkeleton />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500">
            <h2>Error loading companies. Please try again later.</h2>
          </div>
        )}
        {!isLoading && !isError && (
          <>
            {companies?.companies?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.companies.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FolderPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No companies yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Your company directory is empty. Add your first company to get
                  started.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
