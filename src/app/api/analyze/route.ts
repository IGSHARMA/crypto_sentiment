import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { Token } from '@/app/api/top25/route';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Type for LunarCrush data
export type LunarCrushData = {
    symbol: string;
    name: string;
    price: number;
    percent_change_24h: number;
    galaxy_score: number;
    social_dominance: number;
    social_volume: number;
    market_cap: number;
    sentiment: number;
    interactions_24h: number;
    num_contributors: number;
    top_posts?: any[];
};

// Type for Twitter sentiment data
export type TwitterSentimentData = {
    symbol: string;
    sentiment_score: number;
    positive_tweets_percent: number;
    negative_tweets_percent: number;
    neutral_tweets_percent: number;
    tweet_volume_24h: number;
    top_hashtags: string[];
};

// Type for news headlines
export type NewsHeadline = {
    title: string;
    url: string;
};

// Type for analysis result
export type AnalysisResult = {
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    explanation: string;
    drivers: string[];
    recommendation: "BUY" | "HOLD" | "SELL";
    rationale: string;
    sources: {
        title: string;
        url: string;
        summary: string;
    }[];
    twitterSentiment?: {
        score: number;
        positivePercent: number;
        negativePercent: number;
        volume: number;
    };
    topTweets?: {
        text: string;
        url: string;
        author: string;
    }[];
};

async function fetchLunarCrushData(symbol: string): Promise<LunarCrushData | null> {
    // Check cache first
    const cacheKey = `lc:${symbol.toLowerCase()}`;
    let cachedData = await cache.get<LunarCrushData>(cacheKey);

    if (cachedData) {
        console.log(`Using cached LunarCrush data for ${symbol}`);
        return cachedData;
    }

    try {
        const apiKey = process.env.LUNARCRUSH_API_KEY;

        if (!apiKey) {
            console.error('LUNARCRUSH_API_KEY is not defined in environment variables');
            return null;
        }

        // Update to use the v4 API endpoint with the topic endpoint
        const apiUrl = `https://lunarcrush.com/api4/public/topic/${symbol.toLowerCase()}/v1`;

        const response = await fetch(
            apiUrl,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(5000)
            }
        );

        console.log(`LunarCrush API response status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 402) {
                console.error(`LunarCrush API payment required for ${symbol}. Your API key may need a subscription or has exceeded its quota.`);
            } else {
                console.error(`LunarCrush API error for ${symbol}: ${response.status}`);
            }

            // Return mock data instead of null
            const mockData = {
                symbol: symbol,
                name: symbol,
                price: 0,
                percent_change_24h: 0,
                galaxy_score: 50,
                social_dominance: 0.5,
                social_volume: 1000,
                market_cap: 0,
                sentiment: 50, // Adding sentiment as a neutral value for mock data
                interactions_24h: 0,
                num_contributors: 0,
                top_posts: [] // Add empty array for top posts in mock data
            };

            // Cache the mock data for a shorter period
            await cache.set(cacheKey, mockData, 60 * 5); // 5 minutes
            return mockData;
        }

        const responseData = await response.json();

        // Extract the relevant data from the v4 API response
        const data = {
            symbol: symbol,
            name: responseData.config?.name || symbol,
            price: responseData.data?.price || 0,
            percent_change_24h: responseData.data?.percent_change_24h || 0,
            galaxy_score: responseData.data?.galaxy_score || 0,
            social_dominance: responseData.data?.social_dominance || 0,
            social_volume: responseData.data?.num_posts || 0,
            market_cap: responseData.data?.market_cap || 0,
            sentiment: responseData.data?.types_sentiment?.tweet || 50, // Twitter sentiment (0-100)
            interactions_24h: responseData.data?.interactions_24h || 0,
            num_contributors: responseData.data?.num_contributors || 0,
            top_posts: responseData.data?.top_posts || [] // Add top posts from the API response
        };

        // Cache the data
        await cache.set(cacheKey, data, 60 * 60); // 1 hour
        return data;
    } catch (error) {
        console.error(`Error fetching LunarCrush data for ${symbol}:`, error);
        return null;
    }
}

async function fetchNewsHeadlines(symbol: string): Promise<NewsHeadline[]> {
    // Check cache first
    const cacheKey = `news:${symbol.toLowerCase()}`;
    let cachedData = await cache.get<NewsHeadline[]>(cacheKey);

    if (cachedData) {
        console.log(`Using cached news headlines for ${symbol}`);
        return cachedData;
    }

    try {
        const apiKey = process.env.TAVILY_API_KEY;

        if (!apiKey) {
            console.error('TAVILY_API_KEY is not defined in environment variables');
            return getMockHeadlines(symbol);
        }

        console.log(`Fetching news headlines for ${symbol} using Tavily...`);

        // Use Tavily search API to get relevant news
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `latest news about ${symbol} cryptocurrency`,
                topic: "news",
                search_depth: "basic",
                max_results: 3,
                time_range: "week",
                include_answer: true
            }),
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            console.error(`Tavily API error: ${response.status}`);
            return getMockHeadlines(symbol);
        }

        const data = await response.json();

        // Extract headlines from the results
        const headlines: NewsHeadline[] = data.results.map((result: any) => ({
            title: result.title,
            url: result.url
        }));

        // Cache the headlines
        await cache.set(cacheKey, headlines, 60 * 15); // 15 minutes
        return headlines;
    } catch (error) {
        console.error(`Error fetching news headlines for ${symbol}:`, error);
        return getMockHeadlines(symbol);
    }
}

// Helper function to get mock headlines when API fails
function getMockHeadlines(symbol: string): NewsHeadline[] {
    return [
        {
            title: `${symbol} Price Analysis: Market Trends and Future Predictions`,
            url: `https://example.com/crypto/${symbol.toLowerCase()}/analysis`
        },
        {
            title: `Why ${symbol} Is Gaining Attention From Institutional Investors`,
            url: `https://example.com/crypto/${symbol.toLowerCase()}/institutional`
        },
        {
            title: `${symbol} Development Update: New Features Coming Soon`,
            url: `https://example.com/crypto/${symbol.toLowerCase()}/development`
        }
    ];
}

