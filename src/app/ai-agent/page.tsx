"use client";

import { useState, useRef, useEffect } from "react";
import { ZapIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Message type definition
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

function AutoResizeTextarea({
    className,
    value,
    onChange,
    onKeyDown,
    placeholder,
    ...props
}: {
    className?: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [value]);

    return (
        <textarea
            {...props}
            value={value}
            ref={textareaRef}
            rows={1}
            onKeyDown={onKeyDown}
            onChange={(e) => {
                onChange(e.target.value);
                resizeTextarea();
            }}
            placeholder={placeholder}
            className={cn("resize-none min-h-4 max-h-80", className)}
        />
    );
}

export default function AIAgent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isAiTyping, setIsAiTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Show AI typing indicator
        setIsAiTyping(true);

        // Simulate AI response after delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: generateAIResponse(inputValue),
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);
            setIsAiTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    // Simple response generator (placeholder)
    const generateAIResponse = (query: string): string => {
        if (query.toLowerCase().includes("bitcoin") || query.toLowerCase().includes("btc")) {
            return "Bitcoin (BTC) is currently showing strong momentum with increasing volume. The recent price action suggests a bullish trend, with key resistance at $92,000. Based on on-chain metrics, whale accumulation has increased by 12% in the past week.";
        } else if (query.toLowerCase().includes("ethereum") || query.toLowerCase().includes("eth")) {
            return "Ethereum (ETH) is consolidating after the recent rally. Technical indicators suggest a potential breakout above $1,800 in the coming days. The ETH 2.0 staking rate continues to increase, with over 25% of total supply now staked.";
        } else if (query.toLowerCase().includes("solana") || query.toLowerCase().includes("sol")) {
            return "Solana (SOL) has shown impressive recovery with strong fundamentals. Network activity is up 35% month-over-month, and developer activity remains robust. The current price action suggests potential for further upside if it breaks above the $150 resistance level.";
        } else {
            return "I've analyzed your query about " + query + ". Based on current market data, sentiment appears mixed. Would you like me to provide more specific analysis on price action, on-chain metrics, or comparative performance against other assets?";
        }
    };

    const header = (
        <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
            <div className="flex justify-center mb-2">
                <div className="size-12 rounded-full bg-black border border-emerald-500 flex items-center justify-center">
                    <ZapIcon className="size-6 text-emerald-500" />
                </div>
            </div>
            <h1 className="text-2xl font-bold leading-none tracking-tight neon-text">Neon AI Chatbot</h1>
            <p className="text-muted-foreground text-sm">
                A cyberpunk-themed AI chatbot built with <span className="text-emerald-400">Next.js</span>, the{" "}
                <span className="text-emerald-400">Vercel AI SDK</span>, and <span className="text-cyan-400">OpenAI</span>.
            </p>
            <p className="text-muted-foreground text-sm">Send a message to start your conversation.</p>
        </header>
    );

    const messageList = (
        <div className="my-4 flex h-fit min-h-full flex-col gap-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    data-role={message.role}
                    className={cn(
                        "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                        message.role === "assistant"
                            ? "self-start bg-zinc-800 text-zinc-100 border border-zinc-700"
                            : "self-end neon-gradient text-black font-medium",
                    )}
                >
                    {message.content}
                </div>
            ))}

            {/* AI Typing Indicator */}
            {isAiTyping && (
                <div className="self-start max-w-[80%] rounded-xl px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700">
                    <div className="flex space-x-1 items-center">
                        <div className="w-2 h-2 bg-emerald-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );

    return (
        <main className="mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none">
            <div className="flex-1 content-center overflow-y-auto px-6 py-6">
                {messages.length ? messageList : header}
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative mx-6 mb-6 flex items-center rounded-[16px] border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 pr-8 text-sm focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20"
            >
                <AutoResizeTextarea
                    onKeyDown={handleKeyDown}
                    onChange={(v) => setInputValue(v)}
                    value={inputValue}
                    placeholder="Enter a message"
                    className="placeholder:text-zinc-500 flex-1 bg-transparent focus:outline-none"
                />
                <button
                    type="submit"
                    className={cn(
                        "absolute bottom-1 right-1 size-6 rounded-full flex items-center justify-center",
                        inputValue.trim() ? "bg-emerald-500 text-black hover:bg-emerald-600" : "bg-zinc-800 text-zinc-400"
                    )}
                    disabled={!inputValue.trim()}
                >
                    <ArrowUpIcon size={16} />
                </button>
            </form>
        </main>
    );
} 