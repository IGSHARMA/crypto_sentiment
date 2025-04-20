import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

// Type for the token data
export type Token = {
    id: string;
    symbol: string;
    name: string;
    logo?: string;
    market_cap: number;
    price_change_percentage_24h: number;
    current_price: number;
};

const CACHE_KEY = 'top25_tokens';
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds
async function fetchFromCoinGecko(): Promise<Token[]> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h',
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();

        // Define type for CoinGecko API response
        type CoinGeckoResponse = {
            id: string;
            symbol: string;
            name: string;
            image: string;
            market_cap: number;
            price_change_percentage_24h: number;
            current_price: number;
        };

        // Transform the data to match our Token type
        return data.map((coin: CoinGeckoResponse) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            logo: coin.image,
            market_cap: coin.market_cap,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            current_price: coin.current_price
        }));
    } catch (error) {
        console.error('Error fetching from CoinGecko:', error);
        throw error;
    }
}

export async function GET() {
    // Try to get data from cache first
    let tokens = await cache.get<Token[]>(CACHE_KEY);

    if (!tokens) {
        try {
            console.log('Cache miss. Fetching fresh data from CoinGecko');
            tokens = await fetchFromCoinGecko();

            // Store in cache for 24 hours
            await cache.set(CACHE_KEY, tokens, CACHE_TTL);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to fetch token data' },
                { status: 500 }
            );
        }
    } else {
        console.log('Cache hit. Using cached token data');
    }

    return NextResponse.json(tokens);
} 