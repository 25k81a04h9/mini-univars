export type BearAvatarType = 'dudu' | 'bubu' | 'custom';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatar: BearAvatarType;
  avatarUrl?: string;
  coupleId?: string | null;
  createdAt: string;
}

export interface SpecialDates {
  firstDate?: string;
  firstPhotoDate?: string;
  firstTripDate?: string;
  duduBirthday?: string;
  bubuBirthday?: string;
  customDates?: { id: string; title: string; date: string; icon: string }[];
}

export interface CoupleSpace {
  id: string;
  name?: string;
  inviteCode: string;
  memberIds: string[];
  members: {
    [userId: string]: {
      name: string;
      nickname: string;
      avatar: BearAvatarType;
      avatarUrl?: string;
      role?: 'partner1' | 'partner2';
    };
  };
  firstMeetingDate?: string; // YYYY-MM-DD
  relationshipStartDate?: string; // YYYY-MM-DD
  specialDates?: SpecialDates;
  setupCompleted: boolean;
  createdAt: string;
}

export type MoodType = 'happy' | 'loved' | 'excited' | 'tired' | 'sad' | 'missing_you' | 'need_a_hug';

export interface MoodEntry {
  id: string;
  userId: string;
  userName: string;
  mood: MoodType;
  note?: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface MessageReaction {
  emoji: string;
  byUserId: string;
  byName: string;
}

export interface ChatMessage {
  id: string;
  coupleId: string;
  senderId: string;
  senderName: string;
  text: string;
  ciphertext?: string;
  iv?: string;
  isEncrypted: boolean;
  type: 'text' | 'image' | 'voice' | 'sticker' | 'love_note';
  mediaUrl?: string;
  voiceDuration?: number;
  stickerId?: string;
  loveNoteSubject?: string;
  timestamp: number;
  pinned?: boolean;
  isSavedMemory?: boolean;
  replyToId?: string;
  replySnippet?: string;
  reactions?: MessageReaction[];
}

export interface GalleryPhoto {
  id: string;
  coupleId: string;
  url: string;
  caption: string;
  album: string;
  uploadedByUserId: string;
  uploadedByName: string;
  dateTaken: string; // YYYY-MM-DD
  timestamp: number;
  isFavorite: boolean;
  comments?: { id: string; authorId: string; authorName: string; text: string; timestamp: number }[];
}

export interface AlbumInfo {
  id: string;
  title: string;
  description: string;
}

export type CalendarCategory = 
  | 'anniversary' 
  | 'first_meeting' 
  | 'first_date' 
  | 'birthday' 
  | 'trip' 
  | 'date_night' 
  | 'special_moment' 
  | 'reminder';

export interface CalendarEvent {
  id: string;
  coupleId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  description: string;
  category: CalendarCategory;
  createdByUserId: string;
  createdByName: string;
  isDayToRemember?: boolean;
  location?: string;
}

export type NoteCategory = 
  | 'goals' 
  | 'travel' 
  | 'places' 
  | 'shopping' 
  | 'dates' 
  | 'relationship' 
  | 'bucket_list' 
  | 'surprises' 
  | 'thoughts' 
  | 'important';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SharedNote {
  id: string;
  coupleId: string;
  title: string;
  content: string;
  category: NoteCategory;
  pinned: boolean;
  checklist?: ChecklistItem[];
  priority: 'low' | 'medium' | 'high';
  assignedTo: string; // 'both' or userId
  deadline?: string;
  updatedAt: number;
  createdAt: number;
}

export interface BucketGoal {
  id: string;
  coupleId: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  completedAt?: number;
  addedByUserId: string;
  addedByName: string;
}

export interface TravelDestination {
  id: string;
  coupleId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  visited: boolean;
  budget?: { estimated: number; spent: number };
  itinerary: { day: number; title: string; places: string[]; notes: string }[];
  packingList: { id: string; item: string; assignedTo: string; checked: boolean }[];
  hotelDetails?: string;
}

export interface DailyQuestion {
  id: string;
  question: string;
  date: string; // YYYY-MM-DD
  answers?: { [userId: string]: string };
}

export interface LoveLetter {
  id: string;
  coupleId: string;
  senderId: string;
  senderName: string;
  title: string;
  content: string;
  unlockDate: string; // YYYY-MM-DD
  isOpened: boolean;
  createdAt: number;
}

export interface CoupleSong {
  id: string;
  coupleId: string;
  title: string;
  artist: string;
  link?: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'other';
  addedByUserId: string;
  addedByName: string;
  memoryNote?: string;
}

export interface QuizQuestion {
  id: string;
  coupleId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  createdByUserId: string;
  createdByName: string;
  answers?: { [userId: string]: number };
}
