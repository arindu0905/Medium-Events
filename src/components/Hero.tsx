import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Award, Anchor, Building2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Royal Blue Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#12229D]/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[110px]" />

        {/* Hero Image Mask Layer with controlled subtle scale transition */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80')`,
            filter: 'grayscale(25%) brightness(0.65)',
          }}
        />

        {/* Linear overlay gradient for maximum text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/90 via-[#070b19]/80 to-[#070b19]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        {/* Note: The 2nd image pill badge has been removed per instruction 5 */}

        {/* Main Heading Text Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]"
        >
          Creating <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">Lasting Impressions</span> Through Vision & Scale
        </motion.h1>

        {/* Description Fade and Translate */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          With over <strong className="text-white font-semibold">60 years of combined industry expertise</strong>, MEDIUM orchestrates national flagship expos, analytics-driven advertising campaigns, and turnkey creative production in the Maldives.
        </motion.p>

        {/* Action Buttons Staggered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('events')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-xl shadow-lg shadow-blue-950/60 transition-all cursor-pointer border border-blue-400/30"
          >
            <span>Explore Flagship Events</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('enquiry')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer border border-white/10 backdrop-blur-md"
          >
            <span>Submit Project Enquiry</span>
          </motion.button>
        </motion.div>

        {/* Supporting Visual Elements: Quick Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="glass-card p-4 rounded-xl border border-white/08 hover:border-blue-400/40 transition-colors flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">Flagship Marine Expo</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">Organizers of the official Maldives Marine Expo for NBAM.</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/08 hover:border-blue-400/40 transition-colors flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">CIF 2026 & Build Expo</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">Endorsed by MNACI with Ooredoo Maldives partnership.</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/08 hover:border-blue-400/40 transition-colors flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">60+ Years Combined</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">Deep Maldivian market pedigree & quality-driven results.</p>
            </div>
          </div>
        </motion.div>

        {/* Down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={() => onNavigate('events')}
            className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer animate-bounce"
            aria-label="Scroll down to exhibitions"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
