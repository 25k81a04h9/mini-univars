import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Persistence file
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'universe_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStructure {
  users: {
    [id: string]: {
      id: string;
      email: string;
      passwordHash: string;
      passwordSalt: string;
      name: string;
      nickname: string;
      avatar: 'dudu' | 'bubu' | 'custom';
      avatarUrl?: string;
      coupleId?: string | null;
      createdAt: string;
    };
  };
  tokens: {
    [token: string]: string; // token -> userId
  };
  couples: {
    [id: string]: {
      id: string;
      inviteCode: string;
      memberIds: string[];
      firstMeetingDate?: string;
      relationshipStartDate?: string;
      specialDates?: any;
      setupCompleted: boolean;
      createdAt: string;
      hugsCount: number;
    };
  };
  messages: any[];
  photos: any[];
  calendarEvents: any[];
  notes: any[];
  bucketGoals: any[];
  moods: any[];
  loveLetters: any[];
  songs: any[];
  quizQuestions: any[];
  trips: any[];
  dailyAnswers: { [dateAndCouple: string]: { [userId: string]: string } };
}

function loadDB(): DBStructure {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return {
    users: {},
    tokens: {},
    couples: {},
    messages: [],
    photos: [],
    calendarEvents: [],
    notes: [],
    bucketGoals: [],
    moods: [],
    loveLetters: [],
    songs: [],
    quizQuestions: [],
    trips: [],
    dailyAnswers: {},
  };
}

function saveDB(db: DBStructure) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Password hashing
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Auth Middleware
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  const db = loadDB();
  const userId = db.tokens[token];

  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Unauthorized: Invalid session' });
  }

  (req as any).user = db.users[userId];
  next();
}

// --- AUTH ROUTES ---

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, nickname, avatar, avatarUrl } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = loadDB();

  // Check if email already registered
  const exists = Object.values(db.users).find((u) => u.email === cleanEmail);
  if (exists) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  const newUser = {
    id: userId,
    email: cleanEmail,
    passwordHash,
    passwordSalt: salt,
    name: name.trim(),
    nickname: (nickname || name).trim(),
    avatar: (avatar as 'dudu' | 'bubu' | 'custom') || 'dudu',
    avatarUrl,
    coupleId: null,
    createdAt: new Date().toISOString(),
  };

  const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
  db.users[userId] = newUser;
  db.tokens[token] = userId;
  saveDB(db);

  const { passwordHash: _, passwordSalt: __, ...userProfile } = newUser;
  res.json({ token, user: userProfile });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = loadDB();
  const user = Object.values(db.users).find((u) => u.email === cleanEmail);

  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  const testHash = hashPassword(password, user.passwordSalt);
  if (testHash !== user.passwordHash) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
  db.tokens[token] = user.id;
  saveDB(db);

  const { passwordHash: _, passwordSalt: __, ...userProfile } = user;
  res.json({ token, user: userProfile });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const { passwordHash: _, passwordSalt: __, ...userProfile } = user;
  res.json({ user: userProfile });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token) {
    const db = loadDB();
    delete db.tokens[token];
    saveDB(db);
  }
  res.json({ success: true });
});

// --- COUPLE PAIRING & SETUP ROUTES ---

// Create couple space
app.post('/api/couple/create', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();

  if (user.coupleId && db.couples[user.coupleId]) {
    return res.json({ couple: db.couples[user.coupleId] });
  }

  const coupleId = `couple_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const inviteCode = `LOVE-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCouple = {
    id: coupleId,
    inviteCode,
    memberIds: [user.id],
    setupCompleted: false,
    createdAt: new Date().toISOString(),
    hugsCount: 0,
  };

  db.couples[coupleId] = newCouple;
  db.users[user.id].coupleId = coupleId;
  saveDB(db);

  res.json({ couple: newCouple });
});

