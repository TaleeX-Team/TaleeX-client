import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Eye, EyeOff} from "lucide-react";

const SetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div
                className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-3xl shadow-lg p-8">
                {/* Left Section - Form */}
                <div className="w-full md:w-1/2 p-6 mb-32">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center">
                            <img src="public/logo.svg" alt="Company Logo" className="w-7 h-7"/>
                            <span className="ml-2 font-medium">Your Logo</span>
                        </div>
                    </div>


                    {/* Title and Description */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Set a password</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Your previous password has been reseted. Please set a new password for your account.
                    </p>

                    {/* Password Input */}
                    <div className="mb-4">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Set a password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </Button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Set a password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </Button>
                        </div>
                    </div>

                    {/* Set Password Button */}
                    <Button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition h-10">
                        Set password
                    </Button>
                </div>

                {/* Right Section - Illustration */}
                <div className="hidden md:flex  w-1/2 items-center justify-center p-8">
                    <div className="relative w-full">
                        <div className="relative">

                            <img src="public/forget-password.svg" alt="forget"
                                 className="w-full h-full object-contain"/>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;