// Add a new function to get sentiment from news
async function getNewsSentiment(symbol: string): Promise<TwitterSentimentData | null> {
    // Check cache first
    const cacheKey = `sentiment:${symbol.toLowerCase()}`;
    let cachedData = await cache.get<TwitterSentimentData>(cacheKey);

    if (cachedData) {
        console.log(`Using cached sentiment data for ${symbol}`);
        return cachedData;
    }

    try {
        const apiKey = process.env.TAVILY_API_KEY;

        if (!apiKey) {
            console.error('TAVILY_API_KEY is not defined in environment variables');
            return null;
        }

        console.log(`Analyzing sentiment for ${symbol} using Tavily...`);

        // Use Tavily search API to get sentiment summary
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `What is the current market sentiment for ${symbol} cryptocurrency? Analyze positive and negative opinions.`,
                topic: "general",
                search_depth: "basic",
                max_results: 3,
                include_answer: true
            }),
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
            console.error(`Tavily API error: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Log the full response for debugging
        console.log(`Tavily API response for ${symbol}:`, JSON.stringify(data, null, 2));

        // Extract sentiment from the answer
        const answer = data.answer || "";
        console.log(`Sentiment answer for ${symbol}:`, answer);

        // Create a mock sentiment object based on the answer
        const sentiment: TwitterSentimentData = {
            symbol: symbol,
            sentiment_score: answer.toLowerCase().includes("positive") ? 0.7 :
                answer.toLowerCase().includes("negative") ? 0.3 : 0.5,
            positive_tweets_percent: answer.toLowerCase().includes("positive") ? 65 : 33,
            negative_tweets_percent: answer.toLowerCase().includes("negative") ? 65 : 33,
            neutral_tweets_percent: 100 - (answer.toLowerCase().includes("positive") ? 65 :
                answer.toLowerCase().includes("negative") ? 65 : 33) -
                (answer.toLowerCase().includes("negative") ? 65 : 33),
            tweet_volume_24h: 1000,
            top_hashtags: [`#${symbol}`, '#crypto', '#blockchain']
        };

        // Cache the sentiment data
        await cache.set(cacheKey, sentiment, 60 * 30); // 30 minutes
        return sentiment;
    } catch (error) {
        console.error(`Error analyzing sentiment for ${symbol}:`, error);
        return null;
    }
}

