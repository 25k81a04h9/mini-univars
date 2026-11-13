import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Sparkles,
  MessageCircleHeart,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  Heart,
  Clock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { BubuAndDuduTogether, DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';
import {
  calculateRelationshipDuration,
  getNextYearlyAnniversary,
  getMilestones,
  formatOrdinal,
} from '../utils/relationshipCalculator';
import { sounds } from '../utils/soundEffects';
import { ActiveTab } from '../components/Navbar';

export const HomeScreen: React.FC<{ onNavigate: (tab: ActiveTab) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const {
    coupleSpace,
    partner,
    photos,
    todayMoods,
    sendVirtualHug,
    sendMessage,
  } = useCouple();

  const [quickLoveInput, setQuickLoveInput] = useState('');
  const [loveSentToast, setLoveSentToast] = useState(false);

  const startDate = coupleSpace?.relationshipStartDate || new Date().toISOString().split('T')[0];
  const firstMetDate = coupleSpace?.firstMeetingDate || startDate;

  const duration = calculateRelationshipDuration(startDate);
  const meetingDuration = calculateRelationshipDuration(firstMetDate);
  const nextAnniv = getNextYearlyAnniversary(startDate);
  const { nextMilestone, progressPercent } = getMilestones(startDate);

  const partnerName = partner?.name || 'Partner';
  const partnerNickname = partner?.nickname || partnerName;
  const myName = currentUser?.name || 'Me';
  const myNickname = currentUser?.nickname || myName;

  const handleAnniversaryCelebration = () => {
    sounds.playCelebration();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF6B8B', '#FFB6C1', '#F472B6', '#A855F7', '#FBBF24'],
      });
    } catch {
      // fallback
    }
  };

  const handleSendQuickLove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLoveInput.trim()) return;
    await sendMessage({
      text: quickLoveInput.trim(),
      type: 'love_note',
      loveNoteSubject: 'A Sweet Little Note for You 💌',
    });
    setQuickLoveInput('');
    setLoveSentToast(true);
    setTimeout(() => setLoveSentToast(false), 2500);
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-linear-to-b from-rose-100/80 via-pink-50/50 to-white dark:from-rose-950/40 dark:via-zinc-900/60 dark:to-zinc-900 rounded-3xl p-6 sm:p-10 border border-rose-200/80 dark:border-rose-900/40 shadow-xs text-center">
        <div className="absolute top-3 left-4 text-rose-300 dark:text-rose-700/50 text-2xl select-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-4 right-6 text-pink-300 dark:text-pink-700/50 text-2xl select-none animate-pulse">
          ☁️
        </div>

        <BubuAndDuduTogether size={190} />

        <div className="mt-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-800 dark:text-stone-100 tracking-tight"
          >
            Our Little Universe ❤️
          </motion.h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
            {myNickname} & {partnerNickname} • Two hearts, one little world.
          </p>
        </div>

        {/* Live Relationship Counter Banner (Calculated Exclusively From Entered Start Date!) */}
        <div className="mt-6 inline-block w-full max-w-xl">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl p-5 border border-rose-200 dark:border-rose-900/60 shadow-md">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-500 dark:text-rose-400 block mb-1">
              Together For
            </span>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 font-serif tracking-tight cursor-pointer"
              onClick={handleAnniversaryCelebration}
              title="Click to celebrate our love!"
            >
              {duration.totalDays.toLocaleString()} DAYS ❤️
            </motion.div>

            {/* Exact Duration Breakdown */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-rose-100 dark:border-zinc-700 text-stone-700 dark:text-stone-300">
              <div className="p-1.5 rounded-xl bg-rose-50/50 dark:bg-zinc-900/50">
                <span className="text-base sm:text-lg font-bold block text-rose-600 dark:text-rose-300">
                  {duration.years}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Years</span>
              </div>
              <div className="p-1.5 rounded-xl bg-rose-50/50 dark:bg-zinc-900/50">
                <span className="text-base sm:text-lg font-bold block text-rose-600 dark:text-rose-300">
                  {duration.months}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Months</span>
              </div>
              <div className="p-1.5 rounded-xl bg-rose-50/50 dark:bg-zinc-900/50">
                <span className="text-base sm:text-lg font-bold block text-rose-600 dark:text-rose-300">
                  {duration.days}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Days</span>
              </div>
              <div className="p-1.5 rounded-xl bg-rose-50/50 dark:bg-zinc-900/50 hidden sm:block">
                <span className="text-base sm:text-lg font-bold block text-rose-600 dark:text-rose-300">
                  {duration.totalWeeks.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Weeks</span>
              </div>
              <div className="p-1.5 rounded-xl bg-rose-50/50 dark:bg-zinc-900/50 hidden sm:block">
                <span className="text-base sm:text-lg font-bold block text-rose-600 dark:text-rose-300">
                  {duration.totalHours.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Hours</span>
              </div>
            </div>

            {/* Separate First Meeting Counter */}
            {coupleSpace?.firstMeetingDate && (
              <div className="mt-3 pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1.5">
                <span>Since the day we first met:</span>
                <strong className="text-rose-500 font-bold">
                  {meetingDuration.totalDays.toLocaleString()} days
                </strong>
                <span>({coupleSpace.firstMeetingDate})</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={sendVirtualHug}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
          >
            <span>🤗</span>
            <span>Send Bear Hug</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('anniversary')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-200 border border-rose-200 dark:border-zinc-700 text-xs font-semibold shadow-xs hover:bg-rose-50 dark:hover:bg-zinc-700 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Anniversary Milestones</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-200 border border-rose-200 dark:border-zinc-700 text-xs font-semibold shadow-xs hover:bg-rose-50 dark:hover:bg-zinc-700 transition cursor-pointer"
          >
            <MessageCircleHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>Open Chat</span>
          </button>
        </div>
      </div>

      {/* Today Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
            Today in Our Little Universe 🌸
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{todayFormatted}</span>
          </p>
        </div>
      </div>

      {/* Grid: Mood Check-in & Anniversary Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mood Check-In Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <span>Mood Check-In</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-normal">
                Today
              </span>
            </h4>
            <button
              type="button"
              onClick={() => onNavigate('daily_love')}
              className="text-xs text-rose-500 hover:underline font-medium"
            >
              Update Mood →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-zinc-900/60 border border-amber-100 dark:border-zinc-700 flex items-center gap-3">
              {currentUser?.avatar === 'dudu' ? (
                <DuduAvatar size={40} mood={todayMoods.myMood?.mood || 'happy'} />
              ) : (
                <BubuAvatar size={40} mood={todayMoods.myMood?.mood || 'happy'} />
              )}
              <div>
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">{myName}</span>
                <span className="text-xs capitalize font-medium text-amber-700 dark:text-amber-300">
                  {todayMoods.myMood?.mood?.replace('_', ' ') || 'Happy'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/70 dark:bg-zinc-900/60 border border-pink-100 dark:border-zinc-700 flex items-center gap-3">
              {partner?.avatar === 'dudu' ? (
                <DuduAvatar size={40} mood={todayMoods.partnerMood?.mood || 'loved'} />
              ) : (
                <BubuAvatar size={40} mood={todayMoods.partnerMood?.mood || 'loved'} />
              )}
              <div>
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">{partnerName}</span>
                <span className="text-xs capitalize font-medium text-pink-700 dark:text-pink-300">
                  {todayMoods.partnerMood?.mood?.replace('_', ' ') || 'Loved ❤️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Anniversary Countdown Card */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-rose-50 via-white to-pink-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
              Countdown
            </span>
            <span className="text-xs text-stone-400">Official Anniversary</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-stone-800 dark:text-stone-100 font-serif">
              {nextAnniv.daysRemaining === 0 ? (
                <span className="text-rose-500 animate-bounce">TODAY IS OUR ANNIVERSARY! 🎂❤️</span>
              ) : (
                <span>
                  {nextAnniv.daysRemaining} <span className="text-lg font-normal text-stone-500">days until</span>
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">
              Our {formatOrdinal(nextAnniv.nextYearNumber)} Year Anniversary ({nextAnniv.nextDate}) 💍
            </p>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-rose-100 dark:border-zinc-700 flex items-center justify-between">
            <span>Started on {startDate}</span>
            <button
              type="button"
              onClick={() => onNavigate('anniversary')}
              className="text-rose-500 font-medium hover:underline"
            >
              View Milestones →
            </button>
          </div>
        </div>
      </div>

      {/* Send A Little Love Box */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-pink-50 via-rose-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-800 border border-rose-100 dark:border-zinc-700">
        <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-1 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Send a Little Love to {partnerName}</span>
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
          Drop a digital love note into your private encrypted chat instantly!
        </p>

        <form onSubmit={handleSendQuickLove} className="flex gap-2">
          <input
            type="text"
            value={quickLoveInput}
            onChange={(e) => setQuickLoveInput(e.target.value)}
            placeholder={`Thinking of you right now, ${partnerNickname}... ❤️`}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-rose-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
          />
          <button
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Love</span>
          </button>
        </form>

        {loveSentToast && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered safely to our private chat!</span>
          </p>
        )}
      </div>

      {/* Recent Memories with Real Clean Empty State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-rose-500" />
            <span>Recent Shared Memories</span>
          </h4>
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="text-xs text-rose-500 hover:underline font-medium"
          >
            All Photos ({photos.length}) →
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.slice(0, 3).map((photo) => (
              <div
                key={photo.id}
                onClick={() => onNavigate('gallery')}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-rose-100 dark:border-zinc-800 shadow-xs cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2.5 flex flex-col justify-end">
                  <p className="text-white text-[11px] font-medium line-clamp-2">
                    {photo.caption}
                  </p>
                  <span className="text-rose-200 text-[9px] mt-0.5">{photo.dateTaken}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-center">
            <ImageIcon className="w-10 h-10 text-rose-300 dark:text-rose-700 mx-auto mb-2 opacity-60" />
            <h5 className="text-sm font-bold text-stone-700 dark:text-stone-300">
              No photos uploaded yet
            </h5>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Your gallery is waiting for your very first shared memory! Tap Gallery to upload a photo.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-rose-50 dark:bg-zinc-700 text-rose-600 dark:text-rose-300 text-xs font-bold inline-flex items-center gap-1 hover:bg-rose-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload First Memory</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
