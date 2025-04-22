"use client";

import Image from "next/image";
import { TokenPicker } from "@/components/TokenPicker";
import { ResultGrid } from "@/components/ResultGrid";
import { useState } from "react";
import { LoadingProvider } from "@/context/LoadingContext";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link";

// Dashboard component
function DashboardContent() {
    const { isLoading, loadingMessage } = useLoading();
    const [activeTab, setActiveTab] = useState("Coins");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case "Coins":
                return (
                    <>
                        <TokenPicker />
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
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)] bg-[#0a0d12] text-white">
            {/* Global loading overlay */}
            <LoadingOverlay isVisible={isLoading} message={loadingMessage || "Loading dashboard..."} />

            {/* Dashboard with sidebar */}
            <div className="grid grid-cols-[auto_1fr] h-screen">
                {/* Sidebar */}
                <aside className={`bg-[#080808] border-r border-[#4ade80]/20 transition-all duration-300 h-full flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <div className="flex h-16 items-center gap-2 border-b border-[#4ade80]/20 px-6">
                        <div className="bg-black rounded-full p-1">
                            <Image
                                src="/degenAI-logo.png"
                                alt="DegenAI Logo"
                                width={isSidebarCollapsed ? 36 : 40}
                                height={isSidebarCollapsed ? 36 : 40}
                                className="object-contain"
                            />
                        </div>
                        {!isSidebarCollapsed && <span className="font-bold text-[#4ade80]">degenAI</span>}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="ml-auto text-gray-400 hover:text-[#4ade80]"
                        >
                            {isSidebarCollapsed ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <nav className="space-y-2 px-2 py-4 flex-grow">
                        <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect width="7" height="5" x="14" y="3" rx="1" />
                                <rect width="7" height="9" x="14" y="12" rx="1" />
                                <rect width="7" height="5" x="3" y="16" rx="1" />
                            </svg>
                            {!isSidebarCollapsed && <span>Dashboard</span>}
                        </Link>

                        <Link href="/market" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            {!isSidebarCollapsed && <span>Market</span>}
                        </Link>

                        <Link href="/analytics" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                            </svg>
                            {!isSidebarCollapsed && <span>Analytics</span>}
                        </Link>

                        <Link href="/ai-agent" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3H9V5a3 3 0 0 0 3-3z" />
                                <path d="M9 12v3a3 3 0 0 0 6 0v-3" />
                                <path d="M9 17c-2 0-4 .5-4 2v1h14v-1c0-1.5-2-2-4-2h-1" />
                                <path d="M12 16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2z" />
                            </svg>
                            {!isSidebarCollapsed && <span>AI Agent</span>}
                        </Link>

                        <Link href="/more-info" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            {!isSidebarCollapsed && <span>More Info</span>}
                        </Link>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="p-6 overflow-auto h-full">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <div className="text-sm text-gray-400">Welcome to degenAI analytics</div>
                        </div>
                    </div>

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

                    <section className="bg-[#080808] p-6 rounded-lg border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden mt-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <ResultGrid />
                        </div>
                    </section>

                    <section className="bg-[#080808] p-6 rounded-lg border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden mt-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none"></div>
                    </section>
                </main>
            </div>
        </div>
    );
}

// Main component that wraps everything with the provider
export default function Dashboard() {
    return (
        <LoadingProvider>
            <DashboardContent />
        </LoadingProvider>
    );
} 