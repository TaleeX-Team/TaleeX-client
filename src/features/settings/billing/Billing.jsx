import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Check, CreditCard, Download, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Free Plan</h3>
                <Badge>Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Limited features • Upgrade anytime
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-sm">Up to 3 active job postings</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-3xl font-bold">
                $0
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <Button>Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-2 border-primary/20">
        <CardHeader className=" rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>
                Unlock all features and remove limits
              </CardDescription>
            </div>
            <Badge className="bg-primary">Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Upgrade to Pro
                </h3>
                <p className="text-muted-foreground">
                  Get full access to all features and remove the limitations of
                  the free plan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-sm font-medium">
                    Unlimited job postings
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4 md:min-w-[200px]">
              <div>
                <div className="text-4xl font-bold">$1</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <Button size="lg" className="w-full">
                Subscribe Now
              </Button>
              <p className="text-xs text-center md:text-left text-muted-foreground">
                Cancel anytime. No long-term commitment required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
