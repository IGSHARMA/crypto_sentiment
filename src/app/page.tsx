"use client";

import Image from "next/image";
import { TokenPicker } from "@/components/TokenPicker";
import { ResultGrid } from "@/components/ResultGrid";
import { ComparisonResults } from "@/components/ComparisonResults";
import { useState, useEffect } from "react";

// Define interfaces for DEX Screener data
interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
}

interface PriceChange {
  h24: string;
  h6: string;
  h1: string;
  m5: string;
}

interface Volume {
  h24: string;
  h6: string;
  h1: string;
  m5: string;
}

interface Liquidity {
  usd: string;
  base: string;
  quote: string;
}

interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  priceUsd: string;
  priceNative: string;
  txns: any;
  volume: Volume;
  priceChange: PriceChange;
  liquidity: Liquidity;
  fdv: string;
  pairCreatedAt: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Coins");
  const [dexData, setDexData] = useState<DexPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "DexScan") {
      fetchDexScreenerData();
    }
  }, [activeTab]);

  const fetchDexScreenerData = async () => {
    setIsLoading(true);
    try {
      // You'll need to replace this with your actual API endpoint
      // This could be a direct call to DEX Screener API or your backend proxy
      const response = await fetch("https://api.dexscreener.com/latest/dex/search?q=USDC");
      const data = await response.json();
      setDexData(data.pairs || []);
    } catch (error) {
      console.error("Error fetching DEX Screener data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Coins":
        return (
          <>
            <TokenPicker />
          </>
        );
      case "DexScan":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">DexScan Analysis</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore decentralized exchange pairs and liquidity data.
            </p>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : dexData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">24h %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume (24h)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Liquidity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {dexData.slice(0, 25).map((pair, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {pair.dexId} • {pair.chainId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${parseFloat(pair.priceUsd).toFixed(6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseFloat(pair.priceChange.h24) >= 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                            {parseFloat(pair.priceChange.h24).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${parseInt(pair.volume.h24).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${parseInt(pair.liquidity.usd).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p>No DEX data available. Try refreshing or changing search parameters.</p>
              </div>
            )}
          </>
        );
      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p>{activeTab} view is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Portfolio-Scout Logo"
            width={40}
            height={40}
            className="dark:invert"
          />
          <h1 className="text-2xl font-bold">Portfolio-Scout</h1>
        </div>
        <div className="text-sm text-gray-500">
          Data powered by CoinGecko, LunarCrush, and Tavily
        </div>
      </header>

      <main className="flex flex-col gap-8">
        <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <div className="mb-6">
            <div className="flex overflow-x-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {["Coins", "DexScan", "Top", "Trending", "New", "Gainers", "Most Visited"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-medium flex items-center ${activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  <span className="mr-2">
                    {tab === "Coins" && "🪙"}
                    {tab === "DexScan" && "🔍"}
                    {tab === "Top" && "📈"}
                    {tab === "Trending" && "🔥"}
                    {tab === "New" && "✨"}
                    {tab === "Gainers" && "📊"}
                    {tab === "Most Visited" && "👁️"}
                  </span>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {renderTabContent()}
        </section>

        <section>
          <ResultGrid />
        </section>

        <section>
          <ComparisonResults />
        </section>
      </main>

      <footer className="flex justify-center items-center py-4 text-sm text-gray-500">
        <p>© 2025 Portfolio-Scout • <a href="#" className="underline">Terms</a> • <a href="#" className="underline">Privacy</a></p>
      </footer>
    </div>
  );
}
