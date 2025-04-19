"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type Token = {
    id: string;
    symbol: string;
    name: string;
    logo?: string;
    market_cap: number;
    price_change_percentage_24h: number;
    current_price?: number;
};

export function TokenPicker() {
    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopTokens = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/top25');

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setTokens(data);
        } catch (error) {
            console.error("Failed to fetch top tokens:", error);
            setError("Failed to load token data. Please try again later.");

            // Fallback to mock data in development
            if (process.env.NODE_ENV === 'development') {
                const mockTokens: Token[] = [
                    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", market_cap: 1000000000000, price_change_percentage_24h: 2.5, current_price: 84523 },
                    { id: "ethereum", symbol: "ETH", name: "Ethereum", market_cap: 500000000000, price_change_percentage_24h: -1.2, current_price: 3245 },
                    { id: "solana", symbol: "SOL", name: "Solana", market_cap: 50000000000, price_change_percentage_24h: 5.7, current_price: 133 },
                    { id: "cardano", symbol: "ADA", name: "Cardano", market_cap: 30000000000, price_change_percentage_24h: 0.8, current_price: 0.45 },
                    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", market_cap: 20000000000, price_change_percentage_24h: -3.1, current_price: 0.15 },
                ];
                setTokens(mockTokens);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopTokens();
    }, []);

    const toggleToken = (tokenId: string) => {
        setSelectedTokens(prev => {
            if (prev.includes(tokenId)) {
                return prev.filter(id => id !== tokenId);
            } else {
                if (prev.length >= 10) {
                    return prev;
                }
                return [...prev, tokenId];
            }
        });
    };

    const handleAnalyze = async () => {
        if (selectedTokens.length === 0) return;

        setIsAnalyzing(true);
        try {
            // Find the full token objects for the selected IDs
            const tokensToAnalyze = tokens.filter(token => selectedTokens.includes(token.id));

            // Extract just the symbols for the API request
            const symbols = tokensToAnalyze.map(token => token.symbol);

            console.log("Analyzing symbols:", symbols);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbols }),
            });

            if (!response.ok) {
                throw new Error(`Analysis API error: ${response.status}`);
            }

            const results = await response.json();

            // Dispatch event with results for ResultGrid to pick up
            const event = new CustomEvent('analysisComplete', { detail: results });
            window.dispatchEvent(event);

        } catch (error) {
            console.error("Analysis failed:", error);
            setError("Analysis failed. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">24h %</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Select</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {Array(10).fill(0).map((_, i) => (
                                <tr key={i} className="bg-white dark:bg-gray-900">
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Skeleton className="h-4 w-4" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div>
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-3 w-24 mt-1" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Skeleton className="h-6 w-6 mx-auto rounded" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="text-sm">
                    {selectedTokens.length}/10 tokens selected
                </div>
                <Button
                    onClick={fetchTopTokens}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                >
                    Refresh List
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">24h %</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Select</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {tokens.map((token, index) => {
                            const isSelected = selectedTokens.includes(token.id);
                            const priceChangeColor = token.price_change_percentage_24h >= 0
                                ? "text-green-600"
                                : "text-red-600";

                            return (
                                <tr
                                    key={token.id}
                                    className={cn(
                                        "bg-white dark:bg-gray-900",
                                        isSelected && "bg-blue-50 dark:bg-blue-950"
                                    )}
                                >
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {token.logo ? (
                                                <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-medium">
                                                    {token.symbol.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{token.symbol}</div>
                                                <div className="text-xs text-gray-500">{token.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-medium">
                                        ${token.current_price?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-medium ${priceChangeColor}`}>
                                        {token.price_change_percentage_24h >= 0 ? "+" : ""}
                                        {token.price_change_percentage_24h.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        ${(token.market_cap / 1000000000).toFixed(1)}B
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleToken(token.id)}
                                            className={cn(
                                                "w-6 h-6 rounded border flex items-center justify-center",
                                                isSelected
                                                    ? "bg-blue-500 border-blue-500 text-white"
                                                    : "border-gray-300 dark:border-gray-600"
                                            )}
                                            disabled={selectedTokens.length >= 10 && !isSelected}
                                        >
                                            {isSelected && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleAnalyze}
                    disabled={selectedTokens.length === 0 || isAnalyzing}
                    className="px-6"
                >
                    {isAnalyzing ? "Analyzing..." : "Analyze Selected Tokens"}
                </Button>
            </div>
        </div>
    );
} 