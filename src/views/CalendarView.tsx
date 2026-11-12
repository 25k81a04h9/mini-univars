import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Heart,
  Star,
  MapPin,
  Clock,
  Cake,
  Plane,
  Sparkles,
  X,
  Bookmark,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { CalendarCategory, CalendarEvent } from '../types';
import { getOnThisDayItems } from '../utils/relationshipCalculator';
import { DuduAvatar, BubuAvatar } from '../components/BubuDuduAvatars';

export const CalendarView: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    photos,
    messages,
  } = useCouple();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(selectedDateStr);
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState<CalendarCategory>('date_night');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIsDayToRemember, setNewIsDayToRemember] = useState(false);

  // Calendar Math
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle.trim(),
      date: newDate,
      time: newTime || undefined,
      category: newCategory,
      description: newDescription.trim(),
      location: newLocation.trim() || undefined,
      isDayToRemember: newIsDayToRemember,
    });

    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setShowAddModal(false);
  };

  // Find events on selected date
  const eventsOnSelectedDate = calendarEvents.filter((e) => e.date === selectedDateStr);
  const photosOnSelectedDate = photos.filter((p) => p.dateTaken === selectedDateStr);

  // Check if selected date is marked as "A Day to Remember"
  const dayToRememberEvent = eventsOnSelectedDate.find((e) => e.isDayToRemember);

  // "On This Day" Retrospective
  const onThisDayEvents = getOnThisDayItems(calendarEvents, new Date());
  const onThisDayPhotos = getOnThisDayItems(photos, new Date());

  const getCategoryIcon = (cat: CalendarCategory) => {
    switch (cat) {
      case 'anniversary':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'birthday':
        return <Cake className="w-3.5 h-3.5 text-amber-500" />;
      case 'trip':
        return <Plane className="w-3.5 h-3.5 text-sky-500" />;
      case 'first_meeting':
      case 'first_date':
        return <Sparkles className="w-3.5 h-3.5 text-pink-500" />;
      default:
        return <Star className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Our Special Calendar 🗓️</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Every date night, milestone, and sweet memory marked forever
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewDate(selectedDateStr);
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* "On This Day" Retrospective Banner */}
      {(onThisDayEvents.length > 0 || onThisDayPhotos.length > 0) && (
        <div className="p-5 rounded-3xl bg-linear-to-r from-amber-50 via-rose-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-800 border-2 border-amber-200 dark:border-amber-900/60 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✨</span>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 font-serif">
              On This Day in Our History
            </h3>
          </div>

          <div className="space-y-2">
            {onThisDayEvents.map(({ item, yearsAgo }) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-amber-200 dark:border-amber-900 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-600 dark:text-rose-400">{item.title}</span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {yearsAgo} year{yearsAgo > 1 ? 's' : ''} ago today! ❤️
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300">{item.description}</p>
              </div>
            ))}

            {onThisDayPhotos.map(({ item, yearsAgo }) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-amber-200 text-xs"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {item.caption}
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold">
                    Captured {yearsAgo} year{yearsAgo > 1 ? 's' : ''} ago today 📸
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Calendar Card & Selected Date Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-700 p-1 rounded-2xl">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-zinc-600 text-stone-600 dark:text-stone-300 transition"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-zinc-600 text-stone-600 dark:text-stone-300 transition"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-[11px] font-bold text-stone-400 uppercase tracking-wider py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty leading cells */}
            {[...Array(firstDayIndex)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Month days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
              const isSelected = dateStr === selectedDateStr;
              const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
              const hasDayToRemember = dayEvents.some((e) => e.isDayToRemember);

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-1.5 sm:p-2 transition relative border ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105 z-10'
                      : hasDayToRemember
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                      : 'hover:bg-stone-50 dark:hover:bg-zinc-700 border-transparent text-stone-700 dark:text-stone-200'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : ''}`}>
                    {dayNum}
                  </span>

                  {/* Indicators */}
                  <div className="flex items-center gap-0.5 justify-center">
                    {hasDayToRemember && (
                      <Heart
                        className={`w-2.5 h-2.5 ${
                          isSelected ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'
                        }`}
                      />
                    )}
                    {dayEvents.length > 0 && !hasDayToRemember && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-rose-400'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details & "A Day to Remember" */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
                Selected Date
              </span>
              <span className="text-xs text-stone-400">{selectedDateStr}</span>
            </div>

            {/* Special "A Day to Remember ❤️" Banner */}
            {dayToRememberEvent && (
              <div className="p-4 rounded-2xl bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-md mb-4">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-amber-200">
                  <Heart className="w-3.5 h-3.5 fill-amber-200" />
                  <span>A Day to Remember ❤️</span>
                </div>
                <h4 className="text-lg font-bold font-serif">{dayToRememberEvent.title}</h4>
                {dayToRememberEvent.description && (
                  <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                    {dayToRememberEvent.description}
                  </p>
                )}
              </div>
            )}

            {/* Events on this date list */}
            <h4 className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
              Events on this Day ({eventsOnSelectedDate.length}):
            </h4>

            {eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-2 mb-4">
                {eventsOnSelectedDate.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-rose-50/60 dark:bg-zinc-900/60 border border-rose-100 dark:border-zinc-700 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-100">
                        {getCategoryIcon(ev.category)}
                        <span>{ev.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCalendarEvent(ev.id)}
                        className="text-stone-400 hover:text-rose-500 text-[10px]"
                      >
                        Delete
                      </button>
                    </div>

                    {ev.description && (
                      <p className="text-stone-600 dark:text-stone-400 mt-1">{ev.description}</p>
                    )}

                    {ev.location && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{ev.location}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic mb-4">No events scheduled for this day yet.</p>
            )}

            {/* Photos taken on this date */}
            {photosOnSelectedDate.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Photos Taken ({photosOnSelectedDate.length}):
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {photosOnSelectedDate.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => {
                setNewDate(selectedDateStr);
                setShowAddModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-700 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-rose-50 transition"
            >
              + Add Event to {selectedDateStr}
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-rose-500" />
                  <span>Add Couple Event</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Event Title:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Candlelight Dinner Date 🕯️"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Date:
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Category:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CalendarCategory)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    >
                      <option value="date_night">Date Night 🍷</option>
                      <option value="special_moment">Special Moment ✨</option>
                      <option value="anniversary">Anniversary 💍</option>
                      <option value="birthday">Birthday 🎂</option>
                      <option value="trip">Trip & Vacation ✈️</option>
                      <option value="reminder">Personal Reminder ⏰</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Location (Optional):
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Cozy Italian Bistro"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Notes & Details:
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What are we planning? Any surprises? ❤️"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                {/* Mark as a day to remember checkbox */}
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-zinc-800 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="dayToRememberCheck"
                    checked={newIsDayToRemember}
                    onChange={(e) => setNewIsDayToRemember(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-400"
                  />
                  <label htmlFor="dayToRememberCheck" className="text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer">
                    Mark as &quot;A Day to Remember ❤️&quot;
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Save Event 🗓️
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
