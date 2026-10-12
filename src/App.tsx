import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventMarquee } from './components/EventMarquee';
import { StatsBar } from './components/StatsBar';
import { ServicesSection } from './components/ServicesSection';
import { EventsSection } from './components/EventsSection';
import { PastEventsSection } from './components/PastEventsSection';
import { AboutSection } from './components/AboutSection';
import { NewsSection } from './components/NewsSection';
import { EnquiryForm } from './components/EnquiryForm';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { EventModal } from './components/EventModal';
import { FLAGSHIP_EVENTS_DATA } from './data/websiteData';
import { FlagshipEvent } from './types';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [prefilledService, setPrefilledService] = useState<string | undefined>();
  const [prefilledEvent, setPrefilledEvent] = useState<string | undefined>();
  const [marqueeModalEvent, setMarqueeModalEvent] = useState<FlagshipEvent | null>(null);

  // Navigate to separated page view and sync browser URL hash
  const navigateToSection = useCallback((sectionId: string, updateHash: boolean = true) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash && window.location.hash !== `#${sectionId}`) {
      window.history.pushState(null, '', `#${sectionId}`);
    }
  }, []);

  // Handle URL hash on initial load and browser back/forward popstate
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'services', 'events', 'about', 'info-center', 'enquiry'].includes(hash)) {
        setActiveSection(hash);
      }
    };

    if (window.location.hash) {
      setTimeout(handleHash, 100);
    }

    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  const handleSelectService = (serviceId: string) => {
    setPrefilledService(serviceId);
    navigateToSection('enquiry');
  };

  const handleEnquireEvent = (eventTitle: string) => {
    setPrefilledEvent(eventTitle);
    navigateToSection('enquiry');
  };

  const handleMarqueeSelect = (eventId: string) => {
    const matched = FLAGSHIP_EVENTS_DATA.find((e) => e.id === eventId);
    if (matched) {
      setMarqueeModalEvent(matched);
    } else {
      navigateToSection('events');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Upgraded Sticky Navbar with Royal Blue Theme */}
      <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

      {/* Main Content Area - Separated Page View by Default */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* PAGE 1: HOME */}
            {activeSection === 'home' && (
              <div>
                {/* Hero */}
                <Hero onNavigate={navigateToSection} />

                {/* 1st Image Details: Two Rows Moving in Opposite Directions under Suitable Headings */}
                <EventMarquee onSelectEvent={handleMarqueeSelect} />

                {/* Experience & Credibility Metrics */}
                <StatsBar />

                {/* Latest delivered events (from the official Facebook page) */}
                <PastEventsSection limit={3} onViewAll={() => navigateToSection('events')} />

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
                    <div
                      onClick={() => navigateToSection('services')}
                      className="glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
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
                    </div>

                    <div
                      onClick={() => navigateToSection('events')}
                      className="glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
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
                    </div>

                    <div
                      onClick={() => navigateToSection('enquiry')}
                      className="glass-card p-7 rounded-2xl border border-white/08 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg"
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
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* PAGE 2: SERVICES */}
            {activeSection === 'services' && (
              <div className="pt-20">
                <ServicesSection onSelectService={handleSelectService} />
              </div>
            )}

            {/* PAGE 3: FLAGSHIP EVENTS */}
            {activeSection === 'events' && (
              <div className="pt-20">
                {/* Moving Ticker under header */}
                <EventMarquee onSelectEvent={handleMarqueeSelect} />
                <EventsSection onEnquireEvent={handleEnquireEvent} />
                <PastEventsSection />
              </div>
            )}

            {/* PAGE 4: ABOUT & CREDIBILITY */}
            {activeSection === 'about' && (
              <div className="pt-20">
                <StatsBar />
                <AboutSection />
              </div>
            )}

            {/* PAGE 5: INFO CENTER / NEWS */}
            {activeSection === 'info-center' && (
              <div className="pt-20">
                <NewsSection onEnquire={() => navigateToSection('enquiry')} />
              </div>
            )}

            {/* PAGE 6: ENQUIRY */}
            {activeSection === 'enquiry' && (
              <div className="pt-20">
                <EnquiryForm prefilledService={prefilledService} prefilledEvent={prefilledEvent} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Event Details Modal triggered from Marquee */}
      <EventModal
        event={marqueeModalEvent}
        onClose={() => setMarqueeModalEvent(null)}
        onEnquire={handleEnquireEvent}
      />

      {/* Footer */}
      <Footer onNavigate={navigateToSection} />
    </div>
  );
}
