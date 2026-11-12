import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pin,
  Trash2,
  CheckCircle2,
  Circle,
  Tag,
  Clock,
  Sparkles,
  Flame,
  X,
  ListTodo,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { NoteCategory, SharedNote } from '../types';
import { DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';

export const NotesPlannerView: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleChecklistItem,
    bucketGoals,
    addBucketGoal,
    toggleBucketGoal,
    deleteBucketGoal,
    partner,
  } = useCouple();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'notes' | 'bucket_list'>('notes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // New Note State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('relationship');
  const [notePriority, setNotePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [noteAssignedTo, setNoteAssignedTo] = useState<string>('both');
  const [checklistItems, setChecklistItems] = useState<string[]>(['']);

  // New Bucket Goal State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Romance');

  const categories: { id: NoteCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Notes' },
    { id: 'relationship', label: 'Relationship Goals ❤️' },
    { id: 'goals', label: 'Future Goals 🎯' },
    { id: 'travel', label: 'Travel Plans ✈️' },
    { id: 'places', label: 'Places to Visit 🗺️' },
    { id: 'shopping', label: 'Things to Buy 🛍️' },
    { id: 'surprises', label: 'Surprise Ideas 🎁' },
    { id: 'thoughts', label: 'Daily Thoughts 💭' },
    { id: 'important', label: 'Important 📌' },
  ];

  const handleAddChecklistField = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const filteredChecklist = checklistItems
      .filter((text) => text.trim().length > 0)
      .map((text, idx) => ({ id: `chk-${Date.now()}-${idx}`, text: text.trim(), completed: false }));

    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      priority: notePriority,
      assignedTo: noteAssignedTo,
      pinned: false,
      checklist: filteredChecklist.length > 0 ? filteredChecklist : undefined,
    });

    setNoteTitle('');
    setNoteContent('');
    setChecklistItems(['']);
    setShowAddNoteModal(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addBucketGoal({
      title: goalTitle.trim(),
      category: goalCategory,
    });

    setGoalTitle('');
    setShowAddGoalModal(false);
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const completedGoalsCount = bucketGoals.filter((g) => g.completed).length;

  return (
    <div className="space-y-6 pb-16">
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Our Shared Notes & Dreams 📝</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Synchronized plans, bucket lists, and sweet promises for Bubu & Dudu
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 dark:bg-zinc-800 p-1 rounded-2xl flex items-center border border-rose-100 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Shared Notes ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bucket_list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'bucket_list'
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Bucket List ✨
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'notes') setShowAddNoteModal(true);
              else setShowAddGoalModal(true);
            }}
            className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'notes' ? 'New Note' : 'Add Dream'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => {
              const count =
                c.id === 'all' ? notes.length : notes.filter((n) => n.category === c.id).length;
              const isActive = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-zinc-700 hover:bg-rose-50'
                  }`}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Notes Masonry / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const isPinned = note.pinned;
              return (
                <div
                  key={note.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-zinc-800 border transition shadow-xs flex flex-col justify-between relative ${
                    isPinned
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20'
                      : 'border-rose-100 dark:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Header: Title, Pin, Delete */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif leading-snug">
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateNote(note.id, { pinned: !note.pinned })}
                          className={`p-1 transition ${
                            note.pinned ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500'
                          }`}
                          title={note.pinned ? 'Unpin' : 'Pin note'}
                        >
                          <Pin className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-stone-400 hover:text-rose-500 transition"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Note Body */}
                    {note.content && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-wrap leading-relaxed mb-3">
                        {note.content}
                      </p>
                    )}

                    {/* Interactive Checklist */}
                    {note.checklist && note.checklist.length > 0 && (
                      <div className="space-y-1.5 my-3 pt-2 border-t border-stone-100 dark:border-zinc-700">
                        {note.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(note.id, item.id)}
                            className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer select-none group"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-stone-400 group-hover:text-rose-400 shrink-0" />
                            )}
                            <span className={item.completed ? 'line-through text-stone-400' : ''}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Meta: Assigned, Priority, Category */}
                  <div className="pt-3 border-t border-stone-100 dark:border-zinc-700 flex items-center justify-between text-[10px]">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-stone-300 font-semibold">
                      {note.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">Assigned:</span>
                      <span className="font-bold text-rose-500 capitalize">
                        {note.assignedTo === 'both' ? 'Both ❤️' : (note.assignedTo === currentUser?.id ? currentUser?.name : partner?.name) || 'Us'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Our Dreams & Bucket List Page */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-amber-50 via-rose-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-800 border-2 border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Our Lifelong Dreams & Bucket List</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-800 dark:text-stone-100 mt-1">
                Adventures We Will Share Together 💫
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Completed {completedGoalsCount} of {bucketGoals.length} shared dreams!
              </p>
            </div>

            <div className="w-full sm:w-48 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-amber-200 shadow-2xs text-center">
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-serif">
                {Math.round((completedGoalsCount / (bucketGoals.length || 1)) * 100)}%
              </span>
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Fulfilled</span>
            </div>
          </div>

          {/* Bucket Goals List */}
          <div className="space-y-3">
            {bucketGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleBucketGoal(goal.id)}
                className={`p-4 rounded-2xl border transition shadow-xs flex items-center justify-between gap-3 cursor-pointer select-none ${
                  goal.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {goal.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-stone-300 hover:text-rose-400 shrink-0" />
                  )}

                  <div>
                    <h5
                      className={`text-sm font-bold font-serif ${
                        goal.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-800 dark:text-stone-100'
                      }`}
                    >
                      {goal.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400">
                      <span className="px-2 py-0.2 rounded-full bg-stone-100 dark:bg-zinc-700 font-medium">
                        {goal.category}
                      </span>
                      <span>Added by {goal.addedByName || (goal.addedByUserId === currentUser?.id ? currentUser?.name : partner?.name) || 'Both'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {goal.completed && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                      Fulfilled! 🎉
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBucketGoal(goal.id);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100">
                  Create Shared Couple Note 📝
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Title:
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Next Roadtrip Packing List"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Category:
                    </label>
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    >
                      <option value="relationship">Relationship Goals ❤️</option>
                      <option value="goals">Future Goals 🎯</option>
                      <option value="travel">Travel Plans ✈️</option>
                      <option value="places">Places to Visit 🗺️</option>
                      <option value="shopping">Things to Buy 🛍️</option>
                      <option value="surprises">Surprise Ideas 🎁</option>
                      <option value="thoughts">Daily Thoughts 💭</option>
                      <option value="important">Important 📌</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Assigned To:
                    </label>
                    <select
                      value={noteAssignedTo}
                      onChange={(e) => setNoteAssignedTo(e.target.value as 'dudu' | 'bubu' | 'both')}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    >
                      <option value="both">Both Bubu & Dudu ❤️</option>
                      <option value="dudu">Dudu 🐻</option>
                      <option value="bubu">Bubu 🌸</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Content / Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write details..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                {/* Optional Checklist Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                      Checklist Items (Optional):
                    </label>
                    <button
                      type="button"
                      onClick={handleAddChecklistField}
                      className="text-[11px] text-rose-500 hover:underline font-bold"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {checklistItems.map((val, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = [...checklistItems];
                          updated[idx] = e.target.value;
                          setChecklistItems(updated);
                        }}
                        placeholder={`Checklist item #${idx + 1}`}
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Bucket Goal Modal */}
      <AnimatePresence>
        {showAddGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Add Couple Dream / Bucket Goal</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Dream Title:
                  </label>
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Watch fireworks from a boat together 🎆"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Category:
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  >
                    <option value="Romance">Romance & Dates ❤️</option>
                    <option value="Travel">Travel & Exploring ✈️</option>
                    <option value="Adventure">Adventure & Fun 🎈</option>
                    <option value="Life">Future Life Goals 🏡</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGoalModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Add Dream 💫
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
