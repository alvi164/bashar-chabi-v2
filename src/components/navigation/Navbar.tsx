import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo.tsx';
import { PWAInstallPrompt } from '../common/PWAInstallPrompt.tsx';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  const { currentUser, userProfile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/properties', label: t.navProperties },
    { to: '/services', label: t.navServices },
    { to: '/safety', label: t.navSafety },
    { to: '/about', label: t.navAbout },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="focus-visible:ring-2 focus-visible:ring-[#0F4C3A] rounded-xl outline-none shrink-0"
          aria-label={language === 'bn' ? 'বাসার চাবি হোমপেজ' : 'Bashar Chabi Homepage'}
        >
          <Logo size="md" />
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A5550]"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0F4C3A] py-1 border-b-2 ${
                isActive(link.to)
                  ? 'border-[#0F4C3A] text-[#0F4C3A] font-semibold'
                  : 'border-transparent text-[#4A5550]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-md hover:bg-[#FDE68A] transition-colors"
            >
              {language === 'bn' ? 'এডমিন' : 'Admin'}
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions (Language Switch + PWA + User/Login) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* In-app PWA install button */}
          <div className="hidden sm:block">
            <PWAInstallPrompt compact />
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="min-h-[38px] px-2.5 sm:px-3 py-1 rounded-xl border border-[#D8D5CD] bg-white hover:bg-[#F3F1EB] text-xs font-semibold text-[#192420] transition-colors cursor-pointer flex items-center gap-1 select-none focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
            aria-label={
              language === 'bn'
                ? 'Switch language to English'
                : 'ভাষা পরিবর্তন করে বাংলায় দেখুন'
            }
          >
            <span className={language === 'bn' ? 'text-[#0F4C3A] font-bold' : 'text-[#738079]'}>
              বাংলা
            </span>
            <span className="text-[#D8D5CD]">/</span>
            <span className={language === 'en' ? 'text-[#0F4C3A] font-bold' : 'text-[#738079]'}>
              EN
            </span>
          </button>

          {/* User Profile or Login */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-xl border border-[#D8D5CD] bg-white hover:bg-[#FAF9F5] text-xs font-semibold text-[#192420] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center text-[10px] font-bold">
                  {(userProfile?.displayName || currentUser.displayName || 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">
                  {userProfile?.displayName || currentUser.displayName || 'Dashboard'}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#738079] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                title={t.navLogout}
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center min-h-[38px] px-4 py-1.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0B3A2C] text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
            >
              {t.navLogin}
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#192420] hover:bg-[#F3F1EB] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E6DF] bg-white px-4 py-4 space-y-2 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-[#E8F2EE] text-[#0F4C3A] font-semibold'
                  : 'text-[#4A5550] hover:bg-[#FAF9F5]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-[#D97706] bg-[#FEF3C7]"
            >
              {language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Panel'}
            </Link>
          )}
          <div className="pt-2 border-t border-[#F3F1EB] flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-[#0F4C3A] text-white text-sm font-medium"
                >
                  {t.navDashboard}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full min-h-[40px] text-xs font-medium text-[#DC2626]"
                >
                  {t.navLogout}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-[#0F4C3A] text-white text-sm font-medium"
              >
                {t.navLogin}
              </Link>
            )}
            <div className="pt-1 flex justify-center">
              <PWAInstallPrompt />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
