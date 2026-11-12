import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  CoupleSpace,
  ChatMessage,
  GalleryPhoto,
  CalendarEvent,
  SharedNote,
  BucketGoal,
  TravelDestination,
  MoodEntry,
  MoodType,
  LoveLetter,
  CoupleSong,
  QuizQuestion,
  DailyQuestion,
  SpecialDates,
} from '../types';
import { sounds } from '../utils/soundEffects';

interface CallingState {
  active: boolean;
  incoming: boolean;
  type: 'voice' | 'video';
  callerName: string;
  duration: number;
}

interface CoupleContextType {
  coupleSpace: CoupleSpace | null;
  partner: { id: string; name: string; nickname: string; avatar: 'dudu' | 'bubu' | 'custom'; avatarUrl?: string } | null;
  isPaired: boolean;
  setupCompleted: boolean;
  isLoadingCouple: boolean;
  refreshCouple: () => Promise<void>;
  createCoupleSpace: () => Promise<{ success: boolean; couple?: CoupleSpace; error?: string }>;
  joinCoupleSpace: (inviteCode: string) => Promise<{ success: boolean; couple?: CoupleSpace; error?: string }>;
  completeSetup: (data: {
    firstMeetingDate: string;
    relationshipStartDate: string;
    specialDates?: SpecialDates;
    myNickname?: string;
    partnerNickname?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateRelationshipDates: (dates: {
    relationshipStartDate?: string;
    firstMeetingDate?: string;
    specialDates?: SpecialDates;
  }) => Promise<void>;
  
  // Real Chat
  messages: ChatMessage[];
  sendMessage: (msg: {
    text: string;
    type?: 'text' | 'image' | 'voice' | 'sticker' | 'love_note';
    mediaUrl?: string;
    stickerId?: string;
    voiceDuration?: number;
    loveNoteSubject?: string;
    replyToId?: string;
    replySnippet?: string;
    ciphertext?: string;
    iv?: string;
    isEncrypted?: boolean;
  }) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Real Gallery
  photos: GalleryPhoto[];
  albums: { id: string; title: string; count: number }[];
  addPhoto: (photo: { url: string; caption: string; album: string; dateTaken: string }) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  toggleFavoritePhoto: (id: string) => Promise<void>;
  addPhotoComment: (photoId: string, text: string) => Promise<void>;

  // Real Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: {
    title: string;
    date: string;
    time?: string;
    description: string;
    category: any;
    location?: string;
    isDayToRemember?: boolean;
  }) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;

  // Real Notes & Bucket List
  notes: SharedNote[];
  addNote: (note: {
    title: string;
    content: string;
    category: any;
    priority: any;
    assignedTo: string;
    checklist?: any[];
    pinned?: boolean;
  }) => Promise<void>;
  updateNote: (id: string, updates: Partial<SharedNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleChecklistItem: (noteId: string, itemId: string) => Promise<void>;

  bucketGoals: BucketGoal[];
  addBucketGoal: (goal: { title: string; category: string }) => Promise<void>;
  toggleBucketGoal: (id: string) => Promise<void>;
  deleteBucketGoal: (id: string) => Promise<void>;

  // Real Travel Trips
  trips: TravelDestination[];
  addTrip: (trip: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget?: { estimated: number; spent: number };
    itinerary?: any[];
    packingList?: any[];
    hotelDetails?: string;
  }) => Promise<void>;
  toggleTripVisited: (id: string) => Promise<void>;
  togglePackingItem: (tripId: string, itemId: string) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  // Real Daily Love
  moods: MoodEntry[];
  todayMoods: { myMood?: MoodEntry; partnerMood?: MoodEntry };
  setTodayMood: (mood: MoodType, note?: string) => Promise<void>;
  loveLetters: LoveLetter[];
  addLoveLetter: (letter: { title: string; content: string; unlockDate: string }) => Promise<void>;
  openLoveLetter: (id: string) => Promise<void>;
  coupleSongs: CoupleSong[];
  addCoupleSong: (song: { title: string; artist: string; link?: string; platform: any; memoryNote?: string }) => Promise<void>;
  deleteCoupleSong: (id: string) => Promise<void>;

