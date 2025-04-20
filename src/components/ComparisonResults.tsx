"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PortfolioRanking } from "@/components/TokenPicker";

export function ComparisonResults() {
    const [comparisonData, setComparisonData] = useState<PortfolioRanking | null>(null);

    useEffect(() => {
        // Listen for comparison results
        const handleComparisonComplete = (event: CustomEvent<PortfolioRanking>) => {
            console.log("Comparison results received:", event.detail);
            setComparisonData(event.detail);
        };

        // Add event listener
        window.addEventListener('comparisonComplete', handleComparisonComplete as EventListener);

        // Clean up
        return () => {
            window.removeEventListener('comparisonComplete', handleComparisonComplete as EventListener);
        };
    }, []);

    if (!comparisonData) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h2 className="text-2xl font-bold mb-6 text-[#4ade80]">Features Coming Soon</h2>

                <div className="max-w-2xl mb-8 text-gray-300">
                    <p className="mb-6">We're working on exciting new features to enhance your crypto analysis experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                    <div className="bg-[#111111] p-6 rounded-lg border border-[#222222] hover:border-[#4ade80]/30 transition-colors">
                        <div className="text-3xl mb-4">💬</div>
                        <h3 className="text-lg font-semibold mb-2">Natural Language Research</h3>
                        <p className="text-gray-400">Chat interface to research on-chain data using simple conversational language</p>
                    </div>

                    <div className="bg-[#111111] p-6 rounded-lg border border-[#222222] hover:border-[#4ade80]/30 transition-colors">
                        <div className="text-3xl mb-4">👛</div>
                        <h3 className="text-lg font-semibold mb-2">Wallet Integration</h3>
                        <p className="text-gray-400">Connect your wallet to get balances and AI-powered insights on your portfolio changes daily</p>
                    </div>


                    <div className="bg-[#111111] p-6 rounded-lg border border-[#222222] hover:border-[#4ade80]/30 transition-colors">
                        <div className="text-3xl mb-4">📰</div>
                        <h3 className="text-lg font-semibold mb-2">Live News Feed</h3>
                        <p className="text-gray-400">Stay up to date with the latest global crypto news and market-moving events</p>
                    </div>

                    <div className="bg-[#111111] p-6 rounded-lg border border-[#222222] hover:border-[#4ade80]/30 transition-colors">
                        <div className="text-3xl mb-4">✨</div>
                        <h3 className="text-lg font-semibold mb-2">Enhanced UI</h3>
                        <p className="text-gray-400">Improved visualizations and customizable dashboard for a better user experience</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
        </div>
    );
} 