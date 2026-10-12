import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface EventMarqueeProps {
  onSelectEvent?: (eventId: string) => void;
}

export const EventMarquee: React.FC<EventMarqueeProps> = ({ onSelectEvent }) => {
  // Row 1: National Level Exhibitions (from 1st image)
  const nationalExhibitions = [
    {
      id: 'marine-expo',
      title: 'MALDIVES MARINE EXPO 2026',
      edition: '11TH EDITION',
      date: '5th - 8th February 2026',
      location: 'Central Park, Hulhumalé',
      logo: (
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 64 64" className="w-11 h-11 flex-shrink-0" fill="none">
            {/* Marine Expo stylized compass & manta rays */}
            <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="2.5" />
            <path
              d="M32 10C35 18 42 22 50 20C44 26 40 33 42 42C34 38 27 40 22 48C22 39 16 34 8 32C16 30 20 23 20 14C24 21 31 22 32 10Z"
              fill="white"
            />
            <circle cx="32" cy="32" r="4" fill="#12229D" />
          </svg>
          <div className="text-left">
            <span className="text-[10px] font-bold text-yellow-300 tracking-[0.2em] block uppercase">
              11TH EDITION
            </span>
            <span className="text-sm font-black text-white tracking-wider block font-sans">
              MALDIVES MARINE EXPO 2026
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'build-expo',
      title: 'BUILD EXPO',
      edition: 'NATIONAL EDITION',
      date: '16th - 19th APRIL 2026',
      location: 'CENTRAL PARK, HULHUMALÉ, MALDIVES',
      logo: (
        <div className="flex flex-col items-center justify-center border-2 border-white/90 px-4 py-1.5 rounded-sm bg-white/5">
          <div className="text-center leading-none">
            <span className="text-xl font-black text-white tracking-widest font-sans block">
              BU<span className="border-b-2 border-yellow-300 pb-0.5">I</span>LD
            </span>
            <span className="text-xs font-black text-yellow-300 tracking-[0.35em] block mt-0.5">
              EXPO
            </span>
          </div>
          <div className="text-[8.5px] font-medium text-slate-200 mt-1 tracking-tight border-t border-white/20 pt-0.5">
            16TH - 19TH APRIL 2026 • HULHUMALÉ
          </div>
        </div>
      ),
    },
    {
      id: 'hosco',
      title: 'HOSCO',
      edition: 'HOTEL SUPPLY CONFERENCE',
      date: '7th JULY 2025',
      location: 'MALÉ, MALDIVES',
      logo: (
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-white tracking-wider font-sans">
              HOSC
            </span>
            <div className="relative inline-flex items-center justify-center">
              <span className="text-2xl font-black text-white tracking-wider font-sans">O</span>
              {/* Padlock / Arch Door Icon at top-right of O */}
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 absolute -top-1 -right-2 text-yellow-300" fill="currentColor">
                <path d="M4 6V4a4 4 0 1 1 8 0v2h1v8H3V6h1zm2 0h4V4a2 2 0 1 0-4 0v2z" />
              </svg>
            </div>
          </div>
          <div className="text-left border-l border-white/20 pl-2.5">
            <span className="text-[9px] font-bold text-yellow-300 tracking-wider block uppercase">
              HOTEL SUPPLY CONFERENCE
            </span>
            <span className="text-[9px] text-slate-300 block">
              7TH JULY 2025 • MALÉ, MALDIVES
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Row 2: Industry Focused Events (from 1st image)
  const industryEvents = [
    {
      id: 'aviation-forum',
      title: 'Aviation Forum - CONNECTING MALDIVES',
      edition: 'AVIATION SUMMIT',
      date: '12th MAY 2026',
      location: 'HOTEL JEN MALÉ',
      logo: (
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <span className="text-3xl font-black italic text-white tracking-tighter font-sans">
              A<span className="text-blue-200">F</span>
            </span>
            {/* Small airplane motif */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-yellow-300 absolute -top-1 -right-3" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className="text-left border-l border-white/20 pl-2.5">
            <span className="text-xs font-bold text-white tracking-wider block">
              Aviation Forum
            </span>
            <span className="text-[9px] font-semibold text-yellow-300 tracking-[0.2em] block uppercase">
              CONNECTING MALDIVES
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'mmif',
      title: 'MALDIVES MARINE INDUSTRY FORUM',
      edition: 'POLICY SUMMIT',
      date: 'ANNUAL EDITION',
      location: 'MALÉ, MALDIVES',
      logo: (
        <div className="flex items-center gap-3">
          {/* Wave crests with pearl emblem */}
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 80 32" className="w-14 h-6 text-white" fill="currentColor">
              <path d="M0 24 L10 10 L20 24 L30 8 L40 24 L50 6 L60 24 L70 12 L75 24 Z" />
              <circle cx="68" cy="8" r="4" fill="#FACC15" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-white tracking-wider block">
              MALDIVES MARINE
            </span>
            <span className="text-[9px] font-bold text-yellow-300 tracking-wider block">
              INDUSTRY FORUM
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'cif-2026',
      title: 'CONSTRUCTION INDUSTRY FORUM (CIF)',
      edition: 'MNACI & OOREDOO',
      date: '18th AUGUST 2026',
      location: 'ONE CENTRAL PARK, HULHUMALÉ',
      logo: (
        <div className="flex items-center gap-3">
          {/* Isometric building block emblem */}
          <div className="w-9 h-9 rounded-sm border-2 border-white/80 p-0.5 flex flex-col justify-between bg-white/10 rotate-[-8deg]">
            <div className="flex justify-between h-2 bg-yellow-300/80 rounded-xs" />
            <div className="flex justify-between h-2 bg-white/80 rounded-xs" />
            <div className="flex justify-between h-2 bg-blue-300/80 rounded-xs" />
          </div>
          <div className="text-left">
            <span className="text-sm font-black text-white tracking-wider block">
              CIF
            </span>
            <span className="text-[9px] font-bold text-slate-200 tracking-tight block uppercase">
              CONSTRUCTION INDUSTRY FORUM
            </span>
            <span className="text-[8.5px] font-mono text-yellow-300 block">
              www.cif.mv
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Quadruple items to ensure completely seamless infinite scrolling on all viewport sizes
  const quadRow1 = [...nationalExhibitions, ...nationalExhibitions, ...nationalExhibitions, ...nationalExhibitions];
  const quadRow2 = [...industryEvents, ...industryEvents, ...industryEvents, ...industryEvents];

  return (
    <section className="relative py-14 overflow-hidden bg-gradient-to-b from-[#0a1458] via-[#10229c] to-[#070b19] border-y border-blue-500/30 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-400 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <span className="text-[11px] font-bold tracking-[0.25em] text-yellow-400 uppercase">
          Official Portfolio of Flagship Events
        </span>
      </div>

      {/* ========================================================
          ROW 1: NATIONAL LEVEL EXHIBITIONS (Moving to LEFT)
          ======================================================== */}
      <div className="relative mb-12">
        {/* Suitable Heading with Yellow/Gold divider lines exactly as in 1st image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-grow h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400/60 to-yellow-400" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-yellow-300 whitespace-nowrap drop-shadow-sm">
              NATIONAL LEVEL EXHIBITIONS
            </h3>
            <div className="flex-grow h-[1.5px] bg-gradient-to-l from-transparent via-yellow-400/60 to-yellow-400" />
          </div>
        </div>

        {/* Marquee Track 1: Moving in direction 1 (Right to Left) */}
        <div className="relative w-full overflow-hidden flex mask-gradient-x">
          <div className="flex animate-marquee-left whitespace-nowrap gap-6 py-2">
            {quadRow1.map((item, idx) => (
              <div
                key={`row1-${idx}`}
                onClick={() => onSelectEvent?.(item.id)}
                className="flex-shrink-0 inline-flex items-center px-6 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 hover:border-yellow-300/70 transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer group hover:scale-[1.02]"
              >
                {item.logo}
                <div className="ml-4 pl-3 border-l border-white/20 text-slate-300 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-yellow-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          ROW 2: INDUSTRY FOCUSED EVENTS (Moving to RIGHT / Opposite Direction)
          ======================================================== */}
      <div className="relative">
        {/* Suitable Heading with Yellow/Gold divider lines exactly as in 1st image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-grow h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400/60 to-yellow-400" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-yellow-300 whitespace-nowrap drop-shadow-sm">
              INDUSTRY FOCUSED EVENTS
            </h3>
            <div className="flex-grow h-[1.5px] bg-gradient-to-l from-transparent via-yellow-400/60 to-yellow-400" />
          </div>
        </div>

        {/* Marquee Track 2: Moving in OPPOSITE direction (Left to Right) */}
        <div className="relative w-full overflow-hidden flex mask-gradient-x">
          <div className="flex animate-marquee-right whitespace-nowrap gap-6 py-2">
            {quadRow2.map((item, idx) => (
              <div
                key={`row2-${idx}`}
                onClick={() => onSelectEvent?.(item.id)}
                className="flex-shrink-0 inline-flex items-center px-6 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 hover:border-yellow-300/70 transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer group hover:scale-[1.02]"
              >
                {item.logo}
                <div className="ml-4 pl-3 border-l border-white/20 text-slate-300 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-yellow-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
