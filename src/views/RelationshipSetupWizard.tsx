import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Cake,
  Plane,
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { DuduAvatar, BubuAvatar, BubuAndDuduTogether } from '../components/BubuDuduAvatars';

export const RelationshipSetupWizard: React.FC = () => {
  const { currentUser } = useAuth();
  const { partner, completeSetup } = useCouple();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Names & Nicknames
  const [myName, setMyName] = useState(currentUser?.name || '');
  const [myNickname, setMyNickname] = useState(currentUser?.nickname || '');
  const [partnerNickname, setPartnerNickname] = useState(partner?.nickname || '');

  // Step 2: First Meeting Date
  const [firstMeetingDate, setFirstMeetingDate] = useState('');

  // Step 3: Relationship Start Date
  const [relationshipStartDate, setRelationshipStartDate] = useState('');

  // Step 4: Optional Special Dates
  const [firstDate, setFirstDate] = useState('');
  const [firstPhotoDate, setFirstPhotoDate] = useState('');
  const [firstTripDate, setFirstTripDate] = useState('');
  const [duduBirthday, setDuduBirthday] = useState('');
  const [bubuBirthday, setBubuBirthday] = useState('');

  // Submission
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partnerName = partner?.name || 'Partner';

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 2 && !firstMeetingDate) {
      setErrorMsg('Please select the date you first met.');
      return;
    }
    if (step === 3 && !relationshipStartDate) {
      setErrorMsg('Please select the date your relationship officially began.');
      return;
    }
    setStep((prev) => Math.min(5, prev + 1) as any);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1) as any);
  };

  const handleConfirmStory = async () => {
    setErrorMsg('');
    if (!relationshipStartDate) {
      setErrorMsg('Relationship start date is missing.');
      return;
    }

    setIsSubmitting(true);
    const res = await completeSetup({
      firstMeetingDate: firstMeetingDate || relationshipStartDate,
      relationshipStartDate,
      specialDates: {
        firstDate: firstDate || undefined,
        firstPhotoDate: firstPhotoDate || undefined,
        firstTripDate: firstTripDate || undefined,
        duduBirthday: duduBirthday || undefined,
        bubuBirthday: bubuBirthday || undefined,
      },
      myNickname: myNickname.trim() || undefined,
      partnerNickname: partnerNickname.trim() || undefined,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to complete relationship setup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-rose-200 dark:border-rose-900/60 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-rose-500'
                  : s < step
                  ? 'w-3 bg-rose-300 dark:bg-rose-800'
                  : 'w-2 bg-stone-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Step {step} of 5
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 mt-1">
            Tell us how your story began ❤️
          </h2>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: YOUR NAMES & NICKNAMES */}
        {step === 1 && (
          <div className="space-y-6 text-left">
            <div className="flex justify-center items-center gap-6 py-2">
              <div className="text-center">
                {currentUser?.avatar === 'dudu' ? <DuduAvatar size={60} /> : <BubuAvatar size={60} />}
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 mt-1 block">
                  You ({currentUser?.name})
                </span>
              </div>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
              <div className="text-center">
                {partner?.avatar === 'dudu' ? <DuduAvatar size={60} /> : <BubuAvatar size={60} />}
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 mt-1 block">
                  {partnerName}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={myNickname}
                  onChange={(e) => setMyNickname(e.target.value)}
                  placeholder={`e.g. ${currentUser?.name || 'Dudu'}`}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  What should we call your partner?
                </label>
                <input
                  type="text"
                  value={partnerNickname}
                  onChange={(e) => setPartnerNickname(e.target.value)}
                  placeholder={`e.g. ${partnerName || 'Bubu'}`}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: THE FIRST MEETING */}
        {step === 2 && (
          <div className="space-y-6 text-left">
            <div className="text-center py-2">
              <span className="text-4xl">🌸</span>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif mt-2">
                When did you first meet?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                The magical moment your paths crossed for the very first time.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                First Meeting Date:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={firstMeetingDate}
                  onChange={(e) => setFirstMeetingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-semibold"
                  required
                />
                <Calendar className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs text-stone-500 font-semibold hover:text-stone-700"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RELATIONSHIP BEGINNING */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            <div className="text-center py-2">
              <span className="text-4xl">💍</span>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif mt-2">
                When did your relationship officially begin?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                The landmark day you decided to be each other&apos;s forever.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                Official Relationship Start Date:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={relationshipStartDate}
                  onChange={(e) => setRelationshipStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-semibold"
                  required
                />
                <Heart className="w-4 h-4 text-rose-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs text-stone-500 font-semibold hover:text-stone-700"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: OPTIONAL SPECIAL DATES */}
        {step === 4 && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <span className="text-3xl">✨</span>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif mt-1">
                Optional Special Dates
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                You can add these now or skip and add them anytime later!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-400" />
                  <span>First Date:</span>
                </label>
                <input
                  type="date"
                  value={firstDate}
                  onChange={(e) => setFirstDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-rose-400" />
                  <span>First Photograph Together:</span>
                </label>
                <input
                  type="date"
                  value={firstPhotoDate}
                  onChange={(e) => setFirstPhotoDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1 flex items-center gap-1">
                  <Plane className="w-3 h-3 text-rose-400" />
                  <span>First Trip Together:</span>
                </label>
                <input
                  type="date"
                  value={firstTripDate}
                  onChange={(e) => setFirstTripDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1 flex items-center gap-1">
                  <Cake className="w-3 h-3 text-rose-400" />
                  <span>Birthdays:</span>
                </label>
                <input
                  type="date"
                  value={duduBirthday}
                  onChange={(e) => setDuduBirthday(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  placeholder="Partner 1 Birthday"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs text-stone-500 font-semibold hover:text-stone-700"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>Review Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && (
          <div className="space-y-6 text-left">
            <div className="text-center">
              <BubuAndDuduTogether size={150} />
              <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100 mt-2">
                Your Story ❤️
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Please review your story details before entering your shared universe:
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-zinc-800/80 border border-rose-200 dark:border-zinc-700 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-rose-100 dark:border-zinc-700 pb-2">
                <span className="text-stone-500">Couple Partners:</span>
                <span className="font-bold text-stone-800 dark:text-stone-100">
                  {myNickname || currentUser?.name} & {partnerNickname || partnerName}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-rose-100 dark:border-zinc-700 pb-2">
                <span className="text-stone-500">First Met:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {firstMeetingDate || 'Not specified'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Officially Together:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {relationshipStartDate}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs text-stone-500 font-semibold hover:text-stone-700"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmStory}
                className="py-3.5 px-6 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg hover:shadow-xl hover:opacity-95 transition active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Initializing...' : 'Confirm Our Story ❤️'}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
