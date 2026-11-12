import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Calendar,
  Clock,
  PartyPopper,
  Flame,
  CheckCircle2,
  CalendarHeart,
  Star,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { BubuAndDuduTogether, DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';
import {
  calculateRelationshipDuration,
  getNextYearlyAnniversary,
  getMilestones,
} from '../utils/relationshipCalculator';
import { sounds } from '../utils/soundEffects';

export const AnniversaryView: React.FC = () => {
  const { coupleSpace, updateRelationshipDates } = useCouple();
  const [isEditingDates, setIsEditingDates] = useState(false);

  const relationshipStarted = coupleSpace?.relationshipStartDate || new Date().toISOString().split('T')[0];
  const firstMet = coupleSpace?.firstMeetingDate || relationshipStarted;
  const firstDate = coupleSpace?.specialDates?.firstDate || relationshipStarted;

  const [startedDateInput, setStartedDateInput] = useState(relationshipStarted);
  const [firstMetInput, setFirstMetInput] = useState(firstMet);
  const [firstDateInput, setFirstDateInput] = useState(firstDate);

  const duration = calculateRelationshipDuration(relationshipStarted);
  const nextAnniv = getNextYearlyAnniversary(relationshipStarted);
  const { reached, upcoming, nextMilestone, progressPercent } = getMilestones(relationshipStarted);

  const handleCelebrate = () => {
    sounds.playCelebration();
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FF6B8B', '#FFB6C1', '#F472B6', '#A855F7', '#FBBF24', '#38BDF8'],
    });
  };

  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    updateRelationshipDates({
      relationshipStartDate: startedDateInput,
      firstMeetingDate: firstMetInput,
      specialDates: {
        ...(coupleSpace?.specialDates || {}),
        firstDate: firstDateInput,
      },
    });
    setIsEditingDates(false);
    sounds.playMessagePop();
  };

  // Build completed yearly anniversary milestones for history
  const completedYearsHistory = [];
  const startYear = new Date(relationshipStarted + 'T00:00:00').getFullYear();
  const startMonthDay = relationshipStarted.substring(5); // MM-DD

  for (let yr = 1; yr <= duration.years; yr++) {
    const celebratedYear = startYear + yr;
    completedYearsHistory.push({
      yearNumber: yr,
      dateString: `${celebratedYear}-${startMonthDay}`,
      title: `${yr} Year${yr > 1 ? 's' : ''} Anniversary Milestone 💍`,
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-linear-to-b from-rose-100/90 via-pink-50/70 to-white dark:from-rose-950/40 dark:via-zinc-900/60 dark:to-zinc-900 rounded-3xl p-6 sm:p-10 border border-rose-200 dark:border-rose-900/60 text-center shadow-xs">
        <BubuAndDuduTogether size={170} />

        <div className="mt-4">
          <span className="text-xs uppercase tracking-widest font-bold text-rose-500">
            Our Love Story Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-800 dark:text-stone-100 mt-1">
            {duration.totalDays.toLocaleString()} Days Together ❤️
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 font-medium max-w-md mx-auto">
            {duration.years} years, {duration.months} months, and {duration.days} beautiful days of pure happiness
          </p>
        </div>

        {/* Celebration Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleCelebrate}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition transform text-sm cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 animate-bounce" />
            <span>Celebrate Our Anniversary! 🎉</span>
          </button>
        </div>
      </div>

      {/* Next Upcoming Anniversary Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Yearly Countdown Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <CalendarHeart className="w-4 h-4" />
                <span>Next Yearly Anniversary</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-zinc-700 text-rose-600 dark:text-rose-300">
                {nextAnniv.nextDate}
              </span>
            </div>

            <div className="my-4">
              <div className="text-4xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 font-serif">
                {nextAnniv.daysRemaining}
              </div>
              <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                Days Remaining until Year {nextAnniv.nextYearNumber} 🎂
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-rose-100 dark:border-zinc-700">
            Every day is a celebration, but {nextAnniv.nextDate} is our special landmark day!
          </p>
        </div>

        {/* Next Day Milestone Progress Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Milestone Journey</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-zinc-700 text-amber-700 dark:text-amber-300">
                {progressPercent}% Complete
              </span>
            </div>

            {nextMilestone && (
              <div className="my-4">
                <h4 className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif">
                  {nextMilestone.title}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                  Target: <strong>{nextMilestone.targetDays} total days</strong> ({nextMilestone.targetDate})
                </p>
                <div className="w-full bg-stone-100 dark:bg-zinc-700 rounded-full h-3 mt-3 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-amber-400 to-rose-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-rose-100 dark:border-zinc-700">
            {nextMilestone?.daysRemaining} days remaining until our next big celebration!
          </p>
        </div>
      </div>

      {/* Important Relationship Dates */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Our Important Relationship Dates</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingDates(!isEditingDates)}
            className="text-xs text-rose-500 hover:underline font-semibold"
          >
            {isEditingDates ? 'Cancel' : 'Edit Dates ✏️'}
          </button>
        </div>

        {isEditingDates ? (
          <form onSubmit={handleSaveDates} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  1. The Day We First Met:
                </label>
                <input
                  type="date"
                  value={firstMetInput}
                  onChange={(e) => setFirstMetInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  2. Our First Date:
                </label>
                <input
                  type="date"
                  value={firstDateInput}
                  onChange={(e) => setFirstDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  3. Relationship Officially Started:
                </label>
                <input
                  type="date"
                  value={startedDateInput}
                  onChange={(e) => setStartedDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
            >
              Save New Dates
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-zinc-900/60 border border-rose-100 dark:border-zinc-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                First Met 🌸
              </span>
              <h5 className="text-base font-bold text-stone-800 dark:text-stone-100 mt-1">
                {firstMet}
              </h5>
              <p className="text-xs text-stone-500 mt-0.5">The spark that started forever</p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-zinc-900/60 border border-pink-100 dark:border-zinc-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-500">
                Our First Date ☕
              </span>
              <h5 className="text-base font-bold text-stone-800 dark:text-stone-100 mt-1">
                {firstDate}
              </h5>
              <p className="text-xs text-stone-500 mt-0.5">Butterflies and shy smiles</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-zinc-900/60 border border-amber-100 dark:border-zinc-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                Relationship Started 💍
              </span>
              <h5 className="text-base font-bold text-stone-800 dark:text-stone-100 mt-1">
                {relationshipStarted}
              </h5>
              <p className="text-xs text-stone-500 mt-0.5">The official day we became Us</p>
            </div>
          </div>
        )}
      </div>

      {/* Completed Years Anniversary History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>Anniversary History — Years Completed Together</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
          Every chapter of our love story etched in time
        </p>

        {completedYearsHistory.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-rose-200 dark:border-rose-900/60 space-y-6">
            {completedYearsHistory.map((history) => (
              <div key={history.yearNumber} className="relative group">
                {/* Timeline dot */}
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-white dark:border-zinc-800" />

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-zinc-900/40 border border-rose-100 dark:border-zinc-700 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                      {history.title}
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Completed on {history.dateString}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed ❤️</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-stone-400 text-xs">
            We are working towards our first full year anniversary milestone! 🎂
          </div>
        )}
      </div>

      {/* Milestones Grid (100, 365, 500, 1000 days, etc.) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <span>All Relationship Milestones</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reached.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-zinc-900/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  {m.title}
                </span>
                <span className="text-[10px] text-stone-500">Achieved on {m.reachDate}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}

          {upcoming.slice(0, 6).map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-900/20 border border-stone-200 dark:border-zinc-700 flex items-center justify-between opacity-80"
            >
              <div>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                  {m.title}
                </span>
                <span className="text-[10px] text-stone-400">Target: {m.targetDate}</span>
              </div>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                {m.daysRemaining}d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
