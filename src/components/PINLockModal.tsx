import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Delete, Heart } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { BubuAvatar, DuduAvatar } from './BubuDuduAvatars';

export const PINLockModal: React.FC = () => {
  const { isLockedByPin, unlockWithPin } = useCouple();
  const { currentUser } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLockedByPin) return null;

  const handleDigit = async (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);

      if (nextPin.length === 4) {
        const success = await unlockWithPin(nextPin);
        if (!success) {
          setErrorShake(true);
          setErrorMessage('Incorrect PIN. Please try again ❤️');
          setTimeout(() => {
            setErrorShake(false);
            setPinInput('');
          }, 600);
        } else {
          setErrorMessage('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/70 backdrop-blur-md">
      <motion.div
        animate={errorShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : undefined}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 sm:p-8 max-w-xs w-full text-center shadow-2xl"
      >
        <div className="flex justify-center mb-3">
          {currentUser?.avatar === 'bubu' ? (
            <BubuAvatar size={70} mood={errorShake ? 'sad' : 'happy'} />
          ) : (
            <DuduAvatar size={70} mood={errorShake ? 'sad' : 'happy'} />
          )}
        </div>

        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" />
          <span>Our Secret Universe</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Enter our 4-digit relationship PIN to enter
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinInput.length > idx;
            return (
              <motion.div
                key={idx}
                animate={{ scale: isFilled ? 1.2 : 1 }}
                className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                  isFilled
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-rose-300 dark:border-rose-700 bg-transparent'
                }`}
              >
                {isFilled && <Heart className="w-2.5 h-2.5 fill-white" />}
              </motion.div>
            );
          })}
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium mb-3">{errorMessage}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-zinc-800 text-stone-800 dark:text-stone-200 text-xl font-semibold shadow-xs hover:bg-rose-100 dark:hover:bg-zinc-700 active:scale-95 transition"
            >
              {digit}
            </button>
          ))}
          <div className="w-14 h-14 mx-auto" />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-zinc-800 text-stone-800 dark:text-stone-200 text-xl font-semibold shadow-xs hover:bg-rose-100 dark:hover:bg-zinc-700 active:scale-95 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete last digit"
            className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shadow-xs hover:bg-rose-100 dark:hover:bg-zinc-700 active:scale-95 transition"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
