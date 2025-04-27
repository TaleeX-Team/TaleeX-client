import {useState} from 'react';
import {Search, Plus, Check, X, ExternalLink, MoreHorizontal, Filter, ArrowUpDown, Edit, Trash2} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';


const initialCompanies = [
    {
        _id: "65a1bfae1f3a0b7b7c7a1234",
        createdBy: "65a1bfae1f3a0b7b7c7a1234",
        name: "Microsoft",
        address: "One Microsoft Way, Redmond, WA 98052",
        website: "https://www.microsoft.com",
        description: "A leading technology company specializing in software development",
        values: ["Innovation", "Integrity", "Diversity"],
        image: "65a1bfae1f3a0b7b7c7a1234",
        verification: {
            method: "domain",
            status: "verified",
            domain: "microsoft.com",
            email: "admin@microsoft.com",
            document: "65a1bfae1f3a0b7b7c7a1234",
            code: "ABCD123",
            codeExpires: "2024-01-20T12:00:00.000Z",
            reason: "Document expired",
            reviewedBy: "65a1bfae1f3a0b7b7c7a1234",
            reviewedDate: "2024-01-18T09:30:00.000Z"
        }
    },
    {
        _id: "65a1bfae1f3a0b7b7c7a1235",
        createdBy: "65a1bfae1f3a0b7b7c7a1235",
        name: "Apple",
        address: "One Apple Park Way, Cupertino, CA 95014",
        website: "https://www.apple.com",
        description: "A multinational technology company that designs and develops consumer electronics",
        values: ["Innovation", "Quality", "Simplicity"],
        image: "65a1bfae1f3a0b7b7c7a1235",
        verification: {
            method: "email",
            status: "pending",
            domain: "apple.com",
            email: "verify@apple.com",
            document: null,
            code: "XYZ789",
            codeExpires: "2024-01-25T12:00:00.000Z",
            reason: null,
            reviewedBy: null,
            reviewedDate: null
        }
    },
    {
        _id: "65a1bfae1f3a0b7b7c7a1236",
        createdBy: "65a1bfae1f3a0b7b7c7a1236",
        name: "Google",
        address: "1600 Amphitheatre Parkway, Mountain View, CA 94043",
        website: "https://www.google.com",
        description: "A technology company specializing in internet-related services and products",
        values: ["Focus on the user", "Do the right thing", "Think big"],
        image: "65a1bfae1f3a0b7b7c7a1236",
        verification: {
            method: "document",
            status: "rejected",
            domain: "google.com",
            email: "admin@google.com",
            document: "65a1bfae1f3a0b7b7c7a1236",
            code: null,
            codeExpires: null,
            reason: "Invalid document provided",
            reviewedBy: "65a1bfae1f3a0b7b7c7a1234",
            reviewedDate: "2024-01-15T14:20:00.000Z"
        }
    },
    {
        _id: "65a1bfae1f3a0b7b7c7a1237",
        createdBy: "65a1bfae1f3a0b7b7c7a1237",
        name: "Amazon",
        address: "410 Terry Ave N, Seattle, WA 98109",
        website: "https://www.amazon.com",
        description: "An e-commerce and cloud computing company",
        values: ["Customer obsession", "Ownership", "Innovation"],
        image: "65a1bfae1f3a0b7b7c7a1237",
        verification: {
            method: "domain",
            status: "verified",
            domain: "amazon.com",
            email: "verify@amazon.com",
            document: "65a1bfae1f3a0b7b7c7a1237",
            code: "EFGH456",
            codeExpires: "2024-01-22T12:00:00.000Z",
            reason: null,
            reviewedBy: "65a1bfae1f3a0b7b7c7a1234",
            reviewedDate: "2024-01-17T11:45:00.000Z"
        }
    },
    {
        _id: "65a1bfae1f3a0b7b7c7a1238",
        createdBy: "65a1bfae1f3a0b7b7c7a1238",
        name: "Tesla",
        address: "3500 Deer Creek Rd, Palo Alto, CA 94304",
        website: "https://www.tesla.com",
        description: "An electric vehicle and clean energy company",
        values: ["Sustainability", "Innovation", "Excellence"],
        image: "65a1bfae1f3a0b7b7c7a1238",
        verification: {
            method: "email",
            status: "pending",
            domain: "tesla.com",
            email: "verify@tesla.com",
            document: null,
            code: "IJKL789",
            codeExpires: "2024-01-24T12:00:00.000Z",
            reason: null,
            reviewedBy: null,
            reviewedDate: null
        }
    }
];

