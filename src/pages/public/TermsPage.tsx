import React from 'react';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const TermsPage: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider">
          {language === 'bn' ? 'ব্যবহারের শর্তাবলী (পাইলট সংস্করণ)' : 'Terms & Conditions (MVP Version)'}
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192420] tracking-tight">
          {language === 'bn' ? 'শর্তাবলী ও নীতিমালা' : 'Terms of Service'}
        </h1>
        <p className="text-xs text-[#738079]">
          {language === 'bn' ? 'কার্যকর হওয়ার তারিখ: অক্টোবর ২০২৬' : 'Effective Date: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-6 text-sm text-[#4A5550] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '১. মার্কেটপ্লেসের ভূমিকা' : '1. Marketplace Scope'}
          </h2>
          <p>
            {language === 'bn'
              ? 'বাসার চাবি (Bashar Chabi) প্রাথমিক পর্যায়ে একটি তথ্য ও সংযোগমূলক মার্কেটপ্লেস। প্ল্যাটফর্মটি কোনো বাড়িভাড়ার অর্থ বা অগ্রিম জামানত সরাসরি গ্রহণ করে না, ধরে রাখে না বা এসক্রো হিসেবে কাজ করে না।'
              : 'Bashar Chabi operates solely as an information and discovery marketplace. The platform does not hold, handle, or escrow rental monies or security deposits.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '২. ব্যবহারকারীর দায়িত্ব ও সতর্কতা' : '2. Counterparty Verification'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ভাড়াটিয়া এবং বাড়িওয়ালা উভয় পক্ষই প্রত্যক্ষভাবে পরিচিতি, জাতীয় পরিচয়পত্র এবং আইনগত অধিকার যাচাই করতে দায়বদ্ধ। কোনো আর্থিক লেনদেন করার পূর্বে সশরীরে বাসা পরিদর্শন করা এবং লিখিত চুক্তি সম্পাদন করা বাধ্যতামূলক।'
              : 'Users are strictly responsible for verifying counterparties, identities, and property title documents before entering into agreements or executing offline payments.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '৩. লিস্টিং যাচাই ও বাতিলকরণ' : '3. Listing Moderation'}
          </h2>
          <p>
            {language === 'bn'
              ? 'লিস্টিংয়ের তথ্য যাচাই বা প্রকাশ করার অর্থ এই নয় যে প্ল্যাটফর্ম বাসাটির নিশ্চয়তা প্রদান করছে। বিভ্রান্তিকর, অসত্য কিংবা সন্দেহজনক কোনো কার্যকলাপ পরিলক্ষিত হলে যেকোনো মুহূর্তে লিস্টিং বা অ্যাকাউন্ট স্থগিত বা বাতিল করার পূর্ণ অধিকার কর্তৃপক্ষের রয়েছে।'
              : 'Listing approval by moderators does not constitute a legal guarantee or warranty. Bashar Chabi administrators reserve the full right to reject, suspend, or remove listings that violate safety rules.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? '৪. গৃহস্থালি সেবা সংক্রান্ত নীতিমালা' : '4. Household Services'}
          </h2>
          <p>
            {language === 'bn'
              ? 'গৃহস্থালি সেবার ক্ষেত্রে অনুরোধ পর্যালোচনাপূর্বক স্থানীয় সেবা প্রদানকারী নির্ধারণ করা হয়। কাজের মূল্য ও চূড়ান্ত লেনদেন গ্রাহক ও প্রোভাইডারের মধ্যে প্রত্যক্ষ সমঝোতায় নির্ধারিত হয়।'
              : 'Household service requests are reviewed manually. Final billing and payments are settled directly between customer and service provider outside platform rails.'}
          </p>
        </section>
      </div>
    </div>
  );
};
