import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Plus,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Luggage,
  DollarSign,
  Hotel,
  Trash2,
  X,
  Compass,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { TravelDestination } from '../types';

export const TravelPlannerView: React.FC = () => {
  const {
    trips,
    addTrip,
    toggleTripVisited,
    togglePackingItem,
    deleteTrip,
  } = useCouple();

  const [selectedTrip, setSelectedTrip] = useState<TravelDestination | null>(trips[0] || null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  // New Trip form state
  const [tripTitle, setTripTitle] = useState('');
  const [tripDestination, setTripDestination] = useState('');
  const [tripStart, setTripStart] = useState('');
  const [tripEnd, setTripEnd] = useState('');
  const [tripHotel, setTripHotel] = useState('');
  const [tripBudget, setTripBudget] = useState('2500');

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim() || !tripDestination.trim()) return;

    const newTripData = {
      title: tripTitle.trim(),
      destination: tripDestination.trim(),
      startDate: tripStart,
      endDate: tripEnd,
      budget: { estimated: parseFloat(tripBudget) || 2000, spent: 0 },
      hotelDetails: tripHotel.trim() || undefined,
      itinerary: [
        { day: 1, title: 'Arrival & First Sunset Walk', places: ['Cozy local cafe', 'Scenic overlook'], notes: 'Take romantic couple photos!' },
      ],
      packingList: [
        { id: `pk-${Date.now()}-1`, item: 'Passports & ID cards', assignedTo: 'both' as const, checked: false },
        { id: `pk-${Date.now()}-2`, item: 'Camera & Memory Cards', assignedTo: 'dudu' as const, checked: false },
        { id: `pk-${Date.now()}-3`, item: 'Warm matching outfits', assignedTo: 'bubu' as const, checked: false },
      ],
    };

    addTrip(newTripData);
    setTripTitle('');
    setTripDestination('');
    setTripHotel('');
    setShowAddTripModal(false);
  };

  const activeTrip = trips.find((t: TravelDestination) => t.id === selectedTrip?.id) || trips[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span>Our Travel Adventures ✈️</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Planning our dream getaways, packing lists, itineraries, and exploring the globe together
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddTripModal(true)}
          className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Trips Carousel / Selection */}
      {trips.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 text-center shadow-xs">
          <Plane className="w-10 h-10 text-rose-300 mx-auto mb-2 animate-bounce" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif">
            No travel trips planned yet ✈️
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Where should our next adventure together be? Click &quot;Plan New Trip&quot; to begin building our itinerary and packing list!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip: TravelDestination) => {
            const isSelected = activeTrip?.id === trip.id;
            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className={`p-5 rounded-3xl border transition shadow-xs cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/50 dark:bg-zinc-800 border-rose-300 dark:border-rose-700 shadow-md ring-2 ring-rose-400/30'
                    : 'bg-white dark:bg-zinc-800/80 border-stone-200 dark:border-zinc-700 hover:border-rose-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                      <Plane className="w-3 h-3" />
                      <span>{trip.visited ? 'Visited Destination' : 'Upcoming Adventure'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTripVisited(trip.id);
                      }}
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full transition ${
                        trip.visited
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-stone-300 hover:bg-emerald-50'
                      }`}
                    >
                      {trip.visited ? 'Visited ✨' : 'Mark Visited'}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-stone-800 dark:text-stone-100 font-serif">
                    {trip.title}
                  </h4>

                  <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{trip.destination}</span>
                  </p>

                  <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {trip.startDate} → {trip.endDate}
                    </span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">
                    {trip.packingList ? trip.packingList.filter((p: any) => p.checked).length : 0}/{trip.packingList?.length || 0} packed
                  </span>
                  <span className="text-rose-500 font-bold">
                    ${trip.budget?.estimated || 0} budget
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Trip Details Inspector */}
      {activeTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Itinerary (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-500" />
                  <span>Trip Itinerary — {activeTrip.title}</span>
                </h3>
                <span className="text-xs text-stone-400">Day by Day Guide</span>
              </div>

              <div className="space-y-4">
                {activeTrip.itinerary.map((day: any) => (
                  <div
                    key={day.day}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                        Day {day.day}: {day.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {day.places.map((place: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{place}</span>
                        </span>
                      ))}
                    </div>

                    {day.notes && (
                      <p className="text-stone-500 dark:text-stone-400 italic mt-1">
                        Note: {day.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel & Stay Information */}
            {activeTrip.hotelDetails && (
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs flex items-start gap-3">
                <Hotel className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    Hotel & Accommodation
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 font-mono">
                    {activeTrip.hotelDetails}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Packing Checklist & Budget (1 Col) */}
          <div className="space-y-6">
            {/* Packing Checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-rose-500" />
                  <span>Packing Checklist</span>
                </h4>
                <span className="text-[11px] text-stone-400 font-medium">
                  {activeTrip.packingList ? activeTrip.packingList.filter((p: any) => p.checked).length : 0}/{activeTrip.packingList?.length || 0}
                </span>
              </div>

              <div className="space-y-2">
                {activeTrip.packingList?.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => togglePackingItem(activeTrip.id, item.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-xs cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2">
                      {item.checked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 group-hover:text-rose-400 shrink-0" />
                      )}
                      <span className={item.checked ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-200'}>
                        {item.item}
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 uppercase font-semibold">
                      {item.assignedTo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Budget Card */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-rose-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-800 border border-rose-200 dark:border-zinc-700 shadow-xs">
              <h4 className="text-sm font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Estimated Trip Budget</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Planned Budget:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100">
                    ${activeTrip.budget?.estimated || 0}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Current Expenses:</span>
                  <span className="font-bold text-rose-500">
                    ${activeTrip.budget?.spent || 0}
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((activeTrip.budget?.spent || 0) / (activeTrip.budget?.estimated || 1)) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 dark:border-zinc-700 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this trip?')) {
                      deleteTrip(activeTrip.id);
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Trip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal */}
      <AnimatePresence>
        {showAddTripModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-rose-500" />
                  <span>Plan Couple Trip ✈️</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddTripModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Trip Title:
                  </label>
                  <input
                    type="text"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    placeholder="e.g. Autumn in Paris 🥐"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Destination / City & Country:
                  </label>
                  <input
                    type="text"
                    value={tripDestination}
                    onChange={(e) => setTripDestination(e.target.value)}
                    placeholder="e.g. Paris, France"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      value={tripStart}
                      onChange={(e) => setTripStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={tripEnd}
                      onChange={(e) => setTripEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Estimated Budget ($):
                  </label>
                  <input
                    type="number"
                    value={tripBudget}
                    onChange={(e) => setTripBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                    Hotel / Stay Details:
                  </label>
                  <input
                    type="text"
                    value={tripHotel}
                    onChange={(e) => setTripHotel(e.target.value)}
                    placeholder="e.g. Le Marais Boutique Hotel"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTripModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                  >
                    Save Trip ✈️
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