// Status badge component
const StatusBadge = ({status}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'verified':
                return {
                    icon: <Check size={12}/>,
                    bg: 'bg-green-50 dark:bg-green-900/30',
                    text: 'text-green-600 dark:text-green-300',
                    border: 'border-green-100 dark:border-green-800'
                };
            case 'pending':
                return {
                    icon: null,
                    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
                    text: 'text-yellow-600 dark:text-yellow-300',
                    border: 'border-yellow-100 dark:border-yellow-800'
                };
            case 'rejected':
                return {
                    icon: <X size={12}/>,
                    bg: 'bg-red-50 dark:bg-red-900/30',
                    text: 'text-red-600 dark:text-red-300',
                    border: 'border-red-100 dark:border-red-800'
                };
            default:
                return {
                    icon: null,
                    bg: 'bg-gray-50 dark:bg-gray-900/30',
                    text: 'text-gray-600 dark:text-gray-300',
                    border: 'border-gray-100 dark:border-gray-800'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {config.icon}
            <span className="capitalize">{status}</span>
        </div>
    );
};
// Main component
export default function CompaniesManagement() {
    const [companies, setCompanies] = useState(initialCompanies);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        address: '',
        website: '',
        description: '',
        values: [],
        verification: {
            method: 'email',
            status: 'pending',
            domain: '',
            email: ''
        }
    });
    const [tempValue, setTempValue] = useState('');

    // Filtered companies based on search and status filter
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || company.verification.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Handle company verification
    const handleVerifyCompany = (companyId) => {
        setCompanies(prevCompanies =>
            prevCompanies.map(company =>
                company._id === companyId
                    ? {
                        ...company,
                        verification: {...company.verification, status: 'verified', reviewedDate: new Date().toISOString()}
                    }
                    : company
            )
        );
        setSuccessMessage('Company successfully verified');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    // Handle company rejection
    const handleRejectCompany = (companyId) => {
        setCompanies(prevCompanies =>
            prevCompanies.map(company =>
                company._id === companyId
                    ? {
                        ...company,
                        verification: {
                            ...company.verification,
                            status: 'rejected',
                            reviewedDate: new Date().toISOString(),
                            reason: "Rejected by admin"
                        }
                    }
                    : company
            )
        );
        setSuccessMessage('Company rejection processed');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    // Handle adding a new company
    const handleAddCompany = () => {
        // Generate simple ID for new company
        const newId = `new-${Date.now()}`;

        // Extract domain from website
        const domainMatch = newCompany.website.match(/^https?:\/\/(?:www\.)?([^/]+)/i);
        const domain = domainMatch ? domainMatch[1] : '';

        const companyToAdd = {
            ...newCompany,
            _id: newId,
            createdBy: "admin-user",
            image: newId,
            verification: {
                ...newCompany.verification,
                domain,
                status: 'pending',
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                codeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            }
        };

        setCompanies(prev => [companyToAdd, ...prev]);
        setShowAddCompanyModal(false);
        setNewCompany({
            name: '',
            address: '',
            website: '',
            description: '',
            values: [],
            verification: {
                method: 'email',
                status: 'pending',
                domain: '',
                email: ''
            }
        });

        setSuccessMessage('New company added successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    // Handle adding value to new company
    const handleAddValue = () => {
        if (tempValue && !newCompany.values.includes(tempValue)) {
            setNewCompany({
                ...newCompany,
                values: [...newCompany.values, tempValue]
            });
            setTempValue('');
        }
    };

    // Handle removing value from new company
    const handleRemoveValue = (valueToRemove) => {
        setNewCompany({
            ...newCompany,
            values: newCompany.values.filter(value => value !== valueToRemove)
        });
    };

    // Handle deleting a company
    const handleDeleteCompany = (companyId) => {
        setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== companyId));
        setSuccessMessage('Company deleted successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    // Company detail view
    const CompanyDetail = () => {
        if (!selectedCompany) return null;

        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white dark:bg-[var(--color-card)] rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div
                        className="sticky top-0 bg-white dark:bg-[var(--color-card)] p-4 border-b dark:border-[var(--color-border)] flex items-center justify-between">
                        <h2 className="text-xl font-bold dark:text-[var(--color-foreground)]">{selectedCompany.name}</h2>
                        <button
                            onClick={() => setSelectedCompany(null)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-muted)]"
                        >
                            <X size={20} className="dark:text-[var(--color-foreground)]"/>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Company image */}
                        <div className="flex items-center justify-center">
                            <div
                                className="w-32 h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg flex items-center justify-center">
                                <img
                                    src={`/api/placeholder/128/128`}
                                    alt={selectedCompany.name}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Company details */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">Description</h3>
                                <p className="mt-1 dark:text-[var(--color-foreground)]">{selectedCompany.description}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">Address</h3>
                                <p className="mt-1 dark:text-[var(--color-foreground)]">{selectedCompany.address}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">Website</h3>
                                <div className="mt-1 flex items-center">
                                    <a
                                        href={selectedCompany.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-[var(--color-primary)] hover:underline flex items-center"
                                    >
                                        {selectedCompany.website}
                                        <ExternalLink size={14} className="ml-1"/>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">Company
                                    Values</h3>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {selectedCompany.values.map((value, idx) => (
                                        <span key={idx}
                                              className="px-2 py-1 bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)] rounded-full text-xs">
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Verification details */}
                            <div className="border-t dark:border-[var(--color-border)] pt-4 mt-4">
                                <h3 className="text-lg font-medium dark:text-[var(--color-foreground)]">Verification
                                    Details</h3>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span
                                            className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">Status</span>
                                        <StatusBadge status={selectedCompany.verification.status}/>
                                    </div>

                                    {/* ... rest of the verification details with dark mode classes ... */}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="border-t dark:border-[var(--color-border)] pt-4 flex gap-3 justify-end">
                            {selectedCompany.verification.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleRejectCompany(selectedCompany._id);
                                            setSelectedCompany(null);
                                        }}
                                        className="px-4 py-2 border border-red-600 dark:border-[var(--color-destructive)] text-red-600 dark:text-[var(--color-destructive)] rounded-md hover:bg-red-50 dark:hover:bg-[var(--color-destructive)]/10"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleVerifyCompany(selectedCompany._id);
                                            setSelectedCompany(null);
                                        }}
                                        className="px-4 py-2 bg-green-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] rounded-md hover:bg-green-700 dark:hover:bg-[var(--color-primary)]/90"
                                    >
                                        Verify
                                    </button>
                                </>
                            )}
                            {/* ... other action buttons with dark mode classes ... */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // Add company modal
    const AddCompanyModal = () => {
        if (!showAddCompanyModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[var(--color-card)] rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-[var(--color-card)] p-4 border-b dark:border-[var(--color-border)] flex items-center justify-between">
                        <h2 className="text-xl font-bold dark:text-[var(--color-foreground)]">Add New Company</h2>
                        <button
                            onClick={() => setShowAddCompanyModal(false)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-muted)]"
                        >
                            <X size={20} className="dark:text-[var(--color-foreground)]" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.name}
                                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                                placeholder="Enter company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Address</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.address}
                                onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                                placeholder="Enter company address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Website</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.website}
                                onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.description}
                                onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                                placeholder="Enter company description"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Company Values</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    placeholder="Add a value"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddValue();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleAddValue}
                                    className="px-3 py-2 bg-blue-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] rounded-md hover:bg-blue-700 dark:hover:bg-[var(--color-primary)]/90"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {newCompany.values.map((value, idx) => (
                                    <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)] rounded-full text-xs">
                                        <span>{value}</span>
                                        <button
                                            onClick={() => handleRemoveValue(value)}
                                            className="hover:text-blue-600 dark:hover:text-[var(--color-primary)]/80"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Verification Method</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.verification.method}
                                onChange={(e) => setNewCompany({
                                    ...newCompany,
                                    verification: {...newCompany.verification, method: e.target.value}
                                })}
                            >
                                <option value="email">Email</option>
                                <option value="domain">Domain</option>
                                <option value="document">Document</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-muted-foreground)] mb-1">Contact Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                value={newCompany.verification.email}
                                onChange={(e) => setNewCompany({
                                    ...newCompany,
                                    verification: {...newCompany.verification, email: e.target.value}
                                })}
                                placeholder="contact@example.com"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddCompanyModal(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-[var(--color-border)] text-gray-700 dark:text-[var(--color-foreground)] rounded-md hover:bg-gray-50 dark:hover:bg-[var(--color-muted)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCompany}
                                className="px-4 py-2 bg-blue-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] rounded-md hover:bg-blue-700 dark:hover:bg-[var(--color-primary)]/90"
                                disabled={!newCompany.name || !newCompany.website || !newCompany.verification.email}
                            >
                                Add Company
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // Render the grid view of companies
    const renderGridView = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.length > 0 ? (
                filteredCompanies.map(company => (
                    <div
                        key={company._id}
                        className="bg-white dark:bg-[var(--color-card)] border dark:border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-36 bg-gray-200 dark:bg-[var(--color-muted)]">
                            <img
                                src={`/api/placeholder/400/144`}
                                alt={company.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <StatusBadge status={company.verification.status}/>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-lg dark:text-[var(--color-foreground)]">{company.name}</h3>
                                <div className="dropdown relative">
                                    <button
                                        onClick={() => handleDeleteCompany(company._id)}
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-muted)] text-gray-500 hover:text-red-600 dark:hover:text-[var(--color-destructive)]"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-[var(--color-muted-foreground)] text-sm mt-2 line-clamp-2">{company.description}</p>

                            <div
                                className="mt-4 flex items-center text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                                >
                                    <ExternalLink size={14} className="mr-1"/>
                                    Website
                                </a>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1">
                                {company.values.slice(0, 3).map((value, idx) => (
                                    <span key={idx}
                                          className="px-2 py-0.5 bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)] rounded-full text-xs">
                                        {value}
                                    </span>
                                ))}
                            </div>

                            <div
                                className="mt-4 flex justify-between items-center border-t dark:border-[var(--color-border)] pt-3">
                                {/* ... action buttons with dark mode classes ... */}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center py-12">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-[var(--color-muted)] mb-4">
                        <Search className="h-8 w-8 text-gray-400 dark:text-[var(--color-muted-foreground)]"/>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-[var(--color-foreground)]">No companies
                        found</h3>
                    <p className="mt-1 text-gray-500 dark:text-[var(--color-muted-foreground)]">Try adjusting your
                        search or filter criteria</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                        }}
                        className="mt-4 text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
    // Render the table view of companies
    const renderTableView = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[var(--color-border)]">
                <thead className="bg-gray-50 dark:bg-[var(--color-muted)]">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                            Company
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[var(--color-muted)] rounded">
                                <ArrowUpDown size={12} className="dark:text-[var(--color-muted-foreground)]" />
                            </button>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                            Status
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[var(--color-muted)] rounded">
                                <ArrowUpDown size={12} className="dark:text-[var(--color-muted-foreground)]" />
                            </button>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        Website
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        Reviewed
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-[var(--color-card)] divide-y divide-gray-200 dark:divide-[var(--color-border)]">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company, idx) => (
                        <tr key={company._id} className={idx % 2 === 0 ? 'bg-white dark:bg-[var(--color-card)]' : 'bg-gray-50 dark:bg-[var(--color-muted)]'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                                        <img
                                            src={`/api/placeholder/40/40`}
                                            alt={company.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-[var(--color-foreground)]">{company.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-[var(--color-muted-foreground)] truncate max-w-xs">
                                            {company.description}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={company.verification.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="capitalize dark:text-[var(--color-foreground)]">{company.verification.method}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-[var(--color-primary)] hover:underline flex items-center"
                                >
                                    <span className="truncate w-32 inline-block">{company.website}</span>
                                    <ExternalLink size={14} className="ml-1" />
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                {company.verification.reviewedDate
                                    ? new Date(company.verification.reviewedDate).toLocaleDateString()
                                    : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    {company.verification.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleVerifyCompany(company._id)}
                                                className="px-3 py-1 bg-green-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] text-xs rounded-md hover:bg-green-700 dark:hover:bg-[var(--color-primary)]/90"
                                            >
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => handleRejectCompany(company._id)}
                                                className="px-3 py-1 border border-red-600 dark:border-[var(--color-destructive)] text-red-600 dark:text-[var(--color-destructive)] text-xs rounded-md hover:bg-red-50 dark:hover:bg-[var(--color-destructive)]/10"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setSelectedCompany(company)}
                                        className="text-blue-600 dark:text-[var(--color-primary)] hover:text-blue-900 dark:hover:text-[var(--color-primary)]/80"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCompany(company._id)}
                                        className="text-red-600 dark:text-[var(--color-destructive)] hover:text-red-900 dark:hover:text-[var(--color-destructive)]/80"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="inline-flex flex-col items-center justify-center">
                                <Search className="h-8 w-8 text-gray-400 dark:text-[var(--color-muted-foreground)] mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-[var(--color-foreground)]">No companies found</h3>
                                <p className="mt-1 text-gray-500 dark:text-[var(--color-muted-foreground)]">Try adjusting your search or filter criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="mt-4 text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-[var(--color-background)] min-h-screen">
            {/* Success alert */}
            {showSuccessAlert && (
                <div className="fixed top-4 right-4 z-50">
                    <Alert
                        className="bg-green-50 dark:bg-[var(--color-primary)]/10 border-green-200 dark:border-[var(--color-primary)]">
                        <Check className="h-4 w-4 text-green-600 dark:text-[var(--color-primary)]"/>
                        <AlertTitle className="text-green-800 dark:text-[var(--color-foreground)]">Success</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-[var(--color-muted-foreground)]">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-[var(--color-card)] border-b dark:border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[var(--color-foreground)]">Companies
                            Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                            Manage and verify company listings in the system
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 dark:text-[var(--color-muted-foreground)]"/>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                placeholder="Search companies..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters and view toggle */}
                    <div className="col-span-1 md:col-span-2 flex flex-wrap justify-between gap-2">
                        <div className="flex gap-2">
                            <div className="relative">
                                <select
                                    className="block w-44 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pr-2 pointer-events-none">
                                    <Filter
                                        className="h-4 w-4  text-gray-400 dark:text-[var(--color-muted-foreground)]"/>
                                </div>
                            </div>

                            <div className="flex rounded-md shadow-sm">
                                <button
                                    className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-50 dark:bg-[var(--color-primary)]/10 text-blue-600 dark:text-[var(--color-primary)] border-blue-600 dark:border-[var(--color-primary)]'
                                            : 'bg-white dark:bg-[var(--color-input)] text-gray-700 dark:text-[var(--color-foreground)] border-gray-300 dark:border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-[var(--color-muted)]'
                                    }`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    Grid
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                                        viewMode === 'table'
                                            ? 'bg-blue-50 dark:bg-[var(--color-primary)]/10 text-blue-600 dark:text-[var(--color-primary)] border-blue-600 dark:border-[var(--color-primary)]'
                                            : 'bg-white dark:bg-[var(--color-input)] text-gray-700 dark:text-[var(--color-foreground)] border-gray-300 dark:border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-[var(--color-muted)]'
                                    }`}
                                    onClick={() => setViewMode('table')}
                                >
                                    Table
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAddCompanyModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-[var(--color-primary)] hover:bg-blue-700 dark:hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4 mr-1"/>
                            Add Company
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-[var(--color-card)] shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {viewMode === 'grid' ? renderGridView() : renderTableView()}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CompanyDetail/>
            <AddCompanyModal/>
        </div>
    );
}