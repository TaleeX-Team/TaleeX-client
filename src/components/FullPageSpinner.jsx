import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
const FullPageSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 bg-background">
            <Card className="p-0 bg-transparent border-none shadow-none">
                <CardContent className="flex flex-col items-center gap-6 py-6">
                    {/* Spinner animation */}
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-blue-500 dark:text-blue-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Loading your content...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default FullPageSpinner;
