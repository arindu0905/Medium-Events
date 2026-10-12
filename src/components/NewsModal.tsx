import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onEnquire: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose, onEnquire }) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/12 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/60 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-2.5 py-1 rounded bg-[#12229D] text-white text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-400/40">
                {article.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {article.title}
              </h3>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-white/08">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {article.readTime}
              </span>
            </div>

            <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
              {article.fullContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-white/08">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Related Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/08 text-slate-300"
                  >
                    <Tag className="w-3 h-3 text-blue-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-6 border-t border-white/08 bg-[#070b19] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              MEDIUM Communications Division
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-white/10 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEnquire();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-lg cursor-pointer border border-blue-400/30"
              >
                <span>Press Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
