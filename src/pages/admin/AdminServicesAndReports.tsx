import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Button } from '../../components/common/Button.tsx';

/**
 * Reusable Unauthorized / Admin Authorization Required Screen
 */
const AdminUnauthorizedView: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto text-2xl font-bold">
        🛡️
      </div>
      <h1 className="text-xl font-bold text-[#192420]">
        {language === 'bn' ? 'অ্যাডমিন অনুমতি আবশ্যক' : 'Administrator Authorization Required'}
      </h1>
      <p className="text-xs text-[#738079] max-w-md mx-auto leading-relaxed">
        {language === 'bn'
          ? 'এই পৃষ্ঠাটি শুধুমাত্র সার্ভার-অথরাইজড অ্যাডমিনদের জন্য উন্মুক্ত। সাধারণ ব্যবহারকারী বা ক্লায়েন্ট স্টেট দিয়ে এই পৃষ্ঠার কোনো অপারেশন সম্পন্ন করা যাবে না।'
          : 'Access is restricted to accounts with server-authorized admin custom claims (request.auth.token.admin == true).'}
      </p>
      <div className="pt-2">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            ← {language === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Return to Dashboard'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

/**
 * AdminProvidersPage - Moderation queue for service provider accounts and credentials
 */
export const AdminProvidersPage: React.FC = () => {
  const { language } = useTranslation();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminUnauthorizedView />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-[#0F4C3A] hover:underline mb-2 inline-flex items-center gap-1"
          >
            ← {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Back to Admin Overview'}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {language === 'bn' ? 'প্রশাসক নিয়ন্ত্রণ কক্ষ' : 'Administrator Control'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#192420]">
              {language === 'bn' ? 'সার্ভিস প্রোভাইডার যাচাই কিউ' : 'Provider Verification Queue'}
            </h1>
          </div>
          <p className="text-xs text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'গৃহস্থালি সেবা প্রদানকারীদের জাতীয় পরিচয়পত্র, ট্রেড লাইসেন্স ও কাজের অভিজ্ঞতা যাচাই'
              : 'Service provider credentials, NID, and experience verification queue'}
          </p>
        </div>

        <Link to="/admin">
          <Button variant="outline" size="sm">
            {language === 'bn' ? 'কন্ট্রোল সেন্টার' : 'Control Center'}
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center mx-auto text-xl">
          🔧
        </div>
        <h3 className="text-base font-bold text-[#192420]">
          {language === 'bn' ? 'বর্তমানে কোনো যাচাই অপেক্ষমাণ নেই' : 'No pending provider applications'}
        </h3>
        <p className="text-xs text-[#738079] max-w-md mx-auto leading-relaxed">
          {language === 'bn'
            ? 'সার্ভিস প্রোভাইডাররা নিজেদের প্রোফাইল ও জাতীয় পরিচয়পত্র জমা দিলে তা এই তালিকায় পর্যালোচনার জন্য প্রদর্শিত হবে।'
            : 'When household service providers register and submit documentation, their applications will appear here for administrative verification.'}
        </p>
      </div>
    </div>
  );
};

/**
 * AdminServicesPage - Moderation queue for open customer household service requests
 */
export const AdminServicesPage: React.FC = () => {
  const { language } = useTranslation();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminUnauthorizedView />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-[#0F4C3A] hover:underline mb-2 inline-flex items-center gap-1"
          >
            ← {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Back to Admin Overview'}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {language === 'bn' ? 'প্রশাসক নিয়ন্ত্রণ কক্ষ' : 'Administrator Control'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#192420]">
              {language === 'bn' ? 'গৃহস্থালি সার্ভিস অনুরোধসমূহ' : 'Service Requests Dispatch'}
            </h1>
          </div>
          <p className="text-xs text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'গ্রাহকদের জমাকৃত সার্ভিস অনুরোধ পর্যবেক্ষণ ও প্রোভাইডার নির্ধারণ ব্যবস্থাপনা'
              : 'Customer household service bookings and provider dispatch management'}
          </p>
        </div>

        <Link to="/admin">
          <Button variant="outline" size="sm">
            {language === 'bn' ? 'কন্ট্রোল সেন্টার' : 'Control Center'}
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center mx-auto text-xl">
          📋
        </div>
        <h3 className="text-base font-bold text-[#192420]">
          {language === 'bn' ? 'বর্তমানে কোনো খোলা সার্ভিস অনুরোধ নেই' : 'No active service requests'}
        </h3>
        <p className="text-xs text-[#738079] max-w-md mx-auto leading-relaxed">
          {language === 'bn'
            ? 'ব্যবহারকারীরা এসি মেরামত, প্লাম্বিং বা বাসা শিফটিং বুকিং দিলে তা সরাসরি এই কিউতে জমা হবে।'
            : 'Customer bookings for AC servicing, plumbing, cleaning, and moving will populate this queue for administrative dispatch.'}
        </p>
      </div>
    </div>
  );
};

/**
 * AdminReportsPage - Listing violation and abuse reports queue
 */
export const AdminReportsPage: React.FC = () => {
  const { language } = useTranslation();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminUnauthorizedView />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-[#0F4C3A] hover:underline mb-2 inline-flex items-center gap-1"
          >
            ← {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Back to Admin Overview'}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {language === 'bn' ? 'প্রশাসক নিয়ন্ত্রণ কক্ষ' : 'Administrator Control'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#192420]">
              {language === 'bn' ? 'লিস্টিং অভিযোগ ও রিপোর্ট' : 'Listing Reports & Flags'}
            </h1>
          </div>
          <p className="text-xs text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'ভুল তথ্য, ভুয়া ছবি বা অনিয়মের বিরুদ্ধে গ্রাহকদের দাখিলকৃত অভিযোগ পর্যালোচনা'
              : 'Customer moderation reports against inaccurate listings, pricing discrepancy, or fraud'}
          </p>
        </div>

        <Link to="/admin">
          <Button variant="outline" size="sm">
            {language === 'bn' ? 'কন্ট্রোল সেন্টার' : 'Control Center'}
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center mx-auto text-xl">
          🚩
        </div>
        <h3 className="text-base font-bold text-[#192420]">
          {language === 'bn' ? 'বর্তমানে কোনো অনিষ্পন্ন রিপোর্ট নেই' : 'No unresolved listing reports'}
        </h3>
        <p className="text-xs text-[#738079] max-w-md mx-auto leading-relaxed">
          {language === 'bn'
            ? 'লিস্টিং ডিটেইল পৃষ্ঠা থেকে ব্যবহারকারীরা কোনো বাসা রিপোর্ট করলে তা এখানে তাৎক্ষণিকভাবে তালিকাভুক্ত হবে।'
            : 'Community reports submitted via property detail pages will aggregate here for administrative investigation.'}
        </p>
      </div>
    </div>
  );
};
