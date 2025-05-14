import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Star, Award } from "lucide-react";
import { useTokens } from "./useTokens";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import PayPalButton from "./paypalcheckoutButton";
import PayPalButton2 from "./paypalButton2";
import { useTranslation } from "react-i18next"; // Import translation hook

export default function SubscriptionPage() {
  const { t } = useTranslation(); // Initialize translation hook
  const { data: user } = useUser();
  const {
    tokenPrice,
    tokenPacks,
    tokenFeatures,
    isLoading,
    buyTokenPack,
  } = useTokens("USD");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tokenCount, setTokenCount] = useState(5000);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (tokenPrice) {
      setTotalPrice(tokenCount * tokenPrice);
    }
  }, [tokenCount, tokenPrice]);

  const handleIncrement = () => setTokenCount((prev) => prev + 1);
  const handleDecrement = () => setTokenCount((prev) => Math.max(1, prev - 1));
  const handleInputChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setTokenCount(value);
  };

  if (isLoading) {
    return (
      <div className="container pt-0 pb-10 max-w-7xl mx-auto">
        {/* Skeleton Loading UI (same as before) */}
        {/* ... */}
      </div>
    );
  }

  const icons = [Shield, Star, Award];
  const colors = ["bg-blue-500", "bg-purple-500", "bg-amber-500"];

  return (
    <div className="container pt-0 pb-10 max-w-7xl mx-auto">
      <div className="flex">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("subscriptionPage.tokens")}
          </h1>
          <p className="text-muted-foreground">
            {t("subscriptionPage.purchaseTokensDescription")}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                {t("subscriptionPage.buyTokens")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{t("subscriptionPage.purchaseTokens")}</h2>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl">{t("subscriptionPage.tokens")}: {tokenCount}</h3>
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleDecrement} disabled={tokenCount <= 5000}>-</Button>
                      <input
                        type="number"
                        min={5000}
                        value={tokenCount}
                        onChange={handleInputChange}
                        className="w-30 border border-border bg-input rounded-md text-center text-base h-9 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        inputMode="numeric"
                      />
                      <Button onClick={handleIncrement}>+</Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-semibold">{t("subscriptionPage.totalPrice")}: ${totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-[400px]">
                    <PayPalButton2
                      amount={totalPrice}
                      tokenCount={tokenCount}
                      tokenPrice={tokenPrice}
                      currency="USD"
                      onSuccess={() => setIsDialogOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t("subscriptionPage.tokenCredit")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">{user.tokens}</span>
                <span className="text-lg ml-2 text-muted-foreground">{t("subscriptionPage.tokensLabel")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t("subscriptionPage.tokenPrice")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">${tokenPrice}</span>
                <span className="text-lg ml-2 text-muted-foreground">{t("subscriptionPage.perToken")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tokenPacks?.map((pack, index) => {
          const Icon = icons[index % icons.length];
          const color = colors[index % colors.length];

          return (
            <Card
              key={pack._id}
              className={`relative overflow-hidden ${index === 1 ? "border-primary shadow-lg" : ""}`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-tl-none rounded-br-none bg-primary text-primary-foreground">
                    {t("subscriptionPage.mostPopular")}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{pack.name}</CardTitle>
                <CardDescription>{pack.tokens} {t("subscriptionPage.tokens")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${pack.price}</span>
                  <span className="text-muted-foreground ml-1">/{pack.currency}</span>
                </div>

                <div className="bg-muted/30 p-3 rounded-md text-center">
                  <span className="text-2xl font-bold text-primary">{pack.tokens}</span>
                  <span className="text-muted-foreground ml-1">{t("subscriptionPage.tokensLabel")}</span>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">{t("subscriptionPage.useTokensForAnyService")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">{t("subscriptionPage.noExpiration")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">{t("subscriptionPage.support24x7")}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PayPalButton className="mx-auto" pack={pack} />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* How Tokens Work */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("subscriptionPage.howTokensWork")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tokenFeatures?.map((feature) => (
            <Card key={feature._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{feature.feature}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("subscriptionPage.cost")}</span>
                  <Badge variant="secondary">{feature.tokenCost} {t("subscriptionPage.tokensLabel")}</Badge>
                </div>
                <p className="text-sm mt-3">
               { t("subscriptionPage.tokenCostForService", { service: feature.feature })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
