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

    const handleAuthSubmit = (data, type) => {
        const mutation = type === "login" ? login.mutate : register.mutate;
        const successMessage = type === "login" ? "Logged in successfully!" : "Account created successfully!";
        const errorMessage = type === "login"
            ? "Something went wrong during login."
            : "Something went wrong during registration.";

        console.log(`Starting ${type} submission...`);

        mutation(data, {
            onSuccess: (data) => {
                console.log(`${type} mutation successful`);
                toast.success(data.message || successMessage);
                if (type === "login") navigate("/");
                if(type === "signup") setActiveTab("login");
            },
            onError: (error) => {
                console.log(`${type} mutation failed`);
                handleError(error, errorMessage);
            },
        });
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <div ref={contentRef}>
                <TabsContent value="login">
                    <LoginForm
                        handleAuthSubmit={(data) => handleAuthSubmit(data, "login")}
                        isLoading={login.isLoading}
                    />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm
                        handleAuthSubmit={(data) => handleAuthSubmit(data, "signup")}
                        isLoading={register.isLoading}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
};