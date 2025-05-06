import { useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import gsap from "gsap";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "@/components/SignupForm.jsx";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AuthTabs = ({
    activeTab,
    setActiveTab
}) => {
    const contentRef = useRef();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    useEffect(() => {
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    }, [activeTab]);

    // Check authentication status and redirect if already logged in
    useEffect(() => {
        const checkAuthAndRedirect = () => {
            if (login.isSuccess || register.isSuccess) {
                navigate("/app/companies", { replace: true });
            }
        };

        checkAuthAndRedirect();
    }, [login.isSuccess, register.isSuccess, navigate]);

    const handleError = (error, fallbackMessage) => {
        const details = error.response?.data?.details;
        const message = error.response?.data?.message;

        if (details && typeof details === "object") {
            Object.values(details).forEach((msg) => toast.error(msg));
        } else if (message) {
            toast.error(message);
        } else {
            toast.error(fallbackMessage || "Authentication failed. Please try again.");
        }
    };

    const handleAuthSubmit = (data, type) => {
        console.log(`Starting ${type} submission...`);

        if (type === "login") {
            console.log("Login loading state:", login.isLoading);
            login.mutate(data, {
                onSuccess: (data) => {
                    console.log("Login mutation successful");
                    toast.success(data.message || "Logged in successfully!");
                    navigate("/app/companies", { replace: true });
                },
                onError: (error) => {
                    handleError(error);
                }
            });
        } else if (type === "signup") {
            console.log("Register loading state:", register.isLoading);
            register.mutate(data, {
                onSuccess: (data) => {
                    console.log("Registration successful");
                    toast.success(data.message || "Account created successfully!");
                    navigate("/app/companies", { replace: true });
                },
                onError: (error) => {
                    handleError(error);
                }
            });
        }
    };

    const handleOAuthSuccess = () => {
        navigate("/app/companies", { replace: true });
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 dark:bg-card backdrop-blur-sm border border-border dark:border-border rounded-lg mb-4 h-10">
                <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-accent data-[state=active]:text-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                >
                    Sign In
                </TabsTrigger>
                <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-accent data-[state=active]:text-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                >
                    Sign Up
                </TabsTrigger>
            </TabsList>

            <div ref={contentRef} className="mt-4 transition-all duration-300">
                <TabsContent value="login" className="focus-visible:outline-none focus-visible:ring-0">
                    <LoginForm
                        handleAuthSubmit={handleAuthSubmit}
                        isLoading={login.isLoading}
                        handleOAuthSuccess={handleOAuthSuccess}
                    />
                </TabsContent>
                <TabsContent value="signup" className="focus-visible:outline-none focus-visible:ring-0">
                    <SignupForm
                        handleAuthSubmit={handleAuthSubmit}
                        isLoading={register.isLoading}
                        handleOAuthSuccess={handleOAuthSuccess}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
};