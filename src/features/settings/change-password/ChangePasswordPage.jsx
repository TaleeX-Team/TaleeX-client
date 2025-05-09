import { useState } from "react";
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
import { AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useChangePassword } from "@/hooks/useChangePassword";

export default function ChangePasswordPage() {
    const changePasswordMutation = useChangePassword();

    // Form state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Password requirements
    const minLength = 8;
    const hasMinLength = newPassword.length >= minLength;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    // Check if all requirements are met
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    const doPasswordsMatch = newPassword === confirmPassword && confirmPassword !== "";

    // Handle password change submission
    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate all inputs are provided
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("All fields are required");
            return;
        }

        // Validate password meets requirements
        if (!isPasswordValid) {
            setPasswordError("Your new password doesn't meet all requirements");
            return;
        }

        // Validate passwords match
        if (!doPasswordsMatch) {
            setPasswordError("New passwords do not match");
            return;
        }

        // Clear any previous errors
        setPasswordError("");

        // Submit the password change
        const result = await changePasswordMutation.mutateAsync({
            oldPassword,
            newPassword
        });

        if (result) {
            // Show success message and reset form
            setIsSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Reset success message after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        }
    };

    return (
        <div className="container space-y-8">
            <div className="flex">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Change Password
                    </h1>
                    <p className="text-muted-foreground">
                        Update your password to keep your account secure

                    </p>
                </div>
            </div>
            <Card className="w-full max-w-xl">
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                >
                                    {showOldPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {/* Password requirements */}
                            <div className="text-sm space-y-1 mt-2">
                                <p className="text-muted-foreground">Password requirements:</p>
                                <ul className="space-y-1">
                                    <li className="flex items-center gap-2">
                                        <span className={hasMinLength ? "text-green-500" : "text-gray-400"}>
                                            {hasMinLength ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                                            )}
                                        </span>
                                        <span className={hasMinLength ? "text-green-500" : ""}>
                                            At least {minLength} characters
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={hasUpperCase ? "text-green-500" : "text-gray-400"}>
                                            {hasUpperCase ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                                            )}
                                        </span>
                                        <span className={hasUpperCase ? "text-green-500" : ""}>
                                            At least one uppercase letter
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={hasLowerCase ? "text-green-500" : "text-gray-400"}>
                                            {hasLowerCase ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                                            )}
                                        </span>
                                        <span className={hasLowerCase ? "text-green-500" : ""}>
                                            At least one lowercase letter
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={hasNumber ? "text-green-500" : "text-gray-400"}>
                                            {hasNumber ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                                            )}
                                        </span>
                                        <span className={hasNumber ? "text-green-500" : ""}>
                                            At least one number
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={hasSpecialChar ? "text-green-500" : "text-gray-400"}>
                                            {hasSpecialChar ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                                            )}
                                        </span>
                                        <span className={hasSpecialChar ? "text-green-500" : ""}>
                                            At least one special character
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                            />
                            {/* Show check mark if passwords match and are not empty */}
                            {doPasswordsMatch && (
                                <div className="flex items-center gap-2 text-sm text-green-500 mt-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Passwords match</span>
                                </div>
                            )}
                        </div>

                        {/* Error message */}
                        {passwordError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{passwordError}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success message */}
                        {isSuccess && (
                            <Alert variant="success" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>Password changed successfully!</AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        onClick={handleChangePassword}
                        disabled={
                            changePasswordMutation.isPending ||
                            !oldPassword ||
                            !isPasswordValid ||
                            !doPasswordsMatch
                        }
                        className="w-full sm:w-auto"
                    >
                        {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}