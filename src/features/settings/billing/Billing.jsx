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
import { Check, CreditCard, Zap, Shield, Star, Award } from "lucide-react";
import { useTokens } from "./useTokens";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
  // const {
  //   tokenPrice,
  //   tokenPacks,
  //   tokenFeatures,
  //   isLoading,
  //   isPriceLoading,
  //   isBuyingPack,
  //   buyTokenPack,
  // } = useTokens();
  const {
    tokenPrice,
    tokenPacks,
    tokenFeatures,
    isLoading,
    isError,
    buyTokens,
    buyTokenPack,
    isBuyingTokens,
    isBuyingPack,
  } = useTokens("EGP");
  if (isLoading) {
    return (
      <div className="container pt-0 pb-10 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Token Subscription</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purchase tokens to use our AI-powered CV review and interview preparation services
          </p>
        </div>

        {/* Skeleton for Token Info */}
        <div className="mb-12">
          <div className="flex justify-end mb-4">
            <Button disabled>
              <Zap className="mr-2 h-4 w-4" />
              Buy Tokens
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Token Credit</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-3/4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Token Price</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skeleton for Token Packs */}
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-3/4 mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Skeleton for Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">How Tokens Work</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  

  const icons = [Shield, Star, Award];
  const colors = ["bg-blue-500", "bg-purple-500", "bg-amber-500"];

  return (
    <div className="container pt-0 pb-10 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Token Subscription</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Purchase tokens to use our AI-powered CV review and interview preparation services
        </p>
      </div>

      {/* Token Info */}
      <div className="mb-12">
        <div className="flex justify-end mb-4">
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Buy Tokens
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Token Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">--</span>
                <span className="text-lg ml-2 text-muted-foreground">tokens</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Token Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">
              <pre>{JSON.stringify(tokenPrice, null, 2)}</pre>
</span>
                <span className="text-lg ml-2 text-muted-foreground">per token</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Token Packs */}
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
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{pack.name}</CardTitle>
                <CardDescription>{pack.tokens} tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${pack.price}</span>
                  <span className="text-muted-foreground ml-1">/{pack.currency}</span>
                </div>

                <div className="bg-muted/30 p-3 rounded-md text-center">
                  <span className="text-2xl font-bold text-primary">{pack.tokens}</span>
                  <span className="text-muted-foreground ml-1">tokens</span>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Use tokens for any service</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">No expiration date</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">24/7 support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={index === 1 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => buyTokenPack(pack._id)}
                  disabled={isBuyingPack}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Usage Info */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">How Tokens Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenFeatures?.map((feature) => (
            <Card key={feature._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{feature.feature}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cost:</span>
                  <Badge variant="secondary">{feature.tokenCost} tokens</Badge>
                </div>
                <p className="text-sm mt-3">
                  Token cost for {feature.feature} service.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
