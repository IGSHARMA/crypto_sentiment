import { cn } from "@/lib/utils";

type TokenProps = {
    token: {
        id: string;
        symbol: string;
        name: string;
        logo?: string;
        price_change_percentage_24h: number;
    };
    isSelected: boolean;
    onToggle: () => void;
};

export function TokenChip({ token, isSelected, onToggle }: TokenProps) {
    const priceChangeColor = token.price_change_percentage_24h >= 0
        ? "text-green-600"
        : "text-red-600";

    return (
        <button
            onClick={onToggle}
            className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
        >
            <div className="flex items-center gap-2">
                {token.logo ? (
                    <img src={token.logo} alt={token.name} className="w-6 h-6 rounded-full" />
                ) : (
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
                        {token.symbol.charAt(0)}
                    </div>
                )}
                <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">{token.name}</div>
                </div>
            </div>
            <div className={cn("text-sm font-medium", priceChangeColor)}>
                {token.price_change_percentage_24h >= 0 ? "+" : ""}
                {token.price_change_percentage_24h.toFixed(1)}%
            </div>
        </button>
    );
} 