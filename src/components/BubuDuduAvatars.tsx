import React from 'react';
import { motion } from 'motion/react';

interface AvatarProps {
  size?: number;
  className?: string;
  mood?: 'happy' | 'loved' | 'excited' | 'tired' | 'sad' | 'missing_you' | 'need_a_hug';
  animated?: boolean;
}

/**
 * Original Dudu Bear: Cute warm caramel-brown bear with soft cream muzzle and blushing cheeks
 */
export const DuduAvatar: React.FC<AvatarProps> = ({
  size = 64,
  className = '',
  mood = 'happy',
  animated = true,
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      animate={animated ? { y: [0, -2, 0] } : undefined}
      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      aria-label="Dudu the brown bear"
      role="img"
    >
      <defs>
        <radialGradient id="duduBodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#A06846" />
          <stop offset="100%" stopColor="#7E4C2D" />
        </radialGradient>
        <radialGradient id="duduEarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C98B63" />
          <stop offset="100%" stopColor="#A06846" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <circle cx="28" cy="28" r="16" fill="url(#duduEarGrad)" />
      <circle cx="28" cy="28" r="10" fill="#E8B896" />
      <circle cx="72" cy="28" r="16" fill="url(#duduEarGrad)" />
      <circle cx="72" cy="28" r="10" fill="#E8B896" />

      {/* Head */}
      <ellipse cx="50" cy="54" rx="36" ry="32" fill="url(#duduBodyGrad)" />

      {/* Rosy Cheeks */}
      <ellipse cx="28" cy="62" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />
      <ellipse cx="72" cy="62" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />

      {/* Snout Area */}
      <ellipse cx="50" cy="62" rx="16" ry="12" fill="#F7DEC7" />

      {/* Nose */}
      <ellipse cx="50" cy="57" rx="4.5" ry="3.2" fill="#3D2214" />

      {/* Mouth based on mood */}
      {mood === 'happy' && (
        <path d="M 45 63 Q 50 68 55 63" stroke="#3D2214" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {mood === 'loved' && (
        <path d="M 44 62 Q 50 69 56 62" stroke="#3D2214" strokeWidth="2.4" strokeLinecap="round" fill="#FF7096" />
      )}
      {mood === 'excited' && (
        <ellipse cx="50" cy="64" rx="4.5" ry="4" fill="#E74C3C" />
      )}
      {mood === 'tired' && (
        <path d="M 46 64 Q 50 62 54 64" stroke="#3D2214" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {mood === 'sad' && (
        <path d="M 45 66 Q 50 61 55 66" stroke="#3D2214" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {(mood === 'missing_you' || mood === 'need_a_hug') && (
        <path d="M 46 64 Q 50 67 54 64" stroke="#3D2214" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}

      {/* Eyes */}
      {mood === 'loved' ? (
        <>
          <path d="M 32 46 Q 37 40 42 46" stroke="#3D2214" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 58 46 Q 63 40 68 46" stroke="#3D2214" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : mood === 'tired' ? (
        <>
          <line x1="32" y1="46" x2="42" y2="46" stroke="#3D2214" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="46" x2="68" y2="46" stroke="#3D2214" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="37" cy="46" r="4.5" fill="#3D2214" />
          <circle cx="63" cy="46" r="4.5" fill="#3D2214" />
          {/* Tear */}
          <path d="M 32 50 C 30 54 34 56 34 52 Z" fill="#60A5FA" />
        </>
      ) : (
        <>
          <circle cx="37" cy="46" r="4.5" fill="#3D2214" />
          <circle cx="39" cy="44" r="1.6" fill="#FFFFFF" />
          <circle cx="63" cy="46" r="4.5" fill="#3D2214" />
          <circle cx="65" cy="44" r="1.6" fill="#FFFFFF" />
        </>
      )}

      {/* Tiny sweet blue bow/accent for Dudu */}
      <circle cx="22" cy="74" r="4" fill="#60A5FA" opacity="0.9" />
    </motion.svg>
  );
};

/**
 * Original Bubu Bear: Cute fluffy snow-white bear with pastel pink cheeks and sweet flower
 */
export const BubuAvatar: React.FC<AvatarProps> = ({
  size = 64,
  className = '',
  mood = 'happy',
  animated = true,
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      animate={animated ? { y: [0, -2.5, 0] } : undefined}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.3 }}
      aria-label="Bubu the white bear"
      role="img"
    >
      <defs>
        <radialGradient id="bubuBodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="90%" stopColor="#FFF2F4" />
          <stop offset="100%" stopColor="#F5DFE5" />
        </radialGradient>
        <radialGradient id="bubuEarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCE7EB" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <circle cx="28" cy="28" r="16" fill="url(#bubuEarGrad)" stroke="#F0D0D8" strokeWidth="1.2" />
      <circle cx="28" cy="28" r="10" fill="#FFCCD5" />
      <circle cx="72" cy="28" r="16" fill="url(#bubuEarGrad)" stroke="#F0D0D8" strokeWidth="1.2" />
      <circle cx="72" cy="28" r="10" fill="#FFCCD5" />

      {/* Flower or Ribbon on Left Ear */}
      <circle cx="22" cy="20" r="4.5" fill="#FF85A1" />
      <circle cx="22" cy="20" r="2" fill="#FFE066" />

      {/* Head */}
      <ellipse cx="50" cy="54" rx="36" ry="32" fill="url(#bubuBodyGrad)" stroke="#F0D0D8" strokeWidth="1" />

      {/* Rosy Pastel Cheeks */}
      <ellipse cx="28" cy="62" rx="7.5" ry="5" fill="#FF9EAA" opacity="0.75" />
      <ellipse cx="72" cy="62" rx="7.5" ry="5" fill="#FF9EAA" opacity="0.75" />

      {/* Snout Area */}
      <ellipse cx="50" cy="62" rx="15" ry="11" fill="#FFFFFF" />

      {/* Nose */}
      <ellipse cx="50" cy="57" rx="4.2" ry="3" fill="#4A3438" />

      {/* Mouth based on mood */}
      {mood === 'happy' && (
        <path d="M 45 63 Q 50 67 55 63" stroke="#4A3438" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {mood === 'loved' && (
        <path d="M 44 62 Q 50 69 56 62" stroke="#4A3438" strokeWidth="2.4" strokeLinecap="round" fill="#FF758F" />
      )}
      {mood === 'excited' && (
        <ellipse cx="50" cy="64" rx="4.5" ry="4" fill="#FF4D6D" />
      )}
      {mood === 'tired' && (
        <path d="M 46 64 Q 50 62 54 64" stroke="#4A3438" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {mood === 'sad' && (
        <path d="M 45 66 Q 50 61 55 66" stroke="#4A3438" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {(mood === 'missing_you' || mood === 'need_a_hug') && (
        <path d="M 46 64 Q 50 67 54 64" stroke="#4A3438" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}

      {/* Eyes */}
      {mood === 'loved' ? (
        <>
          <path d="M 32 46 Q 37 40 42 46" stroke="#4A3438" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 58 46 Q 63 40 68 46" stroke="#4A3438" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : mood === 'tired' ? (
        <>
          <line x1="32" y1="46" x2="42" y2="46" stroke="#4A3438" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="46" x2="68" y2="46" stroke="#4A3438" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="37" cy="46" r="4.5" fill="#4A3438" />
          <circle cx="63" cy="46" r="4.5" fill="#4A3438" />
          <path d="M 68 50 C 70 54 66 56 66 52 Z" fill="#60A5FA" />
        </>
      ) : (
        <>
          <circle cx="37" cy="46" r="4.5" fill="#4A3438" />
          <circle cx="39" cy="44" r="1.6" fill="#FFFFFF" />
          <circle cx="63" cy="46" r="4.5" fill="#4A3438" />
          <circle cx="65" cy="44" r="1.6" fill="#FFFFFF" />
        </>
      )}
    </motion.svg>
  );
};

/**
 * Bubu & Dudu Together: Cheeks touching, hugging with floating animated hearts
 */
export const BubuAndDuduTogether: React.FC<{
  size?: number;
  className?: string;
  withHearts?: boolean;
}> = ({ size = 180, className = '', withHearts = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {withHearts && (
        <motion.div
          className="absolute -top-3 z-10"
          animate={{
            y: [-3, -12, -3],
            scale: [1, 1.25, 1],
            rotate: [-5, 5, -5],
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <span className="text-2xl drop-shadow-md">💖</span>
        </motion.div>
      )}

      {/* Sparkles */}
      <motion.span
        className="absolute -top-1 left-4 text-xs select-none"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        ✨
      </motion.span>
      <motion.span
        className="absolute top-2 right-4 text-xs select-none"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.3, 0.9] }}
        transition={{ repeat: Infinity, duration: 2.1, delay: 0.5 }}
      >
        🌸
      </motion.span>

      <div className="flex items-center -space-x-4">
        {/* Dudu on Left */}
        <motion.div
          animate={{ rotate: [-2, 1, -2] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <DuduAvatar size={size * 0.58} mood="loved" />
        </motion.div>

        {/* Bubu on Right */}
        <motion.div
          animate={{ rotate: [2, -1, 2] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.2 }}
        >
          <BubuAvatar size={size * 0.58} mood="loved" />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Sticker Collection for romantic chat interactions
 */
export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  renderSvg: (size?: number) => React.ReactNode;
}

export const BUBU_DUDU_STICKERS: StickerItem[] = [
  {
    id: 'bear_hug',
    name: 'Big Hug',
    emoji: '🤗',
    renderSvg: (s = 70) => <BubuAndDuduTogether size={s} withHearts={false} />,
  },
  {
    id: 'bear_kiss',
    name: 'Sweet Kiss',
    emoji: '💋',
    renderSvg: (s = 70) => (
      <div className="flex items-center -space-x-5">
        <DuduAvatar size={s * 0.55} mood="loved" />
        <span className="text-xl z-10">😘</span>
        <BubuAvatar size={s * 0.55} mood="loved" />
      </div>
    ),
  },
  {
    id: 'dudu_heart',
    name: 'Dudu Loves You',
    emoji: '🤎',
    renderSvg: (s = 70) => (
      <div className="relative">
        <DuduAvatar size={s * 0.85} mood="loved" />
        <span className="absolute -bottom-1 -right-1 text-2xl">❤️</span>
      </div>
    ),
  },
  {
    id: 'bubu_flower',
    name: 'Bubu Sweet Flower',
    emoji: '🌸',
    renderSvg: (s = 70) => (
      <div className="relative">
        <BubuAvatar size={s * 0.85} mood="happy" />
        <span className="absolute -bottom-1 -right-1 text-2xl">💐</span>
      </div>
    ),
  },
  {
    id: 'bear_sleep',
    name: 'Sleepy Together',
    emoji: '😴',
    renderSvg: (s = 70) => (
      <div className="relative flex items-center -space-x-3">
        <DuduAvatar size={s * 0.5} mood="tired" />
        <BubuAvatar size={s * 0.5} mood="tired" />
        <span className="absolute -top-2 right-1 text-xs font-bold text-indigo-400">Zzz...</span>
      </div>
    ),
  },
  {
    id: 'bear_cooking',
    name: 'Cooking For You',
    emoji: '🍳',
    renderSvg: (s = 70) => (
      <div className="relative">
        <DuduAvatar size={s * 0.8} mood="excited" />
        <span className="absolute -bottom-1 right-0 text-xl">🥞</span>
      </div>
    ),
  },
  {
    id: 'bear_cheers',
    name: 'Celebration',
    emoji: '🎉',
    renderSvg: (s = 70) => (
      <div className="relative">
        <BubuAvatar size={s * 0.8} mood="excited" />
        <span className="absolute -top-1 -right-1 text-xl">✨</span>
        <span className="absolute -bottom-1 -left-1 text-xl">🎂</span>
      </div>
    ),
  },
  {
    id: 'bear_miss_you',
    name: 'Miss You So Much',
    emoji: '🥺',
    renderSvg: (s = 70) => (
      <div className="relative">
        <BubuAvatar size={s * 0.8} mood="sad" />
        <span className="absolute -bottom-1 -right-1 text-xl">💌</span>
      </div>
    ),
  },
];
