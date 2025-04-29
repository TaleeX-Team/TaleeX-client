import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import PlanForm from "@/components/admin/PlanFrom.jsx";
import {toast} from 'sonner';

const mockPlans = [
    {
        id: "1",
        name: "Basic",
        price: 9.99,
        billingCycle: "monthly",
        status: "active",
        features: ["5 team members", "Basic support", "1GB storage"],
    },
    {
        id: "2",
        name: "Pro",
        price: 29.99,
        billingCycle: "monthly",
        status: "active",
        features: ["Unlimited team members", "Priority support", "10GB storage"],
    },
    {
        id: "3",
        name: "Enterprise",
        price: 99.99,
        billingCycle: "monthly",
        status: "inactive",
        features: ["Custom solutions", "24/7 support", "Unlimited storage"],
    },
];

const PlansPage = () => {
    const [plans] = useState(mockPlans);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleEditPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleDeletePlan = (planId) => {
        toast.success("The subscription plan has been deleted successfully.");
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your subscription plans and pricing.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Plan</DialogTitle>
                            <DialogDescription>
                                Add a new subscription plan to your offerings.
                            </DialogDescription>
                        </DialogHeader>
                        <PlanForm onSubmit={(data) => console.log(data)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Billing Cycle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id} className="group">
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>${plan.price}</TableCell>
                                        <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                                        <TableCell>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.status === "active"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                        >
                          {plan.status}
                        </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleEditPlan(plan)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[600px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Plan</DialogTitle>
                                                            <DialogDescription>
                                                                Modify the details of your subscription plan.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <PlanForm plan={plan} onSubmit={(data) => console.log(data)} />
                                                    </DialogContent>
                                                </Dialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this plan? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeletePlan(plan.id)}
                                                            >
                                                                Delete
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PlansPage;