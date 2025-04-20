"use client";

import Image from "next/image";
import { TokenPicker } from "@/components/TokenPicker";
import { ResultGrid } from "@/components/ResultGrid";
import { ComparisonResults } from "@/components/ComparisonResults";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("Coins");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Canvas animation for the grid background
  useEffect(() => {
    if (!showDashboard) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions
      const setCanvasDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      setCanvasDimensions();
      window.addEventListener("resize", setCanvasDimensions);

      // Grid properties
      const gridSpacing = 50;
      let time = 0;

      // Animation function
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = "rgba(74, 222, 128, 0.1)";
        ctx.lineWidth = 1;

        for (let x = 0; x < canvas.width + gridSpacing; x += gridSpacing) {
          for (let y = 0; y < canvas.height + gridSpacing; y += gridSpacing) {
            // Calculate wave effect
            const distX = mousePosition.x - x;
            const distY = mousePosition.y - y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const maxDistance = 300;

            // Wave effect based on mouse position and time
            const waveX = Math.sin(distance * 0.01 - time * 0.5) * 5;
            const waveY = Math.cos(distance * 0.01 - time * 0.5) * 5;

            const influence = Math.max(0, 1 - distance / maxDistance);
            const offsetX = waveX * influence;
            const offsetY = waveY * influence;

            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 222, 128, ${0.1 + influence * 0.3})`;
            ctx.fill();

            if (Math.random() < 0.001) {
              ctx.beginPath();
              ctx.arc(x + offsetX, y + offsetY, Math.random() * 3 + 1, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(74, 222, 128, 0.8)";
              ctx.fill();
            }
          }
        }

        // Floating crypto symbols
        const symbols = [
          { x: canvas.width * 0.2, y: canvas.height * 0.3, symbol: "₿", color: "rgba(247, 147, 26, 0.5)" },
          { x: canvas.width * 0.8, y: canvas.height * 0.7, symbol: "Ξ", color: "rgba(98, 126, 234, 0.5)" },
          { x: canvas.width * 0.3, y: canvas.height * 0.8, symbol: "◎", color: "rgba(153, 69, 255, 0.5)" },
          { x: canvas.width * 0.7, y: canvas.height * 0.2, symbol: "₮", color: "rgba(38, 161, 123, 0.5)" },
        ];

        symbols.forEach((s, i) => {
          ctx.font = "40px Arial";
          ctx.fillStyle = s.color;
          const offsetY = Math.sin(time * 0.5 + i) * 10;
          ctx.fillText(s.symbol, s.x + Math.sin(time * 0.3 + i * 2) * 20, s.y + offsetY);
        });

        time += 0.01;
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      // Set loaded state after a short delay
      setTimeout(() => setIsLoaded(true), 500);

      return () => {
        window.removeEventListener("resize", setCanvasDimensions);
        cancelAnimationFrame(animationId);
      };
    }
  }, [mousePosition, showDashboard]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Coins":
        return (
          <>
            <TokenPicker />
          </>
        );
      // Commenting out other tabs for now
      /*
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
      */
      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p>{activeTab} view is under development</p>
          </div>
        );
    }
  };

  if (!showDashboard) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0a0d12]">
        {/* Background canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d12]/80 to-[#0a0d12]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
          <div
            className={`mb-10 transition-opacity duration-800 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center justify-center">
              <Image
                src="/degenAI-logo.png"
                alt="DegenAI Logo"
                width={240}
                height={240}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h2
            className={`mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl transition-opacity duration-800 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '400ms' }}
          >
            The Future of <span className="text-[#4ade80]">Crypto</span> Analysis
          </h2>

          <p
            className={`mb-10 max-w-2xl text-lg text-gray-400 transition-opacity duration-800 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '600ms' }}
          >
            Advanced analytics, real-time data, and AI-powered insights to navigate the crypto market with confidence.
          </p>

          <div
            className={`relative transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#4ade80] to-[#3b82f6] opacity-75 blur-sm group-hover:opacity-100" />
            <button
              onClick={() => setShowDashboard(true)}
              className="relative bg-[#1a1f29] px-8 py-6 text-lg font-semibold text-white hover:bg-[#2a2f3a] rounded-lg flex items-center"
            >
              Enter Dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Floating crypto icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-15' : 'opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
              <div
                className="absolute left-[15%] top-[20%] animate-float-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                </svg>
              </div>

              <div
                className="absolute right-[20%] top-[25%] animate-float-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12" />
                  <path d="M16 10H8" />
                </svg>
              </div>

              <div
                className="absolute bottom-[25%] left-[25%] animate-float-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-2xl font-bold text-purple-500">
                  ◎
                </div>
              </div>

              <div
                className="absolute bottom-[30%] right-[15%] animate-float-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 text-xl font-bold text-yellow-500">
                  BNB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price ticker at bottom - improved version */}
        <div
          className={`absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#2a2f3a] bg-[#0e1217]/80 backdrop-blur-sm transition-all duration-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '1000ms' }}
        >
          <div className="ticker-wrap">
            <div className="ticker">
              {/* First set of ticker items */}
              <div className="ticker-item">
                <span className="mr-1 text-orange-500">₿</span>
                <span className="font-medium">BTC</span>
                <span className="ml-2 text-sm text-gray-400">$85,234.78</span>
                <span className="ml-2 text-xs text-green-500">+0.93%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-blue-500">Ξ</span>
                <span className="font-medium">ETH</span>
                <span className="ml-2 text-sm text-gray-400">$1,608.36</span>
                <span className="ml-2 text-xs text-green-500">+1.47%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-purple-500">◎</span>
                <span className="font-medium">SOL</span>
                <span className="ml-2 text-sm text-gray-400">$139.43</span>
                <span className="ml-2 text-xs text-green-500">+5.0%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-blue-400">✕</span>
                <span className="font-medium">XRP</span>
                <span className="ml-2 text-sm text-gray-400">$2.08</span>
                <span className="ml-2 text-xs text-green-500">+1.1%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-yellow-500">BNB</span>
                <span className="font-medium">BNB</span>
                <span className="ml-2 text-sm text-gray-400">$589.98</span>
                <span className="ml-2 text-xs text-red-500">-0.6%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-green-500">₮</span>
                <span className="font-medium">USDT</span>
                <span className="ml-2 text-sm text-gray-400">$1.00</span>
                <span className="ml-2 text-xs text-red-500">-0.01%</span>
              </div>

              {/* Duplicate set for continuous scrolling */}
              <div className="ticker-item">
                <span className="mr-1 text-orange-500">₿</span>
                <span className="font-medium">BTC</span>
                <span className="ml-2 text-sm text-gray-400">$85,234.78</span>
                <span className="ml-2 text-xs text-green-500">+0.93%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-blue-500">Ξ</span>
                <span className="font-medium">ETH</span>
                <span className="ml-2 text-sm text-gray-400">$1,608.36</span>
                <span className="ml-2 text-xs text-green-500">+1.47%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-purple-500">◎</span>
                <span className="font-medium">SOL</span>
                <span className="ml-2 text-sm text-gray-400">$139.43</span>
                <span className="ml-2 text-xs text-green-500">+5.0%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-blue-400">✕</span>
                <span className="font-medium">XRP</span>
                <span className="ml-2 text-sm text-gray-400">$2.08</span>
                <span className="ml-2 text-xs text-green-500">+1.1%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-yellow-500">BNB</span>
                <span className="font-medium">BNB</span>
                <span className="ml-2 text-sm text-gray-400">$589.98</span>
                <span className="ml-2 text-xs text-red-500">-0.6%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-green-500">₮</span>
                <span className="font-medium">USDT</span>
                <span className="ml-2 text-sm text-gray-400">$1.00</span>
                <span className="ml-2 text-xs text-red-500">-0.01%</span>
              </div>

              {/* Add a third set for extra safety on wider screens */}
              <div className="ticker-item">
                <span className="mr-1 text-orange-500">₿</span>
                <span className="font-medium">BTC</span>
                <span className="ml-2 text-sm text-gray-400">$85,234.78</span>
                <span className="ml-2 text-xs text-green-500">+0.93%</span>
              </div>
              <div className="ticker-item">
                <span className="mr-1 text-blue-500">Ξ</span>
                <span className="font-medium">ETH</span>
                <span className="ml-2 text-sm text-gray-400">$1,608.36</span>
                <span className="ml-2 text-xs text-green-500">+1.47%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)] bg-[#0a0d12] text-white">
      <header className="flex items-center justify-between">
      </header>

      <main className="flex flex-col gap-8">
        <section className="bg-[#080808] p-6 rounded-lg border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none"></div>

          <div className="relative z-10 mb-6">
            <div className="flex overflow-x-auto mb-4 bg-[#111111] rounded-lg p-1 border border-[#222222]">
              <button
                key="Coins"
                onClick={() => setActiveTab("Coins")}
                className={`px-4 py-2 rounded-md font-medium flex items-center ${activeTab === "Coins"
                  ? "bg-[#4ade80] text-[#0a0d12]"
                  : "text-gray-300 hover:bg-[#2a2f3a] hover:text-[#4ade80]"
                  }`}
              >
                <span className="mr-2">🪙</span>
                Coins
              </button>
              <button
                key="DexScan"
                onClick={() => setActiveTab("DexScan")}
                className={`px-4 py-2 rounded-md font-medium flex items-center ${activeTab === "DexScan"
                  ? "bg-[#4ade80] text-[#0a0d12]"
                  : "text-gray-300 hover:bg-[#2a2f3a] hover:text-[#4ade80]"
                  }`}
              >
                <span className="mr-2">🔍</span>
                DexScan
              </button>
            </div>
          </div>

          <div className="relative z-10">
            {renderTabContent()}
          </div>
        </section>

        <section className="bg-[#080808] p-6 rounded-lg border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <ResultGrid />
          </div>
        </section>

        <section className="bg-[#080808] p-6 rounded-lg border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <ComparisonResults />
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center gap-4 py-4 text-sm text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <div>
            Data powered by CoinGecko, LunarCrush, and Tavily
          </div>
          <Image
            src="/degenAI-logo.png"
            alt="DegenAI Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
        <p>© 2025 degenAI • <a href="https://www.linkedin.com/in/pratinav-sharma-a8917398/" className="underline hover:text-[#4ade80]">Contact Us</a></p>
      </footer>
    </div>
  );
}
