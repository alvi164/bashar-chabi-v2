import React from 'react';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { Logo } from '../../components/common/Logo.tsx';

export const AboutPage: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      <div className="space-y-3">
        <Logo size="lg" showSubtitle />
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192420] tracking-tight pt-2">
          {language === 'bn' ? 'বাসার চাবি সম্পর্কে' : 'About Bashar Chabi'}
        </h1>
        <p className="text-sm sm:text-base text-[#4A5550] leading-relaxed">
          {language === 'bn'
            ? '“বাসার চাবি, এখন আপনার হাতে” — ঢাকার ভাড়ার বাসা খোঁজা এবং গৃহস্থালি সেবা পাওয়ার একটি নির্ভরযোগ্য ও স্বচ্ছ প্ল্যাটফর্ম।'
            : '“Find your home. Take care of it.” — A Dhaka-first rental property and household services marketplace built on transparency and trust.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-6 text-sm text-[#4A5550] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'আমাদের উদ্দেশ্য ও লক্ষ্য' : 'Our Mission'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ঢাকায় ভাড়ার বাসা খোঁজার ক্ষেত্রে অগ্রিম টাকা নিয়ে প্রতারণা, ভুয়া লিস্টিং এবং অস্পষ্ট যোগাযোগের কারণে সাধারণ ভাড়াটিয়া এবং বাড়িওয়ালা উভয়কেই প্রতিনিয়ত বিপাকে পড়তে হয়। বাসার চাবি তৈরি করা হয়েছে এমন একটি ডিজিটাল মাধ্যম হিসেবে যেখানে প্রতিটি লিস্টিং দায়িত্বশীলভাবে যাচাই করা হয়, সঠিক তথ্য প্রদর্শিত হয় এবং প্রয়োজনীয় হোম সার্ভিস সরাসরি পাওয়া যায়।'
              : 'Finding a rental home in Dhaka often involves unverified brokers, misleading photographs, and rampant advance-deposit fraud. Bashar Chabi is engineered as an honest, localized platform where properties are verified before publication and core household services can be requested with accountability.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'পাইলট সংস্করণের সীমাবদ্ধতা' : 'MVP Pilot Transparency'}
          </h2>
          <p>
            {language === 'bn'
              ? 'এটি বাসার চাবি প্ল্যাটফর্মের প্রাথমিক পাইলট সংস্করণ। এই পর্যায়ে আমরা কোনো অনলাইন পেমেন্ট গেটওয়ে, অটোমেটেড এসক্রো বা ভাড়া লেনদেন পরিচালনা করছি না। ভাড়াটিয়া ও বাড়িওয়ালার মধ্যে আর্থিক লেনদেন সম্পূর্ণ তাদের প্রত্যক্ষ যাচাই ও চুক্তির ওপর নির্ভরশীল। যেকোনো লিস্টিং প্রকাশের পূর্বে প্রশাসক কর্তৃক যাচাই করা হয়।'
              : 'This is our one-week MVP pilot release. We do not process online rent collection, escrow, or automated provider payouts in this phase. Every listing and service request is reviewed manually by platform administrators to uphold quality across residential neighborhoods in Dhaka.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'ঢাকার প্রধান এলাকায় উপস্থিতি' : 'Dhaka Coverage'}
          </h2>
          <p>
            {language === 'bn'
              ? 'আমরা প্রাথমিকভাবে মিরপুর, উত্তরা, ধানমন্ডি, বাড্ডা, মোহাম্মদপুর, গুলশান, বনানী, রামপুরা এবং বসুন্ধরা আবাসিক এলাকায় সেবা চালু করেছি।'
              : 'Initial operations are focused on Mirpur, Uttara, Dhanmondi, Badda, Mohammadpur, Gulshan, Banani, Rampura, and Bashundhara Residential Area.'}
          </p>
        </section>
      </div>
    </div>
  );
};
