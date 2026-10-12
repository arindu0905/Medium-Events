import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { NEWS_ARTICLES_DATA } from '../data/websiteData';
import { NewsArticle } from '../types';
import { NewsModal } from './NewsModal';

interface NewsSectionProps {
  onEnquire: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onEnquire }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Expos & Forums' | 'Company News' | 'Press Releases'>('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const filteredNews = NEWS_ARTICLES_DATA.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  return (
    <section id="info-center" className="relative py-24 bg-[#080d22]/90 border-t border-white/06">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            >
              Info Center
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            >
              News, Expo Bulletins & Press Releases
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 text-slate-300 text-base leading-relaxed"
            >
              Stay informed with official updates regarding upcoming forum schedules, institutional appointments, and key Maldivian market happenings.
            </motion.p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Expos & Forums', 'Company News', 'Press Releases'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#12229D] text-white shadow-md border border-blue-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/06'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/08 hover:border-blue-400/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Article Image with gentle zoom */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d22] via-[#080d22]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#12229D]/90 text-[10px] font-bold uppercase tracking-wider text-white border border-blue-400/30 backdrop-blur-md shadow">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-2 mb-2.5">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full pt-3 border-t border-white/06 flex items-center justify-between text-xs font-semibold text-blue-300 hover:text-white transition-colors cursor-pointer group-hover:translate-x-0.5 duration-200"
                >
                  <span>Read Full Release</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onEnquire={onEnquire}
      />
    </section>
  );
};