// Add a function to fetch top Twitter posts for a symbol
async function fetchTopTwitterPosts(symbol: string): Promise<any[]> {
    // Check cache first
    const cacheKey = `twitter_posts:${symbol.toLowerCase()}`;
    let cachedData = await cache.get<any[]>(cacheKey);

    if (cachedData) {
        console.log(`Using cached Twitter posts for ${symbol}`);
        return cachedData;
    }

    try {
        const apiKey = process.env.LUNARCRUSH_API_KEY;

        if (!apiKey) {
            console.error('LUNARCRUSH_API_KEY is not defined in environment variables');
            return [];
        }

        // Use the topic endpoint to get top posts
        const apiUrl = `https://lunarcrush.com/api4/public/topic/${symbol.toLowerCase()}/posts/v1`;

        const response = await fetch(
            apiUrl,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(5000)
            }
        );

        if (!response.ok) {
            console.error(`LunarCrush API error for ${symbol} posts: ${response.status}`);
            return [];
        }

        const responseData = await response.json();

        // Extract the top Twitter posts
        const posts = responseData.data?.filter((post: any) =>
            post.network === 'twitter' && post.url
        ).slice(0, 5) || [];

        // Cache the posts
        await cache.set(cacheKey, posts, 60 * 30); // 30 minutes
        return posts;
    } catch (error) {
        console.error(`Error fetching Twitter posts for ${symbol}:`, error);
        return [];
    }
}

// Sequential LLM pipeline for token analysis
async function analyzeToken(
    token: Token,
    lunarCrushData: LunarCrushData | null,
    headlines: NewsHeadline[]
): Promise<AnalysisResult> {
    try {
        // Ensure we have data to work with
        const lc = lunarCrushData || {
            symbol: token.symbol,
            name: token.name,
            price: token.current_price,
            percent_change_24h: token.price_change_percentage_24h,
            galaxy_score: 50,
            social_dominance: 0,
            social_volume: 0,
            market_cap: token.market_cap,
            sentiment: 50,
            interactions_24h: 0,
            num_contributors: 0,
            top_posts: []
        };

        // Get sentiment data from Tavily
        const sentiment = await getNewsSentiment(token.symbol);

        // Fetch top Twitter posts
        const twitterPosts = lc.top_posts?.length ? lc.top_posts : await fetchTopTwitterPosts(token.symbol);

        // Create Twitter sentiment data from Tavily or use default
        const tw = sentiment || {
            symbol: token.symbol,
            sentiment_score: lc.sentiment / 100, // Convert LunarCrush sentiment (0-100) to 0-1 scale
            positive_tweets_percent: lc.sentiment,
            negative_tweets_percent: 100 - lc.sentiment,
            neutral_tweets_percent: 0,
            tweet_volume_24h: lc.social_volume,
            top_hashtags: [`#${token.symbol}`, '#crypto']
        };

        // Extract sources from Tavily API response
        let sources = [];
        try {
            // Fetch detailed information using Tavily
            const apiKey = process.env.TAVILY_API_KEY;
            if (apiKey) {
                const response = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `latest analysis and market trends for ${token.symbol} cryptocurrency`,
                        topic: "general",
                        search_depth: "advanced",
                        max_results: 3,
                        include_answer: true,
                        include_raw_content: false
                    }),
                    signal: AbortSignal.timeout(10000)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.results && Array.isArray(data.results)) {
                        sources = data.results.map((result: any) => ({
                            title: result.title || "Untitled Source",
                            url: result.url || "#",
                            summary: result.content || "No summary available"
                        }));
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching detailed sources for ${token.symbol}:`, error);
        }

        // If no sources were found, use headlines as fallback
        if (sources.length === 0) {
            sources = headlines.map(h => ({
                title: h.title,
                url: h.url,
                summary: "No summary available"
            }));
        }

        // Include Twitter posts in sources if available
        if (twitterPosts.length > 0) {
            const twitterSources = twitterPosts.map((post: any) => ({
                title: `Twitter: ${post.user_screen_name || 'User'} on ${token.symbol}`,
                url: post.url || `https://twitter.com/search?q=%24${token.symbol}`,
                summary: post.text || `Recent tweet about ${token.symbol}`
            }));

            // Add Twitter sources to the beginning of the sources array
            sources = [...twitterSources, ...sources].slice(0, 5);
        }

        /* ---------- 1️⃣ EXPLAIN ---------- */
        console.log(`Step 1: Generating explanation for ${token.symbol}...`);
        const explain = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a concise market analyst. Include insights from the provided sources." },
                {
                    role: "user",
                    content: `
Symbol: ${token.symbol}
Price: $${token.current_price} (${token.price_change_percentage_24h.toFixed(2)}% 24h)
Twitter sentiment: ${tw.sentiment_score.toFixed(2)}
Positive tweets: ${tw.positive_tweets_percent.toFixed(1)}%
Tweet volume: ${tw.tweet_volume_24h.toLocaleString()}

Sources:
${sources.map((s: { title: string; summary: string }) => `- ${s.title}: ${s.summary}`).join('\n')}

Explain the price move and current market sentiment in <= 5 sentences, referencing insights from the sources.`,
                },
            ],
        });

        const explanation = explain.choices[0].message.content?.trim() ||
            `${token.name} showed a ${token.price_change_percentage_24h >= 0 ? 'positive' : 'negative'} price movement in the last 24 hours.`;

        /* ---------- 2️⃣ DRIVERS ---------- */
        console.log(`Step 2: Extracting drivers for ${token.symbol}...`);
        const driversResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Extract EXACTLY 3 bullet drivers in JSON array format based on the sources and explanation." },
                {
                    role: "user",
                    content: `
Explanation: ${explanation}

Sources:
${sources.map((s: { title: string; summary: string }) => `- ${s.title}: ${s.summary}`).join('\n')}

Extract 3 key drivers affecting ${token.symbol} price and sentiment.`,
                },
            ],
            response_format: { type: "json_object" },
        });

        let drivers: string[] = [];
        try {
            const driversContent = driversResponse.choices[0].message.content || '{"drivers": []}';
            const parsedDrivers = JSON.parse(driversContent);
            drivers = Array.isArray(parsedDrivers.drivers) ? parsedDrivers.drivers :
                Array.isArray(parsedDrivers) ? parsedDrivers :
                    [
                        `Market cap of $${(token.market_cap / 1000000000).toFixed(2)}B affects overall stability`,
                        `Current price: $${token.current_price} with ${Math.abs(token.price_change_percentage_24h).toFixed(2)}% ${token.price_change_percentage_24h >= 0 ? 'gain' : 'loss'} in 24h`,
                        `Market sentiment: ${tw.sentiment_score > 0.6 ? 'Positive' : tw.sentiment_score < 0.4 ? 'Negative' : 'Neutral'} based on social metrics`
                    ];
        } catch (error) {
            console.error(`Error parsing drivers for ${token.symbol}:`, error);
            drivers = [
                `Market cap of $${(token.market_cap / 1000000000).toFixed(2)}B affects overall stability`,
                `Current price: $${token.current_price} with ${Math.abs(token.price_change_percentage_24h).toFixed(2)}% ${token.price_change_percentage_24h >= 0 ? 'gain' : 'loss'} in 24h`,
                `Market sentiment: ${tw.sentiment_score > 0.6 ? 'Positive' : tw.sentiment_score < 0.4 ? 'Negative' : 'Neutral'} based on social metrics`
            ];
        }

        console.log(`Step 3: Generating recommendation for ${token.symbol}...`);
        const recommendationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Output ONLY one of BUY, HOLD or SELL plus a <=50-word rationale.`,
                },
                {
                    role: "user",
                    content: `
