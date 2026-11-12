import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { WelcomeAuthView } from './views/WelcomeAuthView';
import { PairingPendingView } from './views/PairingPendingView';
import { RelationshipSetupWizard } from './views/RelationshipSetupWizard';
import { HomeScreen } from './views/HomeScreen';
import { AnniversaryView } from './views/AnniversaryView';
import { ChatView } from './views/ChatView';
import { GalleryView } from './views/GalleryView';
import { CalendarView } from './views/CalendarView';
import { NotesPlannerView } from './views/NotesPlannerView';
import { DailyLoveView } from './views/DailyLoveView';
import { TravelPlannerView } from './views/TravelPlannerView';
import { SettingsView } from './views/SettingsView';
import { CallingModal } from './components/CallingModal';
import { HugOverlay } from './components/HugOverlay';
import { PairingModal } from './components/PairingModal';
import { BubuAndDuduTogether } from './components/BubuDuduAvatars';

function AppContent() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { isPaired, setupCompleted, isLoadingCouple } = useCouple();

  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('olu_theme') === 'dark';
  });
  const [showPairingModal, setShowPairingModal] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('olu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('olu_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Loading state
  if (isAuthLoading || (currentUser && isLoadingCouple)) {
    return (
      <div className="min-h-screen bg-[#FFF9FA] dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <BubuAndDuduTogether size={140} />
        <span className="text-xs font-semibold text-rose-500 mt-4 animate-pulse">
          Opening our little universe...
        </span>
      </div>
    );
  }

  // 1. Not logged in: Fresh First Launch Welcome Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FFF9FA] dark:bg-zinc-950 text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
        <WelcomeAuthView />
      </div>
    );
  }

  // 2. Logged in but not paired with partner
  if (!isPaired) {
    return (
      <div className="min-h-screen bg-[#FFF9FA] dark:bg-zinc-950 text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
        <PairingPendingView />
      </div>
    );
  }

  // 3. Paired but relationship setup wizard not completed yet
  if (!setupCompleted) {
    return (
      <div className="min-h-screen bg-[#FFF9FA] dark:bg-zinc-950 text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
        <RelationshipSetupWizard />
      </div>
    );
  }

  // 4. Fully Authenticated, Paired, and Setup: Main Universe Dashboard
  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-zinc-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      {/* Background Ambient Romantic Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/30 dark:bg-rose-950/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-200/25 dark:bg-pink-950/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-200/20 dark:bg-amber-950/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header & Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenPairing={() => setShowPairingModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-4 sm:pt-6 relative z-10">
        {currentTab === 'home' && <HomeScreen onNavigate={setCurrentTab} />}
        {currentTab === 'anniversary' && <AnniversaryView />}
        {currentTab === 'chat' && <ChatView />}
        {currentTab === 'gallery' && <GalleryView />}
        {currentTab === 'calendar' && <CalendarView />}
        {currentTab === 'notes' && <NotesPlannerView />}
        {currentTab === 'daily_love' && <DailyLoveView />}
        {currentTab === 'travel' && <TravelPlannerView />}
        {currentTab === 'settings' && (
          <SettingsView
            isDark={isDark}
            toggleTheme={toggleTheme}
            onOpenPairing={() => setShowPairingModal(true)}
          />
        )}
      </main>

      {/* Floating System Modals */}
      <CallingModal />
      <HugOverlay />
      <PairingModal
        isOpen={showPairingModal}
        onClose={() => setShowPairingModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CoupleProvider>
        <AppContent />
      </CoupleProvider>
    </AuthProvider>
  );
}
