"use client"
import {useState, useEffect} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Skeleton} from "@/components/ui/skeleton"
import {Badge} from "@/components/ui/badge"
import {
    ArrowUpDown,
    Code,
    Coins,
    DollarSign,
    Download,
    Edit,
    Filter,
    MessageSquare,
    Music,
    Package,
    Plus,
    Tag,
    Trash2,
    Video,
    Zap,
    ImageIcon,
    PoundSterlingIcon as CurrencyPound,
    RefreshCw,
    Clock,
} from "lucide-react"
import TokenFeatureForm from "@/components/admin/TokenFeatureForm.jsx"
import TokenPriceForm from "@/components/admin/TokenPriceForm.jsx"
import TokenPackForm from "@/components/admin/TokenPackForm.jsx"
import {useTokenFeatures} from "@/hooks/tokens/useTokenFeatures.js"
import {useTokenPrice} from "@/hooks/tokens/useTokenPrice.js"
import {useTokenPacks} from "@/hooks/tokens/useTokenPacks.js"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

export default function TokenManagementPage() {
    const [selectedFeature, setSelectedFeature] = useState(null)
    const [selectedPack, setSelectedPack] = useState(null)
    const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false)
    const [isPackDialogOpen, setIsPackDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("features")
    const [selectedCurrency, setSelectedCurrency] = useState("EGP")
    const queryClient = useQueryClient()

    // Check if the selected currency is supported
    const isCurrencySupported = (currency) => {
        return ["EGP", "USD"].includes(currency)
    }

    // Handle currency change with validation
    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency)

        if (!isCurrencySupported(currency)) {
            toast.success(`${currency} pricing is not available yet. We're working on it!`)
        }
    }

    const {
        features,
        isLoading: featuresLoading,
        createFeature,
        updateFeature,
        deleteFeature,
        isCreating: isCreatingFeature,
        isUpdating: isUpdatingFeature,
        isDeleting: isDeletingFeature,
    } = useTokenFeatures()

    const {
        tokenPrice,
        isLoading: priceLoading,
        updatePrice,
        isUpdating: isUpdatingPrice,
        error: priceError,
    } = useTokenPrice(isCurrencySupported(selectedCurrency) ? selectedCurrency : "EGP")

    const {
        packs,
        isLoading: packsLoading,
        createPack,
        updatePack,
        deletePack,
        isCreating: isCreatingPack,
        isUpdating: isUpdatingPack,
        isDeleting: isDeletingPack,
    } = useTokenPacks()

    // Reset selected feature when dialog closes
    useEffect(() => {
        if (!isFeatureDialogOpen) {
            setTimeout(() => setSelectedFeature(null), 300)
        }
    }, [isFeatureDialogOpen])

    // Reset selected pack when dialog closes
    useEffect(() => {
        if (!isPackDialogOpen) {
            setTimeout(() => setSelectedPack(null), 300)
        }
    }, [isPackDialogOpen])

    // Show toast on price error
    useEffect(() => {
        if (priceError && isCurrencySupported(selectedCurrency)) {
            toast.error(priceError.message,)
        }
    }, [priceError, selectedCurrency])

    const handleCreateFeature = (feature) => {
        createFeature(feature)
        setIsFeatureDialogOpen(false)
    }

    const handleUpdateFeature = (feature) => {
        if (feature._id) {
            updateFeature({id: feature._id, feature})
        }
        setIsFeatureDialogOpen(false)
    }

    const handleDeleteFeature = (id) => {
        deleteFeature(id)
    }

    const handleUpdatePrice = (price) => {
        if (!isCurrencySupported(price.currency)) {
            toast.success(`${price.currency} pricing is not available yet. We're working on it!`)
            return
        }

        updatePrice(price, {
            onSuccess: () => {
                toast.success(`The token price for ${price.currency} has been updated successfully.`)
                // Refresh all token prices
                queryClient.invalidateQueries({queryKey: ["tokenPrice"]})
            },
            onError: (error) => {
                toast.error(error.message)
            },
        })
    }

    const handleCreatePack = (pack) => {
        createPack(pack)
        setIsPackDialogOpen(false)
    }

    const handleUpdatePack = (pack) => {
        if (pack._id) {
            updatePack({id: pack._id, pack})
        }
        setIsPackDialogOpen(false)
    }

    const handleDeletePack = (id) => {
        deletePack(id)
    }

    const refreshTokenPrice = () => {
        if (isCurrencySupported(selectedCurrency)) {
            queryClient.invalidateQueries({queryKey: ["tokenPrice", selectedCurrency]})
        } else {
            toast.success(`${selectedCurrency} pricing is not available yet. We're working on it!`)
        }
    }

    // Icon mapping for token features visualization
    const getFeatureIcon = (featureName) => {
        const iconMap = {
            Chat: <MessageSquare className="h-4 w-4"/>,
            Image: <ImageIcon className="h-4 w-4"/>,
            Audio: <Music className="h-4 w-4"/>,
            Video: <Video className="h-4 w-4"/>,
            Download: <Download className="h-4 w-4"/>,
            API: <Code className="h-4 w-4"/>,
        }

        // Default icon if no match
        for (const [key, icon] of Object.entries(iconMap)) {
            if (featureName.toLowerCase().includes(key.toLowerCase())) {
                return icon
            }
        }

        return <Zap className="h-4 w-4"/>
    }

    // Generate token pack badge based on size
    const getPackBadgeStyle = (tokens) => {
        if (tokens < 100) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        if (tokens < 500) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
        if (tokens < 1000) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    }

    // Helper to format numbers with commas
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    // Calculate potential revenue from token packs
    const calculateTotalPotentialRevenue = () => {
        if (!packs || !Array.isArray(packs) || packs.length === 0) return {total: 0, currency: "USD"}
        const activePacks = packs.filter((pack) => pack.isActive)
        if (activePacks.length === 0) return {total: 0, currency: packs[0]?.currency || "USD"}

        const total = activePacks.reduce((sum, pack) => sum + (pack.price || 0), 0)
        return {
            total: total.toFixed(2),
            currency: activePacks[0]?.currency || "USD",
        }
    }

    const revenue = calculateTotalPotentialRevenue()

    // Get currency symbol
    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case "EGP":
                return "£E"
            case "USD":
                return "$"
            case "EUR":
                return "€"
            case "GBP":
                return "£"
            default:
                return currencyCode
        }
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Token Management
                    </h1>
                    <p className="text-muted-foreground mt-2">Configure and manage your platform's token economy</p>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-full">
                                <Tag className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Features</p>
                                <p className="text-xl font-bold">{features?.length || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-none shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="bg-purple-500/20 p-2 rounded-full">
                                <Package className="h-5 w-5 text-purple-500"/>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Active Packs</p>
                                <p className="text-xl font-bold">{packs?.filter((p) => p.isActive).length || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-none shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="bg-green-500/20 p-2 rounded-full">
                                <DollarSign className="h-5 w-5 text-green-500"/>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Revenue Potential</p>
                                <p className="text-xl font-bold">
                                    {revenue.currency} {revenue.total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full flex p-1.5 bg-slate-100 dark:bg-slate-800/40 rounded-lg mb-8">
                    <TabsTrigger
                        value="features"
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-md text-base font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <Tag className="h-5 w-5"/>
                        <span>Token Features</span>
                        {features?.length > 0 && (
                            <Badge
                                variant="outline"
                                className="ml-1.5 h-6 min-w-6 rounded-full px-2 bg-white/20 text-white border-transparent text-sm"
                            >
                                {features.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="pricing"
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-md text-base font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <Coins className="h-5 w-5"/>
                        <span>Token Pricing</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="packs"
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-md text-base font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <Package className="h-5 w-5"/>
                        <span>Token Packs</span>
                        {packs?.length > 0 && (
                            <Badge
                                variant="outline"
                                className="ml-1.5 h-6 min-w-6 rounded-full px-2 bg-white/20 text-white border-transparent text-sm"
                            >
                                {packs.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Token Features Tab */}
                <TabsContent value="features" className="animate-in fade-in-50">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <CardHeader
                            className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Tag className="h-5 w-5"/>
                                    Token Features
                                </CardTitle>
                                <CardDescription>Configure features that consume tokens and their
                                    costs</CardDescription>
                            </div>
                            <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                            size="sm">
                                        <Plus className="h-4 w-4"/>
                                        Add Feature
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                    <DialogHeader>
                                        <DialogTitle>{selectedFeature ? "Edit Token Feature" : "Create New Token Feature"}</DialogTitle>
                                        <DialogDescription>
                                            {selectedFeature
                                                ? "Modify the details of this token feature."
                                                : "Add a new feature that consumes tokens."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <TokenFeatureForm
                                        feature={selectedFeature}
                                        onSubmit={selectedFeature ? handleUpdateFeature : handleCreateFeature}
                                        isSubmitting={selectedFeature ? isUpdatingFeature : isCreatingFeature}
                                    />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            {featuresLoading ? (
                                <div className="p-6 space-y-3">
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                </div>
                            ) : features && Array.isArray(features) && features.length > 0 ? (
                                <div className="overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableHead className="font-semibold w-12"></TableHead>
                                                <TableHead className="font-semibold">Feature</TableHead>
                                                <TableHead className="font-semibold">Token Cost</TableHead>
                                                <TableHead className="text-right font-semibold">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {features.map((feature) => (
                                                <TableRow key={feature._id}
                                                          className="group transition-colors hover:bg-muted/30">
                                                    <TableCell className="w-12">
                                                        <div
                                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                            {getFeatureIcon(feature.feature)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {feature.feature}
                                                        {feature.description && (
                                                            <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{feature.description}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline"
                                                               className="font-mono bg-primary/5 hover:bg-primary/10">
                                                            {feature.tokenCost}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => {
                                                                    setSelectedFeature(feature)
                                                                    setIsFeatureDialogOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4"/>
                                                                <span className="sr-only">Edit</span>
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                                    >
                                                                        <Trash2 className="h-4 w-4"/>
                                                                        <span className="sr-only">Delete</span>
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Token
                                                                            Feature</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete this token
                                                                            feature? This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={() => feature._id && handleDeleteFeature(feature._id)}
                                                                            disabled={isDeletingFeature}
                                                                        >
                                                                            {isDeletingFeature ? "Deleting..." : "Delete"}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center py-16 text-center bg-muted/10 rounded-lg m-6 border-2 border-dashed">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Tag className="h-10 w-10 text-primary opacity-80"/>
                                    </div>
                                    <h3 className="text-lg font-medium">No token features found</h3>
                                    <p className="text-muted-foreground mt-2 max-w-md">
                                        Create your first token feature to define how tokens are consumed in your
                                        application.
                                    </p>
                                    <Button className="mt-6 bg-primary hover:bg-primary/90"
                                            onClick={() => setIsFeatureDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Add First Feature
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Token Pricing Tab */}
                <TabsContent value="pricing" className="animate-in fade-in-50">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <Coins className="h-6 w-6 text-purple-500"/>
                                <div>
                                    <CardTitle className="text-2xl font-bold">Token Pricing</CardTitle>
                                    <CardDescription>Define the value of a single token in your preferred
                                        currency</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    {selectedCurrency === "EGP" ? (
                                        <CurrencyPound className="h-5 w-5 text-amber-600"/>
                                    ) : selectedCurrency === "USD" ? (
                                        <DollarSign className="h-5 w-5 text-green-600"/>
                                    ) : selectedCurrency === "EUR" ? (
                                        <Coins className="h-5 w-5 text-blue-600"/>
                                    ) : (
                                        <Coins className="h-5 w-5 text-purple-600"/>
                                    )}
                                    <h3 className="text-lg font-semibold">{selectedCurrency} Token Pricing</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Currency"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro (Coming Soon)</SelectItem>
                                            <SelectItem value="GBP">GBP - British Pound (Coming Soon)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={refreshTokenPrice}
                                        disabled={priceLoading || !isCurrencySupported(selectedCurrency)}
                                        className="h-10 w-10"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${priceLoading ? "animate-spin" : ""}`}/>
                                    </Button>
                                </div>
                            </div>

                            {!isCurrencySupported(selectedCurrency) && (
                                <Alert
                                    className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                                    <AlertTitle className="text-blue-800 dark:text-blue-400">Coming Soon</AlertTitle>
                                    <AlertDescription className="text-blue-700 dark:text-blue-500">
                                        {selectedCurrency} pricing is not available yet. We're working on adding support
                                        for this currency.
                                        Please check back later or use EGP or USD for now.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {priceLoading && isCurrencySupported(selectedCurrency) ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div className="p-0 rounded-lg overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500/10 to-primary/5 p-6 border-b">
                                                <h3 className="text-lg font-semibold mb-1">Current Token Value</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    This is the base value of a single token in {selectedCurrency}
                                                </p>
                                            </div>

                                            <div className="border rounded-b-lg bg-card">
                                                {tokenPrice && isCurrencySupported(selectedCurrency) ? (
                                                    <div className="p-6 space-y-6">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div
                                                                className="text-5xl font-bold text-center mb-2 flex items-center">
                                <span className="text-2xl mr-1">
                                  {getCurrencySymbol(tokenPrice.currency || selectedCurrency)}
                                </span>
                                                                {tokenPrice.tokenValue || tokenPrice}
                                                            </div>
                                                            <Badge variant="outline" className="uppercase bg-muted/50">
                                                                per token
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Currency</p>
                                                                <p className="font-medium uppercase">{tokenPrice.currency || selectedCurrency}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Last
                                                                    updated</p>
                                                                <p className="font-medium">
                                                                    {tokenPrice.updatedAt
                                                                        ? new Date(tokenPrice.updatedAt).toLocaleDateString()
                                                                        : "Not available"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Token value examples */}
                                                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                                                            <p className="text-sm font-medium">Token value examples:</p>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span
                                                                        className="text-muted-foreground">10 tokens</span>
                                                                    <span>
                                    {getCurrencySymbol(tokenPrice.currency || selectedCurrency)}{" "}
                                                                        {((tokenPrice.tokenValue || tokenPrice) * 10).toFixed(2)}
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span
                                                                        className="text-muted-foreground">100 tokens</span>
                                                                    <span>
                                    {getCurrencySymbol(tokenPrice.currency || selectedCurrency)}{" "}
                                                                        {((tokenPrice.tokenValue || tokenPrice) * 100).toFixed(2)}
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span
                                                                        className="text-muted-foreground">500 tokens</span>
                                                                    <span>
                                    {getCurrencySymbol(tokenPrice.currency || selectedCurrency)}{" "}
                                                                        {((tokenPrice.tokenValue || tokenPrice) * 500).toFixed(2)}
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span
                                                                        className="text-muted-foreground">1000 tokens</span>
                                                                    <span>
                                    {getCurrencySymbol(tokenPrice.currency || selectedCurrency)}{" "}
                                                                        {((tokenPrice.tokenValue || tokenPrice) * 1000).toFixed(2)}
                                  </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : !isCurrencySupported(selectedCurrency) ? (
                                                    <div
                                                        className="flex flex-col items-center justify-center py-12 text-center">
                                                        <Clock className="h-12 w-12 text-blue-500 mb-4 opacity-70"/>
                                                        <p className="text-muted-foreground">
                                                            {selectedCurrency} pricing is not available yet. We're
                                                            working on it!
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex flex-col items-center justify-center py-12 text-center">
                                                        <Coins
                                                            className="h-12 w-12 text-muted-foreground mb-4 opacity-50"/>
                                                        <p className="text-muted-foreground">No pricing has been set yet
                                                            for {selectedCurrency}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="bg-card border rounded-lg overflow-hidden">
                                            <div className="bg-muted/30 p-6 border-b">
                                                <h3 className="text-lg font-semibold">Update {selectedCurrency} Token
                                                    Pricing</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Change the token value to adjust your platform's economy
                                                </p>
                                            </div>
                                            <div className="p-6">
                                                {!isCurrencySupported(selectedCurrency) ? (
                                                    <div
                                                        className="flex flex-col items-center justify-center py-8 text-center">
                                                        <Clock className="h-10 w-10 text-blue-500 mb-4 opacity-70"/>
                                                        <h4 className="text-base font-medium mb-2">Coming Soon</h4>
                                                        <p className="text-sm text-muted-foreground max-w-md">
                                                            {selectedCurrency} pricing is not available yet. Please
                                                            check back later or use EGP or USD
                                                            for now.
                                                        </p>
                                                        <Button variant="outline" className="mt-4"
                                                                onClick={() => handleCurrencyChange("EGP")}>
                                                            Switch to EGP
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <TokenPriceForm
                                                        tokenPrice={tokenPrice}
                                                        onSubmit={handleUpdatePrice}
                                                        isSubmitting={isUpdatingPrice}
                                                        defaultCurrency={selectedCurrency}
                                                        supportedCurrencies={["EGP", "USD"]}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Token Packs Tab */}
                <TabsContent value="packs" className="animate-in fade-in-50">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <CardHeader
                            className="flex flex-row items-center justify-between bg-gradient-to-r from-green-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <Package className="h-6 w-6 text-green-600"/>
                                <div>
                                    <CardTitle className="text-2xl font-bold">Token Packs</CardTitle>
                                    <CardDescription>Create and manage token packs that users can
                                        purchase</CardDescription>
                                </div>
                            </div>
                            <Dialog open={isPackDialogOpen} onOpenChange={setIsPackDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                            size="sm">
                                        <Plus className="h-4 w-4"/>
                                        Add Pack
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                    <DialogHeader>
                                        <DialogTitle>{selectedPack ? "Edit Token Pack" : "Create New Token Pack"}</DialogTitle>
                                        <DialogDescription>
                                            {selectedPack
                                                ? "Modify the details of this token pack."
                                                : "Add a new token pack for users to purchase."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <TokenPackForm
                                        pack={selectedPack}
                                        onSubmit={selectedPack ? handleUpdatePack : handleCreatePack}
                                        isSubmitting={selectedPack ? isUpdatingPack : isCreatingPack}
                                        supportedCurrencies={["EGP", "USD"]}
                                    />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            {packsLoading ? (
                                <div className="p-6 space-y-3">
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                    <Skeleton className="h-12 w-full"/>
                                </div>
                            ) : packs && Array.isArray(packs) && packs.length > 0 ? (
                                <div className="rounded-md border overflow-hidden shadow-sm">
                                    <div className="px-4 py-3 bg-muted/10 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">Token Packs</h3>
                                            <span
                                                className="text-muted-foreground text-sm">({packs.length} total)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center"
                                                onClick={() => {
                                                    // Potential search/filter functionality
                                                    console.log("Filter packs")
                                                }}
                                            >
                                                <Filter className="h-4 w-4 mr-2"/>
                                                Filter
                                            </Button>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableHead className="font-semibold w-[200px]">
                                                    <div className="flex items-center">
                                                        Name
                                                        <ArrowUpDown
                                                            className="ml-2 h-4 w-4 opacity-50 cursor-pointer"/>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold">
                                                    <div className="flex items-center">
                                                        Price
                                                        <ArrowUpDown
                                                            className="ml-2 h-4 w-4 opacity-50 cursor-pointer"/>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold">
                                                    <div className="flex items-center">
                                                        Tokens
                                                        <ArrowUpDown
                                                            className="ml-2 h-4 w-4 opacity-50 cursor-pointer"/>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                                <TableHead className="text-right font-semibold">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {packs.map((pack) => (
                                                <TableRow key={pack._id}
                                                          className="group transition-colors hover:bg-muted/30">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center">
                                                            {pack.name}
                                                            {pack.isRecommended && (
                                                                <span
                                                                    className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                  Recommended
                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <span
                                                                className="font-mono text-foreground">{pack.price}</span>
                                                            <span
                                                                className="text-muted-foreground uppercase text-xs">{pack.currency}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary"
                                                               className="font-mono hover:bg-secondary/80 transition-colors">
                                                            {pack.tokens.toLocaleString()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={pack.isActive ? "success" : "destructive"}
                                                            className={`
                                    ${
                                                                pack.isActive
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                            }
                                    cursor-default
                                `}
                                                        >
                                                            {pack.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div
                                                            className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full hover:bg-muted"
                                                                onClick={() => {
                                                                    setSelectedPack(pack)
                                                                    setIsPackDialogOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4"/>
                                                                <span className="sr-only">Edit</span>
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                                    >
                                                                        <Trash2 className="h-4 w-4"/>
                                                                        <span className="sr-only">Delete</span>
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Token
                                                                            Pack</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{pack.name}"?
                                                                            This action cannot be undone and
                                                                            will remove the pack permanently.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={() => pack._id && handleDeletePack(pack._id)}
                                                                            disabled={isDeletingPack}
                                                                        >
                                                                            {isDeletingPack ? "Deleting..." : "Delete"}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg border-2 border-dashed">
                                    <Package className="h-14 w-14 text-muted-foreground mb-4 opacity-50"/>
                                    <h3 className="text-lg font-medium mb-2">No Token Packs Available</h3>
                                    <p className="text-muted-foreground max-w-md mb-4">
                                        Create your first token pack to enable token purchases. Customize pricing, token
                                        amounts, and set
                                        activation status.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="flex items-center group"
                                        onClick={() => setIsPackDialogOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform"/>
                                        Create First Pack
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
