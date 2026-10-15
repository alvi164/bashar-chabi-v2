import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo.tsx';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();

  const dhakaAreas = [
    'মিরপুর (Mirpur)',
    'উত্তরা (Uttara)',
    'ধানমন্ডি (Dhanmondi)',
    'বাড্ডা (Badda)',
    'মোহাম্মদপুর (Mohammadpur)',
    'গুলশান (Gulshan)',
    'বনানী (Banani)',
    'রামপুরা (Rampura)',
    'বসুন্ধরা আ/এ (Bashundhara R/A)',
  ];

  return (
    <footer className="bg-[#FAF9F5] border-t border-[#E8E6DF] pt-12 pb-24 md:pb-12 mt-16 text-[#4A5550]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E8E6DF]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="md" showSubtitle />
            <p className="text-xs text-[#738079] leading-relaxed pt-1">
              {t.brandDescription}
            </p>
            <p className="text-[11px] text-[#0F4C3A] font-semibold bg-[#E8F2EE] inline-block px-2.5 py-1 rounded-md">
              {t.dhakaCoverage}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#192420]">
              {language === 'bn' ? 'প্রধান সংযোগ' : 'Explore'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="hover:text-[#0F4C3A] transition-colors">
                  {t.navProperties}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#0F4C3A] transition-colors">
                  {t.navServices}
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#0F4C3A] transition-colors">
                  {t.navSafety}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0F4C3A] transition-colors">
                  {t.navAbout}
                </Link>
              </li>
            </ul>
          </div>

          {/* Dhaka Residential Areas */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#192420]">
              {language === 'bn' ? 'ঢাকার আবাসিক এলাকাসমূহ' : 'Dhaka Residential Areas'}
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs text-[#738079]">
              {dhakaAreas.map((area) => (
                <span
                  key={area}
                  className="bg-white border border-[#E8E6DF] px-2 py-0.5 rounded text-[11px]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#192420]">
              {language === 'bn' ? 'আইন ও শর্তাবলী' : 'Legal & Trust'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/safety" className="hover:text-[#0F4C3A] transition-colors">
                  {t.navSafety}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#0F4C3A] transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#0F4C3A] transition-colors">
                  {t.termsAndConditions}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#738079]">
          <p>© {new Date().getFullYear()} Bashar Chabi (বাসার চাবি). {t.allRightsReserved}</p>
          <p className="text-[11px] text-[#A8A49C]">
            {language === 'bn'
              ? 'প্রাথমিক পাইলট সংস্করণ • ঢাকা, বাংলাদেশ'
              : 'Pilot MVP Edition • Dhaka, Bangladesh'}
          </p>
        </div>
      </div>
    </footer>
  );
};
