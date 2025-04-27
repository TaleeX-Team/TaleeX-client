import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Sample job data
const jobs = [
    {
        id: "1",
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        type: "Full-time",
        status: "active",
        applicants: 24,
        posted: "5 days ago"
    },
    {
        id: "2",
        title: "Product Manager",
        company: "InnovateCorp",
        location: "New York, NY",
        type: "Full-time",
        status: "active",
        applicants: 42,
        posted: "2 days ago"
    },
    {
        id: "3",
        title: "DevOps Engineer",
        company: "Cloud Systems",
        location: "Remote",
        type: "Contract",
        status: "closed",
        applicants: 16,
        posted: "2 weeks ago"
    },
    {
        id: "4",
        title: "UX/UI Designer",
        company: "Creative Labs",
        location: "Los Angeles, CA",
        type: "Part-time",
        status: "active",
        applicants: 31,
        posted: "3 days ago"
    },
    {
        id: "5",
        title: "Backend Developer",
        company: "Data Dynamics",
        location: "Austin, TX",
        type: "Full-time",
        status: "draft",
        applicants: 0,
        posted: "Not published"
    },
    {
        id: "6",
        title: "Marketing Specialist",
        company: "GrowthHub",
        location: "Chicago, IL",
        type: "Full-time",
        status: "active",
        applicants: 17,
        posted: "1 week ago"
    },
    {
        id: "7",
        title: "Data Scientist",
        company: "Analytics Pro",
        location: "Remote",
        type: "Full-time",
        status: "active",
        applicants: 29,
        posted: "4 days ago"
    },
    {
        id: "8",
        title: "Customer Support Specialist",
        company: "ServiceNow",
        location: "Boston, MA",
        type: "Full-time",
        status: "closed",
        applicants: 52,
        posted: "3 weeks ago"
    },
];

const JobsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const filteredJobs = jobs.filter(job => {
        // Search filter
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === "all" || job.status === statusFilter;

        // Type filter
        const matchesType = typeFilter === "all" || job.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Job
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search jobs..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32 sm:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-32 sm:w-40">
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Remote">Remote</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Jobs table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Job Title</th>
                                <th className="px-4 py-3 text-left font-medium">Company</th>
                                <th className="px-4 py-3 text-left font-medium">Location</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Applicants</th>
                                <th className="px-4 py-3 text-left font-medium">Posted</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="border-t border-border hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{job.title}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{job.company}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                                    <td className="px-4 py-3">{job.type}</td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                job.status === "active" ? "default" :
                                                    job.status === "closed" ? "secondary" :
                                                        "outline"
                                            }
                                            className={
                                                job.status === "active" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
                                                    job.status === "closed" ? "bg-gray-500/20 text-gray-600 hover:bg-gray-500/30" :
                                                        "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30"
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{job.applicants}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{job.posted}</td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit job</DropdownMenuItem>
                                                <DropdownMenuItem>View applicants</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete job
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
};

export default JobsPage;