import React from "react";

type LoadingOverlayProps = {
    isVisible: boolean;
    message?: string;
};

export function LoadingOverlay({ isVisible, message = "Processing your request..." }: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/90 border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                    {/* Animated loading spinner */}
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-blue-400 animate-spin animation-delay-150"></div>
                        <div className="absolute inset-4 rounded-full border-4 border-t-blue-300 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
                    </div>

                    {/* Loading message */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">AI Analysis in Progress</h3>
                        <p className="text-gray-300">{message}</p>
                    </div>

                    {/* Animated dots */}
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse animation-delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse animation-delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
} 