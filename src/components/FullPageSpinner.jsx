import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FullPageSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <Card className="p-6 shadow-lg">
            <CardContent className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-700">Loading...</p>
            </CardContent>
        </Card>
    </div>
);

export default FullPageSpinner;
