import React from 'react';
import { motion } from 'motion/react';
import { COMPANY_DETAILS, CLIENT_PARTNERS } from '../data/websiteData';

export const StatsBar: React.FC = () => {
  return (
    <div className="relative z-20 border-y border-white/08 bg-[#091026]/80 backdrop-blur-md py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/08">
          {COMPANY_DETAILS.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center px-4 ${idx > 0 ? 'pt-6 md:pt-0' : ''}`}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 font-sans tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-2">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 max-w-[200px]">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partners Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-white/06"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mb-6">
            Institutional Partners & Endorsing Associations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium text-slate-300">
            {CLIENT_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/06 hover:border-blue-400/40 transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-slate-200">{partner.name}</span>
                <span className="text-[10px] text-slate-400 border-l border-white/10 pl-2">
                  {partner.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
