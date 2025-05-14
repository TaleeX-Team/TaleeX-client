import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ArrowRight, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { SocialButtons } from "./SocialButtons";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider";
import gsap from "gsap";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LoadingIndicator } from "@/components/LoadingButton.jsx";
import { useTranslation } from "react-i18next"; // Import the i18n hook

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    rememberMe: z.boolean().optional(),
});

export const LoginForm = ({ isLoading, handleAuthSubmit, handleOAuthSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const formRef = useRef();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { t } = useTranslation(); // Initialize translation hook

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data) => {
        if (formRef.current) {
            gsap.to(formRef.current, {
                scale: 0.98,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
            });
        }

        try {
            await handleAuthSubmit(data, "login");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel
                                className={`font-medium ${isDark ? "text-foreground" : "text-foreground"}`}
                            >
                                {t("loginForm.email")} {/* Translated */}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-muted-foreground" : "text-muted-foreground"}`}
                                        size={16}
                                    />
                                    <Input
                                        placeholder={t("loginForm.emailPlaceholder")} 
                                        className={`pl-10 ${isDark
                                            ? "bg-input text-foreground border-border focus:border-primary focus:ring-primary/30"
                                            : "bg-input text-foreground border-border focus:border-primary focus:ring-primary/20"
                                        }`}
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-destructive text-sm" />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel
                                className={`font-medium ${isDark ? "text-foreground" : "text-foreground"}`}
                            >
                                {t("loginForm.password")} {/* Translated */}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-muted-foreground" : "text-muted-foreground"}`}
                                        size={16}
                                    />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className={`pl-10 pr-10 ${isDark
                                            ? "bg-input text-foreground border-border focus:border-primary focus:ring-primary/30"
                                            : "bg-input text-foreground border-border focus:border-primary focus:ring-primary/20"
                                        }`}
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-destructive text-sm" />
                        </FormItem>
                    )}
                />

                {/* Remember Me Checkbox and Forgot Password */}
                <div className="flex items-center justify-between">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        id="remember"
                                        className={isDark ? "border-border data-[state=checked]:bg-primary" : "border-border data-[state=checked]:bg-primary"}
                                    />
                                </FormControl>
                                <Label htmlFor="remember" className={`text-sm ${isDark ? "text-muted-foreground" : "text-muted-foreground"}`}>
                                    {t("loginForm.rememberMe")} {/* Translated */}
                                </Label>
                            </FormItem>
                        )}
                    />
                    <Link
                        to="forget-password"
                        className={`text-sm ${isDark ? "text-primary hover:text-primary/80" : "text-primary hover:text-primary/80"} transition-colors`}
                    >
                        {t("loginForm.forgotPassword")} {/* Translated */}
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300`}
                    disabled={isLoading}
                >
                    {isLoading ? <>
                        <LoadingIndicator className="mr-2" />
                        {t("loginForm.processing")} {/* Translated */}
                    </> : t("loginForm.signIn")} {/* Translated */}
                    <ArrowRight className="ml-2" size={16} />
                </Button>

                {/* Social Buttons */}
                <SocialButtons disabled={isLoading} handleOAuthSuccess={handleOAuthSuccess} />
            </form>
        </Form>
    );
};
