import React from "react";
import Image from "next/image";

type LoadingOverlayProps = {
    isVisible: boolean;
    message?: string;
};

export function LoadingOverlay({ isVisible, message = "Processing your request..." }: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/70 backdrop-blur-sm pointer-events-auto">
            <div className="bg-[#121824] border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <div className="bg-black rounded-full p-2 mb-2">
                        <Image
                            src="/degenAI-logo.png"
                            alt="DegenAI Logo"
                            width={80}
                            height={80}
                            className="object-contain animate-pulse"
                            priority
                        />
                    </div>

                    {/* Loading message */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">AI Analysis in Progress</h3>
                        <p className="text-gray-300">{message}</p>
                    </div>

                    {/* Loading bar */}
                    <div className="h-2 w-48 bg-[#1a1f29] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4ade80] animate-loadingBar"></div>
                    </div>
                </div>
            </div>
        </div>
    );
} 