// Join couple space with invite code
app.post('/api/couple/join', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return res.status(400).json({ error: 'Invitation code is required' });
  }

  const cleanCode = inviteCode.trim().toUpperCase();
  const db = loadDB();

  const couple = Object.values(db.couples).find((c) => c.inviteCode.toUpperCase() === cleanCode);
  if (!couple) {
    return res.status(404).json({ error: 'Invalid invitation code. Please check with your partner.' });
  }

  if (couple.memberIds.includes(user.id)) {
    return res.json({ couple, message: 'Already a member of this couple space' });
  }

  if (couple.memberIds.length >= 2) {
    return res.status(400).json({ error: 'This couple space already has 2 members.' });
  }

  couple.memberIds.push(user.id);
  db.users[user.id].coupleId = couple.id;
  saveDB(db);

  res.json({ couple, message: 'Successfully joined partner space!' });
});

// Get current couple space & partner details
app.get('/api/couple/current', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();

  if (!user.coupleId || !db.couples[user.coupleId]) {
    return res.json({ couple: null, partner: null });
  }

  const couple = db.couples[user.coupleId];
  const partnerId = couple.memberIds.find((id) => id !== user.id);
  let partner = null;

  if (partnerId && db.users[partnerId]) {
    const p = db.users[partnerId];
    partner = {
      id: p.id,
      name: p.name,
      nickname: p.nickname,
      avatar: p.avatar,
      avatarUrl: p.avatarUrl,
    };
  }

  // Construct members map
  const membersMap: any = {};
  couple.memberIds.forEach((mId) => {
    if (db.users[mId]) {
      const u = db.users[mId];
      membersMap[mId] = {
        name: u.name,
        nickname: u.nickname,
        avatar: u.avatar,
        avatarUrl: u.avatarUrl,
      };
    }
  });

  res.json({
    couple: {
      ...couple,
      members: membersMap,
    },
    partner,
    isPaired: couple.memberIds.length === 2,
  });
});

// Setup relationship dates (Step 1-5 wizard)
app.post('/api/couple/setup', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const { firstMeetingDate, relationshipStartDate, specialDates, myNickname, partnerNickname } = req.body;

  if (!user.coupleId) {
    return res.status(400).json({ error: 'User does not belong to a couple space' });
  }

  if (!relationshipStartDate) {
    return res.status(400).json({ error: 'Relationship start date is required' });
  }

  const db = loadDB();
  const couple = db.couples[user.coupleId];

  if (!couple) {
    return res.status(404).json({ error: 'Couple space not found' });
  }

  couple.firstMeetingDate = firstMeetingDate || relationshipStartDate;
  couple.relationshipStartDate = relationshipStartDate;
  couple.specialDates = specialDates || {};
  couple.setupCompleted = true;

  if (myNickname) {
    db.users[user.id].nickname = myNickname;
  }

  const partnerId = couple.memberIds.find((id) => id !== user.id);
  if (partnerId && partnerNickname && db.users[partnerId]) {
    db.users[partnerId].nickname = partnerNickname;
  }

  saveDB(db);
  res.json({ success: true, couple });
});

// Update relationship dates directly
app.patch('/api/couple/dates', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId || !db.couples[user.coupleId]) {
    return res.status(404).json({ error: 'Couple space not found' });
  }

  const couple = db.couples[user.coupleId];
  const { relationshipStartDate, firstMeetingDate, specialDates } = req.body;

  if (relationshipStartDate) couple.relationshipStartDate = relationshipStartDate;
  if (firstMeetingDate) couple.firstMeetingDate = firstMeetingDate;
  if (specialDates) couple.specialDates = { ...(couple.specialDates || {}), ...specialDates };

  saveDB(db);
  res.json({ success: true, couple });
});

// --- COUPLE DATA & INTERACTION ROUTES ---

app.get('/api/couple/data', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();

  if (!user.coupleId) {
    return res.json({
      messages: [],
      photos: [],
      calendarEvents: [],
      notes: [],
      bucketGoals: [],
      moods: [],
      loveLetters: [],
      songs: [],
      quizQuestions: [],
      trips: [],
      hugsCount: 0,
    });
  }

  const coupleId = user.coupleId;
  const couple = db.couples[coupleId];

  res.json({
    messages: db.messages.filter((m) => m.coupleId === coupleId),
    photos: db.photos.filter((p) => p.coupleId === coupleId),
    calendarEvents: db.calendarEvents.filter((e) => e.coupleId === coupleId),
    notes: db.notes.filter((n) => n.coupleId === coupleId),
    bucketGoals: db.bucketGoals.filter((g) => g.coupleId === coupleId),
    moods: db.moods.filter((m) => couple.memberIds.includes(m.userId)),
    loveLetters: db.loveLetters.filter((l) => l.coupleId === coupleId),
    songs: db.songs.filter((s) => s.coupleId === coupleId),
    quizQuestions: db.quizQuestions.filter((q) => q.coupleId === coupleId),
    trips: (db.trips || []).filter((t) => t.coupleId === coupleId),
    dailyAnswers: db.dailyAnswers || {},
    hugsCount: couple?.hugsCount || 0,
  });
});

