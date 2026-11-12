import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Smile,
  Image as ImageIcon,
  Mic,
  Trash2,
  Reply,
  Search,
  Lock,
  Heart,
  Volume2,
  X,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { BubuAvatar, DuduAvatar, BUBU_DUDU_STICKERS } from '../components/BubuDuduAvatars';
import { sounds } from '../utils/soundEffects';
import { ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const { currentUser } = useAuth();
  const { partner, messages, sendMessage, deleteMessage } = useCouple();

  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [showLoveNoteModal, setShowLoveNoteModal] = useState(false);
  const [loveNoteTitle, setLoveNoteTitle] = useState('');
  const [loveNoteBody, setLoveNoteBody] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const partnerName = partner?.name || 'Partner';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await sendMessage({
      text: inputText.trim(),
      type: 'text',
      replyToId: replyingTo?.id,
      replySnippet: replyingTo ? `${replyingTo.senderName}: ${replyingTo.text.slice(0, 40)}` : undefined,
    });

    setInputText('');
    setReplyingTo(null);
  };

  const handleSendSticker = async (stickerId: string) => {
    await sendMessage({
      text: 'Sent a sticker',
      type: 'sticker',
      stickerId,
      replyToId: replyingTo?.id,
    });
    setShowStickers(false);
    setReplyingTo(null);
  };

  const handleSendLoveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveNoteBody.trim()) return;

    await sendMessage({
      text: loveNoteBody.trim(),
      type: 'love_note',
      loveNoteSubject: loveNoteTitle.trim() || 'A Sweet Love Letter for You 💌',
    });

    setLoveNoteTitle('');
    setLoveNoteBody('');
    setShowLoveNoteModal(false);
    sounds.playCelebration();
  };

  const handleSendMockImage = async () => {
    const romanticImages = [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    ];
    const picked = romanticImages[Math.floor(Math.random() * romanticImages.length)];
    await sendMessage({
      text: 'Sharing a sweet memory photo with you ❤️',
      type: 'image',
      mediaUrl: picked,
    });
  };

  const handleFinishVoiceRecord = async () => {
    setIsRecordingVoice(false);
    await sendMessage({
      text: 'Voice Message',
      type: 'voice',
      voiceDuration: Math.max(1, voiceSeconds),
    });
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.loveNoteSubject?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-white dark:bg-zinc-900 rounded-3xl border border-rose-100 dark:border-zinc-800 shadow-xs overflow-hidden relative">
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 bg-rose-50/70 dark:bg-zinc-800/80 border-b border-rose-100 dark:border-zinc-700 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            {partner?.avatar === 'dudu' ? <DuduAvatar size={42} /> : <BubuAvatar size={42} />}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-800" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-100">
                {partnerName}
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-600" />
              <span>Private Encrypted Space</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowLoveNoteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>💌</span>
            <span className="hidden sm:inline">Love Note</span>
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat..."
              className="w-24 sm:w-36 pl-7 pr-2 py-1 text-xs rounded-full bg-white dark:bg-zinc-700 border border-stone-200 dark:border-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-rose-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="shrink-0 mb-1">
                    {partner?.avatar === 'dudu' ? <DuduAvatar size={32} /> : <BubuAvatar size={32} />}
                  </div>
                )}

                <div className={`max-w-[80%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.replySnippet && (
                    <div className="text-[10px] bg-stone-100 dark:bg-zinc-800 text-stone-500 px-3 py-1 rounded-t-xl border-l-2 border-rose-400 truncate w-full">
                      <span className="font-semibold">Replying to: </span>
                      <span>{msg.replySnippet}</span>
                    </div>
                  )}

                  <div
                    className={`relative p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      isMe
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-rose-50 dark:bg-zinc-800 text-stone-800 dark:text-stone-100 rounded-bl-xs border border-rose-100 dark:border-zinc-700'
                    }`}
                  >
                    {/* Love Note */}
                    {msg.type === 'love_note' && (
                      <div className="border border-rose-200 dark:border-rose-900 bg-white/10 p-3 rounded-xl mb-1">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
                          <span>💌</span>
                          <span>{msg.loveNoteSubject || 'Digital Love Letter'}</span>
                        </div>
                        <p className="font-serif italic leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                    )}

                    {/* Sticker */}
                    {msg.type === 'sticker' && (
                      <div className="p-2 flex flex-col items-center">
                        {BUBU_DUDU_STICKERS.find((s) => s.id === msg.stickerId)?.renderSvg(90) || (
                          <span className="text-4xl">🧸</span>
                        )}
                      </div>
                    )}

                    {/* Image */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div className="rounded-xl overflow-hidden mb-2 max-w-xs">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared memory"
                          className="w-full h-auto object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Voice */}
                    {msg.type === 'voice' && (
                      <div className="flex items-center gap-3 py-1 min-w-[150px]">
                        <button
                          type="button"
                          onClick={() => sounds.playHeartReaction()}
                          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            {[3, 6, 8, 4, 7, 5, 8, 4, 6].map((h, i) => (
                              <span
                                key={i}
                                className="w-1 bg-current rounded-full"
                                style={{ height: `${h * 2}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] opacity-80 mt-1 block">
                            0:{msg.voiceDuration?.toString().padStart(2, '0') || '05'} Voice Note
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Plain Text */}
                    {msg.type === 'text' && (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? 'text-rose-100' : 'text-stone-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                    </div>

                    {/* Action Overlay */}
                    <div
                      className={`absolute -top-3 ${
                        isMe ? 'left-0' : 'right-0'
                      } flex items-center gap-1 bg-white dark:bg-zinc-700 border border-stone-200 dark:border-zinc-600 rounded-full px-1.5 py-0.5 shadow-xs opacity-0 hover:opacity-100 transition`}
                    >
                      <button
                        type="button"
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 text-stone-500 hover:text-rose-500 transition"
                        title="Reply"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 text-stone-400 hover:text-rose-500 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {isMe && (
                  <div className="shrink-0 mb-1">
                    {currentUser?.avatar === 'dudu' ? <DuduAvatar size={32} /> : <BubuAvatar size={32} />}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Real Clean Empty State */
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-zinc-800 flex items-center justify-center text-2xl mb-3">
              💌
            </div>
            <h4 className="text-base font-bold text-stone-700 dark:text-stone-300">
              No messages yet
            </h4>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              Send your first message or love letter to {partnerName} to start your private conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Replying Banner */}
      {replyingTo && (
        <div className="p-2 px-4 bg-rose-50 dark:bg-zinc-800 border-t border-rose-200 dark:border-zinc-700 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-3.5 h-3.5" />
            <span>
              Replying to <strong>{replyingTo.senderName}</strong>: &ldquo;{replyingTo.text.slice(0, 35)}&rdquo;
            </span>
          </div>
          <button type="button" onClick={() => setReplyingTo(null)} className="p-1 hover:text-stone-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sticker drawer */}
      <AnimatePresence>
        {showStickers && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 180, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-50/90 dark:bg-zinc-800/90 border-t border-rose-200 dark:border-zinc-700 p-3 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Bubu & Dudu Sticker Collection 🧸
              </span>
              <button
                type="button"
                onClick={() => setShowStickers(false)}
                className="text-stone-400 hover:text-stone-600 text-xs"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BUBU_DUDU_STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => handleSendSticker(sticker.id)}
                  className="p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-rose-100 dark:border-zinc-700 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition shadow-2xs cursor-pointer"
                  title={sticker.name}
                >
                  {sticker.renderSvg(45)}
                  <span className="text-[9px] font-medium text-stone-600 dark:text-stone-400 mt-1 truncate w-full text-center">
                    {sticker.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Input Form */}
      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-rose-100 dark:border-zinc-800 shrink-0">
        {isRecordingVoice ? (
          <div className="flex items-center justify-between bg-rose-50 dark:bg-zinc-800 p-2.5 rounded-2xl border border-rose-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Recording Voice Note ({voiceSeconds}s)...</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(false)}
                className="text-xs text-stone-500 px-3 py-1 rounded-xl hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishVoiceRecord}
                className="text-xs bg-rose-500 text-white font-bold px-4 py-1.5 rounded-xl shadow-xs"
              >
                Send Voice 🎙️
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStickers(!showStickers)}
              className="p-2 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Stickers"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSendMockImage}
              className="p-2 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Share photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-2 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Record voice message"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${partnerName} with love... ❤️`}
              className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center shadow-md active:scale-95 transition shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Love Note Modal */}
      <AnimatePresence>
        {showLoveNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💌</span>
                  <h3 className="text-lg font-bold font-serif text-rose-600 dark:text-rose-400">
                    Write a Love Note for {partnerName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoveNoteModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendLoveNote} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Subject / Title:
                  </label>
                  <input
                    type="text"
                    value={loveNoteTitle}
                    onChange={(e) => setLoveNoteTitle(e.target.value)}
                    placeholder="e.g. You make my heart flutter 💖"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Love Letter Message:
                  </label>
                  <textarea
                    rows={5}
                    value={loveNoteBody}
                    onChange={(e) => setLoveNoteBody(e.target.value)}
                    placeholder="Dearest sweetheart..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 font-serif"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLoveNoteModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition cursor-pointer"
                  >
                    Deliver Love Note 💌
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
