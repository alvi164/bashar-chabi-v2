import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { userRepository } from '../../repositories/userRepository.ts';
import { propertyRepository } from '../../repositories/propertyRepository.ts';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Select } from '../../components/common/Select.tsx';
import { NormalUserRole, Property } from '../../types/index.ts';
import { formatTaka } from '../../utils/currency.ts';
import { formatDhakaDate } from '../../utils/date.ts';

export const OnboardingPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { currentUser, userProfile, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<NormalUserRole>(userProfile?.selectedRole || 'tenant');
  const [area, setArea] = useState(userProfile?.area || 'Mirpur');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await completeOnboarding(role, area);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Onboarding error:', err);
      setError(
        language === 'bn'
          ? 'অনবোর্ডিং তথ্য সংরক্ষণ করা যায়নি। পুনরায় চেষ্টা করুন।'
          : 'Could not save onboarding profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#192420]">
          {language === 'bn' ? 'অনবোর্ডিং সম্পন্ন করুন' : 'Complete Onboarding'}
        </h1>
        <p className="text-xs text-[#738079]">
          {language === 'bn'
            ? 'আপনার প্রাথমিক ভূমিকা ও ঢাকা এলাকা নির্বাচন করুন'
            : 'Select your operational role and primary residential area'}
        </p>
      </div>

      <form onSubmit={handleComplete} className="bg-white rounded-3xl border border-[#E8E6DF] p-6 space-y-5 shadow-xs">
        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#192420] mb-2">
            {language === 'bn' ? 'ভূমিকা নির্বাচন' : 'Operational Role'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRole('tenant')}
              className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                role === 'tenant' ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]' : 'border-[#D8D5CD] bg-white text-[#4A5550]'
              }`}
            >
              <span className="text-base">🔑</span>
              <span>{t.roleTenant}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('landlord_or_agent')}
              className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                role === 'landlord_or_agent' ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]' : 'border-[#D8D5CD] bg-white text-[#4A5550]'
              }`}
            >
              <span className="text-base">🏢</span>
              <span>{t.roleLandlord}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('service_provider')}
              className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                role === 'service_provider' ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]' : 'border-[#D8D5CD] bg-white text-[#4A5550]'
              }`}
            >
              <span className="text-base">🛠️</span>
              <span>{t.roleProvider}</span>
            </button>
          </div>
        </div>

        <Select
          label={language === 'bn' ? 'প্রাথমিক এলাকা' : 'Primary Dhaka Area'}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          options={[
            { value: 'Mirpur', label: 'Mirpur (মিরপুর)' },
            { value: 'Uttara', label: 'Uttara (উত্তরা)' },
            { value: 'Dhanmondi', label: 'Dhanmondi (ধানমন্ডি)' },
            { value: 'Badda', label: 'Badda (বাড্ডা)' },
            { value: 'Mohammadpur', label: 'Mohammadpur (মোহাম্মদপুর)' },
            { value: 'Gulshan', label: 'Gulshan (গুলশান)' },
            { value: 'Banani', label: 'Banani (বনানী)' },
            { value: 'Bashundhara R/A', label: 'Bashundhara R/A (বসুন্ধরা)' },
          ]}
        />

        <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
          {language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Proceed to Dashboard'}
        </Button>
      </form>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser, userProfile, privateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(privateProfile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    setMessage('');
    try {
      await userRepository.updateUserProfile(currentUser.uid, { displayName });
      if (phone) {
        await userRepository.updatePrivateProfile(currentUser.uid, { phone });
      }
      await refreshProfile();
      setMessage(language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে' : 'Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage(language === 'bn' ? 'আপডেট ব্যর্থ হয়েছে' : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
          ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
        </Link>
        <h1 className="text-2xl font-bold text-[#192420] mt-1.5">
          {language === 'bn' ? 'ব্যবহারকারী প্রোফাইল' : 'User Profile'}
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-4 shadow-xs">
        {message && (
          <div className="p-3 rounded-xl bg-[#E8F2EE] text-[#0F4C3A] text-xs font-medium">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs text-[#738079] pb-4 border-b border-[#F3F1EB]">
          <div>
            <span className="block font-medium">{language === 'bn' ? 'ইমেইল:' : 'Email:'}</span>
            <span className="font-semibold text-[#192420]">{currentUser?.email || 'N/A'}</span>
          </div>
          <div>
            <span className="block font-medium">{language === 'bn' ? 'বর্তমান ভূমিকা:' : 'Active Role:'}</span>
            <span className="font-semibold text-[#0F4C3A] uppercase">
              {userProfile?.selectedRole || 'tenant'}
            </span>
          </div>
        </div>

        <Input
          label={language === 'bn' ? 'প্রদর্শিত নাম' : 'Display Name'}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label={language === 'bn' ? 'ব্যক্তিগত ফোন নম্বর (গোপনীয়)' : 'Private Phone (Confidential)'}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="017xxxxxxxx"
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" isLoading={isSaving}>
            {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const TenantVisitsPage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'আমার ভিজিট অনুরোধসমূহ' : 'My Visit Requests'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'বর্তমানে কোনো সক্রিয় ভিজিট অনুরোধ নেই।'
          : 'No scheduled inspection requests.'}
      </div>
    </div>
  );
};

export const TenantFavouritesPage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'সংরক্ষিত বাসা (Favourites)' : 'Saved Properties'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'কোনো বাসা সংরক্ষণ করা হয়নি।'
          : 'No saved properties found.'}
      </div>
    </div>
  );
};

export const LandlordListingsPage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await propertyRepository.getOwnedProperties(currentUser.uid);
      setProperties(data);
    } catch (err) {
      console.error('Failed to load owned properties:', err);
      setError(
        language === 'bn'
          ? 'লিস্টিং লোড করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।'
          : 'Could not load your properties. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentUser]);

  const handleDeleteDraft = async (propId: string) => {
    if (!currentUser) return;
    setIsDeleting(true);
    try {
      await propertyRepository.deleteDraft(propId, currentUser.uid);
      setConfirmDeleteId(null);
      await fetchListings();
    } catch (err: unknown) {
      console.error('Error deleting draft:', err);
      setError(
        language === 'bn'
          ? 'ড্রাফট মোছা সম্ভব হয়নি: ' + (err as Error).message
          : 'Could not delete draft: ' + (err as Error).message
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'draft':
        return (
          <span className="bg-[#F3F1EB] text-[#4A5550] border border-[#D8D5CD] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {language === 'bn' ? 'খসড়া (Draft)' : 'Draft'}
          </span>
        );
      case 'pending_review':
        return (
          <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span>⏳</span>
            <span>{language === 'bn' ? 'পর্যালোচনায় (Under Review)' : 'Pending Review'}</span>
          </span>
        );
      case 'published':
        return (
          <span className="bg-[#E8F2EE] text-[#0F4C3A] border border-[#A7D7C5] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span>✓</span>
            <span>{language === 'bn' ? 'প্রকাশিত (Active)' : 'Published'}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span>✕</span>
            <span>{language === 'bn' ? 'প্রত্যাখ্যাত (Rejected)' : 'Rejected'}</span>
          </span>
        );
      case 'rented':
        return (
          <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {language === 'bn' ? 'ভাড়া সম্পন্ন' : 'Rented'}
          </span>
        );
      default:
        return (
          <span className="bg-[#F3F1EB] text-[#738079] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
            ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </Link>
          <h1 className="text-2xl font-bold text-[#192420] mt-1">
            {language === 'bn' ? 'আমার বাসার লিস্টিং' : 'My Properties'}
          </h1>
          <p className="text-xs text-[#738079]">
            {language === 'bn'
              ? 'আপনার তৈরি করা ড্রাফট, অনুমোদনের জন্য জমা ও প্রকাশিত বাসার তালিকা'
              : 'Manage your property drafts, moderation submissions, and active listings'}
          </p>
        </div>
        <Link to="/dashboard/listings/new">
          <Button variant="primary" size="sm">
            + {language === 'bn' ? 'নতুন বাসা যুক্ত করুন' : 'New Listing'}
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4 text-xs text-[#DC2626]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-12 text-center text-xs text-[#738079]">
          {language === 'bn' ? 'লিস্টিং লোড হচ্ছে...' : 'Loading listings...'}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-12 text-center space-y-3">
          <div className="text-3xl">🏢</div>
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'কোনো লিস্টিং এখনও তৈরি করা হয়নি' : 'No properties listed yet'}
          </h2>
          <p className="text-xs text-[#738079] max-w-sm mx-auto">
            {language === 'bn'
              ? 'নতুন বাসার খসড়া তৈরি করুন এবং যাচাইয়ের পর ভাড়াটিয়াদের জন্য পাবলিশ করুন।'
              : 'Create your first rental draft to submit for verification and find verified tenants.'}
          </p>
          <div className="pt-2">
            <Link to="/dashboard/listings/new">
              <Button variant="primary" size="sm">
                + {language === 'bn' ? 'প্রথম বাসা যোগ করুন' : 'Create First Listing'}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl border border-[#E8E6DF] p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#192420]">
                      {prop.titleBn || (language === 'bn' ? 'শিরোনামহীন খসড়া' : 'Untitled Draft')}
                    </h2>
                    {getStatusBadge(prop.status)}
                  </div>
                  <p className="text-xs text-[#738079]">
                    {prop.area} · {prop.neighbourhood || 'মহল্লা উল্লেখ নেই'} ·{' '}
                    {language === 'bn' ? 'আপডেট:' : 'Updated:'} {formatDhakaDate(prop.updatedAt, language)}
                  </p>
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#0F4C3A] tabular-nums">
                  {formatTaka(prop.monthlyRent, language)}
                  <span className="text-xs font-normal text-[#738079]">/মাস</span>
                </div>
              </div>

              {/* Spec Details */}
              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-[#F3F1EB] text-[#4A5550]">
                <div>
                  <span className="text-[#738079]">{language === 'bn' ? 'বেড:' : 'Beds:'}</span>{' '}
                  <strong>{prop.bedrooms}</strong>
                </div>
                <div>
                  <span className="text-[#738079]">{language === 'bn' ? 'বাথ:' : 'Baths:'}</span>{' '}
                  <strong>{prop.bathrooms}</strong>
                </div>
                <div>
                  <span className="text-[#738079]">{language === 'bn' ? 'আয়তন:' : 'Size:'}</span>{' '}
                  <strong>{prop.sizeSqFt} sqft</strong>
                </div>
              </div>

              {/* Rejection notice if status is rejected */}
              {prop.status === 'rejected' && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl text-xs space-y-1 text-[#DC2626]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{language === 'bn' ? 'প্রশাসকের প্রত্যাখ্যানের কারণ:' : 'Administrator Rejection Reason:'}</span>
                  </div>
                  <p className="text-[#991B1B] leading-relaxed">
                    {prop.rejectionReason || (language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete details')}
                  </p>
                  <p className="text-[11px] text-[#738079] pt-1">
                    {language === 'bn'
                      ? 'ত্রুটিগুলো সংশোধন করতে নিচে "সংশোধন করে জমা দিন" বাটনে চাপুন।'
                      : 'Click "Edit & Resubmit" below to correct the flagged items and resubmit.'}
                  </p>
                </div>
              )}

              {/* Pending review info */}
              {prop.status === 'pending_review' && (
                <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl text-xs text-[#92400E]">
                  🛡️{' '}
                  {language === 'bn'
                    ? 'লিস্টিংটি বর্তমানে প্রশাসক মডারেশন কিউতে যাচাইাধীন রয়েছে। তথ্য যাচাই শেষ হলে এটি স্বয়ংক্রিয়ভাবে সক্রিয় হবে।'
                    : 'This property is currently in the administrator moderation queue. It cannot be edited while under inspection.'}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-[#738079] font-mono">ID: {prop.id}</div>
                <div className="flex items-center gap-2">
                  {/* Draft Actions: Edit, Submit, Delete */}
                  {prop.status === 'draft' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(prop.id)}
                      >
                        <span className="text-[#DC2626]">
                          {language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                        </span>
                      </Button>
                      <Link to={`/dashboard/listings/new?edit=${prop.id}`}>
                        <Button variant="outline" size="sm">
                          {language === 'bn' ? 'ড্রাফট সম্পাদনা' : 'Edit Draft'}
                        </Button>
                      </Link>
                      <Link to={`/dashboard/listings/new?edit=${prop.id}`}>
                        <Button variant="primary" size="sm">
                          {language === 'bn' ? 'জমা দিন' : 'Submit'}
                        </Button>
                      </Link>
                    </>
                  )}

                  {/* Rejected Actions: Edit & Resubmit */}
                  {prop.status === 'rejected' && (
                    <Link to={`/dashboard/listings/new?edit=${prop.id}`}>
                      <Button variant="primary" size="sm">
                        {language === 'bn' ? 'সংশোধন করে জমা দিন' : 'Edit & Resubmit'}
                      </Button>
                    </Link>
                  )}

                  {/* Published: View */}
                  {prop.status === 'published' && (
                    <Link to={`/properties/${prop.id}`}>
                      <Button variant="outline" size="sm">
                        {language === 'bn' ? 'পাবলিক ভিউ দেখুন' : 'View Listing'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E6DF] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? 'ড্রাফট নিশ্চিত মুছে ফেলবেন?' : 'Confirm Delete Draft'}
            </h3>
            <p className="text-xs text-[#738079] leading-relaxed">
              {language === 'bn'
                ? 'এই খসড়াটি সম্পূর্ণভাবে ডেটাবেজ থেকে মুছে যাবে। এটি আর পুনরুদ্ধার করা সম্ভব হবে না।'
                : 'Are you sure you want to permanently delete this draft property? This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDeleteDraft(confirmDeleteId)}
                isLoading={isDeleting}
              >
                {language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const LandlordVisitsPage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'আগত ভিজিট অনুরোধ' : 'Incoming Visit Requests'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'কোনো আগত অনুরোধ নেই।'
          : 'No incoming inspection requests.'}
      </div>
    </div>
  );
};

export const CustomerServicesPage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'আমার গৃহস্থালি সেবার অনুরোধ' : 'My Household Service Requests'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'কোনো সেবার অনুরোধ পাওয়া যায়নি।'
          : 'No service requests found.'}
      </div>
    </div>
  );
};

export const ProviderProfilePage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'সার্ভিস প্রোভাইডার প্রোফাইল' : 'Provider Profile'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'প্রোভাইডার প্রোফাইল ভিউ প্রস্তুত।'
          : 'Provider trade categories and service areas.'}
      </div>
    </div>
  );
};

export const ProviderJobsPage: React.FC = () => {
  const { language } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
        ← {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </Link>
      <h1 className="text-2xl font-bold text-[#192420]">
        {language === 'bn' ? 'বরাদ্দকৃত কাজ (Assigned Jobs)' : 'Assigned Jobs'}
      </h1>
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center text-xs text-[#738079]">
        {language === 'bn'
          ? 'বর্তমানে কোনো কাজ বরাদ্দ নেই। প্রশাসক কাজ অর্পণ করলে তা এখানে দেখা যাবে।'
          : 'No jobs currently assigned.'}
      </div>
    </div>
  );
};
