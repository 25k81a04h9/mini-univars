import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  SwitchCamera,
  Heart,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { BubuAvatar, DuduAvatar } from './BubuDuduAvatars';

export const CallingModal: React.FC = () => {
  const { callingState, acceptCall, rejectCall, endCall, partner } = useCouple();
  const { currentUser } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const partnerName = partner?.nickname || partner?.name || 'My Love';
  const callerName = callingState.callerName || partnerName;

  // Format call duration MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Attempt real camera stream if video call
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (callingState.active && !callingState.incoming && callingState.type === 'video' && isVideoEnabled) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: cameraFacing },
            audio: true,
          })
          .then((s) => {
            stream = s;
            setMediaStream(s);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = s;
            }
          })
          .catch((err) => {
            console.log('Camera permission preview fallback (using cute animated bear feed):', err);
          });
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callingState.active, callingState.incoming, callingState.type, isVideoEnabled, cameraFacing]);

  // Handle mute toggles on media tracks
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((t) => {
        t.enabled = !isMuted;
      });
      mediaStream.getVideoTracks().forEach((t) => {
        t.enabled = isVideoEnabled;
      });
    }
  }, [mediaStream, isMuted, isVideoEnabled]);

  if (!callingState.active && !callingState.incoming) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
      >
        {/* Incoming Call Screen */}
        {callingState.incoming ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-zinc-900 border-2 border-rose-300 dark:border-rose-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {partner?.avatar === 'bubu' ? <BubuAvatar size={90} /> : <DuduAvatar size={90} />}
              </motion.div>
            </div>

            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">
              {callerName} is calling...
            </h3>
            <p className="text-sm text-rose-500 font-medium mt-1 flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Incoming {callingState.type === 'video' ? 'Video' : 'Voice'} Call</span>
            </p>

            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                type="button"
                onClick={rejectCall}
                className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
                aria-label="Decline call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={acceptCall}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl active:scale-95 transition animate-pulse"
                aria-label="Accept call"
              >
                <PhoneCall className="w-7 h-7" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Call Screen */
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-md w-full h-[600px] flex flex-col relative shadow-2xl"
          >
            {/* Top Bar with Call Info */}
            <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                {partner?.avatar === 'bubu' ? <BubuAvatar size={36} /> : <DuduAvatar size={36} />}
                <div>
                  <h4 className="text-white font-semibold text-sm">{partnerName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected • {formatDuration(callingState.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-stone-300 font-mono">
                {callingState.type === 'video' ? 'HD Video' : 'Secure Audio'}
              </div>
            </div>

            {/* Main Stage (Remote Partner) */}
            <div className="flex-1 bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
              {callingState.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-rose-950/40 to-stone-900 relative">
                  {/* Sweet animated partner stream illustration */}
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [-4, 4, -4], scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      {partner?.avatar === 'bubu' ? (
                        <BubuAvatar size={150} mood="loved" />
                      ) : (
                        <DuduAvatar size={150} mood="loved" />
                      )}
                    </motion.div>
                    <p className="text-stone-300 text-sm mt-3 font-medium">
                      {partnerName} is smiling at you ❤️
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mb-4"
                  >
                    {partner?.avatar === 'bubu' ? (
                      <BubuAvatar size={130} mood="happy" />
                    ) : (
                      <DuduAvatar size={130} mood="happy" />
                    )}
                  </motion.div>
                  <h3 className="text-white text-lg font-bold">{partnerName}</h3>
                  <p className="text-rose-400 text-xs mt-1">Private Encrypted Call</p>
                </div>
              )}

              {/* Local video thumbnail */}
              {callingState.type === 'video' && (
                <div className="absolute bottom-20 right-4 w-28 h-40 bg-stone-800 rounded-2xl overflow-hidden border-2 border-stone-700 shadow-xl z-20">
                  {isVideoEnabled ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400">
                      {currentUser?.avatar === 'bubu' ? <BubuAvatar size={45} /> : <DuduAvatar size={45} />}
                      <span className="text-[10px] mt-1">Camera Off</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-stone-900/90 backdrop-blur-md flex items-center justify-around z-20">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-stone-800 text-white hover:bg-stone-700'
                }`}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {callingState.type === 'video' && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      !isVideoEnabled
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-stone-800 text-white hover:bg-stone-700'
                    }`}
                    aria-label={isVideoEnabled ? 'Disable camera' : 'Enable camera'}
                  >
                    {!isVideoEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
                    }
                    className="w-12 h-12 rounded-full bg-stone-800 text-white hover:bg-stone-700 flex items-center justify-center transition"
                    aria-label="Switch camera"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="w-12 h-12 rounded-full bg-stone-800 text-white hover:bg-stone-700 flex items-center justify-center transition"
                aria-label={isSpeakerOn ? 'Mute speaker' : 'Enable speaker'}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
                aria-label="End call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
