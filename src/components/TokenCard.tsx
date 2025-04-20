"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AnalysisResult = {
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    explanation: string;
    drivers: string[];
    recommendation: "BUY" | "HOLD" | "SELL";
    rationale: string;
    sources: {
        title: string;
        url: string;
        summary: string;
    }[];
};

type TokenCardProps = {
    result: AnalysisResult;
};

export function TokenCard({ result }: TokenCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const recommendationColor = {
        BUY: "bg-[#4ade80]/20 text-[#4ade80]",
        HOLD: "bg-yellow-500/20 text-yellow-400",
        SELL: "bg-red-500/20 text-red-400"
    }[result.recommendation];

    const priceChangeColor = result.priceChange24h >= 0
        ? "text-[#4ade80]"
        : "text-red-400";

    return (
        <>
            <div className="bg-[#080808] border border-[#222222] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-[#222222]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-lg font-bold">
                                {result.symbol.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <h3 className="font-medium">{result.symbol}</h3>
                                <p className="text-sm text-gray-400">{result.name}</p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${recommendationColor}`}>
                            {result.recommendation}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Price</span>
                        <span className="font-mono font-medium">${result.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">24h Change</span>
                        <span className={priceChangeColor}>
                            {result.priceChange24h >= 0 ? "+" : ""}{result.priceChange24h.toFixed(2)}%
                        </span>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Analysis</h4>
                        <p className="text-sm text-gray-300">{result.explanation}</p>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Key Drivers</h4>
                        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                            {result.drivers.map((driver, index) => (
                                <li key={index}>{driver}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">Recommendation Rationale</h4>
                        <p className="text-sm text-gray-300">{result.rationale}</p>
                    </div>
                </div>
            </div>
        </>
    );
} 