import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_DETAILS } from '../data/websiteData';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'events', label: 'Flagship Events' },
  { id: 'about', label: 'About & Credibility' },
  { id: 'info-center', label: 'Info Center' },
  { id: 'enquiry', label: 'Enquiry' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-lg shadow-black/50 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo link: 3rd image mark + 4th image transparent wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-95 cursor-pointer"
            aria-label="MEDIUM EVENTS Home"
          >
            <Logo variant="full" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>

                  {/* Active Indicator Line in Royal/Electric Blue */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-300 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover micro-interaction */}
                  <span className="absolute inset-0 rounded-md bg-white/0 hover:bg-white/[0.05] transition-colors pointer-events-none" />
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition-colors"
              title="Call MEDIUM Operations"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick('enquiry')}
              className="relative inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-lg shadow-sm shadow-blue-950/60 transition-all duration-200 cursor-pointer border border-blue-400/30"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass-panel border-t border-white/10 overflow-hidden mt-3 shadow-2xl"
          >
            <div className="px-5 pt-3 pb-6 space-y-2">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-950/70 text-blue-300 border border-blue-700/50'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                  </motion.button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-white/10 space-y-2">
                <a
                  href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.04]"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>Call: {COMPANY_DETAILS.phone}</span>
                </a>
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.04]"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{COMPANY_DETAILS.email}</span>
                </a>
                <button
                  onClick={() => handleNavClick('enquiry')}
                  className="w-full mt-2 py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#12229D] hover:bg-[#1a38c9] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Submit Project Enquiry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
