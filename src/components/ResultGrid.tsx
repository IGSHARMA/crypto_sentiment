"use client";

import { useState, useEffect, useRef } from "react";
import { TokenCard } from "@/components/TokenCard";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons for the accordion

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
        type: 'analysis' | 'comparison' | 'welcome';
        data: any;
        timestamp: Date;
    }>>([
        // Add a default welcome message
        {
            type: 'welcome',
            data: {
                message: "Welcome to Portfolio Scout! Select tokens above and click 'Analyze' to see detailed analysis, or select multiple tokens and click 'Compare' to see portfolio recommendations."
            },
            timestamp: new Date()
        }
    ]);

    // State for accordion sections
    const [analysisOpen, setAnalysisOpen] = useState(false);
    const [comparisonOpen, setComparisonOpen] = useState(false);

    // State for formatted timestamps (client-side only)
    const [formattedTimes, setFormattedTimes] = useState<{ [key: number]: string }>({});

    // Flag to track if component has mounted (client-side only)
    const hasMounted = useRef(false);

    // Reference to the chat container
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Format timestamps after component has mounted (client-side only)
    useEffect(() => {
        hasMounted.current = true;

        // Format all timestamps
        const times: { [key: number]: string } = {};
        chatHistory.forEach((item, index) => {
            times[index] = item.timestamp.toLocaleTimeString();
        });
        setFormattedTimes(times);
    }, [chatHistory]);

    // Auto-scroll to bottom when chat history changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

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

            // Auto-open the analysis section when new results arrive
            setAnalysisOpen(true);
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

            // Auto-open the comparison section when new results arrive
            setComparisonOpen(true);
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

    // Get analysis history
    const analysisHistory = chatHistory.filter(item => item.type === 'analysis');

    // Get comparison history
    const comparisonHistory = chatHistory.filter(item => item.type === 'comparison');

    return (
        <div className="space-y-8">
            {/* AI Assistant Chat Interface - Always visible */}
            <div className="mt-8 space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h2 className="text-xl font-semibold">AI Assistant</h2>
                </div>

                <div
                    ref={chatContainerRef}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden max-h-[800px] overflow-y-auto"
                >
                    {chatHistory.map((item, index) => (
                        <div key={index} className="p-4 border-b last:border-b-0 dark:border-gray-700">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                        AI
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {item.type === 'welcome' ? (
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                {/* Only show formatted time if component has mounted */}
                                                {hasMounted.current ? `${formattedTimes[index]} - Welcome` : "Welcome"}
                                            </div>
                                            <p>{item.data.message}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                {/* Only show formatted time if component has mounted */}
                                                {hasMounted.current
                                                    ? `${formattedTimes[index]} - ${item.type === 'analysis' ? 'Token Analysis' : 'Portfolio Comparison'}`
                                                    : item.type === 'analysis' ? 'Token Analysis' : 'Portfolio Comparison'
                                                }
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analysis Results History - Accordion Section */}
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => setAnalysisOpen(!analysisOpen)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <h2 className="text-xl font-semibold flex items-center">
                        Analysis Results History
                        {analysisHistory.length > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                                {analysisHistory.length}
                            </span>
                        )}
                    </h2>
                    {analysisOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {analysisOpen && (
                    <div className="p-4">
                        {analysisHistory.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No analysis results yet. Select tokens above and click "Analyze" to see results here.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {analysisHistory.map((item, index) => (
                                    <div key={index} className="border-b pb-6 last:border-0 last:pb-0 dark:border-gray-700">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            {/* Only show formatted time if component has mounted */}
                                            {hasMounted.current ? formattedTimes[index] : "Welcome"}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {item.data.map((result: AnalysisResult) => (
                                                <TokenCard key={result.symbol} result={result} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comparison Results History - Accordion Section */}
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => setComparisonOpen(!comparisonOpen)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <h2 className="text-xl font-semibold flex items-center">
                        Comparison Results History
                        {comparisonHistory.length > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                                {comparisonHistory.length}
                            </span>
                        )}
                    </h2>
                    {comparisonOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {comparisonOpen && (
                    <div className="p-4">
                        {comparisonHistory.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No comparison results yet. Select multiple tokens above and click "Compare" to see results here.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comparisonHistory.map((item, index) => (
                                    <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-100 dark:bg-gray-700 p-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold">Portfolio Comparison</h3>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {/* Only show formatted time if component has mounted */}
                                                    {hasMounted.current ? formattedTimes[index] : "Welcome"}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Ranked comparison of selected tokens
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <h3 className="font-medium mb-2">Portfolio Summary</h3>
                                                <p>{item.data.summary}</p>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-3">Ranked Recommendations</h3>
                                                <div className="space-y-3">
                                                    {item.data.rankedTokens.map((token: any) => (
                                                        <div
                                                            key={token.symbol}
                                                            className="border rounded-lg p-3 flex items-center dark:border-gray-700"
                                                        >
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold">
                                                                {token.rank}
                                                            </div>
                                                            <div className="ml-3 flex-grow">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-medium">{token.symbol}</h4>
                                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${token.decision === "BUY"
                                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                                        : token.decision === "SELL"
                                                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                                        }`}>
                                                                        {token.decision}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{token.rationale}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}