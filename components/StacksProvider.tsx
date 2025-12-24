"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppConfig, UserSession, connect, UserData } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

interface StacksContextValue {
    userSession: UserSession;
    userData: UserData | null;
    authenticate: () => void;
    disconnect: () => void;
    isDataLoading: boolean;
}

const StacksContext = createContext<StacksContextValue | undefined>(undefined);

export default function StacksProvider({ children }: { children: React.ReactNode }) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        const savedAddress = localStorage.getItem("arkadiko_stx_address");
        if (savedAddress) {
            const userData = {
                profile: {
                    stxAddress: {
                        mainnet: savedAddress,
                        testnet: savedAddress,
                    },
                },
            };
            setUserData(userData as any);
        }
        setIsDataLoading(false);
    }, []);

    const authenticate = async () => {
        try {
            const response = await (connect as any)({
                appDetails: {
                    name: "Arkadiko Wizard",
                    icon: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "",
                },
                redirectTo: "/",
                userSession,
            });

            if (response && response.addresses && response.addresses.length > 0) {
                const address = response.addresses[0].address;

                const newUserData = {
                    profile: {
                        stxAddress: {
                            mainnet: address,
                            testnet: address,
                        },
                    },
                };

                setUserData(newUserData as any);
                localStorage.setItem("arkadiko_stx_address", address);
            }
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };

    const disconnect = () => {
        localStorage.removeItem("arkadiko_stx_address");
        userSession.signUserOut("/");
        setUserData(null);
    };

    return (
        <StacksContext.Provider value={{ userSession, userData, authenticate, disconnect, isDataLoading }}>
            {children}
        </StacksContext.Provider>
    );
}

export const useStacks = () => {
    const context = useContext(StacksContext);
    if (!context) {
        throw new Error("useStacks must be used within a StacksProvider");
    }
    return context;
};
