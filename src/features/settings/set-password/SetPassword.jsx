import React, { useState } from 'react'
import { useSetPassword } from "@/hooks/useSetPassoword.js";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Cookies from "js-cookie";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SetPassword = () => {
    const hasPassword = Cookies.get('hasPassword') === 'true';
    console.log(hasPassword, "hasPassword");
    const setPasswordMutation = useSetPassword();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Handle password submission
    const handleSetPassword = (e) => {
        e.preventDefault();

        // Validate passwords
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        // Clear any previous errors
        setPasswordError("");

        // Submit the password
        setPasswordMutation.mutate(newPassword, {
            onSuccess: () => {
                // Clear form fields after success
                setNewPassword("");
                setConfirmPassword("");
            }
        });
    };

    return (
        <div className="container space-y-8">
            {!hasPassword && (
                <>
                    <div className="flex">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Set Password
                            </h1>
                            <p className="text-muted-foreground">
                                Enhance your account security by setting a password
                            </p>
                        </div>
                    </div>
                    <Card className="w-full max-w-xl">
                        <CardContent>
                            <form onSubmit={handleSetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter a secure password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                    />
                                </div>

                                {passwordError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{passwordError}</AlertDescription>
                                    </Alert>
                                )}
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                onClick={handleSetPassword}
                                disabled={setPasswordMutation.isPending || !newPassword || !confirmPassword}
                            >
                                {setPasswordMutation.isPending ? "Setting Password..." : "Set Password"}
                            </Button>
                        </CardFooter>
                    </Card>
                </>
            )}
        </div>
    )
}

export default SetPassword