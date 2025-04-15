import React from 'react'
import {ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const ForgetPassword = () => {
    return (
        <div
            className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-3xl shadow-lg p-8">
            {/* Left Section - Form */}
            <div className="w-full md:w-1/2 p-6">
                {/* Logo */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <img src="public/logo.svg" alt="Company Logo" className="w-7 h-7"/>
                        <span className="ml-2 font-medium">Your Logo</span>
                    </div>
                </div>

                {/* Back to Login */}
                <button className="flex items-center text-sm text-gray-600 mb-8">
                    <ChevronLeft className="w-4 h-4 mr-1"/>
                    Back to login
                </button>

                {/* Title and Description */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot your password?</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Don't worry, happens to all of us. Enter your email below to recover your password
                </p>

                {/* Email Input */}
                <div className="mb-6">
                    <label className="text-sm text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="john.doe@gmail.com"
                        value="johndoe@gmail.com"
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 h-10"
                    />
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mb-5"
                >
                    Submit
                </Button>

                {/* Divider */}
                <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-xs text-gray-600 uppercase">Or Sign up with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 h-10">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.693v-3.621h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z"
                            />
                        </svg>
                    </button>

                    <button
                        className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 h-10">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                            />
                            <path
                                fill="#34A853"
                                d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.61-1.26 3.43-1.26 5.38s.46 3.77 1.26 5.38l3.98-3.09z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12.255 5.04c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                            />
                        </svg>
                    </button>

                    <button
                        className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 h-10">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="black">
                            <path
                                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Section - Illustration */}
            <div className="hidden md:flex  w-1/2 items-center justify-center p-8">
                <div className="relative w-full">
                    <div className="relative">

                        <img src="public/forget-password.svg" alt="forget" className="w-full h-full object-contain"/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword
