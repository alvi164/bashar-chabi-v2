import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { ServiceCard } from '../../components/services/ServiceCard.tsx';
import { ALLOWED_SERVICE_CATEGORIES } from '../../utils/validation.ts';
import { Button } from '../../components/common/Button.tsx';

export const LandingPage: React.FC = () => {
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Mirpur');
  const [propertyType, setPropertyType] = useState('apartment');

  const popularAreas = [
    { id: 'mirpur', bn: 'মিরপুর', en: 'Mirpur' },
    { id: 'uttara', bn: 'উত্তরা', en: 'Uttara' },
    { id: 'dhanmondi', bn: 'ধানমন্ডি', en: 'Dhanmondi' },
    { id: 'badda', bn: 'বাড্ডা', en: 'Badda' },
    { id: 'mohammadpur', bn: 'মোহাম্মদপুর', en: 'Mohammadpur' },
    { id: 'gulshan', bn: 'গুলশান', en: 'Gulshan' },
    { id: 'banani', bn: 'বনানী', en: 'Banani' },
    { id: 'bashundhara', bn: 'বসুন্ধরা আ/এ', en: 'Bashundhara R/A' },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?area=${encodeURIComponent(selectedArea)}&type=${encodeURIComponent(propertyType)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        <div className="bg-[#FAF9F5] rounded-3xl border border-[#E8E6DF] p-6 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle brand tint background */}
          <div className="max-w-3xl space-y-6">
            {/* Pill-free Editorial Lead */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0F4C3A] uppercase">
              {language === 'bn' ? 'ঢাকা কেন্দ্রিক রেন্টাল ও হোম সার্ভিস প্ল্যাটফর্ম' : 'Dhaka-First Rental & Home Services'}
            </p>

            {/* Primary Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#192420] tracking-tight text-balance leading-tight">
              {language === 'bn' ? 'বাসার চাবি, এখন আপনার হাতে' : 'Your next home is closer than you think.'}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4A5550] leading-relaxed max-w-2xl">
              {language === 'bn'
                ? 'যাচাই করা ভাড়ার বাসা খুঁজুন, সহজে ভিজিট বুক করুন এবং প্রয়োজনীয় বাসার সেবা নিন।'
                : 'Discover rental homes, request visits and find essential household services in one place.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/properties">
                <Button variant="primary" size="lg">
                  {t.btnFindHome}
                </Button>
              </Link>
              <Link to="/dashboard/listings/new">
                <Button variant="outline" size="lg">
                  {t.btnListProperty}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" size="lg">
                  {t.btnBookService}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Search Bar Box */}
          <div className="mt-10 pt-8 border-t border-[#E8E6DF]">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#192420] mb-1">
                  {language === 'bn' ? 'এলাকা নির্বাচন করুন' : 'Select Area'}
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] bg-white text-sm text-[#192420] focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
                >
                  {popularAreas.map((area) => (
                    <option key={area.id} value={area.en}>
                      {language === 'bn' ? area.bn : area.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#192420] mb-1">
                  {language === 'bn' ? 'বাসার ধরন' : 'Property Type'}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] bg-white text-sm text-[#192420] focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
                >
                  <option value="apartment">{language === 'bn' ? 'অ্যাপার্টমেন্ট' : 'Apartment'}</option>
                  <option value="house">{language === 'bn' ? 'সম্পূর্ণ বাড়ি' : 'Full House'}</option>
                  <option value="room">{language === 'bn' ? 'সাবলেট / রুম' : 'Single Room'}</option>
                  <option value="sublet">{language === 'bn' ? 'সাবলেট' : 'Sublet'}</option>
                  <option value="mess_seat">{language === 'bn' ? 'মেস সিট' : 'Mess Seat'}</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" variant="primary" fullWidth className="min-h-[44px]">
                  {t.btnSearch}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT SAFETY ADVISORY (Mandatory Brand Message) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#92400E]">
                {t.safetyNoticeHeadline}
              </h2>
              <p className="text-xs sm:text-sm text-[#78350F] mt-0.5 leading-relaxed font-medium">
                “{t.safetyNoticeBody}”
              </p>
            </div>
          </div>

          <Link to="/safety" className="shrink-0">
            <Button variant="outline" size="sm" className="bg-white border-[#FDE68A] text-[#92400E] hover:bg-[#FEF9C3]">
              {t.safetyLearnMore}
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. DHAKA NEIGHBOURHOODS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#192420]">
                {language === 'bn' ? 'ঢাকার প্রধান আবাসিক এলাকাসমূহ' : 'Explore Dhaka Neighborhoods'}
              </h2>
              <p className="text-xs sm:text-sm text-[#738079] mt-1">
                {language === 'bn'
                  ? 'আপনার পছন্দের এলাকায় ভাড়ার বাসা অনুসন্ধান করুন'
                  : 'Find rental listings across prominent residential hubs'}
              </p>
            </div>
            <Link
              to="/properties"
              className="text-xs font-semibold text-[#0F4C3A] hover:underline whitespace-nowrap"
            >
              {language === 'bn' ? 'সব এলাকা দেখুন →' : 'View all areas →'}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {popularAreas.map((area) => (
              <Link
                key={area.id}
                to={`/properties?area=${encodeURIComponent(area.en)}`}
                className="bg-white rounded-2xl border border-[#E8E6DF] p-4 hover:border-[#0F4C3A] transition-all hover:shadow-xs group"
              >
                <div className="text-sm font-semibold text-[#192420] group-hover:text-[#0F4C3A]">
                  {language === 'bn' ? area.bn : area.en}
                </div>
                <div className="text-xs text-[#738079] mt-0.5">
                  {language === 'bn' ? 'লিস্টিং দেখুন' : 'Explore listings'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIX HOUSEHOLD SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider">
                {language === 'bn' ? 'প্রয়োজনীয় সেবা' : 'Essential Home Care'}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#192420] mt-1">
                {language === 'bn' ? '৬টি নির্ভরযোগ্য বাসার সেবা' : '6 Core Household Services'}
              </h2>
              <p className="text-xs sm:text-sm text-[#738079] mt-1">
                {language === 'bn'
                  ? 'প্রাথমিক পাইলটে প্রতিটি সেবার অনুরোধ সরাসরি যাচাই করে প্রোভাইডার নির্ধারণ করা হয়।'
                  : 'During this pilot, all requests are manually verified before assignment.'}
              </p>
            </div>

            <Link to="/services">
              <Button variant="outline" size="sm">
                {language === 'bn' ? 'সব সেবা দেখুন' : 'Explore All Services'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ALLOWED_SERVICE_CATEGORIES.map((category) => (
              <ServiceCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT WORKFLOW (HOW IT WORKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider">
              {language === 'bn' ? 'স্বচ্ছ প্রক্রিয়া' : 'Clear & Transparent'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#192420] mt-1">
              {language === 'bn' ? 'বাসার চাবি কীভাবে কাজ করে' : 'How Bashar Chabi Works'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2EE] text-[#0F4C3A] font-bold text-sm flex items-center justify-center">
                ১
              </div>
              <h3 className="text-base font-semibold text-[#192420]">
                {language === 'bn' ? '১. বাসা খুঁজুন ও তথ্য দেখুন' : '1. Search & Review'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                {language === 'bn'
                  ? 'লগইন ছাড়াই ঢাকার বিভিন্ন এলাকার অনুমোদিত বাসা ব্রাউজ করুন এবং ফিল্টার করে পছন্দের বাসা বের করুন।'
                  : 'Browse published properties across Dhaka without logging in and filter by rent and area.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2EE] text-[#0F4C3A] font-bold text-sm flex items-center justify-center">
                ২
              </div>
              <h3 className="text-base font-semibold text-[#192420]">
                {language === 'bn' ? '২. ভিজিট বুকিং পাঠান' : '2. Request a Visit'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                {language === 'bn'
                  ? 'আপনার সুবিধাজনক তারিখ ও সময় নির্বাচন করে বাড়িওয়ালার কাছে ভিজিট অনুরোধ পাঠান।'
                  : 'Pick your preferred date and time to submit a property inspection visit request.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2EE] text-[#0F4C3A] font-bold text-sm flex items-center justify-center">
                ৩
              </div>
              <h3 className="text-base font-semibold text-[#192420]">
                {language === 'bn' ? '৩. নিরাপদ যাচাই ও হোম সার্ভিস' : '3. Inspect & Move In'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                {language === 'bn'
                  ? 'সরাসরি বাসা দেখে চুক্তি সম্পন্ন করুন এবং বাসা বদল, ক্লিনিং বা ইলেক্ট্রিক সহায়তায় বাসার সেবা বুক করুন।'
                  : 'Verify the property in person, sign a written lease, and request moving or cleaning services.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
