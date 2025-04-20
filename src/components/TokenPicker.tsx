"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export type Token = {
    id: string;
    symbol: string;
    name: string;
    logo?: string;
    market_cap: number;
    price_change_percentage_24h: number;
    current_price?: number;
};

export type PortfolioRanking = {
    rankedTokens: {
        rank: number;
        symbol: string;
        decision: "BUY" | "HOLD" | "SELL";
        rationale: string;
    }[];
    summary: string;
};

export function TokenPicker() {
    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isComparing, setIsComparing] = useState(false);

    // Add loading message state
    const [loadingMessage, setLoadingMessage] = useState("Processing your request...");

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
        setLoadingMessage(`Analyzing ${selectedTokens.length} token${selectedTokens.length > 1 ? 's' : ''}...`);
        // Dispatch event to indicate analysis has started
        window.dispatchEvent(new CustomEvent('analysisStart'));

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
            console.log("Analysis results:", results);

            // Make sure we're dispatching the correct data structure
            if (results && results.tokens) {
                // Dispatch event with the tokens array for ResultGrid to pick up
                window.dispatchEvent(new CustomEvent('analysisComplete', {
                    detail: results.tokens
                }));
            }

            // Clear selected tokens after successful analysis - moved outside the if block
            setSelectedTokens([]);
        } catch (error) {
            console.error("Analysis failed:", error);
            setError("Analysis failed. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCompareTokens = async () => {
        if (selectedTokens.length < 2) {
            setError("Please select at least 2 tokens to compare.");
            return;
        }

        setIsComparing(true);
        setLoadingMessage(`Comparing ${selectedTokens.length} tokens to optimize your portfolio...`);
        // Dispatch event to indicate comparison has started
        window.dispatchEvent(new CustomEvent('comparisonStart'));

        try {
            // Find the full token objects for the selected IDs
            const tokensToAnalyze = tokens.filter(token => selectedTokens.includes(token.id));

            // Extract just the symbols for the API request
            const symbols = tokensToAnalyze.map(token => token.symbol);

            console.log("Comparing symbols:", symbols);

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

            // Dispatch event with comparison results
            window.dispatchEvent(new CustomEvent('comparisonComplete', {
                detail: results.portfolio
            }));

            // Clear selected tokens after successful comparison - ensure this runs
            setSelectedTokens([]);
        } catch (error) {
            console.error("Comparison failed:", error);
            setError("Comparison failed. Please try again later.");
        } finally {
            setIsComparing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#252525]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Loading Overlay */}
            <LoadingOverlay
                isVisible={isAnalyzing || isComparing}
                message={loadingMessage}
            />

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <div className="text-sm font-bold text-white-600 dark:text-white-400">
                        Top 25 Tokens by Volume in 24h
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Select tokens to compare performance metrics and get AI-powered sentiment analysis and investment recommendations.
                    </p>
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

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">24h %</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market Cap</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Select</th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                        {tokens.map((token, index) => {
                            const isSelected = selectedTokens.includes(token.id);
                            const priceChangeColor = token.price_change_percentage_24h >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400";

                            return (
                                <tr
                                    key={token.id}
                                    className={cn(
                                        "hover:bg-gray-50 dark:hover:bg-gray-800",
                                        isSelected && "bg-[#252525]/50 dark:bg-[#252525]/20"
                                    )}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {token.logo ? (
                                                <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-medium">
                                                    {token.symbol.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{token.symbol}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{token.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-medium text-gray-900 dark:text-white">
                                        ${token.current_price?.toLocaleString() || "N/A"}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${priceChangeColor}`}>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${token.price_change_percentage_24h >= 0
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {token.price_change_percentage_24h >= 0 ? "+" : ""}
                                            {token.price_change_percentage_24h.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                        ${(token.market_cap / 1000000000).toFixed(1)}B
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleToken(token.id)}
                                                className={cn(
                                                    "w-6 h-6 rounded border flex items-center justify-center",
                                                    isSelected
                                                        ? "bg-[#252525] border-[#252525] text-[#D1D1D1]"
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
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="sticky bottom-4 left-0 right-0 flex justify-center gap-4 mt-6">
                <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">{selectedTokens.length} tokens selected</span>
                        <div className="h-8 border-l border-gray-600"></div>

                        <div className="relative flex rounded-full overflow-hidden border border-gray-700">
                            <div
                                className="absolute bg-[#252525]/20 h-full transition-all duration-200 ease-in-out rounded-full"
                                style={{
                                    width: '50%',
                                    left: isAnalyzing ? '50%' : '0%',
                                    transform: isAnalyzing ? 'translateX(0)' : 'translateX(0)'
                                }}
                            />

                            <button
                                onClick={handleCompareTokens}
                                disabled={selectedTokens.length < 2 || isComparing}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors ${!isAnalyzing
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {isComparing ? "Comparing..." : "Compare"}
                            </button>

                            <button
                                onClick={handleAnalyze}
                                disabled={selectedTokens.length === 0 || isAnalyzing}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isAnalyzing
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {isAnalyzing ? "Analyzing..." : "Analyze"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 