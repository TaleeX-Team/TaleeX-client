import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Zap, Shield, Star, Award } from "lucide-react"

export default function SubscriptionPage() {
  const currentTokens = 45
  const tokenPrice = 4

  const tokenPacks = [
    {
      id: "basic",
      name: "Basic Token Pack",
      tokens: 10,
      price: 9.99,
      currency: "USD",
      isPopular: false,
      features: ["Use tokens for any service", "No expiration date", "24/7 support"],
      color: "bg-blue-500",
      icon: Shield,
    },
    {
      id: "advanced",
      name: "Advanced Token Pack",
      tokens: 20,
      price: 19.99,
      currency: "USD",
      isPopular: true,
      features: ["Use tokens for any service", "No expiration date", "Priority support"],
      color: "bg-purple-500",
      icon: Star,
    },
    {
      id: "premium",
      name: "Premium Token Pack",
      tokens: 30,
      price: 29.99,
      currency: "USD",
      isPopular: false,
      features: ["Use tokens for any service", "No expiration date", "Premium support", "Bulk discount"],
      color: "bg-amber-500",
      icon: Award,
    },
  ]

  return (
    <div className="container pt-0 pb-10 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Token Subscription</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Purchase tokens to use our AI-powered CV review and interview preparation services
        </p>
      </div>

      {/* Token Information and Buy Button */}
      <div className="mb-12">
        <div className="flex justify-end mb-4">
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Buy Tokens
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Credit Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Token Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">{currentTokens}</span>
                <span className="text-lg ml-2 text-muted-foreground">tokens</span>
              </div>
            </CardContent>
          </Card>

          {/* Token Price Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Token Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-primary">${tokenPrice}</span>
                <span className="text-lg ml-2 text-muted-foreground">per token</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Token Packages */}
      <div className="grid md:grid-cols-3 gap-6">
        {tokenPacks.map((pack) => (
          <Card
            key={pack.id}
            className={`relative overflow-hidden ${pack.isPopular ? "border-primary shadow-lg" : ""}`}
          >
            {pack.isPopular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-tl-none rounded-br-none bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${pack.color} flex items-center justify-center mb-4`}>
                <pack.icon className="h-6 w-6 text-white" />
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
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={pack.isPopular ? "default" : "outline"} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Usage Information */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">How Tokens Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CV Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost:</span>
                <Badge variant="secondary">10 tokens</Badge>
              </div>
              <p className="text-sm mt-3">Get professional feedback on your CV structure, content, and formatting.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost:</span>
                <Badge variant="secondary">20 tokens</Badge>
              </div>
              <p className="text-sm mt-3">Receive comprehensive feedback with specific improvement suggestions.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost:</span>
                <Badge variant="secondary">40 tokens</Badge>
              </div>
              <p className="text-sm mt-3">Practice with our AI interviewer to prepare for real job interviews.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Final Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost:</span>
                <Badge variant="secondary">20 tokens</Badge>
              </div>
              <p className="text-sm mt-3">Get a comprehensive evaluation of your job readiness and skills.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