// Send Chat Message
app.post('/api/couple/message', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();

  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { text, type, mediaUrl, stickerId, voiceDuration, loveNoteSubject, replyToId, replySnippet, ciphertext, iv, isEncrypted } = req.body;

  const newMsg = {
    id: `msg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    coupleId: user.coupleId,
    senderId: user.id,
    senderName: user.name,
    text: text || '',
    type: type || 'text',
    mediaUrl,
    stickerId,
    voiceDuration,
    loveNoteSubject,
    replyToId,
    replySnippet,
    ciphertext,
    iv,
    isEncrypted: Boolean(isEncrypted),
    timestamp: Date.now(),
    reactions: [],
  };

  db.messages.push(newMsg);
  saveDB(db);
  res.json({ message: newMsg });
});

// Delete Chat Message
app.delete('/api/couple/message/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const msgId = req.params.id;
  const db = loadDB();

  db.messages = db.messages.filter((m) => !(m.id === msgId && m.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Add Photo to Shared Gallery
app.post('/api/couple/photo', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { url, caption, album, dateTaken } = req.body;
  const newPhoto = {
    id: `photo_${Date.now()}`,
    coupleId: user.coupleId,
    url,
    caption: caption || '',
    album: album || 'best_moments',
    uploadedByUserId: user.id,
    uploadedByName: user.name,
    dateTaken: dateTaken || new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    isFavorite: false,
    comments: [],
  };

  db.photos.unshift(newPhoto);
  saveDB(db);
  res.json({ photo: newPhoto });
});

// Delete Photo
app.delete('/api/couple/photo/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const photoId = req.params.id;
  const db = loadDB();

  db.photos = db.photos.filter((p) => !(p.id === photoId && p.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Toggle Photo Favorite
app.patch('/api/couple/photo/:id/favorite', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const photoId = req.params.id;
  const db = loadDB();
  const photo = db.photos.find((p) => p.id === photoId && p.coupleId === user.coupleId);
  if (photo) {
    photo.isFavorite = !photo.isFavorite;
    saveDB(db);
    return res.json({ photo });
  }
  res.status(404).json({ error: 'Photo not found' });
});

// Add Photo Comment
app.post('/api/couple/photo/:id/comment', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const photoId = req.params.id;
  const { text } = req.body;
  const db = loadDB();
  const photo = db.photos.find((p) => p.id === photoId && p.coupleId === user.coupleId);
  if (photo) {
    const comment = {
      id: `comm_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      text: text || '',
      timestamp: Date.now(),
    };
    photo.comments = photo.comments || [];
    photo.comments.push(comment);
    saveDB(db);
    return res.json({ photo, comment });
  }
  res.status(404).json({ error: 'Photo not found' });
});

// --- TRAVEL TRIPS ---
app.post('/api/couple/trip', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, destination, startDate, endDate, visited, budget, itinerary, packingList, hotelDetails } = req.body;
  const newTrip = {
    id: `trip_${Date.now()}`,
    coupleId: user.coupleId,
    title,
    destination: destination || '',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date().toISOString().split('T')[0],
    visited: Boolean(visited),
    budget: budget || { estimated: 0, spent: 0 },
    itinerary: itinerary || [],
    packingList: packingList || [],
    hotelDetails: hotelDetails || '',
  };

  db.trips = db.trips || [];
  db.trips.unshift(newTrip);
  saveDB(db);
  res.json({ trip: newTrip });
});

app.patch('/api/couple/trip/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const tripId = req.params.id;
  const db = loadDB();
  db.trips = db.trips || [];
  const trip = db.trips.find((t) => t.id === tripId && t.coupleId === user.coupleId);
  if (trip) {
    Object.assign(trip, req.body);
    saveDB(db);
    return res.json({ trip });
  }
  res.status(404).json({ error: 'Trip not found' });
});

