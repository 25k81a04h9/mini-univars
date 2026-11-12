import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useCouple } from '../context/CoupleContext';
import { BubuAndDuduTogether } from './BubuDuduAvatars';

export const HugOverlay: React.FC = () => {
  const { showHugAnimation, closeHugAnimation, partner, hugsCount } = useCouple();
  const partnerName = partner?.name || 'your love';

  useEffect(() => {
    if (showHugAnimation) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF8BA7', '#FFCCD5', '#C084FC', '#F472B6', '#FBBF24'],
        });
      } catch {
        // fallback
      }

      const timer = setTimeout(() => {
        closeHugAnimation();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showHugAnimation, closeHugAnimation]);

  return (
    <AnimatePresence>
      {showHugAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeHugAnimation}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white/95 dark:bg-zinc-900/95 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <BubuAndDuduTogether size={160} />

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-4 font-serif"
            >
              Giant Bear Hug! 🤗
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-stone-600 dark:text-stone-300 mt-2 text-sm"
            >
              Warm, squeezy bear cuddles delivered straight to{' '}
              <span className="font-semibold text-rose-500">{partnerName}</span>!
            </motion.p>

            <div className="mt-4 inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/50 px-4 py-1.5 rounded-full text-xs font-medium text-rose-700 dark:text-rose-300">
              <span>Total Cuddles Shared:</span>
              <span className="font-bold text-sm">{hugsCount} ❤️</span>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={closeHugAnimation}
                className="w-full bg-linear-to-r from-rose-400 to-pink-500 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
              >
                Hold Tight & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
