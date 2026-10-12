import React from 'react';
import { motion } from 'motion/react';
import { CalendarDays, TrendingUp, Palette, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '../data/websiteData';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarDays':
        return <CalendarDays className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      default:
        return <CalendarDays className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

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
            Full-Suite Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Specialized Services Built for Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
          >
            From national-scale expositions to data-driven commercial marketing and bespoke brand systems, MEDIUM translates visionary concepts into seamless execution.
          </motion.p>
        </div>

        {/* Services Grid (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-8 border border-white/08 hover:border-blue-400/40 transition-all duration-300 group relative flex flex-col justify-between"
            >
              <div>
                {/* Header of card with icon and stat badge */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#12229D]/80 to-[#0A1244] border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-md">
                    {getIcon(service.icon)}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white block">
                      {service.stat}
                    </span>
                    <span className="text-[11px] font-medium text-blue-300 uppercase tracking-wider block">
                      {service.statLabel}
                    </span>
                  </div>
                </div>

                {/* Sub-tagline quote */}
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1.5">
                  "{service.tagline}"
                </p>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                  {service.title}
                </h3>

                {/* Body description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 pt-4 border-t border-white/08 mb-8">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/06 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 hover:text-white transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
                >
                  <span>Request Proposal for {service.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