app.delete('/api/couple/trip/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const tripId = req.params.id;
  const db = loadDB();
  db.trips = (db.trips || []).filter((t) => !(t.id === tripId && t.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Add Calendar Event
app.post('/api/couple/calendar', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, date, time, description, category, location, isDayToRemember } = req.body;
  const newEvent = {
    id: `ev_${Date.now()}`,
    coupleId: user.coupleId,
    title,
    date,
    time,
    description: description || '',
    category: category || 'date_night',
    location,
    isDayToRemember: Boolean(isDayToRemember),
    createdByUserId: user.id,
    createdByName: user.name,
  };

  db.calendarEvents.push(newEvent);
  saveDB(db);
  res.json({ event: newEvent });
});

// Delete Calendar Event
app.delete('/api/couple/calendar/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const evId = req.params.id;
  const db = loadDB();

  db.calendarEvents = db.calendarEvents.filter((e) => !(e.id === evId && e.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Add Note
app.post('/api/couple/note', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, content, category, priority, assignedTo, checklist } = req.body;
  const newNote = {
    id: `note_${Date.now()}`,
    coupleId: user.coupleId,
    title,
    content: content || '',
    category: category || 'relationship',
    priority: priority || 'medium',
    assignedTo: assignedTo || 'both',
    pinned: false,
    checklist: checklist || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  db.notes.unshift(newNote);
  saveDB(db);
  res.json({ note: newNote });
});

// Update Note
app.patch('/api/couple/note/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const noteId = req.params.id;
  const db = loadDB();

  const note = db.notes.find((n) => n.id === noteId && n.coupleId === user.coupleId);
  if (note) {
    Object.assign(note, req.body, { updatedAt: Date.now() });
    saveDB(db);
    return res.json({ note });
  }
  res.status(404).json({ error: 'Note not found' });
});

// Delete Note
app.delete('/api/couple/note/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const noteId = req.params.id;
  const db = loadDB();

  db.notes = db.notes.filter((n) => !(n.id === noteId && n.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Add Bucket Goal
app.post('/api/couple/bucket', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, category } = req.body;
  const newGoal = {
    id: `bg_${Date.now()}`,
    coupleId: user.coupleId,
    title,
    category: category || 'Romance',
    completed: false,
    addedByUserId: user.id,
    addedByName: user.name,
  };

  db.bucketGoals.unshift(newGoal);
  saveDB(db);
  res.json({ goal: newGoal });
});

// Toggle/Update Bucket Goal
app.patch('/api/couple/bucket/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const goalId = req.params.id;
  const db = loadDB();

  const goal = db.bucketGoals.find((g) => g.id === goalId && g.coupleId === user.coupleId);
  if (goal) {
    if (req.body.completed !== undefined) {
      goal.completed = req.body.completed;
      goal.completedAt = goal.completed ? Date.now() : undefined;
    }
    saveDB(db);
    return res.json({ goal });
  }
  res.status(404).json({ error: 'Goal not found' });
});

// Delete Bucket Goal
app.delete('/api/couple/bucket/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const goalId = req.params.id;
  const db = loadDB();

  db.bucketGoals = db.bucketGoals.filter((g) => !(g.id === goalId && g.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Set Mood
app.post('/api/couple/mood', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const { mood, note, date } = req.body;
  const db = loadDB();

  const dateStr = date || new Date().toISOString().split('T')[0];
  const newMood = {
    id: `mood_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    mood,
    note,
    date: dateStr,
    timestamp: Date.now(),
  };

  // replace user's mood for today
  db.moods = db.moods.filter((m) => !(m.userId === user.id && m.date === dateStr));
  db.moods.unshift(newMood);
  saveDB(db);
  res.json({ mood: newMood });
});

// Send Virtual Bear Hug
app.post('/api/couple/hug', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const couple = db.couples[user.coupleId];
  if (couple) {
    couple.hugsCount = (couple.hugsCount || 0) + 1;
    saveDB(db);
    return res.json({ hugsCount: couple.hugsCount });
  }
  res.status(404).json({ error: 'Couple not found' });
});

// Add Love Letter
app.post('/api/couple/love-letter', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, content, unlockDate } = req.body;
  const newLetter = {
    id: `letter_${Date.now()}`,
    coupleId: user.coupleId,
    senderId: user.id,
    senderName: user.name,
    title,
    content,
    unlockDate,
    isOpened: false,
    createdAt: Date.now(),
  };

  db.loveLetters.unshift(newLetter);
  saveDB(db);
  res.json({ letter: newLetter });
});

// Open Love Letter
app.patch('/api/couple/love-letter/:id/open', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const letterId = req.params.id;
  const db = loadDB();

  const letter = db.loveLetters.find((l) => l.id === letterId && l.coupleId === user.coupleId);
  if (letter) {
    letter.isOpened = true;
    saveDB(db);
    return res.json({ letter });
  }
  res.status(404).json({ error: 'Letter not found' });
});

// Add Song
app.post('/api/couple/song', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { title, artist, link, platform, memoryNote } = req.body;
  const newSong = {
    id: `song_${Date.now()}`,
    coupleId: user.coupleId,
    title,
    artist: artist || '',
    link,
    platform: platform || 'spotify',
    addedByUserId: user.id,
    addedByName: user.name,
    memoryNote,
  };

  db.songs.unshift(newSong);
  saveDB(db);
  res.json({ song: newSong });
});

// Delete Song
app.delete('/api/couple/song/:id', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const songId = req.params.id;
  const db = loadDB();

  db.songs = db.songs.filter((s) => !(s.id === songId && s.coupleId === user.coupleId));
  saveDB(db);
  res.json({ success: true });
});

// Answer daily question
app.post('/api/couple/daily-question', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { date, answer } = req.body;
  const key = `${date}_${user.coupleId}`;
  db.dailyAnswers = db.dailyAnswers || {};
  db.dailyAnswers[key] = db.dailyAnswers[key] || {};
  db.dailyAnswers[key][user.id] = answer;
  saveDB(db);
  res.json({ success: true, answers: db.dailyAnswers[key] });
});

// Answer quiz question
app.post('/api/couple/quiz/answer', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (!user.coupleId) return res.status(400).json({ error: 'Not in a couple' });

  const { questionId, answerIndex } = req.body;
  const q = db.quizQuestions.find((quiz) => quiz.id === questionId && quiz.coupleId === user.coupleId);
  if (q) {
    q.answers = q.answers || {};
    q.answers[user.id] = answerIndex;
    saveDB(db);
    return res.json({ question: q });
  }
  res.status(404).json({ error: 'Quiz question not found' });
});

// Update User Profile
app.patch('/api/auth/profile', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  const { name, nickname, avatar, avatarUrl } = req.body;
  const u = db.users[user.id];
  if (u) {
    if (name) u.name = name.trim();
    if (nickname) u.nickname = nickname.trim();
    if (avatar) u.avatar = avatar;
    if (avatarUrl !== undefined) u.avatarUrl = avatarUrl;
    saveDB(db);
    const { passwordHash: _, passwordSalt: __, ...userProfile } = u;
    return res.json({ user: userProfile });
  }
  res.status(404).json({ error: 'User not found' });
});

// Reset couple data for a fresh start
app.post('/api/couple/reset-all', authMiddleware, (req, res) => {
  const user = (req as any).user;
  const db = loadDB();
  if (user.coupleId) {
    const coupleId = user.coupleId;
    delete db.couples[coupleId];
    db.messages = db.messages.filter((m) => m.coupleId !== coupleId);
    db.photos = db.photos.filter((p) => p.coupleId !== coupleId);
    db.calendarEvents = db.calendarEvents.filter((e) => e.coupleId !== coupleId);
    db.notes = db.notes.filter((n) => n.coupleId !== coupleId);
    db.bucketGoals = db.bucketGoals.filter((g) => g.coupleId !== coupleId);
    db.loveLetters = db.loveLetters.filter((l) => l.coupleId !== coupleId);
    db.songs = db.songs.filter((s) => s.coupleId !== coupleId);
    Object.values(db.users).forEach((u) => {
      if (u.coupleId === coupleId) u.coupleId = null;
    });
    saveDB(db);
  }
  res.json({ success: true });
});

// Vite Middleware in Development / Static files in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Our Little Universe server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
