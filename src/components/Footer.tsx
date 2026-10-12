import React from 'react';
import { ArrowUp, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from './Logo';
import { pathFor } from '../routes';
import { COMPANY_DETAILS, SERVICES_DATA } from '../data/websiteData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050814] border-t border-white/08 text-slate-300 overflow-hidden">
      {/* Top Footer Tier */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info with 3rd image mark and 4th image wordmark */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={scrollToTop}
              className="text-left focus:outline-none cursor-pointer"
            >
              <Logo variant="full" />
            </button>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              MEDIUM Events Pvt Ltd is a turnkey creative and event management firm in the Maldives. Operating with over 60 years of combined industry experience across national expos, strategic forums, and analytics-driven marketing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={COMPANY_DETAILS.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-white/08 hover:border-blue-400/50 hover:bg-blue-950/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Official Facebook: Medium Events Pvt Ltd"
                title="Follow on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_DETAILS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-white/08 hover:border-blue-400/50 hover:bg-blue-950/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Official Instagram: @medium_mv"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_DETAILS.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-white/08 hover:border-blue-400/50 hover:bg-blue-950/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Official LinkedIn: Medium Events Pvt Ltd"
                title="Follow on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to={pathFor('home')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={pathFor('services')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to={pathFor('events')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Flagship Events
                </Link>
              </li>
              <li>
                <Link
                  to={pathFor('about')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  About & Pedigree
                </Link>
              </li>
              <li>
                <Link
                  to={pathFor('news')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Info Center & News
                </Link>
              </li>
              <li>
                <Link
                  to={pathFor('contact')}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Project Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Core Services
            </p>
            <ul className="space-y-2 text-xs">
              {SERVICES_DATA.map((srv) => (
                <li key={srv.id}>
                  <Link
                    to={pathFor('services')}
                    className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters & Operations */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Headquarters
            </p>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{COMPANY_DETAILS.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`tel:${COMPANY_DETAILS.officePhone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DETAILS.officePhone} <span className="text-slate-500">(Office)</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DETAILS.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="border-t border-white/06 py-6 bg-[#03060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} MEDIUM Events Pvt Ltd. All Rights Reserved. Malé, Republic of Maldives.
          </div>

          <div className="flex items-center gap-6">
            <span>Official Portal: medium.mv</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
