import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Key,
  Moon,
  Sun,
  UserCheck,
  Check,
  Copy,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { safeParseResponse } from '../utils/api';
import { DuduAvatar, BubuAvatar, BubuAndDuduTogether } from '../components/BubuDuduAvatars';
import { sounds } from '../utils/soundEffects';

export const SettingsView: React.FC<{
  isDark: boolean;
  toggleTheme: () => void;
  onOpenPairing: () => void;
}> = ({ isDark, toggleTheme, onOpenPairing }) => {
  const {
    coupleSpace,
    partner,
    isLockedByPin,
    setPin,
    resetAllCoupleData,
    messages,
    photos,
    calendarEvents,
    notes,
    bucketGoals,
    moods,
    loveLetters,
    coupleSongs,
    trips,
  } = useCouple();

  const { currentUser, token, logout, refreshUser } = useAuth();

  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [nicknameInput, setNicknameInput] = useState(currentUser?.nickname || '');
  const [avatarInput, setAvatarInput] = useState<'dudu' | 'bubu' | 'custom'>(currentUser?.avatar || 'dudu');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [pinSavedToast, setPinSavedToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput,
          nickname: nicknameInput,
          avatar: avatarInput,
        }),
      });
      const parsed = await safeParseResponse(res);
      if (parsed.ok) {
        await refreshUser();
        setSavedSuccess(true);
        sounds.playMessagePop();
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (err) {
      console.warn('Error saving profile:', err);
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      await setPin(pinInput);
      setPinSavedToast(true);
      setPinInput('');
      setTimeout(() => setPinSavedToast(false), 2000);
    } else if (pinInput === '') {
      await setPin(null);
      setPinSavedToast(true);
      setTimeout(() => setPinSavedToast(false), 2000);
    }
  };

  const handleExportData = () => {
    const archive = {
      exportedAt: new Date().toISOString(),
      coupleSpace,
      currentUser,
      partner,
      messages,
      photos,
      calendarEvents,
      notes,
      bucketGoals,
      moods,
      loveLetters,
      coupleSongs,
      trips,
    };
    const jsonStr = JSON.stringify(archive, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Our_Little_Universe_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playMessagePop();
  };

  const handleCopyCode = () => {
    if (coupleSpace?.inviteCode) {
      navigator.clipboard.writeText(coupleSpace.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Settings & Privacy 🔐</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your account, couple space, privacy PIN, and data backup
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-bold hover:bg-rose-100 transition cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out of Account</span>
        </button>
      </div>

      {/* Profiles Editing */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <h3 className="text-base font-bold font-serif text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-rose-500" />
          <span>Our Couple Accounts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current User Profile Form */}
          <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-rose-50/60 dark:bg-zinc-900/60 border border-rose-200 dark:border-zinc-700 space-y-3">
            <div className="flex items-center gap-3">
              {avatarInput === 'bubu' ? <BubuAvatar size={45} /> : <DuduAvatar size={45} />}
              <div>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                  Your Account ({currentUser?.email})
                </h4>
                <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                  Logged in as {currentUser?.name}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Your Display Name:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Your Nickname:
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Bear Avatar:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarInput('dudu')}
                  className={`flex-1 p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    avatarInput === 'dudu'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white dark:bg-zinc-800 border-stone-200 text-stone-700'
                  }`}
                >
                  <DuduAvatar size={22} animated={false} />
                  <span>Dudu Bear</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarInput('bubu')}
                  className={`flex-1 p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    avatarInput === 'bubu'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white dark:bg-zinc-800 border-stone-200 text-stone-700'
                  }`}
                >
                  <BubuAvatar size={22} animated={false} />
                  <span>Bubu Bear</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile Updated!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>

          {/* Partner Info */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-zinc-900/60 border border-amber-200 dark:border-zinc-700 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {partner?.avatar === 'bubu' ? <BubuAvatar size={45} /> : <DuduAvatar size={45} />}
                <div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    Partner ({partner ? partner.name : 'Waiting for Partner'})
                  </h4>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                    {partner ? `Paired as ${partner.nickname}` : 'Invite your partner with code'}
                  </span>
                </div>
              </div>

              {partner ? (
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-amber-100 dark:border-zinc-700">
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase">Partner Name</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{partner.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-amber-100 dark:border-zinc-700">
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase">Pet Nickname</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{partner.nickname}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-amber-200 text-center text-xs text-stone-500">
                  Your partner has not joined yet. Share your invitation code with them!
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-400 italic">
              Each partner manages their own private account credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Theme Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span>App Appearance & Theme</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Switch between pastel cozy daylight and starry night romantic mode
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-zinc-700 hover:bg-rose-100 dark:hover:bg-zinc-600 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          <span>{isDark ? 'Light Pastel Mode' : 'Starry Dark Mode'}</span>
        </button>
      </div>

      {/* App PIN Lock */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <h3 className="text-base font-bold font-serif text-stone-800 dark:text-stone-100 mb-1 flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" />
          <span>Relationship PIN Lock</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Protect your private couple memories with a 4-digit code required when opening the app.
        </p>

        <form onSubmit={handleSavePin} className="space-y-3 max-w-sm">
          <div>
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
              {isLockedByPin ? 'Change PIN or leave blank to disable:' : 'Set 4-Digit PIN:'}
            </label>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="•••• (4 numbers)"
              className="w-full px-4 py-2 rounded-xl text-sm tracking-widest font-mono bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 dark:bg-zinc-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-stone-900 transition cursor-pointer"
            >
              {isLockedByPin ? 'Update PIN' : 'Enable PIN Lock'}
            </button>

            {isLockedByPin && (
              <button
                type="button"
                onClick={() => setPin(null)}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Disable PIN Lock
              </button>
            )}

            {pinSavedToast && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Couple Pairing & Invitation Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            <span>Couple Space Pairing & Invitation Code</span>
          </h3>
          <button
            type="button"
            onClick={onOpenPairing}
            className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
          >
            Pairing Dialog & QR →
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          This universe is restricted exclusively to {currentUser?.name} &amp; {partner ? partner.name : 'your partner'}.
        </p>

        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">
              Current Space Invitation Code
            </span>
            <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400 tracking-wider">
              {coupleSpace?.inviteCode || 'N/A'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 hover:bg-rose-50 cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Security Architecture Report */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-50/60 to-white dark:from-zinc-900 dark:to-zinc-800 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
        <h3 className="text-base font-bold font-serif text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Security &amp; Privacy Architecture</span>
        </h3>

        <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            • <strong>End-to-End Cryptography:</strong> Text messages in the chat are encrypted using
            the standard <strong>Web Crypto API (SubtleCrypto)</strong> with <strong>AES-GCM 256-bit</strong> and
            cryptographically random 12-byte initialization vectors (IV). Keys are derived locally on-device
            using <strong>PBKDF2 with 100,000 iterations and SHA-256</strong>.
          </p>
          <p>
            • <strong>Strict Couple Scoping:</strong> All memories, photos, calendar events, notes, and
            chat messages are strictly locked to couple space ID <code>{coupleSpace?.id || 'N/A'}</code>. No public
            profiles, no search engines, no followers, and no third-party telemetry.
          </p>
          <p>
            • <strong>Individual Authentication:</strong> Dudu and Bubu have independent email &amp; password accounts with scrypt password hashing on the server.
          </p>
        </div>
      </div>

      {/* Data Management: Export & Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
            Export &amp; Backup All Memories
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Download a complete, offline JSON archive of all messages, photos, notes, and calendar events.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportData}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-stone-800 dark:bg-zinc-700 hover:bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Archive</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to reset all couple data? This will clear all shared memories for a fresh start.'
                )
              ) {
                resetAllCoupleData();
              }
            }}
            className="px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-500 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
