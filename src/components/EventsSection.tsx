import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { FLAGSHIP_EVENTS_DATA } from '../data/websiteData';
import { FlagshipEvent } from '../types';
import { EventModal } from './EventModal';

interface EventsSectionProps {
  onEnquireEvent: (eventTitle: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onEnquireEvent }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Expos' | 'Forums' | 'Conferences'>('All');
  const [selectedEvent, setSelectedEvent] = useState<FlagshipEvent | null>(null);

  const filteredEvents = FLAGSHIP_EVENTS_DATA.filter((event) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Expos') return event.category.toLowerCase().includes('expo') || event.category.toLowerCase().includes('exhibition');
    if (activeFilter === 'Forums') return event.category.toLowerCase().includes('forum');
    if (activeFilter === 'Conferences') return event.category.toLowerCase().includes('conference') || event.category.toLowerCase().includes('summit');
    return true;
  });

  return (
    <section id="events" className="relative py-24 bg-[#080d22]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            >
              Flagship Portfolio
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            >
              Nation-Scale Expos & Strategic Forums
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 text-slate-300 text-base leading-relaxed"
            >
              MEDIUM organizes the Maldives’ most authoritative exhibitions and business forums, connecting national associations, regional ministries, and global industry stakeholders.
            </motion.p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Expos', 'Forums', 'Conferences'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#12229D] text-white shadow-md shadow-blue-950/60 border border-blue-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/06'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/08 hover:border-blue-400/40 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Event Image Container with restrained zoom */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d22] via-[#080d22]/40 to-transparent" />

                {/* Badge on top-left */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#12229D]/90 backdrop-blur-md border border-blue-400/30 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {event.category}
                  </span>
                </div>

                {/* Date on bottom-left */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {event.dateOrFrequency}
                  </span>
                  <span className="text-[11px] text-yellow-300 font-semibold">
                    {event.year}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-2">
                    {event.name}
                  </h3>
                  <p className="text-xs text-blue-300 font-medium mt-1 mb-3">
                    {event.tagline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-white/06 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>Event Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEnquireEvent(event.name)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Sponsorship</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEnquire={onEnquireEvent}
      />
    </section>
  );
};
