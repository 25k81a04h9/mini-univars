import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Copy, Check, QrCode, Key, Heart, LogOut, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { DuduAvatar, BubuAvatar, BubuAndDuduTogether } from '../components/BubuDuduAvatars';
import { sounds } from '../utils/soundEffects';

export const PairingPendingView: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { coupleSpace, createCoupleSpace, joinCoupleSpace, refreshCouple } = useCouple();

  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [pairingSuccess, setPairingSuccess] = useState(false);

  const handleCreateSpace = async () => {
    setErrorMessage('');
    const res = await createCoupleSpace();
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create couple space.');
    }
  };

  const handleJoinSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!inputCode.trim()) return;

    setIsJoining(true);
    const res = await joinCoupleSpace(inputCode.trim());
    setIsJoining(false);

    if (res.success) {
      setPairingSuccess(true);
      sounds.playCelebration();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B8B', '#FFB6C1', '#F472B6', '#A855F7', '#FBBF24'],
        });
      } catch {
        // fallback
      }
      setTimeout(async () => {
        setPairingSuccess(false);
        await refreshCouple();
      }, 2000);
    } else {
      setErrorMessage(res.error || 'Failed to join couple space.');
    }
  };

  const handleCopyCode = () => {
    if (coupleSpace?.inviteCode) {
      navigator.clipboard.writeText(coupleSpace.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-rose-200 dark:border-rose-900/60 shadow-xl text-center relative overflow-hidden"
      >
        {/* User Identity Pill & Logout */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-left">
            {currentUser?.avatar === 'dudu' ? (
              <DuduAvatar size={32} animated={false} />
            ) : (
              <BubuAvatar size={32} animated={false} />
            )}
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-stone-400">{currentUser?.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-stone-400 hover:text-rose-500 text-xs flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Pairing Success Celebration State */}
        {pairingSuccess ? (
          <div className="py-8 space-y-4">
            <BubuAndDuduTogether size={170} />
            <motion.h3
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold font-serif text-rose-600 dark:text-rose-400"
            >
              Paired Forever! 💖
            </motion.h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Your accounts have successfully bonded into one private universe.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              {currentUser?.avatar === 'dudu' ? <DuduAvatar size={100} /> : <BubuAvatar size={100} />}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-800 dark:text-stone-100 leading-snug">
                Your little universe is waiting for someone ❤️
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                Our Little Universe is strictly made for two. Generate an invitation code for your partner,
                or enter the code they gave you.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* If Couple Space already created, show Invitation Code & QR */}
            {coupleSpace?.inviteCode ? (
              <div className="space-y-4 text-left p-4 rounded-2xl bg-rose-50/70 dark:bg-zinc-800/80 border border-rose-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  1. Share this Invitation Code with your partner:
                </span>

                <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-rose-200 dark:border-zinc-700">
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400 tracking-wider text-base sm:text-lg">
                    {coupleSpace.inviteCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-rose-50 dark:bg-zinc-800 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1 text-xs font-bold"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* QR Code representation */}
                <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-700">
                  <QrCode className="w-20 h-20 text-stone-800 dark:text-stone-200 mb-1" />
                  <span className="text-[10px] text-stone-400 font-mono">
                    Show this QR code to partner to join
                  </span>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-rose-500 font-medium animate-pulse flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Waiting for your partner to join...</span>
                  </span>
                  <button
                    type="button"
                    onClick={refreshCouple}
                    className="text-[11px] text-stone-400 hover:text-stone-600 underline mt-2 block mx-auto"
                  >
                    Check if partner has joined ↻
                  </button>
                </div>
              </div>
            ) : (
              /* Options to Create Space or Join with Partner's Code */
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleCreateSpace}
                  className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Create Our Couple Space</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="grow border-t border-stone-200 dark:border-zinc-700" />
                  <span className="shrink mx-3 text-xs text-stone-400 uppercase font-semibold">
                    Or Join Partner
                  </span>
                  <div className="grow border-t border-stone-200 dark:border-zinc-700" />
                </div>

                {/* Enter Invitation Code */}
                <form onSubmit={handleJoinSpace} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="Enter Partner's Code (e.g. LOVE-1234)"
                      className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono uppercase tracking-wider bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-bold"
                    />
                    <Key className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
                  </div>

                  <button
                    type="submit"
                    disabled={isJoining || !inputCode.trim()}
                    className="w-full py-3 rounded-2xl bg-stone-800 dark:bg-zinc-700 text-white font-bold text-xs shadow-xs hover:bg-stone-900 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isJoining ? 'Verifying Code...' : 'Connect to Partner ❤️'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
