import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, QrCode, Heart, Key, Unlink, ShieldCheck } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { BubuAndDuduTogether } from './BubuDuduAvatars';

export const PairingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { coupleSpace, partner, isPaired, joinCoupleSpace, resetAllCoupleData } = useCouple();
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [pairError, setPairError] = useState('');
  const [pairSuccess, setPairSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (coupleSpace?.inviteCode) {
      navigator.clipboard.writeText(coupleSpace.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = await joinCoupleSpace(inputCode.trim());
    if (res.success) {
      setPairSuccess(true);
      setPairError('');
      setTimeout(() => {
        setPairSuccess(false);
        onClose();
      }, 1500);
    } else {
      setPairError(res.error || 'Invalid invitation code. Please check with your partner ❤️');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center mb-6">
            <BubuAndDuduTogether size={130} />
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif mt-2">
              Our Couple Space 💍
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              A private two-person universe locked exclusively to you and your partner
            </p>
          </div>

          {isPaired ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Couple Space Paired &amp; Active
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    This space is strictly restricted to {currentUser?.name} and{' '}
                    {partner?.name || 'Partner'}. No strangers or public followers.
                  </p>
                </div>
              </div>

              {/* Invitation Code Display */}
              <div className="p-4 bg-rose-50 dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700">
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  Our Unique Space Code:
                </label>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-rose-200 dark:border-zinc-700">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tracking-wider text-sm">
                    {coupleSpace?.inviteCode || 'N/A'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* QR Code Representation */}
              <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-stone-200 dark:border-zinc-700">
                <div className="w-36 h-36 bg-stone-100 dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center p-2 border border-dashed border-rose-300 dark:border-rose-700">
                  <QrCode className="w-24 h-24 text-stone-800 dark:text-stone-200" />
                  <span className="text-[10px] text-stone-400 font-mono mt-1">Scan with partner</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to unlink or reset this couple space?')) {
                      resetAllCoupleData();
                      onClose();
                    }
                  }}
                  className="w-full text-xs text-rose-500 hover:text-rose-600 font-medium py-2 flex items-center justify-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Unlink or Reset Couple Pairing</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
                Please enter your partner&apos;s invitation code to link your accounts together into one
                private universe.
              </div>

              <form onSubmit={handleJoin} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Enter Invitation Code:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. LOVE-1234"
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono uppercase text-sm tracking-wider focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                    />
                    <Key className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  </div>
                </div>

                {pairError && <p className="text-xs text-rose-500 font-medium">{pairError}</p>}
                {pairSuccess && (
                  <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-emerald-500" />
                    <span>Connected forever with your partner!</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-rose-400 to-pink-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  Join Partner Space ❤️
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm text-stone-600 dark:text-stone-400 font-medium hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
