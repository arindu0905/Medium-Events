import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Target, Users2, Workflow, CheckCircle2, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      title: '60+ Years Combined Expertise',
      icon: Users2,
      subtitle: 'Seasoned directors with over 15 years individual specialization',
      description:
        'MEDIUM’s leadership brings together over six decades of cumulative professional experience across Maldivian media, corporate advertising, conference production, and exhibition engineering. Every engagement is guided directly by senior practitioners with deep market understanding.',
      points: [
        'Multi-disciplinary leadership covering creative, technical, and commercial domains',
        'Proven history of navigating complex island logistics and maritime staging',
        'Long-term client relationships anchored in sustainable business growth',
      ],
    },
    {
      title: 'Calculated Analytics & Quality Standards',
      icon: Target,
      subtitle: 'Creatively productive ideas grounded in measurable performance',
      description:
        'We believe creativity must yield concrete business outcomes. Whether structuring corporate advertising or setting delegate agendas for international forums, our strategies are built upon analytics, metrics, and rigorous quality control.',
      points: [
        'Data-backed audience profiling and niche industry targeting',
        'Transparent reporting and return-on-investment benchmarking',
        'Zero-compromise audiovisual, spatial, and print production standards',
      ],
    },
    {
      title: 'Turnkey Protocol & Nationwide Execution',
      icon: Workflow,
      subtitle: 'From concept to tear-down: single point of accountability',
      description:
        'MEDIUM handles the entire project lifecycle. We coordinate with ministries, trade associations, international delegations, venue authorities, and technical crews to guarantee seamless turnkey delivery.',
      points: [
        'Comprehensive ministerial and association endorsement protocol',
        'End-to-end stagecraft, lighting, sound, and live broadcast infrastructure',
        'Dedicated VIP liaison and protocol management for high-level dignitaries',
      ],
    },
    {
      title: 'Institutional Trust & Endorsements',
      icon: ShieldCheck,
      subtitle: 'The chosen partner for the Maldives’ flagship industry bodies',
      description:
        'As general members of the National Boating Association of Maldives (NBAM) and trusted partners of MNACI, Ooredoo, and Maldives Publications, we are honored to manage the nation’s highest-profile public and private gatherings.',
      points: [
        'Organizers of the official Maldives Marine Expo for NBAM',
        'Curators of the National Construction Industry Forum (CIF 2026)',
        'Appointed by Maldives Publications for the official Visiting Guide',
      ],
    },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          >
            Credibility & Provenance
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            The Standard for Maldivian Creative & Event Excellence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
          >
            Built on over 60 years of combined industry insight, MEDIUM Events Pvt Ltd is driven by quality, strategic clarity, and an uncompromising commitment to our clients' success.
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Tab list */}
          <div className="lg:col-span-5 space-y-3">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 cursor-pointer flex items-start gap-4 border ${
                    isActive
                      ? 'glass-panel bg-[#12229D]/30 border-blue-400/60 shadow-lg shadow-blue-950/40'
                      : 'bg-slate-950/40 border-white/06 hover:border-white/12 hover:bg-slate-900/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#12229D] text-white border border-blue-400/50'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {pillar.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-2xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#12229D]/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
                    Core Pillar {activeTab + 1} of {pillars.length}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    {pillars[activeTab].title}
                  </h3>

                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-6">
                    {pillars[activeTab].subtitle}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed mb-8">
                    {pillars[activeTab].description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/08">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      Key Structural Advantages:
                    </p>
                    {pillars[activeTab].points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight pill */}
                  <div className="mt-8 pt-6 border-t border-white/08 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span>Turnkey Operations Based in Malé, Maldives</span>
                    </div>
                    <span className="text-xs font-bold text-white">
                      Operations@medium.mv
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
