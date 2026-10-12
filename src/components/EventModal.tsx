import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { FlagshipEvent } from '../types';

interface EventModalProps {
  event: FlagshipEvent | null;
  onClose: () => void;
  onEnquire: (eventTitle: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onEnquire }) => {
  if (!event) return null;

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
          className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/12 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Image Banner with Mask */}
          <div className="relative h-60 w-full overflow-hidden flex-shrink-0">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/60 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-2.5 py-1 rounded bg-[#12229D] text-white text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-400/40">
                {event.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {event.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {event.tagline}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/06 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Schedule</span>
                  <span className="font-semibold text-white">{event.dateOrFrequency}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Venue</span>
                  <span className="font-semibold text-white truncate max-w-[150px]">{event.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
                <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Scale</span>
                  <span className="font-semibold text-white">{event.attendees}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-2">
                Executive Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Role & Endorsements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/06">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  MEDIUM Mandate & Role
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  {event.role}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/06">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Official Endorsements
                </span>
                <div className="space-y-1">
                  {event.endorsements.map((end, idx) => (
                    <span key={idx} className="text-xs text-slate-300 block">
                      • {end}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Event Highlights */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-3">
                Key Event Dimensions & Program Highlights
              </h4>
              <div className="space-y-2.5">
                {event.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-white/08 bg-[#070b19] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Inquire regarding exhibition booths, sponsorship, or VIP passes.
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEnquire(event.name);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-lg transition-colors cursor-pointer shadow-sm border border-blue-400/30"
              >
                <span>Enquire as Sponsor / Exhibitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
