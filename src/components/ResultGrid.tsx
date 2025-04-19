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
    const [chatHistory, setChatHistory] = useState<Array<{
        type: 'analysis' | 'comparison';
        data: any;
        timestamp: Date;
    }>>([]);

    useEffect(() => {
        // Listen for analysis start
        const handleAnalysisStart = () => {
            setLoading(true);
        };

        // Listen for analysis results from TokenPicker
        const handleAnalysisComplete = (event: CustomEvent<AnalysisResult[]>) => {
            console.log("Analysis results received:", event.detail);
            setResults(event.detail);
            setLoading(false);

            // Add to chat history
            setChatHistory(prev => [
                ...prev,
                {
                    type: 'analysis',
                    data: event.detail,
                    timestamp: new Date()
                }
            ]);
        };

        // Listen for comparison results
        const handleComparisonComplete = (event: CustomEvent<any>) => {
            console.log("Comparison results received in ResultGrid:", event.detail);

            // Add to chat history
            setChatHistory(prev => [
                ...prev,
                {
                    type: 'comparison',
                    data: event.detail,
                    timestamp: new Date()
                }
            ]);
        };

        // Add event listeners
        window.addEventListener('analysisStart', handleAnalysisStart as EventListener);
        window.addEventListener('analysisComplete', handleAnalysisComplete as EventListener);
        window.addEventListener('comparisonComplete', handleComparisonComplete as EventListener);

        // Clean up
        return () => {
            window.removeEventListener('analysisStart', handleAnalysisStart as EventListener);
            window.removeEventListener('analysisComplete', handleAnalysisComplete as EventListener);
            window.removeEventListener('comparisonComplete', handleComparisonComplete as EventListener);
        };
    }, []);

    return (
        <div className="space-y-8">
            {/* AI Assistant Chat Interface */}
            {chatHistory.length > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                        <h2 className="text-xl font-semibold">AI Assistant</h2>
                    </div>

                    <div className="space-y-6">
                        {chatHistory.map((item, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                            AI
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            {item.timestamp.toLocaleTimeString()} - {item.type === 'analysis' ? 'Token Analysis' : 'Portfolio Comparison'}
                                        </div>

                                        {item.type === 'analysis' && (
                                            <div className="space-y-6">
                                                {item.data.map((token: AnalysisResult) => (
                                                    <div key={token.symbol} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                                        {/* Token Header */}
                                                        <div className="bg-gray-100 dark:bg-gray-700 p-3 flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-medium text-lg">
                                                                    {token.symbol.charAt(0)}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="font-bold text-lg">{token.symbol}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{token.name}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-mono font-bold">${token.price?.toLocaleString()}</div>
                                                                <div className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2)}%
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Price Movement Explanation */}
                                                        <div className="p-4 border-t dark:border-gray-700">
                                                            <h3 className="font-medium mb-2">Price Movement Explanation</h3>
                                                            <p>{token.explanation || "No price movement explanation available."}</p>
                                                        </div>

                                                        {/* Key Drivers */}
                                                        {token.drivers && token.drivers.length > 0 && (
                                                            <div className="p-4 border-t dark:border-gray-700">
                                                                <h3 className="font-medium mb-2">Key Drivers</h3>
                                                                <ul className="list-disc pl-5 space-y-1">
                                                                    {token.drivers.map((driver: string, idx: number) => (
                                                                        <li key={idx}>{driver}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Recommendation */}
                                                        <div className="p-4 border-t dark:border-gray-700">
                                                            <h3 className="font-medium mb-3">Recommendation</h3>
                                                            <div className="flex items-start">
                                                                <div className={`px-4 py-2 rounded-md text-sm font-medium mr-3 ${token.recommendation === "BUY"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                                    : token.recommendation === "SELL"
                                                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                                    }`}>
                                                                    {token.recommendation}
                                                                </div>
                                                                <p>{token.rationale || "No recommendation reason available."}</p>
                                                            </div>
                                                        </div>

                                                        {/* Sources */}
                                                        {token.sources && token.sources.length > 0 && (
                                                            <div className="p-4 border-t dark:border-gray-700">
                                                                <h3 className="font-medium mb-2">Sources</h3>
                                                                <div className="space-y-3">
                                                                    {token.sources.map((source: any, idx: number) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={source.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block text-blue-600 dark:text-blue-400 hover:underline"
                                                                        >
                                                                            {source.title || source.url}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {item.type === 'comparison' && (
                                            <div className="space-y-6">
                                                {/* Summary */}
                                                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <div className="bg-gray-100 dark:bg-gray-700 p-3">
                                                        <h3 className="font-bold">Portfolio Summary</h3>
                                                    </div>
                                                    <div className="p-4">
                                                        <p>{item.data.summary}</p>
                                                    </div>
                                                </div>

                                                {/* Ranked Tokens */}
                                                {item.data.rankedTokens.map((token: any) => (
                                                    <div
                                                        key={token.symbol}
                                                        className="border dark:border-gray-700 rounded-lg overflow-hidden"
                                                    >
                                                        <div className="bg-gray-100 dark:bg-gray-700 p-3 flex items-center">
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-lg">
                                                                {token.rank}
                                                            </div>
                                                            <div className="ml-3 flex-grow">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-bold text-lg">{token.symbol}</h4>
                                                                    <span className={`px-4 py-2 rounded-md text-sm font-medium ${token.decision === "BUY"
                                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                                        : token.decision === "SELL"
                                                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                                        }`}>
                                                                        {token.decision}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <p>{token.rationale}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analysis Results Section */}
            <div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h2 className="text-xl font-semibold">Analysis Results</h2>
                </div>
                <div className="mt-4">
                    {loading ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">
                                Analyzing tokens...
                            </p>
                        </div>
                    ) : !results || results.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">
                                Select tokens above and click "Analyze" to see results here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.isArray(results) ? (
                                results.map(result => (
                                    <TokenCard key={result.symbol} result={result} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No analysis results available yet
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}