import {useState, useRef} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {User, Mail, Lock, ArrowRight, EyeOff, Eye, Phone} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Link} from "react-router-dom";
import {SocialButtons} from "./SocialButtons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import gsap from "gsap";

const formSchema = z.object({
    firstName: z
        .string()
        .min(2, {message: "First name must be at least 2 characters."})
        .regex(/^[a-zA-Z\s]+$/, {message: "First name can only contain letters and spaces."}),
    lastName: z
        .string()
        .min(2, {message: "Last name must be at least 2 characters."})
        .regex(/^[a-zA-Z\s]+$/, {message: "Last name can only contain letters and spaces."}),
    email: z.string().email({message: "Please enter a valid email address."}),
    phone: z
        .string()
        .min(10, {message: "Phone number must be at least 10 digits."})
        .regex(/^\+?[0-9]+$/, {message: "Phone number must contain only digits with an optional + prefix."}),
    password: z.string().min(6, {message: "Password must be at least 6 characters."}),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept terms and privacy policy.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const SignupForm = ({isLoading, handleAuthSubmit, handleOAuthSuccess}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formRef = useRef();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
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
            await handleAuthSubmit(data, "register");
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">First Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                            size={14}/>
                                        <Input
                                            placeholder="John"
                                            className=" pl-10 h-8 text-sm"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({field}) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">Last Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                            size={14}/>
                                        <Input
                                            placeholder="Doe"
                                            className=" pl-10 h-8 text-sm"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs"/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                        size={14}/>
                                    <Input
                                        placeholder="name@company.com"
                                        className=" pl-10 h-8 text-sm"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Phone Number</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                        size={14}/>
                                    <Input
                                        placeholder="+1234567890"
                                        className=" pl-10 h-8 text-sm"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                        size={14}/>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className=" pl-10 pr-10 h-8 text-sm"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                        size={14}/>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className=" pl-10 pr-10 h-8 text-sm"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="terms"
                                    className="h-4 w-4"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel htmlFor="terms" className="text-xs">
                                    I agree to the{" "}
                                    <Link to="#" className="text-purple-400 hover:text-purple-300">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-purple-400 hover:text-purple-300">
                                        Privacy Policy
                                    </Link>
                                </FormLabel>
                                <FormMessage className="text-xs"/>
                            </div>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 h-8 text-sm"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create account"} <ArrowRight className="ml-2" size={14}/>
                </Button>

                <SocialButtons disabled={isLoading} handleOAuthSuccess={handleOAuthSuccess}/>
            </form>
        </Form>
    );
};