"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PortfolioRanking } from "@/components/TokenPicker";

export function ComparisonResults() {
    const [comparisonData, setComparisonData] = useState<PortfolioRanking | null>(null);

    useEffect(() => {
        // Listen for comparison results
        const handleComparisonComplete = (event: CustomEvent<PortfolioRanking>) => {
            console.log("Comparison results received:", event.detail);
            setComparisonData(event.detail);
        };

        // Add event listener
        window.addEventListener('comparisonComplete', handleComparisonComplete as EventListener);

        // Clean up
        return () => {
            window.removeEventListener('comparisonComplete', handleComparisonComplete as EventListener);
        };
    }, []);

    if (!comparisonData) {
        return null;
    }

    return (
        <div className="mt-8">
        </div>
    );
} 