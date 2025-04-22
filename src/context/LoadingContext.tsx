import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    loadingMessage: string;
    setLoadingMessage: (message: string) => void;
    startLoading: (message: string) => void;
    stopLoading: () => void;
};

export const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
    loadingMessage: "",
    setLoadingMessage: () => { },
    startLoading: () => { },
    stopLoading: () => { },
});

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const startLoading = (message: string) => {
        setLoadingMessage(message);
        setIsLoading(true);
    };

    const stopLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, loadingMessage, setLoadingMessage, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => useContext(LoadingContext); 