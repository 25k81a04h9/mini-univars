import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Smile,
  Mail,
  Gift,
  Music,
  HelpCircle,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Plus,
  X,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { MoodType, LoveLetter, CoupleSong } from '../types';
import { DuduAvatar, BubuAvatar, BubuAndDuduTogether } from '../components/BubuDuduAvatars';
import { sounds } from '../utils/soundEffects';

const MOOD_OPTIONS: { id: MoodType; label: string; emoji: string }[] = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'loved', label: 'Loved ❤️', emoji: '🥰' },
  { id: 'excited', label: 'Excited', emoji: '✨' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'sad', label: 'Need Love', emoji: '🥺' },
  { id: 'missing_you', label: 'Missing You', emoji: '💌' },
  { id: 'need_a_hug', label: 'Need a Hug', emoji: '🤗' },
];

const RANDOM_LOVE_SURPRISES = [
  "You are the most precious gift I have ever received in my entire life ❤️",
  "Just thinking of you gives me butterflies all over again! 🦋",
  "I love you more than all the stars and all the pancakes in the galaxy 🍯🥞",
  "Thank you for being my safest place and my sweetest home 🏡✨",
  "If I could hug you right this second, I would never let you go! 🐻🤗",
  "My heart will always beat in rhythm with yours 💖",
];

