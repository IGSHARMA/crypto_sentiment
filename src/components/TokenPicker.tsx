"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenChip } from "@/components/TokenChip";

// Match the type from our API
type Token = {
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
                    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", market_cap: 1000000000000, price_change_percentage_24h: 2.5 },
                    { id: "ethereum", symbol: "ETH", name: "Ethereum", market_cap: 500000000000, price_change_percentage_24h: -1.2 },
                    { id: "solana", symbol: "SOL", name: "Solana", market_cap: 50000000000, price_change_percentage_24h: 5.7 },
                    { id: "cardano", symbol: "ADA", name: "Cardano", market_cap: 30000000000, price_change_percentage_24h: 0.8 },
                    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", market_cap: 20000000000, price_change_percentage_24h: -3.1 },
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

    const toggleToken = (symbol: string) => {
        setSelectedTokens(prev =>
            prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : prev.length < 10
                    ? [...prev, symbol]
                    : prev
        );
    };

    const handleAnalyze = async () => {
        if (selectedTokens.length === 0) return;

        setIsAnalyzing(true);

        try {
            // In a real implementation, this would call your API
            console.log("Analyzing tokens:", selectedTokens);

            // Here you would call your analysis API
            // const response = await fetch('/api/analyze', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ symbols: selectedTokens })
            // });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const refreshList = async () => {
        await fetchTopTokens();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    {selectedTokens.length}/10 tokens selected
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshList}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Refresh List"}
                </Button>
            </div>

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Array(10).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {tokens.map(token => (
                        <TokenChip
                            key={token.id}
                            token={token}
                            isSelected={selectedTokens.includes(token.symbol)}
                            onToggle={() => toggleToken(token.symbol)}
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-end mt-6">
                <Button
                    onClick={handleAnalyze}
                    disabled={selectedTokens.length === 0 || isAnalyzing}
                    className="w-full sm:w-auto"
                >
                    {isAnalyzing ? "Analyzing..." : "Analyze Selected Tokens"}
                </Button>
            </div>
        </div>
    );
} 