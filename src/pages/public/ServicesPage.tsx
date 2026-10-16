import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { ServiceCard } from '../../components/services/ServiceCard.tsx';
import { ALLOWED_SERVICE_CATEGORIES } from '../../utils/validation.ts';
import { Button } from '../../components/common/Button.tsx';

export const ServicesPage: React.FC = () => {
  const { language, t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider">
          {language === 'bn' ? 'বাসার প্রয়োজনীয় সমাধান' : 'Essential Home Care'}
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192420] tracking-tight">
          {language === 'bn' ? 'বাসার সেবা সমূহ' : 'Household Services in Dhaka'}
        </h1>
        <p className="text-sm sm:text-base text-[#4A5550] leading-relaxed">
          {language === 'bn'
            ? 'বাসা স্থানান্তর, ঘর পরিষ্কার কিংবা সাধারণ বৈদ্যুতিক ও প্লাম্বিং সমস্যার সমাধান পান এক প্ল্যাটফর্মে।'
            : 'Find vetted assistance for moving, cleaning, plumbing, electrical, AC and appliances across Dhaka.'}
        </p>
      </div>

      {/* Pilot Transparency Box */}
      <div className="bg-[#E8F2EE] rounded-2xl border border-[#D4E6DF] p-5 text-xs sm:text-sm text-[#0F4C3A] flex items-start gap-3">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-[#0F4C3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong className="block font-semibold mb-0.5">
            {language === 'bn' ? 'পাইলট সংস্করণ বিজ্ঞপ্তি' : 'MVP Pilot Transparency Notice'}
          </strong>
          {language === 'bn'
            ? 'বাসার চাবি প্ল্যাটফর্মে গৃহস্থালি সেবার অনুরোধগুলো স্বয়ংক্রিয় নয়; গ্রাহকের অনুরোধ পাওয়ার পর প্রশাসক ম্যানুয়ালি যাচাই করে অনুমোদিত সার্ভিস প্রোভাইডারের কাছে দায়িত্ব অর্পণ করেন।'
            : 'During this pilot, service requests are manually reviewed by administrators before being assigned to verified local providers.'}
        </div>
      </div>

      {/* 6 Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALLOWED_SERVICE_CATEGORIES.map((cat) => (
          <ServiceCard key={cat} category={cat} />
        ))}
      </div>

      {/* Custom Request Banner */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#192420]">
            {language === 'bn' ? 'নির্দিষ্ট সেবার জন্য সরাসরি অনুরোধ পাঠাতে চান?' : 'Need to submit a direct request?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#738079] mt-1">
            {language === 'bn'
              ? 'আপনার প্রয়োজনীয় সেবার ধরন ও এলাকা উল্লেখ করে ফর্মটি পূরণ করুন।'
              : 'Specify your category, area, and preferred schedule to get started.'}
          </p>
        </div>
        <Link to="/services/request">
          <Button variant="primary" size="lg">
            {t.btnBookService}
          </Button>
        </Link>
      </div>
    </div>
  );
};
