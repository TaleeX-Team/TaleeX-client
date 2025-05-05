"use client"

import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle, XCircle, Home, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const VerifyEmail = () => {
    const { verificationToken } = useParams() // Assuming the token is passed as a URL parameter
    const { verifyEmail } = useAuth()
    const navigate = useNavigate()

    // Use a ref to track if we've already attempted verification
    const verificationAttempted = React.useRef(false)

    useEffect(() => {
        // Only attempt verification once
        if (verificationToken && !verificationAttempted.current) {
            verifyEmail.mutate(verificationToken)
            verificationAttempted.current = true
        }
    }, [verificationToken])

    const handleGoHome = () => {
        navigate("/")
    }

    if (verifyEmail.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
                <Card className="w-full max-w-md border-t-4 border-primary">
                    <CardHeader className="text-center">
                        <h2 className="text-3xl font-extrabold">Verifying Email</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Please wait while we verify your email address
                        </p>
                    </CardHeader>
                    <CardContent className="flex justify-center pt-6 pb-8">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (verifyEmail.isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
                <Card className="w-full max-w-md border-t-4 border-destructive">
                    <CardHeader className="text-center">
                        <XCircle className="mx-auto h-16 w-16 text-destructive" />
                        <h2 className="mt-4 text-3xl font-extrabold">Verification Failed</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {verifyEmail.error?.message ||
                                verifyEmail.error?.response?.data?.message ||
                                "We couldn't verify your email address. The link may have expired or is invalid."}
                        </p>
                    </CardHeader>
                    <CardFooter className="flex justify-center pb-6">
                        <Button
                            onClick={handleGoHome}
                            variant="destructive"
                            className="mt-4 px-8"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Return to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            <Card className="w-full max-w-md border-t-4 border-green-500 dark:border-green-400">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400" />
                    <h2 className="mt-4 text-3xl font-extrabold">Email Verified!</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {verifyEmail.data?.message ||
                            "Your email has been successfully verified. You can now access all features of your account."}
                    </p>
                </CardHeader>
                <CardFooter className="flex justify-center pb-6">
                    <Button
                        onClick={handleGoHome}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Go to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default VerifyEmail