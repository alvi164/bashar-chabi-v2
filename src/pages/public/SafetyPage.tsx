import React from 'react';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const SafetyPage: React.FC = () => {
  const { language, t } = useTranslation();

  const safetyGuidelines = [
    {
      icon: '🏠',
      titleBn: '১. বাসা সরাসরি পরিদর্শন করুন',
      titleEn: '1. Visit the Property in Person',
      descBn: 'অনলাইনে ছবি বা ভিডিও দেখে কোনো অবস্থাতেই অগ্রিম টাকা পাঠাবেন না। বাসা নিজে সরাসরি দেখুন এবং পারিপার্শ্বিক অবস্থা যাচাই করুন।',
      descEn: 'Never send advance money merely based on photos or videos. Physically inspect the premises and check the surrounding environment.',
    },
    {
      icon: '🪪',
      titleBn: '২. মালিক বা এজেন্টের পরিচয় যাচাই করুন',
      titleEn: '2. Verify Landlord or Agent Identity',
      descBn: 'বাড়িওয়ালা বা অনুমোদিত প্রতিনিধির জাতীয় পরিচয়পত্র (NID) এবং বাড়িটির মালিকানা বা চুক্তিপত্রের বৈধ কাগজপত্র দেখতে চান।',
      descEn: 'Ask for government-issued ID (NID) and proof of property ownership or written legal authorization before finalizing any discussions.',
    },
    {
      icon: '📝',
      titleBn: '৩. লিখিত বাড়িভাড়া চুক্তিপত্র সম্পাদন করুন',
      titleEn: '3. Execute a Written Lease Agreement',
      descBn: 'ভাড়ার শর্ত, জামানতের পরিমাণ, সার্ভিস চার্জ এবং নোটিশ পিরিয়ড স্পষ্টভাবে উল্লেখ করে উভয় পক্ষের স্বাক্ষরিত লিখিত চুক্তি করুন।',
      descEn: 'Formalize rent amount, advance deposit, service charges, and notice period in a signed written rental agreement.',
    },
    {
      icon: '🧾',
      titleBn: '৪. সকল লেনদেনের লিখিত প্রমাণ রাখুন',
      titleEn: '4. Maintain Documented Payment Records',
      descBn: 'অগ্রিম জামানত বা ভাড়ার টাকা পরিশোধ করার সময় মানি রিসিট (মানি রসিদ) বা ব্যাংক ট্রান্সফারের প্রমাণপত্র সংরক্ষণ করুন।',
      descEn: 'Always insist on a signed money receipt or execute bank transfers so you possess verifiable documentation of every transaction.',
    },
    {
      icon: '⚠️',
      titleBn: '৫. তাড়াহুড়ো করে অগ্রিম চাওয়ার চাপে বিভ্রান্ত হবেন না',
      titleEn: '5. Resist Urgent Advance-Payment Pressure',
      descBn: 'প্রতারকরা সাধারণত "অন্য ভাড়াটিয়া চলে আসছে" বলে বিকাশ/নগদে তাড়াহুড়ো করে টাকা চায়। এমন চাপে পড়ে যাচাই না করে টাকা দেবেন না।',
      descEn: 'Fraudsters often claim multiple competing tenants are arriving immediately to rush you into unverified mobile financial transfers.',
    },
    {
      icon: '🔒',
      titleBn: '৬. গোপনীয় তথ্য ও অপ্রয়োজনীয় নথি শেয়ার করবেন না',
      titleEn: '6. Never Share Sensitive OTPs or Passwords',
      descBn: 'বাসার চাবি কিংবা কোনো সেবা প্রদানকারী কখনও আপনার ওটিপি, পাসওয়ার্ড কিংবা ব্যক্তিগত আর্থিক পিন চাইবে না।',
      descEn: 'Bashar Chabi staff will never solicit your login passwords, OTP verification codes, or bank PINs.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#D97706] uppercase tracking-wider">
          {language === 'bn' ? 'সচেতনতা ও নির্দেশনা' : 'Safety & Awareness'}
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192420] tracking-tight">
          {language === 'bn' ? 'ভাড়া ও লেনদেনের নিরাপত্তা সহায়িকা' : 'Rental & Payment Safety Guidelines'}
        </h1>
        <p className="text-sm sm:text-base text-[#4A5550] leading-relaxed">
          {language === 'bn'
            ? 'ঢাকার আবাসন বাজারে নিরাপদ অভিজ্ঞতা নিশ্চিত করার জন্য প্রতিটি ভাড়াটিয়া ও বাড়িওয়ালার জন্য অপরিহার্য পরামর্শ।'
            : 'Essential guidance to protect tenants and property owners from fraud across Dhaka.'}
        </p>
      </div>

      {/* Prominent Core Warning Callout */}
      <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-[#92400E]">
        <div className="w-16 h-16 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shrink-0 text-3xl">
          🛡️
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-base sm:text-lg font-bold">
            {t.safetyNoticeHeadline}
          </h2>
          <p className="text-base sm:text-xl font-bold leading-relaxed text-[#78350F]">
            “{t.safetyNoticeBody}”
          </p>
        </div>
      </div>

      {/* Safety Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {safetyGuidelines.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E8E6DF] p-6 space-y-2 hover:border-[#B8B4AA] transition-colors"
          >
            <div className="text-2xl">{item.icon}</div>
            <h3 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? item.titleBn : item.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
              {language === 'bn' ? item.descBn : item.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Reporting Note */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-base font-bold text-[#192420]">
          {language === 'bn' ? 'সন্দেহজনক কোনো কার্যকলাপ দেখেছেন?' : 'Encountered suspicious activity?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#738079] max-w-lg mx-auto">
          {language === 'bn'
            ? 'যেকোনো লিস্টিং বা ব্যবহারকারীর তথ্যে সন্দেহ হলে সরাসরি লিস্টিং পেজে থাকা "অভিযোগ করুন" বাটনের মাধ্যমে আমাদের জানান।'
            : 'If you notice fraudulent claims or unverified behaviour, use the Report button on the listing details page immediately.'}
        </p>
      </div>
    </div>
  );
};
