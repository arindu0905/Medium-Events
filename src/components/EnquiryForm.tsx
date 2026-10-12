import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { COMPANY_DETAILS, SERVICES_DATA } from '../data/websiteData';
import { EnquirySubmission } from '../types';

interface EnquiryFormProps {
  prefilledService?: string;
  prefilledEvent?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ prefilledService, prefilledEvent }) => {
  const [formData, setFormData] = useState<EnquirySubmission>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    service: 'Events & Turnkey Management',
    timeline: 'Q3/Q4 2026',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Handle prefilled service or event
  useEffect(() => {
    if (prefilledService) {
      const match = SERVICES_DATA.find((s) => s.id === prefilledService);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          service: match.title,
          message: prev.message || `Requesting details & proposal for ${match.title}.`,
        }));
      }
    }
    if (prefilledEvent) {
      setFormData((prev) => ({
        ...prev,
        service: 'Events & Turnkey Management',
        message: prev.message || `Inquiry regarding sponsorship / exhibition participation for: ${prefilledEvent}.`,
      }));
    }
  }, [prefilledService, prefilledEvent]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format (e.g. name@company.mv).';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide a contact phone or mobile number.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide project details (minimum 10 characters).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable dispatch with state feedback
    await new Promise((resolve) => setTimeout(resolve, 900));

    const ref = `MED-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(ref);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      service: 'Events & Turnkey Management',
      timeline: 'Q3/Q4 2026',
      budget: '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="enquiry" className="relative py-24 bg-[#070b19] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#12229D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact details & credibility */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              >
                Direct Collaboration
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Let’s Bring Your Vision Into Action
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed"
              >
                Whether you represent an industry association planning a flagship convention, or a brand requiring calculated advertising in the Maldives, our executive team is ready to assist.
              </motion.p>
            </div>

            {/* Direct Contact Pillars */}
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-white/08 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 block">
                    Headquarters Office
                  </span>
                  <p className="text-xs text-slate-200 mt-1 leading-snug">
                    {COMPANY_DETAILS.address}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Branch: {COMPANY_DETAILS.altAddress}
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/08 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 block">
                    Direct Hotlines
                  </span>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-xs font-bold text-white hover:text-blue-300 transition-colors block mt-1"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                  <span className="text-[11px] text-slate-400 block">
                    Alt: {COMPANY_DETAILS.secondaryPhone}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/08 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 block">
                    Operations Email
                  </span>
                  <a
                    href={`mailto:${COMPANY_DETAILS.email}`}
                    className="text-xs font-bold text-white hover:text-blue-300 transition-colors block mt-1"
                  >
                    {COMPANY_DETAILS.email}
                  </a>
                  <span className="text-[11px] text-slate-400 block">
                    General: {COMPANY_DETAILS.inquiryEmail}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/08 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#12229D]/50 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 block">
                    Operational Hours
                  </span>
                  <p className="text-xs text-slate-200 mt-1">
                    Sunday – Thursday: 09:00 – 17:00 (MVT)
                  </p>
                  <span className="text-[11px] text-slate-400 block">
                    Emergency operations 24/7 during live expo & forum days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8 text-blue-400" />
                    </div>

                    <div>
                      <span className="inline-block px-3 py-1 rounded bg-[#091129] border border-blue-500/30 text-xs font-mono text-blue-300 font-semibold mb-2">
                        Ref #{referenceId}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white">
                        Enquiry Received Successfully
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                        Thank you, <strong className="text-white">{formData.fullName}</strong>. Your project brief has been routed to MEDIUM Operations ({COMPANY_DETAILS.email}). A dedicated director will review your specifications and contact you shortly.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-white/06 text-left max-w-md mx-auto text-xs space-y-1.5 text-slate-300">
                      <div><strong className="text-white">Organization:</strong> {formData.company || 'Not specified'}</div>
                      <div><strong className="text-white">Service:</strong> {formData.service}</div>
                      <div><strong className="text-white">Contact:</strong> {formData.email} • {formData.phone}</div>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-4">
                      <button
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] transition-colors cursor-pointer border border-blue-400/40"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="border-b border-white/08 pb-4">
                      <h3 className="text-xl font-bold text-white">
                        Official Project & Event Enquiry Form
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Please provide project parameters. Required fields are marked with an asterisk (*).
                      </p>
                    </div>

                    {/* Full Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Ibrahim Rasheed"
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.fullName
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/12 focus:border-blue-400'
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Organization / Company
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Maldivian Enterprise / Resort"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border border-white/12 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@organization.mv"
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/12 focus:border-blue-400'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Contact Phone / Mobile *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+960 770-0000"
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.phone
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/12 focus:border-blue-400'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Service Category & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Service Category *
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border border-white/12 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                        >
                          <option value="Events & Turnkey Management">Events & Turnkey Management</option>
                          <option value="Flagship Expo Sponsorship / Booth">Flagship Expo Sponsorship / Booth</option>
                          <option value="Advertising & Marketing">Advertising & Marketing (Analytics)</option>
                          <option value="Design & Applications">Design & Applications (3D & Video)</option>
                          <option value="Creative Consultancy">Creative Consultancy</option>
                          <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Target Timeline / Schedule
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border border-white/12 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                        >
                          <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                          <option value="Q3/Q4 2026">Q3/Q4 2026</option>
                          <option value="2027 Annual Cycle">2027 Annual Cycle</option>
                          <option value="Exploratory / Advisory">Exploratory / Advisory</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Brief / Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Project Brief & Requirements *
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {formData.message.length} characters
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your event scope, estimated delegate count, campaign goals, or specific booth requirements..."
                        className={`w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.message
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/12 focus:border-blue-400'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#12229D] to-[#1A38C9] hover:from-[#1629b3] hover:to-[#2244e6] shadow-lg shadow-blue-950/70 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-blue-400/40 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Transmitting Brief to Operations...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Enquiry to MEDIUM Operations</span>
                          </>
                        )}
                      </motion.button>
                      <p className="text-center text-[11px] text-slate-400 mt-2.5">
                        All project communications are held in strict commercial confidence.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
