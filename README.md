# Our Little Universe ❤️
### A Private Couple-Only App for Bubu and Dudu
*Two hearts, one little world.*

Our Little Universe is a full-featured, mobile-first private relationship application designed exclusively for two paired individuals: **Dudu** (the cute brown bear) and **Bubu** (the sweet white bear). It provides an intimate, adorable digital haven with live relationship duration tracking, end-to-end encrypted messaging, shared albums, memories calendar, synchronized bucket list, timelocked love letters, mood check-ins, travel planning, and private voice/video calling.

---

## 🌟 Key Features

1. **Adorable Bubu & Dudu Aesthetic:**
   - Handcrafted original vector SVG illustrations of Dudu (brown bear) and Bubu (white bear)
   - Soft pastel pink, caramel brown, lavender, cream, and rose gold palette
   - Floating sparkles, animated bear emotions, and romantic confetti celebrations
   - Responsive design for mobile, tablet, and desktop with Light and Dark modes

2. **Private Account System & Pairing:**
   - Exclusively two-person space: no public followers, posts, or stranger search
   - Unique invitation code (`BUBU-DUDU-2024-LOVE`) & QR code generation
   - App-specific 4-digit PIN lock for private device security
   - Instant role switching between Dudu 🐻 and Bubu 🌸 for easy testing and multi-device access

3. **Relationship Day Counter:**
   - Exact days, years, months, days, total weeks, and total hours together
   - Real calendar date calculation accounting for leap years, month length differences, and time zones
   - Milestone tracking (100 days, 365 days, 500 days, 1000 days, etc.) with animated progress bar
   - Next yearly anniversary countdown with celebratory fanfare

4. **Private Chat & Love Notes 💌:**
   - End-to-End Cryptography: Client-side AES-GCM 256-bit encryption with PBKDF2 key derivation (100,000 iterations)
   - Exclusive Bubu & Dudu sticker pack (Hug, Sweet Kiss, Sleeping, Cooking, Celebration, etc.)
   - Voice audio recording with simulated waveform
   - Image sharing and media previews
   - Digital Love Notes envelope with animated wax seal delivery
   - Message reactions (❤️, 🥰, 🐻, 💋), pinning, and memory bookmarks

5. **Shared Photo Gallery 📸:**
   - Organized albums: *Our First Meeting*, *Our First Date*, *Best Moments*, *Cute Pictures*, *Trips Together*, *Celebrations*, *Random Memories*, *Forever Favourites*
   - Photo captions, date taken, uploader avatar attribution, and favorite heart badges
   - Fullscreen lightbox viewer with comment thread and direct photo downloading

6. **Special Memories Calendar 🗓️:**
   - Monthly interactive couple calendar with event categories (Anniversaries, Date Nights, Birthdays, Trips)
   - Special landmark marker: **"A Day to Remember ❤️"**
   - **"On This Day"** retrospective: automatically resurfaces moments and photos from the same date in previous years

7. **Shared Notes & Bucket List 📝:**
   - Synchronized couple notes with priorities, categories, and interactive task checklists
   - **Our Dreams & Bucket List** special section with celebratory confetti fanfare upon goal fulfillment

8. **Daily Love Routines 🧸:**
   - Daily question for the couple with mutual response reveal
   - Daily mood check-in (Happy, Loved, Excited, Tired, Need Love, Missing You, Need a Hug)
   - "Send a Little Love ❤️" random romantic message generator
   - **Love Letter Box & Timelock Vault**: Write secret letters that cannot be opened until a future anniversary or target date
   - **Couple Quiz Trivia**: Trivia challenge to test how well you know each other
   - **Our Special Songs Playlist**: Track meaningful songs with direct links to Spotify, YouTube, and Apple Music
   - Virtual Bear Hug button with counter and full-screen celebration

9. **Private Voice & Video Calling 📞:**
   - WebRTC one-to-one video and voice calling interface
   - Microphone mute, camera toggle, camera flip (user/environment), speaker controls, and call timer
   - Google public STUN relay integration (`stun:stun.l.google.com:19302`)

---

## 🛠️ Technical Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion v12), Canvas Confetti
- **Audio:** Web Audio API native synthesizer for romantic chimes, hug sounds, and milestone fanfare
- **Cryptography:** Web Crypto API (`SubtleCrypto` AES-GCM 256-bit & PBKDF2 with SHA-256)
- **Calling:** WebRTC with media stream capture and STUN relay configuration
- **PWA:** Web App Manifest (`/public/manifest.json`), mobile meta tags, standalone display mode

---

## 🚀 Development & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app will run locally on `http://localhost:3000`.

### 3. Run Unit Tests (Pure Logic Verification)
Verify the core relationship calendar calculations and cryptographic functions using Node's native test runner:
```bash
npx --yes tsx --test src/utils/relationshipCalculator.test.ts
npx --yes tsx --test src/utils/encryption.test.ts
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Firebase Setup

### End-to-End Encryption (E2E)
- All private chat messages are encrypted client-side using **AES-GCM (256-bit)** before being sent or persisted.
- Keys are derived locally on user devices from the unique couple space credentials using **PBKDF2** (100,000 iterations, SHA-256).
- Messages stored in persistent storage contain only `{ ciphertext, iv }`; raw plaintext is never stored without decryption keys.

### Firebase Integration Guide
To connect your own Google Cloud / Firebase project for cloud multi-device sync:
1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Firestore Database** and **Firebase Authentication** (Google / Email provider).
3. Place your Firebase web credentials in `src/firebase-config.ts` or set the environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

### WebRTC STUN/TURN Setup
WebRTC peer-to-peer calling uses the standard ICE configuration:
```javascript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
];
```
For restrictive symmetric NATs or corporate firewalls, configure a TURN relay server (e.g. Coturn, Twilio, or Xirsys) in your calling signaling layer.

---

## 📱 PWA Installation (Android & Desktop)
- **On Android (Chrome / Brave / Edge):** Tap the browser menu (`⋮`) -> **"Add to Home screen"** or **"Install app"**.
- **On iOS (Safari):** Tap the Share button -> **"Add to Home Screen"**.
- **On Desktop (Chrome / Edge):** Click the install icon in the URL bar to install the applet as an independent standalone window.
