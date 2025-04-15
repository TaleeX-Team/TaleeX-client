import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ChevronLeft, Eye, EyeOff, Shield, Lock} from 'lucide-react';

export default function VerificationCodePage() {
    const [code, setCode] = useState('7789BMEX');
    const [showCode, setShowCode] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="p-6 md:p-10 w-full md:w-1/2 flex flex-col">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center">
                            <img src="public/logo.svg" alt="Company Logo" className="w-7 h-7"/>
                            <span className="ml-2 font-medium">Your Logo</span>
                        </div>
                    </div>

                    {/* Back to login */}
                    <button className="flex items-center text-sm text-gray-600 mb-8">
                        <ChevronLeft className="w-4 h-4 mr-1"/>
                        Back to login
                    </button>

                    {/* Heading */}
                    <h1 className="text-2xl font-bold mb-2">Verify code</h1>
                    <p className="text-gray-600 mb-6">An authentication code has been sent to your email.</p>

                    {/* Verification input */}
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Code
                        </label>
                        <div className="relative">
                            <Input
                                id="code"
                                type={showCode ? "text" : "password"}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowCode(!showCode)}
                            >
                                {showCode ? (
                                    <EyeOff className="h-4 w-4 text-gray-400"/>
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Didn't receive */}
                    <div className="mb-6">
                        <button className="text-sm text-rose-500 hover:underline">
                            Didn't receive a code? <span className="font-medium text-blue-600">Resend</span>
                        </button>
                    </div>

                    {/* Verify button */}
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                    >
                        Verify
                    </Button>
                </div>

                {/* Right side - Illustration (hidden on mobile) */}
                <div className="hidden md:flex bg-gray-100 w-1/2 items-center justify-center p-8">
                    <div className="relative w-full">
                        <div className="relative">

                            <img src="public/verify.svg" alt="verify" className="w-full h-full object-contain"/>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}