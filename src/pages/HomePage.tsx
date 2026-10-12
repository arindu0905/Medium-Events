import React from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/Hero';
import { EventMarquee } from '../components/EventMarquee';
import { StatsBar } from '../components/StatsBar';
import { PastEventsSection } from '../components/PastEventsSection';
import { useMarqueeEventModal } from '../hooks/useMarqueeEventModal';
import { pathFor } from '../routes';

export default function HomePage() {
  const { onSelectEvent, modal } = useMarqueeEventModal();
  return (
    <>
      <div>
          {/* Hero */}
          <Hero />
      
          {/* 1st Image Details: Two Rows Moving in Opposite Directions under Suitable Headings */}
          <EventMarquee onSelectEvent={onSelectEvent} />
      
          {/* Experience & Credibility Metrics */}
          <StatsBar />
      
          {/* Latest delivered events (from the official Facebook page) */}
          <PastEventsSection limit={3} />
      
          {/* Quick Pathways to Separated Pages */}
          <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400 mb-2.5 block">
                Capabilities & Portfolios
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Explore MEDIUM in Detail
              </h2>
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to={pathFor('services')}
                className="block glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-2">
                  Core Services
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  Events, Advertising & Design
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Analytics-driven marketing, creative consultancy, and turnkey event staging in the Maldives.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore All Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
      
              <Link
                to={pathFor('events')}
                className="block glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300 block mb-2">
                  Flagship Expos
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  National Expos & Industry Forums
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Maldives Marine Expo, Construction Industry Forum CIF 2026, Build Expo, and MMIF.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Flagship Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
      
              <Link
                to={pathFor('contact')}
                className="block glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-2">
                  Direct Collaboration
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  Submit Your Project Brief
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Reach MEDIUM Operations directly in Malé for sponsorship, booth bookings, or corporate campaigns.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Project Enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </div>
      {modal}
    </>
  );
}
