import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ArrowRight, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Link, useNavigate} from "react-router-dom";
import { SocialButtons } from "./SocialButtons";

import gsap from "gsap";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    rememberMe: z.boolean().optional(),
})

export const LoginForm = ({ isLoading, handleAuthSubmit ,handleOAuthSuccess}) => {
    const [showPassword, setShowPassword] = useState(false);
    const formRef = useRef();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    const onSubmit = async (data) => {
        if (formRef.current) {
            gsap.to(formRef.current, {
                scale: 0.98,
                duration: 0.2,
                yoyo: true,
                repeat: 1
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
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        placeholder="name@company.com"
                                        className="glass-card pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className="glass-card pl-10 pr-10"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                    />
                                </FormControl>
                                <Label htmlFor="remember" className="text-sm">
                                    Remember me
                                </Label>
                            </FormItem>
                        )}
                    />
                    <Link
                        to="forget-password"
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2" />
                </Button>

                <SocialButtons disabled={isLoading} handleOAuthSuccess={handleOAuthSuccess} />
            </form>
        </Form>
    );
};