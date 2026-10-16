import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { UserRole } from '../../types/index.ts';
import { Button } from '../../components/common/Button.tsx';

export const RoleDashboardPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { userProfile, isAdmin } = useAuth();
  const [activeRole, setActiveRole] = useState<UserRole>('tenant');

  useEffect(() => {
    if (isAdmin) {
      setActiveRole('admin');
    } else if (userProfile?.selectedRole) {
      setActiveRole(userProfile.selectedRole);
    } else {
      const saved = localStorage.getItem('basharchabi_preview_role') as UserRole;
      if (saved && saved !== 'admin') {
        setActiveRole(saved);
      } else {
        setActiveRole('tenant');
      }
    }
  }, [isAdmin, userProfile]);

  const handleSwitchRole = (role: UserRole) => {
    if (role === 'admin' && !isAdmin) {
      return;
    }
    setActiveRole(role);
    localStorage.setItem('basharchabi_preview_role', role);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Banner & Phase 1 Role Switcher */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#0F4C3A] bg-[#E8F2EE] px-2.5 py-1 rounded-md">
            {language === 'bn' ? 'ব্যবহারকারী ড্যাশবোর্ড' : 'User Control Center'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#192420] mt-1.5">
            {language === 'bn' ? 'ভূমিকা অনুযায়ী ড্যাশবোর্ড' : 'Role Dashboard'}
          </h1>
          <p className="text-xs text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'নিচের ভূমিকাগুলো পরিবর্তন করে বিভিন্ন ভূমিকার ড্যাশবোর্ড অভিজ্ঞতা পরীক্ষা করুন:'
              : 'Switch roles below to preview individual workflows and navigation:'}
          </p>
        </div>

        {/* Interactive Segmented Control for Role Switching */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F5] p-1.5 rounded-2xl border border-[#E8E6DF]">
          <button
            onClick={() => handleSwitchRole('tenant')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeRole === 'tenant'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-[#4A5550] hover:bg-[#F3F1EB]'
            }`}
          >
            {t.roleTenant}
          </button>
          <button
            onClick={() => handleSwitchRole('landlord_or_agent')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeRole === 'landlord_or_agent'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-[#4A5550] hover:bg-[#F3F1EB]'
            }`}
          >
            {t.roleLandlord}
          </button>
          <button
            onClick={() => handleSwitchRole('service_provider')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeRole === 'service_provider'
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'text-[#4A5550] hover:bg-[#F3F1EB]'
            }`}
          >
            {t.roleProvider}
          </button>
          {isAdmin && (
            <button
              onClick={() => handleSwitchRole('admin')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-[#4A5550] hover:bg-[#F3F1EB]'
              }`}
            >
              {t.roleAdmin}
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Content */}
      {activeRole === 'tenant' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/dashboard/favourites"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">❤️</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'সংরক্ষিত বাসা (Favourites)' : 'Saved Properties'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'আপনার বুকমার্ক করা সকল বাসার তালিকা' : 'Properties you marked for review'}
              </p>
            </Link>

            <Link
              to="/dashboard/visits"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">📅</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ভিজিট অনুরোধসমূহ (Visits)' : 'Visit Requests'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'বাড়িওয়ালাদের পাঠানো ভিজিটের অবস্থা' : 'Status of scheduled inspections'}
              </p>
            </Link>

            <Link
              to="/dashboard/service-requests"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">🛠️</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'হোম সার্ভিস অনুরোধ' : 'Home Service Requests'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'আপনার করা বাসা সার্ভিস রিকোয়েস্ট' : 'Track ongoing service requests'}
              </p>
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 text-center space-y-3">
            <h3 className="text-sm font-semibold text-[#192420]">
              {language === 'bn' ? 'ভাড়াটিয়া ড্যাশবোর্ড প্রস্তুত' : 'Tenant Workflow Ready'}
            </h3>
            <p className="text-xs text-[#738079] max-w-md mx-auto">
              {language === 'bn'
                ? 'রিয়েল-টাইম ভিজিট ট্র্যাকিং ও বুকমার্ক ডেটা ফায়ারস্টোর থেকে পরিচালিত হচ্ছে।'
                : 'Visits and favourites synchronize via Cloud Firestore with real-time status updates.'}
            </p>
          </div>
        </div>
      )}

      {activeRole === 'landlord_or_agent' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/dashboard/listings/new"
              className="bg-[#0F4C3A] text-white rounded-2xl p-5 hover:bg-[#0B3A2C] transition-colors shadow-xs"
            >
              <div className="text-2xl mb-1">➕</div>
              <h2 className="text-base font-bold text-white">
                {language === 'bn' ? 'নতুন বাসা যুক্ত করুন' : 'Create New Listing'}
              </h2>
              <p className="text-xs text-[#E8F2EE] mt-1">
                {language === 'bn' ? 'খসড়া তৈরি ও অনুমোদনের জন্য জমা দিন' : 'Draft and submit for review'}
              </p>
            </Link>

            <Link
              to="/dashboard/listings"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">📋</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'আমার লিস্টিং সমূহ' : 'My Properties'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'অনুমোদন, খসড়া ও ভাড়া হওয়া বাসা' : 'View drafts, published & rented'}
              </p>
            </Link>

            <Link
              to="/dashboard/listing-visits"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">🔔</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'আগত ভিজিট অনুরোধ' : 'Incoming Visits'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'ভাড়াটিয়াদের ভিজিট নিশ্চিত বা বাতিল করুন' : 'Confirm or decline requests'}
              </p>
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 text-center space-y-3">
            <h3 className="text-sm font-semibold text-[#192420]">
              {language === 'bn' ? 'মালিক ড্যাশবোর্ড প্রস্তুত' : 'Landlord Workflow Ready'}
            </h3>
            <p className="text-xs text-[#738079] max-w-md mx-auto">
              {language === 'bn'
                ? 'বাসার ড্রাফট তৈরি, প্রাইভেট ঠিকানা গোপন রাখা এবং প্রশাসক অনুমোদনের জন্য সাবমিট করার ফুল ফর্ম আর্কিটেকচার প্রস্তুত।'
                : 'Form validation, privacy rules, draft saves and moderation status pipelines are architected.'}
            </p>
            <Link to="/dashboard/listings/new">
              <Button variant="primary" size="sm">
                {language === 'bn' ? 'লিস্টিং ফর্ম দেখুন' : 'Preview Listing Form'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {activeRole === 'service_provider' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/dashboard/provider-profile"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">🛠️</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'সার্ভিস প্রোফাইল ও এলাকা' : 'Service Profile & Areas'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'কাজের ক্যাটাগরি ও কাজের এলাকা' : 'Trades, working hours & Dhaka coverage'}
              </p>
            </Link>

            <Link
              to="/dashboard/provider-jobs"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-2xl mb-1">📑</div>
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'বরাদ্দকৃত কাজ (Assigned Jobs)' : 'Assigned Jobs'}
              </h2>
              <p className="text-xs text-[#738079] mt-1">
                {language === 'bn' ? 'শুধুমাত্র আপনাকে অর্পিত কাজের তালিকা' : 'Only jobs explicitly assigned to you'}
              </p>
            </Link>
          </div>

          <div className="bg-[#E8F2EE] rounded-2xl border border-[#D4E6DF] p-5 text-xs text-[#0F4C3A] space-y-1">
            <strong>{language === 'bn' ? 'নিরাপত্তা নীতি:' : 'Security Policy:'}</strong>{' '}
            {language === 'bn'
              ? 'সার্ভিস প্রোভাইডাররা কখনো সকল গ্রাহকের অনুরোধ অবাধে ব্রাউজ করতে পারবেন না। শুধুমাত্র প্রশাসক কর্তৃক অর্পিত কাজই প্রোভাইডার ড্যাশবোর্ডে দৃশ্যমান হবে।'
              : 'Service providers cannot browse open customer requests. Only work directly assigned by administrators is accessible.'}
          </div>
        </div>
      )}

      {activeRole === 'admin' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/admin/properties"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-xs font-semibold text-[#738079]">
                {language === 'bn' ? 'অপেক্ষমাণ বাসা' : 'Pending Properties'}
              </div>
              <div className="text-2xl font-extrabold text-[#192420] mt-1 tabular-nums">0</div>
              <div className="text-[11px] text-[#0F4C3A] mt-1 font-medium">
                {language === 'bn' ? 'যাচাই কিউ →' : 'Review queue →'}
              </div>
            </Link>

            <Link
              to="/admin/providers"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-xs font-semibold text-[#738079]">
                {language === 'bn' ? 'প্রোভাইডার অনুমোদন' : 'Provider Verification'}
              </div>
              <div className="text-2xl font-extrabold text-[#192420] mt-1 tabular-nums">0</div>
              <div className="text-[11px] text-[#0F4C3A] mt-1 font-medium">
                {language === 'bn' ? 'প্রোফাইল কিউ →' : 'Profile queue →'}
              </div>
            </Link>

            <Link
              to="/admin/service-requests"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-xs font-semibold text-[#738079]">
                {language === 'bn' ? 'সেবার অনুরোধ' : 'Open Service Requests'}
              </div>
              <div className="text-2xl font-extrabold text-[#192420] mt-1 tabular-nums">0</div>
              <div className="text-[11px] text-[#0F4C3A] mt-1 font-medium">
                {language === 'bn' ? 'অর্পণ কিউ →' : 'Assignment queue →'}
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="bg-white rounded-2xl border border-[#E8E6DF] p-5 hover:border-[#0F4C3A] transition-colors"
            >
              <div className="text-xs font-semibold text-[#738079]">
                {language === 'bn' ? 'অভিযোগসমূহ' : 'Open Reports'}
              </div>
              <div className="text-2xl font-extrabold text-[#192420] mt-1 tabular-nums">0</div>
              <div className="text-[11px] text-[#D97706] mt-1 font-medium">
                {language === 'bn' ? 'তদন্ত কিউ →' : 'Report queue →'}
              </div>
            </Link>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link to="/admin/audit-logs">
              <Button variant="outline" size="sm">
                {language === 'bn' ? 'অডিট লগ পরিদর্শক (Audit Logs)' : 'View Immutable Audit Logs'}
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="primary" size="sm">
                {language === 'bn' ? 'সম্পূর্ণ এডমিন প্যানেল' : 'Full Admin Overview'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
