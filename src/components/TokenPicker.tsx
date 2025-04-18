"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenChip } from "@/components/TokenChip";

type Token = {
    id: string;
    symbol: string;
    name: string;
    logo?: string;
    market_cap: number;
    price_change_percentage_24h: number;
};

export function TokenPicker() {
    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        // In a real implementation, this would fetch from your API
        const fetchTopTokens = async () => {
            setIsLoading(true);
            try {
                // Mock data for now
                const mockTokens: Token[] = [
                    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", market_cap: 1000000000000, price_change_percentage_24h: 2.5 },
                    { id: "ethereum", symbol: "ETH", name: "Ethereum", market_cap: 500000000000, price_change_percentage_24h: -1.2 },
                    { id: "solana", symbol: "SOL", name: "Solana", market_cap: 50000000000, price_change_percentage_24h: 5.7 },
                    { id: "cardano", symbol: "ADA", name: "Cardano", market_cap: 30000000000, price_change_percentage_24h: 0.8 },
                    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", market_cap: 20000000000, price_change_percentage_24h: -3.1 },
                ];

                setTokens(mockTokens);
            } catch (error) {
                console.error("Failed to fetch top tokens:", error);
            } finally {
                setIsLoading(false);
            }
        };

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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const refreshList = async () => {
        setIsLoading(true);
        try {
            // In a real implementation, this would refresh the token list
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock refreshed data
            const refreshedTokens = [...tokens].sort(() => Math.random() - 0.5);
            setTokens(refreshedTokens);
        } catch (error) {
            console.error("Failed to refresh token list:", error);
        } finally {
            setIsLoading(false);
        }
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
                    Refresh List
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Array(10).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
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