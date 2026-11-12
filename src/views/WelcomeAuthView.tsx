import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock, Mail, User, Sparkles, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BubuAndDuduTogether, DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';
import { BearAvatarType } from '../types';

export const WelcomeAuthView: React.FC = () => {
  const { register, login } = useAuth();
  const [authMode, setAuthMode] = useState<'welcome' | 'register' | 'login'>('welcome');

  // Register state
  const [regName, setRegName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<BearAvatarType>('dudu');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: regName.trim(),
      nickname: regNickname.trim() || regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      avatar: selectedAvatar,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to register account.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(loginEmail.trim(), loginPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-rose-200 dark:border-rose-900/60 shadow-xl text-center relative overflow-hidden"
      >
        {/* Subtle decorative background stars */}
        <div className="absolute top-2 left-3 text-rose-300 dark:text-rose-700 text-lg select-none">
          ✨
        </div>
        <div className="absolute top-3 right-4 text-pink-300 dark:text-pink-700 text-lg select-none">
          🌸
        </div>

        {/* Welcome Screen */}
        {authMode === 'welcome' && (
          <div className="space-y-6">
            <BubuAndDuduTogether size={190} />

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 tracking-tight">
                Our Little Universe ❤️
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                Every love story has a beginning. Let&apos;s create ours.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('register');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-400 text-white font-bold shadow-lg hover:shadow-xl hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('login');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-50 dark:bg-zinc-800 text-stone-700 dark:text-stone-200 border border-rose-200 dark:border-zinc-700 font-bold hover:bg-rose-100 dark:hover:bg-zinc-700 active:scale-95 transition cursor-pointer"
              >
                I Already Have An Account
              </button>
            </div>

            <p className="text-[11px] text-stone-400 pt-2">
              A private digital home designed exclusively for two lovers.
            </p>
          </div>
        )}

        {/* Register Screen */}
        {authMode === 'register' && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {selectedAvatar === 'dudu' ? <DuduAvatar size={70} /> : <BubuAvatar size={70} />}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-800 dark:text-stone-100">
                Create Your Account
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Tell us who you are so your partner knows it&apos;s you!
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Choose Bear Avatar */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Choose your bear avatar:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar('dudu')}
                    className={`p-3 rounded-2xl border-2 transition flex items-center gap-2.5 ${
                      selectedAvatar === 'dudu'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-amber-300'
                    }`}
                  >
                    <DuduAvatar size={36} animated={false} />
                    <div className="text-left">
                      <span className="text-xs font-bold block">Dudu Bear</span>
                      <span className="text-[10px] text-stone-400">Brown Bear 🐻</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAvatar('bubu')}
                    className={`p-3 rounded-2xl border-2 transition flex items-center gap-2.5 ${
                      selectedAvatar === 'bubu'
                        ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 shadow-xs'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-pink-300'
                    }`}
                  >
                    <BubuAvatar size={36} animated={false} />
                    <div className="text-left">
                      <span className="text-xs font-bold block">Bubu Angel</span>
                      <span className="text-[10px] text-stone-400">White Bear 🌸</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* What should we call you? */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  What should we call you? (Your name):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dudu or Bubu"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Pet Nickname */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Preferred sweet nickname (Optional):
                </label>
                <input
                  type="text"
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value)}
                  placeholder="e.g. My Teddy Bear 🐻 or Honey 🍯"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Your email address:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. dudu@love.com"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Choose a password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:opacity-95 active:scale-95 transition disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? 'Creating Account...' : 'Continue to Couple Pairing ❤️'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('login');
                }}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        )}

        {/* Login Screen */}
        {authMode === 'login' && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BubuAndDuduTogether size={120} withHearts={false} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-800 dark:text-stone-100">
                Welcome Back!
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Log in to enter your private shared universe
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Email Address:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:opacity-95 active:scale-95 transition disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? 'Signing In...' : 'Log In ❤️'}
              </button>
            </form>

            <div className="text-center pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('register');
                }}
                className="text-xs text-rose-500 hover:underline font-semibold block w-full"
              >
                Don&apos;t have an account yet? Create one
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('welcome');
                }}
                className="text-xs text-stone-400 hover:text-stone-600 block w-full"
              >
                ← Back to welcome screen
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
