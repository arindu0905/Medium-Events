import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, Facebook, ArrowRight } from 'lucide-react';
import { PAST_EVENTS_DATA, COMPANY_DETAILS } from '../data/websiteData';
import { pathFor } from '../routes';
import { PastEvent } from '../types';

type SeriesFilter = 'All' | PastEvent['series'];

const SERIES_FILTERS: SeriesFilter[] = [
  'All',
  'Construction Industry Forum',
  'Marine Industry Forum',
  'Aviation Forum',
  'Build Expo',
];

interface PastEventsSectionProps {
  // When set, shows only the most recent N events plus a "view all" link (used on Home)
  limit?: number;
}

export const PastEventsSection: React.FC<PastEventsSectionProps> = ({ limit }) => {
  const [activeSeries, setActiveSeries] = useState<SeriesFilter>('All');

  const sortedEvents = [...PAST_EVENTS_DATA].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const filteredEvents = sortedEvents.filter((e) => activeSeries === 'All' || e.series === activeSeries);
  const visibleEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

  // Group by year for the timeline
  const eventsByYear = visibleEvents.reduce<Record<string, PastEvent[]>>((acc, event) => {
    const year = event.isoDate.slice(0, 4);
    (acc[year] ||= []).push(event);
    return acc;
  }, {});
  const years = Object.keys(eventsByYear).sort((a, b) => b.localeCompare(a));

  const totalResponses = PAST_EVENTS_DATA.reduce((sum, e) => sum + e.responded, 0);
  const seriesCount = new Set(PAST_EVENTS_DATA.map((e) => e.series)).size;
  const firstYear = sortedEvents[sortedEvents.length - 1]?.isoDate.slice(0, 4);

  return (
    <section id="track-record" className="relative py-24 border-t border-white/06">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            >
              Track Record
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            >
              Events We've Delivered
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 text-slate-300 text-base leading-relaxed"
            >
              Every forum and expo MEDIUM has hosted since {firstYear} — from the Construction Industry Forum to the Maldives Marine Industry Forum, Aviation Forum and Build Expo.
            </motion.p>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {[
              { value: PAST_EVENTS_DATA.length, label: 'Events Hosted' },
              { value: seriesCount, label: 'Event Series' },
              { value: `${totalResponses}+`, label: 'Facebook RSVPs' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl border border-white/08 px-4 py-3 text-center min-w-[96px]"
              >
                <span className="block text-2xl font-extrabold text-white">{stat.value}</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Series Filter Pills */}
        {!limit && (
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {SERIES_FILTERS.map((series) => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeSeries === series
                    ? 'bg-[#12229D] text-white shadow-md shadow-blue-950/60 border border-blue-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/06'
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        )}

        {/* Home preview: flat grid of the latest events */}
        {limit && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.map((event, idx) => (
              <PastEventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        )}

        {/* Full timeline grouped by year */}
        {!limit && (
          <div className="space-y-14">
            {years.map((year) => (
              <div key={year} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-black text-yellow-300 tracking-wider">{year}</span>
                  <div className="flex-grow h-[1.5px] bg-gradient-to-r from-yellow-400/60 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsByYear[year].map((event, idx) => (
                    <PastEventCard key={event.id} event={event} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {limit && (
            <Link
              to={pathFor('events')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-lg transition-colors cursor-pointer border border-blue-400/30 shadow-md"
            >
              <span>View Full Track Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          <a
            href={COMPANY_DETAILS.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-colors border border-white/10"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Follow MEDIUM on Facebook</span>
          </a>
        </div>
      </div>
    </section>
  );
};

const PastEventCard: React.FC<{ event: PastEvent; index: number }> = ({ event, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -5 }}
    className="glass-card rounded-2xl overflow-hidden border border-white/08 hover:border-yellow-300/40 transition-all duration-300 flex flex-col group shadow-lg"
  >
    {/* Event banner from the official Facebook event */}
    <div className="relative aspect-[2.1/1] w-full overflow-hidden bg-slate-900 flex-shrink-0">
      <img
        src={event.image}
        alt={`${event.name} banner`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#070b19]/85 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          {event.series}
        </span>
      </div>
    </div>

    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center gap-1.5 text-xs text-yellow-300 font-semibold mb-2">
        <Calendar className="w-3.5 h-3.5" />
        <span>{event.date}</span>
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
        {event.name}
      </h3>

      <div className="flex items-start gap-1.5 text-xs text-slate-400 mt-1.5 mb-3">
        <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-px" />
        <span>{event.venue}</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">{event.description}</p>

      <div className="mt-auto pt-4 border-t border-white/06 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          {event.responded} responded
        </span>
        <a
          href={event.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>View Event</span>
        </a>
      </div>
    </div>
  </motion.article>
);
