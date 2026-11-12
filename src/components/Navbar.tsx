import React from 'react';
import {
  Heart,
  MessageCircleHeart,
  Image,
  Calendar,
  CheckSquare,
  Sparkles,
  Plane,
  Settings,
  Phone,
  Video,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { BubuAvatar, DuduAvatar } from './BubuDuduAvatars';

export type ActiveTab =
  | 'home'
  | 'anniversary'
  | 'chat'
  | 'gallery'
  | 'calendar'
  | 'notes'
  | 'daily_love'
  | 'travel'
  | 'settings';

interface NavbarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenPairing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  toggleTheme,
  onOpenPairing,
}) => {
  const { currentUser, logout } = useAuth();
  const { coupleSpace, partner, sendVirtualHug, hugsCount, startCall, messages } = useCouple();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'anniversary', label: 'Counter', icon: Sparkles },
    { id: 'chat', label: 'Chat', icon: MessageCircleHeart },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notes', label: 'Plans', icon: CheckSquare },
    { id: 'daily_love', label: 'Love & Fun', icon: Sparkles },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-rose-100 dark:border-zinc-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          {/* Brand & Heading */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-100 to-pink-200 dark:from-rose-950 dark:to-zinc-800 flex items-center justify-center shadow-xs">
              <span className="text-xl group-hover:scale-110 transition transform">🧸</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-rose-600 dark:text-rose-400 leading-tight">
                Our Little Universe ❤️
              </h1>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                Two hearts, one little world.
              </p>
            </div>
          </div>

          {/* Quick Actions & Authenticated Account Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* E2E Space Paired Indicator */}
            <div
              onClick={onOpenPairing}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 cursor-pointer"
              title="Private Authenticated Space"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Private Space</span>
            </div>

            {/* Hug Button */}
            <button
              type="button"
              onClick={sendVirtualHug}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer"
              title="Send a Virtual Hug to your partner"
            >
              <span className="animate-bounce">🤗</span>
              <span className="hidden sm:inline">Hug</span>
              <span className="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 text-[10px] px-1.5 py-0.2 rounded-full">
                {hugsCount}
              </span>
            </button>

            {/* Calling Buttons */}
            <div className="flex items-center bg-rose-50/60 dark:bg-zinc-800/80 p-0.5 rounded-full border border-rose-100 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => startCall('voice')}
                className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-white dark:hover:bg-zinc-700 transition"
                title="Start Voice Call"
                aria-label="Start Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => startCall('video')}
                className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-white dark:hover:bg-zinc-700 transition"
                title="Start Video Call"
                aria-label="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>

            {/* Real Authenticated User Profile Badge (NO fake dropdown switcher!) */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-2xl border border-rose-100 dark:border-zinc-700">
              {currentUser?.avatar === 'dudu' ? (
                <DuduAvatar size={24} animated={false} />
              ) : (
                <BubuAvatar size={24} animated={false} />
              )}
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block leading-tight">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-rose-500 font-medium">
                  {currentUser?.nickname || 'Online'}
                </span>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-rose-50/70 dark:bg-zinc-950/70 border-b border-rose-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-rose-500 dark:hover:text-rose-400'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-500' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 pl-4 shrink-0 font-medium">
            <span>Paired with:</span>
            <span className="text-rose-500 font-bold">{partner?.name || 'Partner'}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Dock Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-rose-100 dark:border-zinc-800 py-1.5 px-2 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition relative ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 scale-105'
                    : 'text-stone-400 hover:text-rose-400'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[9px] font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