Symbol: ${token.symbol}
Price: $${token.current_price} (${token.price_change_percentage_24h.toFixed(2)}% 24h)
Explanation: ${explanation}
Drivers: ${JSON.stringify(drivers)}
Sources: ${sources.map((s: { title: string; summary: string }) => s.title).join(' | ')}`,
                },
            ],
        });

        const recommendationText = recommendationResponse.choices[0].message.content?.trim() || "HOLD - Insufficient data for a clear recommendation.";

        // Extract the recommendation (BUY, HOLD, or SELL) from the beginning of the text
        const recommendationMatch = recommendationText.match(/^(BUY|HOLD|SELL)/i);
        const recommendation = recommendationMatch
            ? (recommendationMatch[0].toUpperCase() as "BUY" | "HOLD" | "SELL")
            : "HOLD";

        // The rest is the rationale
        const rationale = recommendationText.replace(/^(BUY|HOLD|SELL)\s*[-:–]?\s*/i, '').trim() ||
            `Based on the current market conditions and social metrics.`;

        console.log(`Completed analysis for ${token.symbol}`);

        return {
            symbol: token.symbol,
            name: token.name,
            price: token.current_price,
            priceChange24h: token.price_change_percentage_24h,
            explanation: explanation,
            drivers: drivers.slice(0, 3), // Ensure exactly 3 drivers
            recommendation: recommendation,
            rationale: `${recommendation} - ${rationale}`,
            sources: sources.slice(0, 3), // Include up to 3 sources
            twitterSentiment: {
                score: tw.sentiment_score,
                positivePercent: tw.positive_tweets_percent,
                negativePercent: tw.negative_tweets_percent,
                volume: tw.tweet_volume_24h
            },
            topTweets: twitterPosts.slice(0, 3).map(post => ({
                text: post.text || `Tweet about ${token.symbol}`,
                url: post.url || `https://twitter.com/search?q=%24${token.symbol}`,
                author: post.user_screen_name || 'Twitter User'
            }))
        };
    } catch (error) {
        console.error(`Error in LLM pipeline for ${token.symbol}:`, error);

        // Fallback response if the LLM pipeline fails
        return {
            symbol: token.symbol,
            name: token.name,
            price: token.current_price,
            priceChange24h: token.price_change_percentage_24h,
            explanation: `Analysis could not be generated for ${token.name} due to an error.`,
            drivers: [
                "Data processing error",
                "API service unavailable",
                `Price ${token.price_change_percentage_24h >= 0 ? 'increase' : 'decrease'} of ${Math.abs(token.price_change_percentage_24h).toFixed(2)}% in 24h`
            ],
            recommendation: "HOLD",
            rationale: "HOLD - Due to technical issues, we cannot provide a reliable recommendation at this time.",
            sources: [], // Empty sources for fallback
            twitterSentiment: {
                score: 0.5,
                positivePercent: 50,
                negativePercent: 50,
                volume: 0
            },
            topTweets: []
        };
    }
}

