import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { Button } from '../../components/common/Button.tsx';

export const UnauthorizedPage: React.FC = () => {
  const { language, t } = useTranslation();

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto text-3xl">
        ⛔
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192420]">
        {language === 'bn' ? 'অননুমোদিত প্রবেশাধিকার (৪০৩)' : 'Access Unauthorized (403)'}
      </h1>
      <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
        {language === 'bn'
          ? 'এই পৃষ্ঠায় প্রবেশের জন্য আপনার যথাযথ অ্যাকাউন্টের অনুমতি নেই। প্রশাসক ও নিয়ন্ত্রিত অংশের প্রবেশাধিকার সার্ভার দ্বারা কঠোরভাবে যাচাই করা হয়।'
          : 'You do not hold authorized permission to access this resource. Privileged routes are strictly verified server-side.'}
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md">
            {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return Home'}
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="md">
            {t.navLogin}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DF] text-[#738079] flex items-center justify-center mx-auto text-3xl">
        🔍
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192420]">
        {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি (৪০৪)' : 'Page Not Found (404)'}
      </h1>
      <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
        {language === 'bn'
          ? 'আপনি যে ঠিকানাটি খুঁজছেন তা পরিবর্তিত হয়েছে অথবা অস্তিত্ব নেই।'
          : 'The page you requested does not exist or has been moved.'}
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return Home'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
