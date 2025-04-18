import Image from "next/image";
import { TokenPicker } from "@/components/TokenPicker";
import { ResultGrid } from "@/components/ResultGrid";

export default function Home() {
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
          <h2 className="text-xl font-semibold mb-4">Select Tokens to Analyze</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose up to 10 tokens from the daily Top-25 list to receive analysis and recommendations.
          </p>
          <TokenPicker />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          <ResultGrid />
        </section>
      </main>

      <footer className="flex justify-center items-center py-4 text-sm text-gray-500">
        <p>© 2025 Portfolio-Scout • <a href="#" className="underline">Terms</a> • <a href="#" className="underline">Privacy</a></p>
      </footer>
    </div>
  );
}
