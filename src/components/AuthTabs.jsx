import {useRef, useEffect} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import gsap from "gsap";
import {LoginForm} from "./LoginForm";
import {SignupForm} from "@/components/SignupForm.jsx";
import {useAuth} from "@/hooks/useAuth";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

export const AuthTabs = ({
                             activeTab,
                             setActiveTab
                         }) => {
    const contentRef = useRef();
    const navigate = useNavigate();
    const {login, register} = useAuth();

    useEffect(() => {
        gsap.fromTo(
            contentRef.current,
            {opacity: 0, y: 10},
            {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"}
        );
    }, [activeTab]);

    const handleError = (error, fallbackMessage) => {
        console.error("Auth failed:", error?.message);
        const details = error?.response?.data?.details;
        const message = error?.response?.data?.message;

        if (details && typeof details === "object") {
            Object.values(details).forEach((msg) => toast.error(msg));
        } else if (message) {
            toast.error(message);
        } else {
            toast.error(fallbackMessage);
        }
    };

    // Compatible method that works with the existing LoginForm/SignupForm
    const handleAuthSubmit = (data, type) => {
        console.log(`Starting ${type} submission...`);

        if (type === "login") {
            console.log("Login loading state:", login.isLoading);
            login.mutate(data, {
                onSuccess: (data) => {
                    console.log("Login mutation successful");
                    toast.success(data.message || "Logged in successfully!");
                    navigate("/");
                },
                onError: (error) => {
                    console.log("Login mutation failed");
                    handleError(error, "Something went wrong during login.");
                }
            });
        } else if (type === "signup") {
            console.log("Register loading state:", register.isLoading);
            register.mutate(data, {
                onSuccess: (data) => {
                    console.log("Signup mutation successful");
                    toast.success(data.message || "Account created successfully!");
                    setActiveTab("login");
                },
                onError: (error) => {
                    console.log("Signup mutation failed");
                    handleError(error, "Something went wrong during registration.");
                }
            });
        }
    };

    const handleOAuthSuccess = () => {
        navigate("/");
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-gray-900 border border-purple-200 dark:border-purple-900">
                <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white dark:text-purple-200 dark:data-[state=inactive]:text-purple-400"
                >
                    Sign In
                </TabsTrigger>
                <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-white dark:text-purple-200 dark:data-[state=inactive]:text-purple-400"
                >
                    Sign Up
                </TabsTrigger>
            </TabsList>

            <div ref={contentRef} className="mt-4">
                <TabsContent value="login">
                    <LoginForm
                        handleAuthSubmit={handleAuthSubmit}
                        isLoading={login.isLoading}
                        handleOAuthSuccess={handleOAuthSuccess}
                    />
                </TabsContent>
                <TabsContent value="signup">
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