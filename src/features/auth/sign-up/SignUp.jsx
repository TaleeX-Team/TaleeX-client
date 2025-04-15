import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Card} from "@/components/ui/card";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phoneNumber: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and privacy policy.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
        },
    });

    function onSubmit(values) {
        console.log(values);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="hidden md:block w-2/5 bg-purple-50 relative">
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src="public/signup.svg"
                                    alt="Mobile signup"
                                    className="w-auto h-full max-w-full"
                                    style={{maxHeight: "100%"}} // Adjust this value as needed
                                />
                            </div>
                        </div>

                        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20"></div>
                        <div
                            className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20"></div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-3/5 p-6 md:p-10">
                        <div className="flex justify-end mb-8">
                            <div className="flex items-center gap-2">
                                <img
                                    src="public/logo.svg"
                                    alt="Company Logo"
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                                <span className="text-lg md:text-xl font-bold text-gray-800">
        Your Brand
      </span>
                            </div>
                        </div>

                        <div className="max-w-md mx-auto">
                            <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign up</h1>
                            <p className="text-gray-600 mb-8">Let's get you all set up so you can access your personal
                                account.</p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="john.doe@gmail.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 (555) 000-0000" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••••••••••"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="••••••••••••••••"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={16}/> :
                                                                <Eye size={16}/>}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="termsAccepted"
                                        render={({field}) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-normal">
                                                        I agree to all the <span
                                                        className="text-blue-500 font-medium cursor-pointer">Terms</span> and <span
                                                        className="text-pink-500 font-medium cursor-pointer">Privacy Policies</span>
                                                    </FormLabel>
                                                    <FormMessage/>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        Create account
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-5 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? <span
                                    className="text-blue-600 font-medium cursor-pointer hover:underline">Login</span>
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="relative">
                                    <Separator className="absolute inset-0"/>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="px-4 bg-white text-gray-500">Or Sign up with</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <Button variant="outline" className="flex items-center justify-center">
                                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.693v-3.621h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z"/>
                                        </svg>
                                    </Button>

                                    <Button variant="outline" className="flex items-center justify-center">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4"
                                                  d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                                            <path fill="#34A853"
                                                  d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"/>
                                            <path fill="#FBBC05"
                                                  d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.61-1.26 3.43-1.26 5.38s.46 3.77 1.26 5.38l3.98-3.09z"/>
                                            <path fill="#EA4335"
                                                  d="M12.255 5.04c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                                        </svg>
                                    </Button>

                                    <Button variant="outline" className="flex items-center justify-center">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="black">
                                            <path
                                                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}