// Update the cache key to match what's used in top25/route.ts
const CACHE_KEY = 'top25_tokens'; // Make sure this matches the key in top25/route.ts
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const symbols = body.symbols || [];

        console.log(`Analyzing tokens: ${symbols.join(', ')}`);

        if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or missing symbols array' },
                { status: 400 }
            );
        }

        if (symbols.length > 10) {
            return NextResponse.json(
                { error: 'Maximum 10 symbols allowed for analysis' },
                { status: 400 }
            );
        }

        // Get token data from cache or fetch it if not available
        let tokens = await cache.get<Token[]>(CACHE_KEY);

        if (!tokens) {
            console.log('Cache miss in analyze endpoint. Fetching fresh data...');
            try {
                const response = await fetch('http://localhost:3000/api/top25');
                if (!response.ok) {
                    throw new Error(`Failed to fetch top25: ${response.status}`);
                }
                tokens = await response.json();

                // Store in cache
                await cache.set(CACHE_KEY, tokens, CACHE_TTL);
            } catch (error) {
                console.error('Error fetching token data:', error);
                return NextResponse.json(
                    { error: 'Failed to fetch token data' },
                    { status: 500 }
                );
            }
        }

        console.log(`Found ${tokens?.length} tokens in cache/fetch`);

        // Filter tokens based on selected symbols (case-insensitive)
        const selectedTokens = tokens?.filter(token =>
            symbols.some(s => s.toLowerCase() === token.symbol.toLowerCase())
        ) || [];

        console.log(`Selected ${selectedTokens.length} tokens for analysis`);

        if (selectedTokens.length === 0) {
            console.log(`No matching tokens found. Symbols requested: ${symbols.join(', ')}`);
            console.log(`Available symbols: ${tokens?.map(t => t.symbol).join(', ') || 'No tokens available'}`);

            // For debugging, let's create mock results instead of failing
            const mockResults = symbols.map(symbol => ({
                symbol,
                name: symbol,
                price: 0,
                priceChange24h: 0,
                explanation: "This token was not found in our database.",
                drivers: [
                    "Token not in top 25",
                    "Using fallback data",
                    "Consider selecting a different token"
                ],
                recommendation: "HOLD" as const,
                rationale: "HOLD - Insufficient data to make a recommendation.",
                sources: []
            }));

            return NextResponse.json(mockResults);
        }

        // Process tokens in parallel with sequential LLM calls for each token
        const analysisPromises = selectedTokens.map(async (token) => {
            try {
                // Fetch LunarCrush and news headlines in parallel
                const [lunarCrushData, headlines] = await Promise.all([
                    fetchLunarCrushData(token.symbol),
                    fetchNewsHeadlines(token.symbol)
                ]);

                // Run the sequential LLM pipeline for this token
                return analyzeToken(token, lunarCrushData, headlines);
            } catch (error) {
                console.error(`Error analyzing token ${token.symbol}:`, error);
                // Return a fallback result
                return {
                    symbol: token.symbol,
                    name: token.name,
                    price: token.current_price || 0,
                    priceChange24h: token.price_change_percentage_24h,
                    explanation: `Analysis failed for ${token.name}.`,
                    drivers: ["Data unavailable", "API error occurred", "Using fallback data"],
                    recommendation: "HOLD" as const,
                    rationale: "HOLD - Insufficient data to make a recommendation.",
                    sources: []
                };
            }
        });

        const results = await Promise.all(analysisPromises);
        console.log(`Successfully analyzed ${results.length} tokens`);

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error analyzing tokens:', error);
        return NextResponse.json(
            { error: 'Failed to analyze tokens', details: (error as Error).message },
            { status: 500 }
        );
    }
} 