import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Send, CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { COMPANY_DETAILS, SERVICES_DATA } from '../data/websiteData';
import { EnquirySubmission } from '../types';
import { WEB3FORMS_KEY } from '../config';
import { trackEvent } from '../lib/analytics';
import { buildMailtoUrl, buildWhatsAppUrl, enquirySubject, formatEnquiryText, submitEnquiry } from '../lib/enquiry';

type SendState = 'idle' | 'sending' | 'sent' | 'failed';

const EMPTY_FORM: EnquirySubmission = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  service: 'Events & Turnkey Management',
  timeline: 'Q3/Q4 2026',
  budget: '',
  message: '',
};

export const EnquiryForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service');
  const prefilledEvent = searchParams.get('event');
  const [formData, setFormData] = useState<EnquirySubmission>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendState, setSendState] = useState<SendState>('idle');
  const isSubmitting = sendState === 'sending';
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Prefill from /contact?service= or ?event= (applied after mount so it matches the pre-rendered HTML)
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
        event: prefilledEvent,
        service: 'Flagship Expo Sponsorship / Booth',
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

    // Bots tick the hidden honeypot: show them a normal confirmation and send nothing
    if (honeypotRef.current?.checked) {
      setSendState('sent');
      return;
    }

    // Until MEDIUM's Web3Forms key is configured, enquiries go out over WhatsApp instead
    if (!WEB3FORMS_KEY) {
      trackEvent('whatsapp_click', { location: 'form' });
      window.open(whatsAppUrl, '_blank', 'noopener');
      return;
    }

    setSendState('sending');
    const result = await submitEnquiry(formData, WEB3FORMS_KEY, window.location.href);
    setSendState(result.ok ? 'sent' : 'failed');
    if (result.ok) trackEvent('generate_lead', { service: formData.service, event: formData.event ?? '' });
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSendState('idle');
  };

  // Pre-filled fallbacks so a lead is never lost when the form can't be delivered
  const enquiryText = formatEnquiryText(formData);
  const whatsAppUrl = buildWhatsAppUrl(COMPANY_DETAILS.whatsapp, enquiryText);
  const mailtoUrl = buildMailtoUrl(COMPANY_DETAILS.inquiryEmail, enquirySubject(formData), enquiryText);
  const requireValid = (e: React.MouseEvent) => {
    if (!validate()) e.preventDefault();
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
                    onClick={() => trackEvent('contact_click', { method: 'phone' })}
                    className="text-xs font-bold text-white hover:text-blue-300 transition-colors block mt-1"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                  <span className="text-[11px] text-slate-400 block">
                    Alt: {COMPANY_DETAILS.secondaryPhone}
                  </span>
                  <a
                    href={buildWhatsAppUrl(COMPANY_DETAILS.whatsapp, "Hi MEDIUM, I'd like to make an enquiry.")}
                    onClick={() => trackEvent('whatsapp_click', { location: 'contact_page' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp ({COMPANY_DETAILS.whatsapp})</span>
                  </a>
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
                    onClick={() => trackEvent('contact_click', { method: 'email' })}
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
                {sendState === 'sent' ? (
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
                      <h3 className="text-2xl font-extrabold text-white">
                        Enquiry Sent
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                        Thanks, {formData.fullName}. MEDIUM will be in touch within 1 business day.
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
                    {/* Honeypot: hidden from people, bots fill it in and Web3Forms discards the submission */}
                    <div aria-hidden="true" className="hidden">
                      <input ref={honeypotRef} type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
                    </div>

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

                    {sendState === 'failed' && (
                      <div role="alert" className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 space-y-3">
                        <p className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px text-red-400" />
                          <span>We couldn't send your enquiry just now. Your details are still here — send them another way:</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={whatsAppUrl}
                            onClick={() => trackEvent('whatsapp_click', { location: 'fallback' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-[#1faa53] hover:bg-[#25D366] transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Send on WhatsApp instead</span>
                          </a>
                          <a
                            href={mailtoUrl}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-white/10 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Send by email instead</span>
                          </a>
                        </div>
                      </div>
                    )}

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
                            <span>Sending Enquiry...</span>
                          </>
                        ) : WEB3FORMS_KEY ? (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Enquiry to MEDIUM</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4" />
                            <span>Send via WhatsApp</span>
                          </>
                        )}
                      </motion.button>
                      {!WEB3FORMS_KEY && (
                        <a
                          href={mailtoUrl}
                          onClick={requireValid}
                          className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send by email instead</span>
                        </a>
                      )}
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
