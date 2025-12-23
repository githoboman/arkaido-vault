"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Activity,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    LogOut
} from 'lucide-react';

interface DashboardProps {
    stxAmount: string;
    borrowAmount: string;
    stxPrice: number;
    userAddress?: string;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stxAmount, borrowAmount, stxPrice: initialStxPrice, onLogout, userAddress }) => {
    const [stxPrice, setStxPrice] = useState(initialStxPrice);
    const [collateralRatio, setCollateralRatio] = useState(0);
    const [healthFactor, setHealthFactor] = useState(100);

    useEffect(() => {
        // Simulate live price updates
        const interval = setInterval(() => {
            const change = (Math.random() - 0.5) * 0.02;
            setStxPrice(prev => Math.max(0.1, prev + change));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const collateralValue = parseFloat(stxAmount) * stxPrice;
        const borrowed = parseFloat(borrowAmount);
        if (borrowed > 0) {
            const ratio = (collateralValue / borrowed) * 100;
            setCollateralRatio(ratio);

            // Calculate simplified health factor (0-100)
            // 150% ratio = 0 health, 300% ratio = 100 health
            const health = Math.min(100, Math.max(0, (ratio - 150) / 1.5));
            setHealthFactor(health);
        }
    }, [stxPrice, stxAmount, borrowAmount]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-purple-400" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Arkadiko Vault #247
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-slate-400 text-sm">STX Price:</span>
                            <span className="font-bold">${stxPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg border border-purple-500/30">
                            <Wallet className="w-4 h-4" />
                            <span className="font-medium text-sm">{userAddress ? `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}` : '0x12...89'}</span>
                        </div>
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Health Card */}
                    <div className="md:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Vault Health</h2>
                                <div className="flex items-baseline gap-4">
                                    <span className={`text-5xl font-bold ${collateralRatio >= 300 ? 'text-green-400' :
                                        collateralRatio >= 200 ? 'text-blue-400' :
                                            collateralRatio >= 170 ? 'text-yellow-400' : 'text-red-500'
                                        }`}>
                                        {collateralRatio.toFixed(0)}%
                                    </span>
                                    <span className="text-slate-400">Collateralization Ratio</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Liquidation Risk</span>
                                    <span>{healthFactor.toFixed(0)}/100 Safe</span>
                                </div>
                                <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${healthFactor > 60 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                            healthFactor > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                                'bg-gradient-to-r from-red-600 to-red-400'
                                            }`}
                                        style={{ width: `${healthFactor}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-slate-500">
                                    <span>Likely Liquidation</span>
                                    <span>Extremely Safe</span>
                                </div>
                            </div>

                            {collateralRatio < 200 && (
                                <div className="mt-6 flex items-start gap-3 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 leading-relaxed">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-yellow-200">
                                        <strong className="block mb-1 text-yellow-500">Warning: Ratio Low</strong>
                                        Your vault is approaching the danger zone. Consider depositing more STX or repaying some USDA to stay safe.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Your Assets</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">STX</div>
                                        <div>
                                            <div className="font-bold">Stacks</div>
                                            <div className="text-xs text-slate-400">Collateral</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{stxAmount}</div>
                                        <div className="text-xs text-slate-400">${(parseFloat(stxAmount) * stxPrice).toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs">$</div>
                                        <div>
                                            <div className="font-bold">USDA</div>
                                            <div className="text-xs text-slate-400">Borrowed</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">${borrowAmount}</div>
                                        <div className="text-xs text-slate-400">Stablecoin</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center justify-center p-4 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all">
                                    <ArrowDownLeft className="w-6 h-6 mb-2" />
                                    <span className="text-sm font-bold">Deposit</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
                                    <ArrowUpRight className="w-6 h-6 mb-2" />
                                    <span className="text-sm font-bold">Withdraw</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
                                    <RefreshCw className="w-6 h-6 mb-2" />
                                    <span className="text-sm font-bold">Repay</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all">
                                    <Activity className="w-6 h-6 mb-2" />
                                    <span className="text-sm font-bold">Mint</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History / Info */}
                <div className="mt-8 bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                                    <ArrowDownLeft className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">Vault Created</div>
                                    <div className="text-xs text-slate-400">Just now</div>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <span className="text-green-400 block">+ ${borrowAmount} USDA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
