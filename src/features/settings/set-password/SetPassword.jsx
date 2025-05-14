import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";  // Import i18n hook

const SetPassword = () => {
  const { t } = useTranslation();  // Initialize translation hook

  const hasPassword = localStorage.getItem("hasPassword") === "true";
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
      setPasswordError(t("setPassword.passwordErrorLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("setPassword.passwordErrorMatch"));
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
      },
    });
  };

  return (
    <div className="container space-y-8">
      {!hasPassword && (
        <>
          <div className="flex">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("setPassword.setPasswordTitle")}
              </h1>
              <p className="text-muted-foreground">
                {t("setPassword.setPasswordDescription")}
              </p>
            </div>
          </div>
          <Card className="w-full max-w-xl">
            <CardContent>
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("setPassword.newPasswordLabel")}</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t("setPassword.newPasswordPlaceholder")}
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
                  <Label htmlFor="confirmPassword">{t("setPassword.confirmPasswordLabel")}</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("setPassword.confirmPasswordPlaceholder")}
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
                disabled={
                  setPasswordMutation.isPending ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {setPasswordMutation.isPending
                  ? t("setPassword.settingPassword")
                  : t("setPassword.setPasswordButton")}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default SetPassword;

