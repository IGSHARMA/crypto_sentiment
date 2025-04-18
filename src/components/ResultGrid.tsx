"use client";

import { useState } from "react";
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
};

export function ResultGrid() {
    const [results, setResults] = useState<AnalysisResult[]>([
        // Mock data for demonstration
        {
            symbol: "BTC",
            name: "Bitcoin",
            price: 62345.78,
            priceChange24h: 2.5,
            explanation: "Bitcoin surged as institutional investors increased positions following positive ETF inflows. Market sentiment improved after the Fed signaled a potential pause in rate hikes.",
            drivers: [
                "Strong ETF inflows of $250M in the last 24h",
                "Reduced selling pressure from miners",
                "Positive technical breakout above $60K resistance"
            ],
            recommendation: "BUY",
            rationale: "Momentum indicators suggest continued uptrend with strong institutional backing."
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            price: 3456.12,
            priceChange24h: -1.2,
            explanation: "Ethereum faced selling pressure as traders rotated capital into Bitcoin and layer-2 solutions. The decline was moderate with support holding at key levels.",
            drivers: [
                "Capital rotation from ETH to BTC",
                "Concerns about high gas fees resurfacing",
                "Delay in next network upgrade announcement"
            ],
            recommendation: "HOLD",
            rationale: "Current weakness appears temporary; fundamentals remain strong."
        }
    ]);

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