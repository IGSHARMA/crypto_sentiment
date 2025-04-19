"use client";

import { useState, useEffect } from "react";
import { TokenCard } from "@/components/TokenCard";

type AnalysisResult = {
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    explanation: string;
    drivers: string[];
    recommendation: "BUY" | "HOLD" | "SELL";
    rationale: string;
    sources: any[];
};

export function ResultGrid() {
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Listen for analysis results from TokenPicker
        const handleAnalysisComplete = (event: CustomEvent<AnalysisResult[]>) => {
            setResults(event.detail);
        };

        // Add event listener
        window.addEventListener('analysisComplete', handleAnalysisComplete as EventListener);

        // Clean up
        return () => {
            window.removeEventListener('analysisComplete', handleAnalysisComplete as EventListener);
        };
    }, []);

    if (results.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                    Select tokens above and click "Analyze" to see results here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(result => (
                <TokenCard key={result.symbol} result={result} />
            ))}
        </div>
    );
} 