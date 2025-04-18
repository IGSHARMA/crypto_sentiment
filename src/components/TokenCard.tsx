"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
};

type TokenCardProps = {
    result: AnalysisResult;
};

export function TokenCard({ result }: TokenCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const recommendationColor = {
        BUY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        HOLD: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        SELL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    }[result.recommendation];

    const priceChangeColor = result.priceChange24h >= 0
        ? "text-green-600"
        : "text-red-600";

    return (
        <>
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-medium">
                                {result.symbol.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold">{result.symbol}</h3>
                                <p className="text-sm text-gray-500">{result.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-medium">${result.price.toLocaleString()}</div>
                            <div className={cn("text-sm font-medium", priceChangeColor)}>
                                {result.priceChange24h >= 0 ? "+" : ""}
                                {result.priceChange24h.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">24h Analysis</h4>
                        <p className="text-sm line-clamp-3">{result.explanation}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className={cn("px-3 py-1 rounded-full text-sm font-medium", recommendationColor)}>
                            {result.recommendation}
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>{result.symbol} ({result.name}) Analysis</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Price Movement Explanation</h4>
                                        <p className="text-sm">{result.explanation}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Key Drivers</h4>
                                        <ul className="list-disc pl-5 text-sm space-y-1">
                                            {result.drivers.map((driver, i) => (
                                                <li key={i}>{driver}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Recommendation</h4>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("px-3 py-1 rounded-full text-sm font-medium", recommendationColor)}>
                                                {result.recommendation}
                                            </div>
                                            <p className="text-sm">{result.rationale}</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    );
} 