import React from 'react';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const PrivacyPage: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider">
          {language === 'bn' ? 'গোপনীয়তা নীতিমালা (পাইলট সংস্করণ)' : 'Privacy Policy (MVP Version)'}
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192420] tracking-tight">
          {language === 'bn' ? 'ব্যক্তিগত তথ্যের গোপনীয়তা' : 'Privacy & Data Protection'}
        </h1>
        <p className="text-xs text-[#738079]">
          {language === 'bn' ? 'কার্যকর হওয়ার তারিখ: অক্টোবর ২০২৬' : 'Effective Date: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-6 text-sm text-[#4A5550] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '১. আমরা কোন তথ্য সংগ্রহ করি' : '1. Information We Collect'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ব্যবহারকারী নিবন্ধনকালে প্রদর্শিত নাম, ইমেইল ঠিকানা, নির্বাচিত ভূমিকা (ভাড়াটিয়া, বাড়িওয়ালা বা সার্ভিস প্রোভাইডার) এবং এলাকা সংক্রান্ত তথ্য গ্রহণ করা হয়। বাড়িওয়ালারা যখন বাসার তথ্য তৈরি করেন, তখন এলাকা, বাসা সংক্রান্ত স্পেসিফিকেশন এবং অভ্যন্তরীণ ঠিকানার তথ্য নেওয়া হয়।'
              : 'During account creation, we collect display name, email address, selected role (tenant, landlord_or_agent, or service_provider), and residential area. Landlords submit listing descriptions, rent expectations, and private address details.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '২. গোপনীয় তথ্যের সুরক্ষা ও জনসমক্ষে অপ্রদর্শন' : '2. Non-Disclosure of Private Addresses & Contacts'}
          </h2>
          <p>
            {language === 'bn'
              ? 'বাসার নিখুঁত অভ্যন্তরীণ ঠিকানা (Private Address) এবং বাড়িওয়ালার ব্যক্তিগত ফোন নম্বর কোনো পাবলিক পেজে বা ব্রাউজার কোয়েরিতে উন্মুক্ত করা হয় না। শুধুমাত্র অনুমোদিত ভিজিট অনুরোধ নিশ্চিত করার পরই সংশ্লিষ্ট পক্ষের মধ্যে যোগাযোগের সূত্র তৈরি হতে পারে।'
              : 'Exact residential door/house numbers (privateAddress) and personal contact numbers are never exposed in public queries or unauthenticated pages. Only confirmed visit participants and platform administrators have access.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '৩. তথ্য সংশোধন বা মুছে ফেলার অনুরোধ' : '3. Data Correction and Deletion'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ব্যবহারকারী যেকোনো সময় তার প্রোফাইল তথ্য সম্পাদনা করতে পারবেন অথবা অ্যাকাউন্ট ও লিস্টিং ডেটা মুছে ফেলার জন্য অনুরোধ জানাতে পারবেন।'
              : 'Users may edit their personal account details or request full deletion of their records at any time through account settings.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '৪. পাইলট সংস্করণের সীমাবদ্ধতা' : '4. MVP Scope Clarification'}
          </h2>
          <p>
            {language === 'bn'
              ? 'এটি প্রাথমিক পাইলট সংস্করণের নীতিমালা এবং এটি কোনো আইনজীবী কর্তৃক প্রত্যয়িত নয়। ব্যবহারকারীদের স্বার্থ রক্ষার্থে আমরা ন্যূনতম প্রয়োজনীয় তথ্যের বাইরে অতিরিক্ত কোনো ব্যক্তিগত তথ্য প্রক্রিয়াকরণ করি না।'
              : 'This policy reflects the operational reality of our MVP pilot and has not been reviewed by external legal counsel. We deliberately minimize data collection to what is essential for property discovery.'}
          </p>
        </section>
      </div>
    </div>
  );
};
