import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Heart,
  Calendar,
  MessageCircle,
  Download,
  Trash2,
  X,
  Search,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';
import { GalleryPhoto } from '../types';

export const GalleryView: React.FC = () => {
  const {
    photos,
    albums,
    addPhoto,
    toggleFavoritePhoto,
    deletePhoto,
    addPhotoComment,
    partner,
  } = useCouple();
  const { currentUser } = useAuth();

  const [activeAlbum, setActiveAlbum] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  // New photo form inputs
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAlbum, setUploadAlbum] = useState('best_moments');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);

  // Comment input on lightbox
  const [commentInput, setCommentInput] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    addPhoto({
      url: uploadUrl.trim(),
      caption: uploadCaption.trim() || 'A sweet moment together ❤️',
      album: uploadAlbum,
      dateTaken: uploadDate,
    });

    setUploadUrl('');
    setUploadCaption('');
    setShowUploadModal(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedPhoto) return;
    addPhotoComment(selectedPhoto.id, commentInput.trim());
    setCommentInput('');

    // Update selected photo view
    const updated = photos.find((p) => p.id === selectedPhoto.id);
    if (updated) setSelectedPhoto(updated);
  };

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    const matchesAlbum = activeAlbum === 'all' || p.album === activeAlbum;
    const matchesFav = !filterFavoritesOnly || p.isFavorite;
    const matchesSearch =
      !searchQuery.trim() ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dateTaken.includes(searchQuery);
    return matchesAlbum && matchesFav && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Our Shared Gallery 📸</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Preserving every smile, adventure, and cozy moment of Bubu & Dudu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
            className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition border ${
              filterFavoritesOnly
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 border-rose-200 dark:border-zinc-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-white' : 'text-rose-500'}`} />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Album Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Album Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveAlbum('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
              activeAlbum === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-zinc-700 hover:bg-rose-50'
            }`}
          >
            All Photos ({photos.length})
          </button>

          {albums.map((album) => {
            const count = photos.filter((p) => p.album === album.id).length;
            const isActive = activeAlbum === album.id;
            return (
              <button
                key={album.id}
                type="button"
                onClick={() => setActiveAlbum(album.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-zinc-700 hover:bg-rose-50'
                }`}
              >
                {album.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search captions or dates..."
            className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-2xl text-xs bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => {
            const uploaderName = photo.uploadedByName || (photo.uploadedByUserId === currentUser?.id ? currentUser?.name : partner?.name) || 'Our Love';
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative rounded-3xl overflow-hidden aspect-square bg-stone-100 dark:bg-zinc-800 border border-rose-100 dark:border-zinc-800 shadow-xs cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Favorite Heart Badge */}
                {photo.isFavorite && (
                  <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center shadow-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  </span>
                )}

                {/* Overlay info on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                  <p className="text-white text-xs font-semibold line-clamp-2">
                    {photo.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-rose-200 mt-1">
                    <span>{photo.dateTaken}</span>
                    <span>by {uploaderName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700">
          <ImageIcon className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-stone-700 dark:text-stone-300">
            No memories found
          </h4>
          <p className="text-xs text-stone-400 mt-1">
            Try choosing a different album or add your first memory photo!
          </p>
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Area */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[280px] md:min-h-[460px]">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="max-h-[500px] w-full object-contain"
                />
              </div>

              {/* Details and Comments Sidebar */}
              <div className="w-full md:w-80 p-5 flex flex-col justify-between bg-white dark:bg-zinc-900 border-t md:border-t-0 md:border-l border-stone-200 dark:border-zinc-800">
                <div className="space-y-4 overflow-y-auto max-h-[300px] md:max-h-[360px]">
                  {/* Uploader & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedPhoto.uploadedByUserId === currentUser?.id ? (
                        currentUser?.avatar === 'bubu' ? <BubuAvatar size={32} /> : <DuduAvatar size={32} />
                      ) : (
                        partner?.avatar === 'bubu' ? <BubuAvatar size={32} /> : <DuduAvatar size={32} />
                      )}
                      <div>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                          {selectedPhoto.uploadedByName || (selectedPhoto.uploadedByUserId === currentUser?.id ? currentUser?.name : partner?.name) || 'Our Universe'}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {selectedPhoto.dateTaken}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavoritePhoto(selectedPhoto.id)}
                      className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-zinc-800 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          selectedPhoto.isFavorite
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-stone-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                    {selectedPhoto.caption}
                  </p>

                  {/* Comments Section */}
                  <div className="pt-3 border-t border-stone-100 dark:border-zinc-800">
                    <h5 className="text-xs font-bold text-stone-600 dark:text-stone-400 mb-2">
                      Our Comments ({selectedPhoto.comments?.length || 0}):
                    </h5>

                    <div className="space-y-2">
                      {selectedPhoto.comments && selectedPhoto.comments.length > 0 ? (
                        selectedPhoto.comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800 text-xs"
                          >
                            <span className="font-bold text-rose-500 capitalize block mb-0.5">
                              {c.authorName || c.authorId || 'Love'}:
                            </span>
                            <p className="text-stone-700 dark:text-stone-300">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-stone-400 italic">No comments yet. Leave one!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Comment Input */}
                <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 space-y-3">
                  <form onSubmit={handleAddComment} className="flex gap-1.5">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a sweet comment..."
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-600"
                    >
                      Send
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <a
                      href={selectedPhoto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="our_memory.jpg"
                      className="flex items-center gap-1 hover:text-stone-800 dark:hover:text-stone-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this shared memory?')) {
                          deletePhoto(selectedPhoto.id);
                          setSelectedPhoto(null);
                        }
                      }}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Photo Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-rose-500" />
                  <span>Add Photo Memory</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Photo URL or Image Link:
                  </label>
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://... or paste image link"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-stone-400">Quick samples:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadUrl(
                          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
                        )
                      }
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Park Walk
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadUrl(
                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
                        )
                      }
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Cute Puppy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Album:
                  </label>
                  <select
                    value={uploadAlbum}
                    onChange={(e) => setUploadAlbum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  >
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Date Taken:
                  </label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Description & Caption:
                  </label>
                  <textarea
                    rows={3}
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="What made this day so magical? ❤️"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Save Memory 📸
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