export const DailyLoveView: React.FC = () => {
  const {
    coupleSpace,
    partner,
    todayMoods,
    setTodayMood,
    currentDailyQuestion,
    answerDailyQuestion,
    loveLetters,
    addLoveLetter,
    openLoveLetter,
    coupleSongs,
    addCoupleSong,
    deleteCoupleSong,
    quizQuestions,
    answerQuizQuestion,
    sendVirtualHug,
    sendMessage,
  } = useCouple();
  const { currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'mood' | 'letters' | 'quiz' | 'songs'>('mood');

  // Daily Question Input
  const [dailyAnswerInput, setDailyAnswerInput] = useState('');

  // Random Love Drop Toast
  const [randomLoveMessage, setRandomLoveMessage] = useState<string | null>(null);

  // Love Letter Form Modal
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterUnlockDate, setLetterUnlockDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );

  // New Song Modal
  const [showSongModal, setShowSongModal] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songLink, setSongLink] = useState('');
  const [songPlatform, setSongPlatform] = useState<'spotify' | 'youtube' | 'apple'>('spotify');
  const [songMemory, setSongMemory] = useState('');

  const partnerName = partner?.nickname || partner?.name || 'My Love';
  const myName = currentUser?.nickname || currentUser?.name || 'Me';
  const myMood = todayMoods.myMood?.mood;

  const handleSendRandomLove = async () => {
    sounds.playHeartReaction();
    const picked = RANDOM_LOVE_SURPRISES[Math.floor(Math.random() * RANDOM_LOVE_SURPRISES.length)];
    setRandomLoveMessage(picked);

    // Also dispatch as sweet message to chat
    await sendMessage({
      text: picked,
      type: 'love_note',
      loveNoteSubject: 'A Surprise Sweet Message Just For You 💌',
    });
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterContent.trim()) return;

    addLoveLetter({
      title: letterTitle.trim(),
      content: letterContent.trim(),
      unlockDate: letterUnlockDate,
    });

    setLetterTitle('');
    setLetterContent('');
    setShowLetterModal(false);
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    addCoupleSong({
      title: songTitle.trim(),
      artist: songArtist.trim() || 'Our Favorite Artist',
      link: songLink.trim() || undefined,
      platform: songPlatform,
      memoryNote: songMemory.trim() || undefined,
    });

    setSongTitle('');
    setSongArtist('');
    setSongLink('');
    setSongMemory('');
    setShowSongModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Daily Love & Fun Features 🧸</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Sweet daily connection routines, mood check-ins, letters, and couple trivia
          </p>
        </div>

        {/* Action Button: Send a Little Love */}
        <button
          type="button"
          onClick={handleSendRandomLove}
          className="px-5 py-2.5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>Send a Little Love ❤️</span>
        </button>
      </div>

      {/* Random Love Toast Banner */}
      <AnimatePresence>
        {randomLoveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-linear-to-r from-pink-100 to-rose-100 dark:from-zinc-800 dark:to-zinc-800 border-2 border-rose-300 dark:border-rose-900 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💌</span>
              <div>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                  Sweet Message Sent to {partnerName}:
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200 italic font-serif">
                  &ldquo;{randomLoveMessage}&rdquo;
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRandomLoveMessage(null)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-rose-100 dark:border-zinc-800">
        {[
          { id: 'mood', label: 'Mood & Daily Question 🌸', icon: Smile },
          { id: 'letters', label: 'Love Letter Box 💌', icon: Mail },
          { id: 'quiz', label: 'Couple Quiz Trivia ❓', icon: HelpCircle },
          { id: 'songs', label: 'Our Special Songs 🎵', icon: Music },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition ${
                isActive
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-zinc-700 hover:bg-rose-50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Mood & Daily Question */}
      {activeSubTab === 'mood' && (
        <div className="space-y-6">
          {/* Mood Check-In Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
            <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 mb-1 flex items-center gap-2">
              <Smile className="w-5 h-5 text-rose-500" />
              <span>How are you feeling today, {myName}?</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Select your daily mood so {partnerName} can celebrate or send you warm bear hugs!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {MOOD_OPTIONS.map((opt) => {
                const isSelected = myMood === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTodayMood(opt.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition border cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105'
                        : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:border-rose-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-bold capitalize">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bear Avatars Visualizing Both Moods */}
            <div className="mt-8 pt-6 border-t border-stone-100 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-zinc-900/60 border border-amber-100 dark:border-zinc-700 flex items-center gap-4">
                {currentUser?.avatar === 'bubu' ? (
                  <BubuAvatar size={60} mood={todayMoods.myMood?.mood || 'happy'} />
                ) : (
                  <DuduAvatar size={60} mood={todayMoods.myMood?.mood || 'happy'} />
                )}
                <div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {myName}&apos;s Current Mood
                  </h4>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 capitalize mt-0.5">
                    {todayMoods.myMood?.mood?.replace('_', ' ') || 'Happy & Cozy 🐻'}
                  </p>
                  {todayMoods.myMood?.note && (
                    <p className="text-[11px] text-stone-500 italic mt-1">
                      &ldquo;{todayMoods.myMood.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-zinc-900/60 border border-pink-100 dark:border-zinc-700 flex items-center gap-4">
                {partner?.avatar === 'bubu' ? (
                  <BubuAvatar size={60} mood={todayMoods.partnerMood?.mood || 'loved'} />
                ) : (
                  <DuduAvatar size={60} mood={todayMoods.partnerMood?.mood || 'loved'} />
                )}
                <div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {partnerName}&apos;s Current Mood
                  </h4>
                  <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 capitalize mt-0.5">
                    {todayMoods.partnerMood?.mood?.replace('_', ' ') || (partner ? 'Waiting for check-in 🌸' : 'Waiting for partner to pair ❤️')}
                  </p>
                  {todayMoods.partnerMood?.note && (
                    <p className="text-[11px] text-stone-500 italic mt-1">
                      &ldquo;{todayMoods.partnerMood.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Couple Question Detailed Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
            <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Today&apos;s Question For Us ❤️</span>
            </h3>
            <p className="text-base font-semibold text-rose-600 dark:text-rose-400 font-serif my-3">
              &ldquo;{currentDailyQuestion.question}&rdquo;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-zinc-900/40 border border-amber-100 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  {currentUser?.avatar === 'bubu' ? <BubuAvatar size={28} animated={false} /> : <DuduAvatar size={28} animated={false} />}
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                    {myName}&apos;s Response:
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 italic font-serif leading-relaxed">
                  {(currentUser && currentDailyQuestion.answers?.[currentUser.id]) || 'You haven\'t answered yet today...'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-zinc-900/40 border border-pink-100 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  {partner?.avatar === 'bubu' ? <BubuAvatar size={28} animated={false} /> : <DuduAvatar size={28} animated={false} />}
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                    {partnerName}&apos;s Response:
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 italic font-serif leading-relaxed">
                  {(partner && currentDailyQuestion.answers?.[partner.id]) || `Waiting for ${partnerName} to answer...`}
                </p>
              </div>
            </div>

            {/* Answer Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!dailyAnswerInput.trim()) return;
                answerDailyQuestion(dailyAnswerInput.trim());
                setDailyAnswerInput('');
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={dailyAnswerInput}
                onChange={(e) => setDailyAnswerInput(e.target.value)}
                placeholder={`Submit or update your answer as ${myName}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-xs transition cursor-pointer"
              >
                Save Answer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Love Letter Box & Timelocked Capsules */}
      {activeSubTab === 'letters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-500" />
                <span>Our Digital Love Letter Box & Timelock Vault</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Letters written from the heart, locked until a chosen future anniversary or date!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLetterModal(true)}
              className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Write Letter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loveLetters.map((letter) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isUnlocked = todayStr >= letter.unlockDate || letter.isOpened;
              const senderName = letter.senderName || (letter.senderId === currentUser?.id ? currentUser?.name : partner?.name) || 'My Love';
              const recipientName = letter.senderId === currentUser?.id ? (partner?.name || 'Partner') : (currentUser?.name || 'Me');

              return (
                <div
                  key={letter.id}
                  className={`p-6 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-linear-to-b from-rose-50/50 to-white dark:from-zinc-800 dark:to-zinc-800 border-rose-200 dark:border-zinc-700'
                      : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                        {isUnlocked ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{isUnlocked ? 'Unlocked Letter' : `Locked until ${letter.unlockDate}`}</span>
                      </span>

                      <span className="text-[10px] text-stone-400">
                        From {senderName} to {recipientName}
                      </span>
                    </div>

                    <h4 className="text-base font-bold font-serif text-stone-800 dark:text-stone-100 mt-1">
                      {letter.title}
                    </h4>

                    {isUnlocked ? (
                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-rose-100 dark:border-zinc-700 mt-3">
                        <p className="text-xs text-stone-700 dark:text-stone-300 font-serif italic whitespace-pre-wrap leading-relaxed">
                          {letter.content}
                        </p>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-zinc-800 border border-dashed border-amber-300 dark:border-amber-800 text-center mt-3">
                        <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                          Timelocked Memory Capsule
                        </p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          This sweet letter will unlock on {letter.unlockDate} for {recipientName}!
                        </p>
                      </div>
                    )}
                  </div>

                  {isUnlocked && !letter.isOpened && (
                    <div className="mt-4 pt-3 border-t border-rose-100 dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() => openLoveLetter(letter.id)}
                        className="w-full py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-600 transition"
                      >
                        Break Wax Seal & Read ❤️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Couple Quiz Trivia */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-amber-50 via-rose-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-800 border-2 border-amber-200 dark:border-amber-900/60 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Couple Trivia Challenge
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100 mt-1">
                How Well Do We Know Each Other? ❓
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Answer fun questions written by your partner!
              </p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q) => {
              const myAnswer = q.answers ? q.answers[currentUser?.id || ''] : undefined;
              const isAnswered = myAnswer !== undefined;
              const isCorrect = isAnswered && myAnswer === q.correctAnswerIndex;
              const creatorName = q.createdByName || (q.createdByUserId === currentUser?.id ? currentUser?.name : partner?.name) || 'My Love';

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-500">
                      Question from {creatorName}:
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isCorrect ? 'Correct! 💖' : 'Almost! 🥰'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif mb-4">
                    {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = myAnswer === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => answerQuizQuestion(q.id, optIdx)}
                          className={`p-3 rounded-2xl text-xs font-semibold text-left transition border flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                              : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:border-rose-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Our Special Songs Playlist */}
      {activeSubTab === 'songs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-500" />
                <span>Our Couple Songs & Playlist 🎵</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                The soundtrack to our memories, car rides, and living room dances
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSongModal(true)}
              className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Song</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupleSongs.map((song) => (
              <div
                key={song.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-zinc-700 text-rose-500 flex items-center justify-center font-bold">
                      🎵
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteCoupleSong(song.id)}
                      className="text-stone-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif">
                    {song.title}
                  </h4>
                  <p className="text-xs font-semibold text-rose-500 mt-0.5">{song.artist}</p>

                  {song.memoryNote && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic mt-3 bg-stone-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-stone-100 dark:border-zinc-700">
                      &ldquo;{song.memoryNote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px] capitalize">
                    Added by {song.addedByName || (song.addedByUserId === currentUser?.id ? currentUser?.name : partner?.name) || 'Us'}
                  </span>

                  {song.link ? (
                    <a
                      href={song.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-500 font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Listen on {song.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-stone-400 text-[11px]">Saved Song</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Love Letter Modal */}
      <AnimatePresence>
        {showLetterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-rose-500" />
                  <span>Write Timelocked Love Letter</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLetter} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Letter Title:
                  </label>
                  <input
                    type="text"
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                    placeholder="e.g. Open on Our 2nd Year Anniversary 💍"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Unlock Date (Cannot be opened until this date):
                  </label>
                  <input
                    type="date"
                    value={letterUnlockDate}
                    onChange={(e) => setLetterUnlockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Secret Message & Feelings:
                  </label>
                  <textarea
                    rows={6}
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    placeholder="My dearest..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 font-serif"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLetterModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Seal Letter in Vault 🔒
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Song Modal */}
      <AnimatePresence>
        {showSongModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Music className="w-5 h-5 text-rose-500" />
                  <span>Add Couple Song</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSongModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSong} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Song Title:
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Perfect"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Artist:
                  </label>
                  <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="e.g. Ed Sheeran"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Platform:
                    </label>
                    <select
                      value={songPlatform}
                      onChange={(e) => setSongPlatform(e.target.value as 'spotify' | 'youtube' | 'apple')}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    >
                      <option value="spotify">Spotify</option>
                      <option value="youtube">YouTube</option>
                      <option value="apple">Apple Music</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Link / URL (Optional):
                    </label>
                    <input
                      type="url"
                      value={songLink}
                      onChange={(e) => setSongLink(e.target.value)}
                      placeholder="https://open.spotify.com/..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Special Memory Behind It:
                  </label>
                  <input
                    type="text"
                    value={songMemory}
                    onChange={(e) => setSongMemory(e.target.value)}
                    placeholder="e.g. Played when we first cooked dinner together 🍝"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSongModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Add Song 🎵
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