  currentDailyQuestion: DailyQuestion;
  answerDailyQuestion: (answer: string) => Promise<void>;
  quizQuestions: QuizQuestion[];
  answerQuizQuestion: (questionId: string, answerIndex: number) => Promise<void>;

  // Real Hugs
  hugsCount: number;
  sendVirtualHug: () => Promise<void>;
  showHugAnimation: boolean;
  closeHugAnimation: () => void;

  // WebRTC Calling State
  callingState: CallingState;
  startCall: (type: 'voice' | 'video') => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;

  // App PIN lock
  isLockedByPin: boolean;
  setPin: (pin: string | null) => Promise<void>;
  unlockWithPin: (pin: string) => Promise<boolean>;

  // Reset
  resetAllCoupleData: () => Promise<void>;
}

const CoupleContext = createContext<CoupleContextType | null>(null);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, token } = useAuth();

  const [coupleSpace, setCoupleSpace] = useState<CoupleSpace | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [isLoadingCouple, setIsLoadingCouple] = useState<boolean>(true);

  // Real data state - completely empty by default
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [bucketGoals, setBucketGoals] = useState<BucketGoal[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>([]);
  const [coupleSongs, setCoupleSongs] = useState<CoupleSong[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [trips, setTrips] = useState<TravelDestination[]>([]);
  const [dailyAnswers, setDailyAnswers] = useState<{ [userId: string]: string }>({});
  const [hugsCount, setHugsCount] = useState<number>(0);

  const [pinLockCode, setPinLockCode] = useState<string | null>(() => localStorage.getItem('universe_pin_lock'));
  const [isLockedByPin, setIsLockedByPin] = useState<boolean>(() => Boolean(localStorage.getItem('universe_pin_lock')));

  const [showHugAnimation, setShowHugAnimation] = useState(false);

  // Calling state
  const [callingState, setCallingState] = useState<CallingState>({
    active: false,
    incoming: false,
    type: 'video',
    callerName: '',
    duration: 0,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callingState.active && !callingState.incoming) {
      timer = setInterval(() => {
        setCallingState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callingState.active, callingState.incoming]);

  const startCall = useCallback((type: 'voice' | 'video') => {
    setCallingState({
      active: true,
      incoming: false,
      type,
      callerName: currentUser?.name || 'Me',
      duration: 0,
    });
    sounds.playMessagePop();
  }, [currentUser]);

  const acceptCall = useCallback(() => {
    setCallingState((prev) => ({ ...prev, incoming: false }));
    sounds.playMessagePop();
  }, []);

  const rejectCall = useCallback(() => {
    setCallingState({
      active: false,
      incoming: false,
      type: 'voice',
      callerName: '',
      duration: 0,
    });
  }, []);

  const endCall = useCallback(() => {
    setCallingState({
      active: false,
      incoming: false,
      type: 'voice',
      callerName: '',
      duration: 0,
    });
  }, []);

  // Fetch Couple Space and Shared Data
  const refreshCouple = useCallback(async () => {
    if (!token || !currentUser) {
      setCoupleSpace(null);
      setPartner(null);
      setMessages([]);
      setPhotos([]);
      setCalendarEvents([]);
      setNotes([]);
      setBucketGoals([]);
      setMoods([]);
      setLoveLetters([]);
      setCoupleSongs([]);
      setQuizQuestions([]);
      setTrips([]);
      setDailyAnswers({});
      setHugsCount(0);
      setIsLoadingCouple(false);
      return;
    }

    try {
      // 1. Get couple info
      const resCouple = await fetch('/api/couple/current', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resCouple.ok) {
        const coupleData = await resCouple.json();
        setCoupleSpace(coupleData.couple);
        setPartner(coupleData.partner);

        // 2. If couple space exists, get shared data
        if (coupleData.couple) {
          const resData = await fetch('/api/couple/data', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (resData.ok) {
            const d = await resData.json();
            setMessages(d.messages || []);
            setPhotos(d.photos || []);
            setCalendarEvents(d.calendarEvents || []);
            setNotes(d.notes || []);
            setBucketGoals(d.bucketGoals || []);
            setMoods(d.moods || []);
            setLoveLetters(d.loveLetters || []);
            setCoupleSongs(d.songs || []);
            setQuizQuestions(d.quizQuestions || []);
            setTrips(d.trips || []);
            setHugsCount(d.hugsCount || 0);

            if (d.dailyAnswers && coupleData.couple) {
              const today = new Date().toISOString().split('T')[0];
              const key = `${today}_${coupleData.couple.id}`;
              setDailyAnswers(d.dailyAnswers[key] || {});
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error loading couple data:', err);
    } finally {
      setIsLoadingCouple(false);
    }
  }, [token, currentUser]);

  useEffect(() => {
    refreshCouple();
  }, [refreshCouple]);

  // Create Couple Space
  const createCoupleSpace = async (): Promise<{ success: boolean; couple?: CoupleSpace; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/couple/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      await refreshCouple();
      sounds.playCelebration();
      return { success: true, couple: data.couple };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  // Join Couple Space with code
  const joinCoupleSpace = async (inviteCode: string): Promise<{ success: boolean; couple?: CoupleSpace; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/couple/join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      await refreshCouple();
      sounds.playCelebration();
      return { success: true, couple: data.couple };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  // Complete Relationship Setup Wizard
  const completeSetup = async (setupData: {
    firstMeetingDate: string;
    relationshipStartDate: string;
    specialDates?: SpecialDates;
    myNickname?: string;
    partnerNickname?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/couple/setup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      await refreshCouple();
      sounds.playCelebration();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const updateRelationshipDates = async (dates: {
    relationshipStartDate?: string;
    firstMeetingDate?: string;
    specialDates?: SpecialDates;
  }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/dates', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dates),
      });
      if (res.ok) {
        const data = await res.json();
        setCoupleSpace(data.couple);
        sounds.playCelebration();
      }
    } catch (err) {
      console.warn('Error updating dates:', err);
    }
  };

  // Chat Actions
  const sendMessage = async (msg: {
    text: string;
    type?: 'text' | 'image' | 'voice' | 'sticker' | 'love_note';
    mediaUrl?: string;
    stickerId?: string;
    voiceDuration?: number;
    loveNoteSubject?: string;
    replyToId?: string;
    replySnippet?: string;
    ciphertext?: string;
    iv?: string;
    isEncrypted?: boolean;
  }) => {
    if (!token) return;

    try {
      const res = await fetch('/api/couple/message', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(msg),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error sending message:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/message/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting message:', err);
    }
  };

  // Gallery
  const addPhoto = async (photo: { url: string; caption: string; album: string; dateTaken: string }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photo),
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => [data.photo, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error uploading photo:', err);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/photo/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting photo:', err);
    }
  };

  const albums = [
    { id: 'all', title: 'All Memories', count: photos.length },
    { id: 'best_moments', title: 'Best Moments 💖', count: photos.filter((p) => p.album === 'best_moments').length },
    { id: 'dates_trips', title: 'Dates & Trips ✈️', count: photos.filter((p) => p.album === 'dates_trips').length },
    { id: 'everyday_love', title: 'Everyday Love ☕', count: photos.filter((p) => p.album === 'everyday_love').length },
    { id: 'funny_sweet', title: 'Silly & Sweet 🐻', count: photos.filter((p) => p.album === 'funny_sweet').length },
  ];

  const toggleFavoritePhoto = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/photo/${id}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => prev.map((p) => (p.id === id ? data.photo : p)));
        sounds.playHeartReaction();
      }
    } catch (err) {
      console.warn('Error toggling photo favorite:', err);
    }
  };

  const addPhotoComment = async (photoId: string, text: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/photo/${photoId}/comment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => prev.map((p) => (p.id === photoId ? data.photo : p)));
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding comment:', err);
    }
  };

  // Calendar
  const addCalendarEvent = async (event: {
    title: string;
    date: string;
    time?: string;
    description: string;
    category: any;
    location?: string;
    isDayToRemember?: boolean;
  }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/calendar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents((prev) => [...prev, data.event]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding event:', err);
    }
  };

  const deleteCalendarEvent = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/calendar/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting event:', err);
    }
  };

  // Notes
  const addNote = async (note: {
    title: string;
    content: string;
    category: any;
    priority: any;
    assignedTo: string;
    checklist?: any[];
  }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/note', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.note, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding note:', err);
    }
  };

  const updateNote = async (id: string, updates: Partial<SharedNote>) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/note/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === id ? data.note : n)));
      }
    } catch (err) {
      console.warn('Error updating note:', err);
    }
  };

  const deleteNote = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/note/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting note:', err);
    }
  };

  const toggleChecklistItem = async (noteId: string, itemId: string) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote || !targetNote.checklist) return;

    const updatedChecklist = targetNote.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    await updateNote(noteId, { checklist: updatedChecklist });
  };

  // Bucket Goals
  const addBucketGoal = async (goal: { title: string; category: string }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/bucket', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
      });
      if (res.ok) {
        const data = await res.json();
        setBucketGoals((prev) => [data.goal, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding goal:', err);
    }
  };

  const toggleBucketGoal = async (id: string) => {
    if (!token) return;
    const targetGoal = bucketGoals.find((g) => g.id === id);
    if (!targetGoal) return;

    const nextCompleted = !targetGoal.completed;
    try {
      const res = await fetch(`/api/couple/bucket/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });
      if (res.ok) {
        const data = await res.json();
        setBucketGoals((prev) => prev.map((g) => (g.id === id ? data.goal : g)));
        if (nextCompleted) sounds.playCelebration();
      }
    } catch (err) {
      console.warn('Error toggling goal:', err);
    }
  };

  const deleteBucketGoal = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/bucket/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBucketGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting goal:', err);
    }
  };

  // Mood
  const setTodayMood = async (mood: MoodType, note?: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/mood', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, note }),
      });
      if (res.ok) {
        const data = await res.json();
        const dateStr = data.mood.date;
        setMoods((prev) => {
          const filtered = prev.filter((m) => !(m.userId === currentUser?.id && m.date === dateStr));
          return [data.mood, ...filtered];
        });
        sounds.playHeartReaction();
      }
    } catch (err) {
      console.warn('Error saving mood:', err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMoods = {
    myMood: moods.find((m) => m.userId === currentUser?.id && m.date === todayStr),
    partnerMood: moods.find((m) => m.userId === partner?.id && m.date === todayStr),
  };

  // Virtual Hug
  const sendVirtualHug = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/hug', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHugsCount(data.hugsCount);
        sounds.playHugSound();
        setShowHugAnimation(true);
      }
    } catch (err) {
      console.warn('Error sending hug:', err);
    }
  };

  const closeHugAnimation = () => setShowHugAnimation(false);

  // Love Letters
  const addLoveLetter = async (letter: { title: string; content: string; unlockDate: string }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/love-letter', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(letter),
      });
      if (res.ok) {
        const data = await res.json();
        setLoveLetters((prev) => [data.letter, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding letter:', err);
    }
  };

  const openLoveLetter = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/love-letter/${id}/open`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLoveLetters((prev) => prev.map((l) => (l.id === id ? data.letter : l)));
        sounds.playCelebration();
      }
    } catch (err) {
      console.warn('Error opening letter:', err);
    }
  };

  // Songs
  const addCoupleSong = async (song: { title: string; artist: string; link?: string; platform: any; memoryNote?: string }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/song', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });
      if (res.ok) {
        const data = await res.json();
        setCoupleSongs((prev) => [data.song, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding song:', err);
    }
  };

  const deleteCoupleSong = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/song/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCoupleSongs((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting song:', err);
    }
  };

  // Trips
  const addTrip = async (tripData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget?: { estimated: number; spent: number };
    itinerary?: any[];
    packingList?: any[];
    hotelDetails?: string;
  }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/trip', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      if (res.ok) {
        const data = await res.json();
        setTrips((prev) => [data.trip, ...prev]);
        sounds.playMessagePop();
      }
    } catch (err) {
      console.warn('Error adding trip:', err);
    }
  };

  const toggleTripVisited = async (id: string) => {
    if (!token) return;
    const target = trips.find((t) => t.id === id);
    if (!target) return;
    try {
      const res = await fetch(`/api/couple/trip/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visited: !target.visited }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrips((prev) => prev.map((t) => (t.id === id ? data.trip : t)));
      }
    } catch (err) {
      console.warn('Error toggling trip visited:', err);
    }
  };

  const togglePackingItem = async (tripId: string, itemId: string) => {
    if (!token) return;
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.packingList) return;
    const updated = trip.packingList.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    try {
      const res = await fetch(`/api/couple/trip/${tripId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packingList: updated }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrips((prev) => prev.map((t) => (t.id === tripId ? data.trip : t)));
      }
    } catch (err) {
      console.warn('Error toggling packing item:', err);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/couple/trip/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting trip:', err);
    }
  };

  // Daily Question
  const DAILY_QUESTIONS_POOL = [
    'What was the very first thought you had when our eyes first met?',
    'What is your all-time favorite memory or date with me so far?',
    'What is a little thing I do without realizing that always warms your heart?',
    'If we had a completely free weekend together right now, what would our dream day look like?',
    'What song reminds you the most of our love story?',
    'What is one place in the entire world you cannot wait to explore holding my hand?',
    'How do you know when I need a big bear hug?',
  ];

  const todayIndex = Math.floor(Date.now() / 86400000) % DAILY_QUESTIONS_POOL.length;
  const currentDailyQuestion: DailyQuestion = {
    id: `dq_${todayStr}`,
    question: DAILY_QUESTIONS_POOL[todayIndex],
    date: todayStr,
    answers: dailyAnswers,
  };

  const answerDailyQuestion = async (answer: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/daily-question', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: todayStr, answer }),
      });
      if (res.ok) {
        const data = await res.json();
        setDailyAnswers(data.answers || {});
        sounds.playHeartReaction();
      }
    } catch (err) {
      console.warn('Error answering daily question:', err);
    }
  };

  const answerQuizQuestion = async (questionId: string, answerIndex: number) => {
    if (!token) return;
    try {
      const res = await fetch('/api/couple/quiz/answer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId, answerIndex }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuizQuestions((prev) => prev.map((q) => (q.id === questionId ? data.question : q)));
        sounds.playCelebration();
      }
    } catch (err) {
      console.warn('Error answering quiz:', err);
    }
  };

  // PIN Lock
  const setPin = async (newPin: string | null) => {
    if (newPin) {
      localStorage.setItem('universe_pin_lock', newPin);
      setPinLockCode(newPin);
    } else {
      localStorage.removeItem('universe_pin_lock');
      setPinLockCode(null);
      setIsLockedByPin(false);
    }
  };

  const unlockWithPin = async (enteredPin: string): Promise<boolean> => {
    if (!pinLockCode || enteredPin === pinLockCode) {
      setIsLockedByPin(false);
      return true;
    }
    return false;
  };

  const resetAllCoupleData = async () => {
    if (!token) return;
    try {
      await fetch('/api/couple/reset-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshCouple();
    } catch (err) {
      console.warn('Error resetting data:', err);
    }
  };

  const isPaired = Boolean(coupleSpace && coupleSpace.memberIds.length >= 2);
  const setupCompleted = Boolean(coupleSpace && coupleSpace.setupCompleted && coupleSpace.relationshipStartDate);

  return (
    <CoupleContext.Provider
      value={{
        coupleSpace,
        partner,
        isPaired,
        setupCompleted,
        isLoadingCouple,
        refreshCouple,
        createCoupleSpace,
        joinCoupleSpace,
        completeSetup,
        updateRelationshipDates,
        messages,
        sendMessage,
        deleteMessage,
        photos,
        albums,
        addPhoto,
        deletePhoto,
        toggleFavoritePhoto,
        addPhotoComment,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleChecklistItem,
        bucketGoals,
        addBucketGoal,
        toggleBucketGoal,
        deleteBucketGoal,
        trips,
        addTrip,
        toggleTripVisited,
        togglePackingItem,
        deleteTrip,
        moods,
        todayMoods,
        setTodayMood,
        loveLetters,
        addLoveLetter,
        openLoveLetter,
        coupleSongs,
        addCoupleSong,
        deleteCoupleSong,
        currentDailyQuestion,
        answerDailyQuestion,
        quizQuestions,
        answerQuizQuestion,
        hugsCount,
        sendVirtualHug,
        showHugAnimation,
        closeHugAnimation,
        callingState,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        isLockedByPin,
        setPin,
        unlockWithPin,
        resetAllCoupleData,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
