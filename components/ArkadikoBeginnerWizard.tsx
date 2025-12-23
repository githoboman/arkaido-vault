"use client";

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Zap, Heart, Bell, Info, Wallet, Loader2 } from 'lucide-react';
import { UserData } from '@stacks/connect';
import Dashboard from './Dashboard';
import { useStacks } from './StacksProvider';

type SafetyLevel = 'very-safe' | 'safe' | 'risky' | 'danger' | '';
type ViewState = 'wizard' | 'dashboard';

const ArkadikoBeginnerWizard = () => {
    const { userSession, userData, authenticate, disconnect, isDataLoading } = useStacks();
    const [view, setView] = useState<ViewState>('wizard');
    const [step, setStep] = useState(0);
    const [stxAmount, setStxAmount] = useState('');
    const [borrowAmount, setBorrowAmount] = useState('');
    const [stxPrice] = useState(0.85);
    const [userLevel, setUserLevel] = useState('');
    const [collateralRatio, setCollateralRatio] = useState(0);
    const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>('');
    const [liquidationPrice, setLiquidationPrice] = useState(0);

    useEffect(() => {
        if (stxAmount && borrowAmount) {
            const collateralValue = parseFloat(stxAmount) * stxPrice;
            const amount = parseFloat(borrowAmount);

            if (amount > 0) {
                const ratio = (collateralValue / amount) * 100;
                setCollateralRatio(ratio);

                const liqPrice = (amount * 1.5) / parseFloat(stxAmount);
                setLiquidationPrice(liqPrice);

                if (ratio >= 300) setSafetyLevel('very-safe');
                else if (ratio >= 200) setSafetyLevel('safe');
                else if (ratio >= 170) setSafetyLevel('risky');
                else setSafetyLevel('danger');
            } else {
                setCollateralRatio(0);
                setSafetyLevel('');
            }
        }
    }, [stxAmount, borrowAmount, stxPrice]);

    const handleConnectWallet = () => {
        authenticate();
    };

    const handleLogout = () => {
        disconnect();
        setView('wizard');
        setStep(0);
    };

    if (view === 'dashboard') {
        return <Dashboard stxAmount={stxAmount} borrowAmount={borrowAmount} stxPrice={stxPrice} onLogout={handleLogout} userAddress={userData?.profile?.stxAddress?.mainnet} />;
    }

    // Helper functions for UI
    const getSafetyColor = (level: SafetyLevel) => {
        const styles = {
            'very-safe': 'text-green-600 bg-green-50/80 border-green-200',
            'safe': 'text-blue-600 bg-blue-50/80 border-blue-200',
            'risky': 'text-orange-600 bg-orange-50/80 border-orange-200',
            'danger': 'text-red-600 bg-red-50/80 border-red-200',
            '': 'text-gray-600 bg-gray-50 border-gray-200'
        };
        return styles[level];
    };

    const getSafetyIcon = (level: SafetyLevel) => {
        switch (level) {
            case 'very-safe': return <Shield className="w-10 h-10 text-green-500" />;
            case 'safe': return <CheckCircle className="w-10 h-10 text-blue-500" />;
            case 'risky': return <AlertTriangle className="w-10 h-10 text-orange-500" />;
            case 'danger': return <AlertTriangle className="w-10 h-10 text-red-500" />;
            default: return null;
        }
    };

    const getSafetyMessage = (level: SafetyLevel) => {
        switch (level) {
            case 'very-safe': return 'Extremely Safe! STX is solid.';
            case 'safe': return 'Good safety buffer.';
            case 'risky': return 'Getting a bit tight.';
            case 'danger': return 'High liquidation risk!';
            default: return '';
        }
    };

    const maxSafeBorrow = stxAmount ? ((parseFloat(stxAmount) * stxPrice) / 3).toFixed(0) : "0";
    const recommendedBorrow = stxAmount ? ((parseFloat(stxAmount) * stxPrice) / 4).toFixed(0) : "0";

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center font-sans text-slate-800">
            <div className="w-full max-w-4xl">

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800">Arkadiko</span>
                    </div>

                    <button
                        onClick={userData ? undefined : handleConnectWallet}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all shadow-md flex items-center gap-2 ${userData
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-purple-300'
                            }`}
                    >
                        {isDataLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : userData ? (
                            <Wallet className="w-4 h-4" />
                        ) : (
                            <Wallet className="w-4 h-4 text-purple-600" />
                        )}
                        {isDataLoading ? 'Loading...' : userData ? `${userData.profile.stxAddress.mainnet.slice(0, 4)}...${userData.profile.stxAddress.mainnet.slice(-4)}` : 'Connect Wallet'}
                    </button>
                </div>

                {/* Wizard Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 ring-1 ring-slate-900/5">

                    {/* Progress Bar */}
                    <div className="bg-slate-50/50 border-b border-slate-100 p-6">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 rounded-full -z-10" />
                            <div
                                className="absolute left-0 top-1/2 h-1 bg-purple-600 rounded-full -z-10 transition-all duration-500"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />

                            {['Start', 'Amount', 'Risks', 'Review', 'Finish'].map((label, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${idx <= step
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                                        : 'bg-white text-slate-400 border border-slate-200'
                                        }`}>
                                        {idx < step ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                                    </div>
                                    <span className={`text-xs font-semibold ${idx <= step ? 'text-purple-700' : 'text-slate-400'}`}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 md:p-10 min-h-[400px]">
                        {step === 0 && (
                            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="inline-flex p-4 bg-purple-100 rounded-full mb-2">
                                    <Heart className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to Better Borrowing</h1>
                                    <p className="text-xl text-slate-600 leading-relaxed">
                                        Borrow stablecoins against your STX without selling. <br />
                                        Simple, transparent, and safe.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 text-left">
                                    {[
                                        { title: 'Deposit STX', desc: 'Secure your assets in a smart contract vault' },
                                        { title: 'Mint USDA', desc: 'Get stable liquidity to use instantly' },
                                        { title: 'Keep Upside', desc: 'You still own your STX while using its value' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold mb-3">{i + 1}</div>
                                            <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    {!userData ? (
                                        <button
                                            onClick={handleConnectWallet}
                                            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-3"
                                        >
                                            <Wallet />
                                            Connect Wallet to Start
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                                                <CheckCircle className="w-5 h-5" /> Wallet Connected
                                            </p>
                                            <button
                                                onClick={() => setStep(1)}
                                                className="w-full md:w-auto px-10 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                Let&apos;s Go <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900">How much do you need?</h2>
                                    <p className="text-slate-500">Calculate your safe borrowing limit</p>
                                </div>

                                <div className="space-y-6">
                                    {/* STX Input */}
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Deposit Amount</label>
                                        <div className="relative transform transition-all group-hover:scale-[1.01]">
                                            <input
                                                type="number"
                                                value={stxAmount}
                                                onChange={(e) => setStxAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-6 pr-20 py-5 text-2xl font-bold bg-white border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none shadow-sm"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-400">≈ ${(parseFloat(stxAmount || '0') * stxPrice).toFixed(2)}</span>
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold text-sm">STX</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Borrow Input */}
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Borrow Amount (USDA)</label>
                                        <div className="relative transform transition-all group-hover:scale-[1.01]">
                                            <input
                                                type="number"
                                                value={borrowAmount}
                                                onChange={(e) => setBorrowAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-6 pr-20 py-5 text-2xl font-bold bg-white border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none shadow-sm"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-sm">USDA</span>
                                        </div>

                                        {stxAmount && (
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <div
                                                    onClick={() => setBorrowAmount(recommendedBorrow)}
                                                    className="flex-1 cursor-pointer p-3 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                                                >
                                                    <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Recommended</div>
                                                    <div className="text-lg font-bold text-green-800">${recommendedBorrow}</div>
                                                </div>
                                                <div
                                                    onClick={() => setBorrowAmount(maxSafeBorrow)}
                                                    className="flex-1 cursor-pointer p-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                                                >
                                                    <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Max Safe</div>
                                                    <div className="text-lg font-bold text-orange-800">${maxSafeBorrow}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between items-center gap-4">
                                    <button onClick={() => setStep(0)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                                        Back
                                    </button>
                                    <button
                                        disabled={!stxAmount || !borrowAmount}
                                        onClick={() => setStep(2)}
                                        className="flex-1 px-8 py-4 bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                                    >
                                        Check Safety <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Safety Check</h2>
                                </div>

                                <div className={`relative p-8 rounded-3xl border-2 ${getSafetyColor(safetyLevel)} transition-all duration-500`}>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                                            {getSafetyIcon(safetyLevel)}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-1">Collateralization Ratio</div>
                                            <div className="text-5xl font-bold mb-2 tracking-tight">{collateralRatio.toFixed(0)}%</div>
                                            <div className="font-medium text-lg">{getSafetyMessage(safetyLevel)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-sm text-slate-500 mb-1">If STX drops to...</div>
                                        <div className="text-2xl font-bold text-red-500">${liquidationPrice.toFixed(2)}</div>
                                        <div className="text-xs text-slate-400 mt-1">Liquidation Warning Price</div>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-sm text-slate-500 mb-1">Current Buffer</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {((stxPrice - liquidationPrice) / stxPrice * 100).toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">Price drop room</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                                        Adjust Amounts
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        Looks Good <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Review & Confirm</h2>
                                </div>

                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <span className="text-slate-500 font-medium">Operation Summary</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">Minting Vault</span>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">STX</div>
                                                <div>
                                                    <div className="font-bold text-slate-900">Depositing Collateral</div>
                                                    <div className="text-xs text-slate-400">Stacks Token</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl">{stxAmount} STX</div>
                                                <div className="text-sm text-slate-500">${(parseFloat(stxAmount) * stxPrice).toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-slate-100" />

                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">$</div>
                                                <div>
                                                    <div className="font-bold text-slate-900">Borrowing</div>
                                                    <div className="text-xs text-slate-400">USDA Stablecoin</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl text-green-600">${borrowAmount}</div>
                                                <div className="text-sm text-slate-500">USDA</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <p>By clicking confirm, you agree to lock your STX in the smart contract. You can withdraw it at any time by repaying the USDA debt.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(4)}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Confirm Transaction <Zap className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="max-w-xl mx-auto text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping" />
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </div>

                                <div>
                                    <h2 className="text-4xl font-bold text-slate-900 mb-2">Vault Created!</h2>
                                    <p className="text-slate-500 text-lg">Your USDA has been sent to your wallet.</p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500">Transaction ID</span>
                                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">0x7f...3a2b</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Status</span>
                                        <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setView('dashboard')}
                                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-xl transition-all"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArkadikoBeginnerWizard;
