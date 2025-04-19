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
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Portfolio Comparison</h2>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium mb-3">Summary</h3>
                <p className="text-gray-300">{comparisonData.summary}</p>
            </div>

            <div className="space-y-4">
                {comparisonData.rankedTokens.map((token, index) => (
                    <div
                        key={token.symbol}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lg">
                            {token.rank}
                        </div>
                        <div className="ml-4 flex-grow">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-medium">{token.symbol}</h4>
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${token.decision === "BUY"
                                        ? "bg-green-900 text-green-100"
                                        : token.decision === "SELL"
                                            ? "bg-red-900 text-red-100"
                                            : "bg-yellow-900 text-yellow-100"
                                    }`}>
                                    {token.decision}
                                </span>
                            </div>
                            <p className="text-gray-400 mt-1">{token.rationale}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 