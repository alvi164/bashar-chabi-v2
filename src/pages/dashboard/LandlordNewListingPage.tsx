import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Select } from '../../components/common/Select.tsx';
import { PropertyType, FurnishingStatus, TenantEligibility, Property } from '../../types/index.ts';
import { validatePropertyInput } from '../../utils/validation.ts';
import { formatTaka } from '../../utils/currency.ts';
import { propertyRepository } from '../../repositories/propertyRepository.ts';

export const LandlordNewListingPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { currentUser, userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const editId = searchParams.get('edit');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProperty, setExistingProperty] = useState<Property | null>(null);

  // Form State
  const [propertyId, setPropertyId] = useState<string | null>(editId);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [monthlyRent, setMonthlyRent] = useState<number>(20000);
  const [deposit, setDeposit] = useState<number>(40000);
  const [serviceCharge, setServiceCharge] = useState<number>(3000);

  const [area, setArea] = useState('Mirpur');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [privateAddress, setPrivateAddress] = useState('');

  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [sizeSqFt, setSizeSqFt] = useState<number>(1200);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('unfurnished');
  const [tenantEligibility, setTenantEligibility] = useState<TenantEligibility>('family');
  const [availableFrom, setAvailableFrom] = useState('2026-11-01');

  const [utilities, setUtilities] = useState({
    gas: true,
    water: true,
    electricity: true,
    generator: false,
    lift: true,
    security: true,
    wifi: false,
    parking: false,
  });

  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [operationError, setOperationError] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<'draft' | 'pending_review' | null>(null);

  // Load existing property when editing draft or rejected listing
  useEffect(() => {
    if (!editId) return;
    const fetchExisting = async () => {
      setLoadingInitial(true);
      try {
        const prop = await propertyRepository.getPropertyById(editId);
        if (prop) {
          setExistingProperty(prop);
          setPropertyId(prop.id);
          setTitleBn(prop.titleBn || '');
          setTitleEn(prop.titleEn || '');
          setPropertyType(prop.propertyType || 'apartment');
          setMonthlyRent(prop.monthlyRent || 20000);
          setDeposit(prop.deposit || 0);
          setServiceCharge(prop.serviceCharge || 0);
          setArea(prop.area || 'Mirpur');
          setNeighbourhood(prop.neighbourhood || '');
          setPrivateAddress(prop.privateAddress || '');
          setBedrooms(prop.bedrooms || 2);
          setBathrooms(prop.bathrooms || 1);
          setSizeSqFt(prop.sizeSqFt || 800);
          setFurnishing(prop.furnishing || 'unfurnished');
          setTenantEligibility(prop.tenantEligibility || 'family');
          setAvailableFrom(prop.availableFrom || '');
          if (prop.utilities) setUtilities(prop.utilities);
          setDescriptionBn(prop.descriptionBn || '');
          setDescriptionEn(prop.descriptionEn || '');
          setImageUrls(prop.imageUrls || []);
        }
      } catch (err) {
        console.error('Error fetching property for edit:', err);
        setOperationError(language === 'bn' ? 'লিস্টিং তথ্য লোড করা যায়নি' : 'Could not load listing');
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchExisting();
  }, [editId, language]);

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (imageUrls.length >= 8) {
      setOperationError(language === 'bn' ? 'সর্বোচ্চ ৮টি ছবি যোগ করা যাবে' : 'Maximum 8 images allowed');
      return;
    }
    if (!imageUrlInput.startsWith('https://')) {
      setOperationError(language === 'bn' ? 'ছবি অবশ্যই https:// সুরক্ষিত লিঙ্ক হতে হবে' : 'Must be secure https:// URL');
      return;
    }
    setImageUrls([...imageUrls, imageUrlInput.trim()]);
    setImageUrlInput('');
    setOperationError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    setValidationErrors({});
    setOperationError(null);
    if (step < 5) {
      setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handlePrevStep = () => {
    setOperationError(null);
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  const getPayload = (): Partial<Property> => ({
    titleBn: titleBn.trim(),
    titleEn: titleEn.trim() || undefined,
    descriptionBn: descriptionBn.trim(),
    descriptionEn: descriptionEn.trim() || undefined,
    propertyType,
    monthlyRent: Number(monthlyRent),
    deposit: Number(deposit),
    serviceCharge: Number(serviceCharge),
    area,
    neighbourhood: neighbourhood.trim(),
    privateAddress: privateAddress.trim(),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    sizeSqFt: Number(sizeSqFt),
    furnishing,
    tenantEligibility,
    utilities,
    availableFrom,
    imageUrls,
  });

  const handleSaveDraft = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setOperationError(null);
    setIsSubmitting(true);

    try {
      const payload = getPayload();
      if (propertyId) {
        await propertyRepository.updateDraft(propertyId, currentUser.uid, payload);
      } else {
        const created = await propertyRepository.createDraft(currentUser.uid, payload);
        setPropertyId(created.id);
      }
      setSubmittedStatus('draft');
    } catch (err: unknown) {
      console.error('Error saving draft:', err);
      setOperationError(
        (err as Error).message ||
          (language === 'bn' ? 'ড্রাফট সংরক্ষণ ব্যর্থ হয়েছে' : 'Failed to save draft')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const payload = getPayload();
    const result = validatePropertyInput({
      titleBn: payload.titleBn || '',
      monthlyRent: payload.monthlyRent || 0,
      deposit: payload.deposit || 0,
      serviceCharge: payload.serviceCharge || 0,
      area: payload.area || '',
      bedrooms: payload.bedrooms || 0,
      bathrooms: payload.bathrooms || 0,
      sizeSqFt: payload.sizeSqFt || 0,
      descriptionBn: payload.descriptionBn || '',
      imageUrls: payload.imageUrls || [],
    });

    if (!result.isValid) {
      setValidationErrors(result.errors);
      return;
    }

    if (!payload.availableFrom) {
      setValidationErrors({ availableFrom: 'Available from date is required' });
      return;
    }

    setOperationError(null);
    setIsSubmitting(true);

    try {
      let targetId = propertyId;
      if (!targetId) {
        // Create draft first, then submit
        const created = await propertyRepository.createDraft(currentUser.uid, payload);
        targetId = created.id;
        setPropertyId(created.id);
      }

      await propertyRepository.submitForReview(targetId, currentUser.uid, payload);
      setSubmittedStatus('pending_review');
    } catch (err: unknown) {
      console.error('Error submitting property for review:', err);
      setOperationError(
        (err as Error).message ||
          (language === 'bn' ? 'অনুমোদনের জন্য জমা দেওয়া ব্যর্থ হয়েছে' : 'Submission failed')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const areaOptions = [
    { value: 'Mirpur', label: 'Mirpur (মিরপুর)' },
    { value: 'Uttara', label: 'Uttara (উত্তরা)' },
    { value: 'Dhanmondi', label: 'Dhanmondi (ধানমন্ডি)' },
    { value: 'Badda', label: 'Badda (বাড্ডা)' },
    { value: 'Mohammadpur', label: 'Mohammadpur (মোহাম্মদপুর)' },
    { value: 'Gulshan', label: 'Gulshan (গুলশান)' },
    { value: 'Banani', label: 'Banani (বনানী)' },
    { value: 'Rampura', label: 'Rampura (রামপুরা)' },
    { value: 'Bashundhara R/A', label: 'Bashundhara R/A (বসুন্ধরা)' },
  ];

  if (loadingInitial) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-[#738079]">
        {language === 'bn' ? 'লিস্টিং তথ্য লোড হচ্ছে...' : 'Loading listing data...'}
      </div>
    );
  }

  // Authorization banner if not landlord
  const isAuthorizedRole = userProfile?.selectedRole === 'landlord_or_agent';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/dashboard/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{language === 'bn' ? 'আমার লিস্টিং তালিকা' : 'My Listings'}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#192420] mt-1.5">
          {existingProperty
            ? language === 'bn'
              ? 'লিস্টিং সম্পাদনা ও পুনঃজমা'
              : 'Edit & Resubmit Listing'
            : language === 'bn'
            ? 'নতুন ভাড়ার বাসা যুক্ত করুন'
            : 'List a Rental Property'}
        </h1>
        <p className="text-xs sm:text-sm text-[#738079]">
          {language === 'bn'
            ? 'ধাপ অনুযায়ী তথ্য পূরণ করে ড্রাফট সংরক্ষণ করুন বা প্রশাসকের অনুমোদনের জন্য পাঠান'
            : 'Complete the steps below to save a draft or submit for administrator review'}
        </p>
      </div>

      {!isAuthorizedRole && currentUser && (
        <div className="bg-[#FEF3C7] border border-[#F59E0B] p-4 rounded-2xl text-xs text-[#92400E]">
          <strong>{language === 'bn' ? 'সতর্কবার্তা:' : 'Notice:'}</strong>{' '}
          {language === 'bn'
            ? 'আপনার সক্রিয় ভূমিকা "বাড়িওয়ালা বা প্রতিনিধি" নয়। বাসা তৈরি ও পরিচালনার জন্য বাড়িওয়ালা ভূমিকা প্রয়োজন।'
            : 'Your active account role is not landlord_or_agent. Only authenticated landlords can submit and manage property drafts.'}
        </div>
      )}

      {/* Rejection reason banner if rejected */}
      {existingProperty?.status === 'rejected' && existingProperty.rejectionReason && (
        <div className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4 sm:p-5 text-xs space-y-1 text-[#DC2626]">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>⚠️</span>
            <span>
              {language === 'bn' ? 'প্রশাসকের পর্যালোচনার কারণ (Rejection Notice):' : 'Administrator Rejection Reason:'}
            </span>
          </div>
          <p className="pl-6 text-[#991B1B] font-medium leading-relaxed">
            {existingProperty.rejectionReason}
          </p>
          <p className="pl-6 text-[11px] text-[#738079] pt-1">
            {language === 'bn'
              ? 'নিচের ফর্মটিতে উল্লেখিত ত্রুটিগুলো সংশোধন করে পুনরায় "অনুমোদনের জন্য জমা দিন" বাটনে চাপুন।'
              : 'Please correct the issues noted above and resubmit the listing for moderation.'}
          </p>
        </div>
      )}

      {operationError && (
        <div className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4 text-xs text-[#DC2626]">
          {operationError}
        </div>
      )}

      {/* 5-Step Indicator */}
      <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 flex items-center justify-between text-xs font-semibold">
        {[
          { num: 1, labelBn: 'মূল তথ্য', labelEn: 'Basics' },
          { num: 2, labelBn: 'অবস্থান', labelEn: 'Location' },
          { num: 3, labelBn: 'বৈশিষ্ট্য', labelEn: 'Details' },
          { num: 4, labelBn: 'বিবরণ ও ছবি', labelEn: 'Media' },
          { num: 5, labelBn: 'প্রিভিউ', labelEn: 'Review' },
        ].map((item) => (
          <div
            key={item.num}
            className={`flex items-center gap-1.5 ${
              step === item.num
                ? 'text-[#0F4C3A] font-bold'
                : step > item.num
                ? 'text-[#4A5550]'
                : 'text-[#9DA7A2]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === item.num
                  ? 'bg-[#0F4C3A] text-white'
                  : step > item.num
                  ? 'bg-[#E8F2EE] text-[#0F4C3A]'
                  : 'bg-[#F3F1EB] text-[#738079]'
              }`}
            >
              {step > item.num ? '✓' : item.num}
            </span>
            <span className="hidden sm:inline">
              {language === 'bn' ? item.labelBn : item.labelEn}
            </span>
          </div>
        ))}
      </div>

      {submittedStatus ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto text-2xl">
            {submittedStatus === 'draft' ? '📝' : '🛡️'}
          </div>
          <h2 className="text-xl font-bold text-[#192420]">
            {submittedStatus === 'draft'
              ? language === 'bn'
                ? 'খসড়া (Draft) হিসেবে Firestore-এ সফলভাবে সংরক্ষিত'
                : 'Saved as Draft in Firestore'
              : language === 'bn'
              ? 'মডারেশনের জন্য সফলভাবে জমা দেওয়া হয়েছে'
              : 'Submitted for Administrator Review'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5550] max-w-md mx-auto leading-relaxed">
            {submittedStatus === 'draft'
              ? language === 'bn'
                ? 'আপনার বাসার খসড়া ডেটাবেজে সংরক্ষিত রয়েছে। আপনি যেকোনো সময় ফিরে এসে এটি সংশোধন বা সাবমিট করতে পারবেন।'
                : 'Your listing is saved as a secure draft. You can continue editing or submit it for review at any time.'
              : language === 'bn'
              ? 'বাসার চাবি প্রশাসক কর্তৃক তথ্য ও সত্যতা যাচাইয়ের পর এটি অনুমোদিত ও প্রকাশিত হবে। জমা দেওয়ামাত্র সরাসরি পাবলিশ হয় না।'
              : 'Submission received. An administrator will inspect the details in the moderation queue before publishing.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmittedStatus(null);
                setStep(1);
              }}
            >
              {language === 'bn' ? 'ফর্মে ফিরে যান' : 'Back to Form'}
            </Button>
            <Link to="/dashboard/listings">
              <Button variant="primary" size="sm">
                {language === 'bn' ? 'আমার লিস্টিং দেখুন' : 'View My Listings'}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-6 shadow-xs">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ধাপ ১: প্রাথমিক তথ্যাবলী' : 'Step 1: Basic Information'}
              </h2>

              <Input
                label={language === 'bn' ? 'বাংলা শিরোনাম' : 'Bangla Title'}
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: মিরপুর ২ এ মনোরম পারিবারিক ফ্ল্যাট ভাড়া হবে"
              />

              <Input
                label={language === 'bn' ? 'ইংরেজি শিরোনাম' : 'English Title'}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="E.g., Beautiful Family Flat in Mirpur 2"
              />

              <Select
                label={language === 'bn' ? 'বাসার ধরন' : 'Property Type'}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                options={[
                  { value: 'apartment', label: language === 'bn' ? 'অ্যাপার্টমেন্ট' : 'Apartment' },
                  { value: 'house', label: language === 'bn' ? 'সম্পূর্ণ বাড়ি' : 'Full House' },
                  { value: 'room', label: language === 'bn' ? 'রুম' : 'Single Room' },
                  { value: 'sublet', label: language === 'bn' ? 'সাবলেট' : 'Sublet' },
                  { value: 'mess_seat', label: language === 'bn' ? 'মেস সিট' : 'Mess Seat' },
                ]}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label={t.propertyRent}
                  type="number"
                  min={1}
                  required
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                />
                <Input
                  label={t.propertyDeposit}
                  type="number"
                  min={0}
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                />
                <Input
                  label={t.propertyServiceCharge}
                  type="number"
                  min={0}
                  required
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ধাপ ২: অবস্থান ও ঠিকানা' : 'Step 2: Location'}
              </h2>

              <Select
                label={language === 'bn' ? 'ঢাকা এলাকা' : 'Dhaka Area'}
                options={areaOptions}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />

              <Input
                label={language === 'bn' ? 'মহল্লা / রোড / সেক্টর' : 'Neighbourhood / Sector'}
                required
                value={neighbourhood}
                onChange={(e) => setNeighbourhood(e.target.value)}
                placeholder="যেমন: সেক্টর ৭, রোড ১২ অথবা ব্লক সি"
              />

              {/* Private Address: Confidential Field */}
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#D8D5CD] space-y-2">
                <label className="block text-sm font-semibold text-[#192420]">
                  {language === 'bn' ? 'সুনির্দিষ্ট অভ্যন্তরীণ ঠিকানা (গোপনীয়)' : 'Private Address (Confidential)'}
                </label>
                <textarea
                  rows={3}
                  value={privateAddress}
                  onChange={(e) => setPrivateAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি নম্বর ১২/এ, ফ্ল্যাট ৪বি..."
                  className="w-full p-3 rounded-xl border border-[#D8D5CD] bg-white text-sm"
                />
                <p className="text-[11px] text-[#0F4C3A] font-medium leading-relaxed">
                  🛡️{' '}
                  {language === 'bn'
                    ? 'নিরাপত্তা বার্তা: এই বিস্তারিত ঠিকানাটি পাবলিক সার্চে প্রদর্শিত হবে না। এটি শুধুমাত্র আপনি এবং অনুমোদিত প্রশাসক দেখতে পাবেন।'
                    : 'Security Guarantee: This private address is never exposed in public searches or queries. Only you and authorized admins have access.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ধাপ ৩: বাসার বৈশিষ্ট্য ও সুবিধা' : 'Step 3: Property Details'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label={t.propertyBedrooms}
                  type="number"
                  min={0}
                  max={20}
                  required
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                />
                <Input
                  label={t.propertyBathrooms}
                  type="number"
                  min={0}
                  max={20}
                  required
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                />
                <Input
                  label={t.propertySize}
                  type="number"
                  min={50}
                  required
                  value={sizeSqFt}
                  onChange={(e) => setSizeSqFt(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label={t.propertyFurnishing}
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                  options={[
                    { value: 'unfurnished', label: language === 'bn' ? 'আসবাবপত্রহীন' : 'Unfurnished' },
                    { value: 'semi_furnished', label: language === 'bn' ? 'আংশিক আসবাবপত্র' : 'Semi-Furnished' },
                    { value: 'furnished', label: language === 'bn' ? 'পূর্ণাঙ্গ আসবাবপত্র' : 'Furnished' },
                  ]}
                  required
                />
                <Select
                  label={t.propertyEligibility}
                  value={tenantEligibility}
                  onChange={(e) => setTenantEligibility(e.target.value as TenantEligibility)}
                  options={[
                    { value: 'family', label: language === 'bn' ? 'পরিবার' : 'Family' },
                    { value: 'bachelor_male', label: language === 'bn' ? 'ব্যাচেলর (ছেলে)' : 'Bachelor (Male)' },
                    { value: 'bachelor_female', label: language === 'bn' ? 'ব্যাচেলর (মেয়ে)' : 'Bachelor (Female)' },
                    { value: 'any', label: language === 'bn' ? 'যেকোনো' : 'Any' },
                  ]}
                  required
                />
              </div>

              <Input
                label={t.propertyAvailableFrom}
                type="date"
                required
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              />

              {/* Utility Checkboxes */}
              <div>
                <label className="block text-sm font-semibold text-[#192420] mb-2">
                  {t.propertyUtilities}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {Object.keys(utilities).map((uKey) => {
                    const typedKey = uKey as keyof typeof utilities;
                    return (
                      <label
                        key={typedKey}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-[#D8D5CD] bg-[#FAF9F5] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={utilities[typedKey]}
                          onChange={(e) =>
                            setUtilities({ ...utilities, [typedKey]: e.target.checked })
                          }
                          className="accent-[#0F4C3A] w-4 h-4 rounded"
                        />
                        <span className="capitalize">{typedKey}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DESCRIPTION & IMAGES */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ধাপ ৪: বিবরণ ও ছবি' : 'Step 4: Description & Photos'}
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#192420] mb-1">
                  {language === 'bn' ? 'বাংলা বিস্তারিত বিবরণ' : 'Bangla Description'}
                  <span className="text-[#D97706] font-bold ml-1">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="বাসাটির সুযোগ-সুবিধা, পরিবেশ এবং সার্বিক বিবরণ..."
                  className="w-full p-3.5 rounded-xl border border-[#D8D5CD] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#192420] mb-1">
                  {language === 'bn' ? 'ইংরেজি বিবরণ' : 'English Description'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="English description..."
                  className="w-full p-3.5 rounded-xl border border-[#D8D5CD] text-sm"
                />
              </div>

              {/* HTTPS Image URLs */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#192420]">
                  {language === 'bn'
                    ? 'বাসার ছবির লিঙ্ক (সর্বোচ্চ ৮টি HTTPS লিঙ্ক)'
                    : 'Property Photo Links (Max 8 HTTPS URLs)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] text-sm"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddImage}>
                    {language === 'bn' ? 'যুক্ত করুন' : 'Add'}
                  </Button>
                </div>

                {imageUrls.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {imageUrls.map((url, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF] text-xs"
                      >
                        <span className="truncate max-w-[80%] font-mono text-[#4A5550]">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="text-[#DC2626] font-bold px-2 py-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & SUBMISSION */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-base font-bold text-[#192420]">
                {language === 'bn' ? 'ধাপ ৫: প্রিভিউ ও চূড়ান্ত জমা' : 'Step 5: Preview & Submission'}
              </h2>

              <div className="bg-[#FAF9F5] rounded-2xl border border-[#E8E6DF] p-5 space-y-3 text-sm">
                <div className="flex justify-between items-baseline border-b border-[#E8E6DF] pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#192420]">{titleBn || 'শিরোনামহীন বাসা'}</h3>
                    <p className="text-xs text-[#738079]">
                      {area} · {neighbourhood}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-[#0F4C3A] tabular-nums">
                    {formatTaka(monthlyRent, language)}/মাস
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-2">
                  <div>
                    <span className="text-[#738079]">বেড:</span>{' '}
                    <strong className="text-[#192420]">{bedrooms}</strong>
                  </div>
                  <div>
                    <span className="text-[#738079]">বাথ:</span>{' '}
                    <strong className="text-[#192420]">{bathrooms}</strong>
                  </div>
                  <div>
                    <span className="text-[#738079]">আয়তন:</span>{' '}
                    <strong className="text-[#192420]">{sizeSqFt} sqft</strong>
                  </div>
                </div>

                <p className="text-xs text-[#4A5550] leading-relaxed pt-2 border-t border-[#E8E6DF]">
                  {descriptionBn || 'কোনো বিবরণ যোগ করা হয়নি'}
                </p>

                {imageUrls.length > 0 && (
                  <div className="pt-2 border-t border-[#E8E6DF] text-xs text-[#738079]">
                    <span>সংযুক্ত ছবি: </span>
                    <strong className="text-[#0F4C3A]">{imageUrls.length}টি HTTPS লিংক</strong>
                  </div>
                )}
              </div>

              {/* Validation errors if any */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4 text-xs text-[#DC2626] space-y-1">
                  <strong>{language === 'bn' ? 'অনুগ্রহ করে নিচের ত্রুটিগুলো সংশোধন করুন:' : 'Please correct errors:'}</strong>
                  {Object.entries(validationErrors).map(([field, err]) => (
                    <div key={field}>• {err}</div>
                  ))}
                </div>
              )}

              <div className="bg-[#E8F2EE] rounded-2xl p-4 text-xs text-[#0F4C3A]">
                <strong>{language === 'bn' ? 'গুরুত্বপূর্ণ ঘোষণা:' : 'Important Notice:'}</strong>{' '}
                {language === 'bn'
                  ? 'অনুমোদনের জন্য জমা দেওয়া হলে প্রশাসক লিস্টিংটি পর্যালোচনা করবেন। তথ্য সঠিক প্রমাণিত হলে এটি "published" স্ট্যাটাসে সক্রিয় হবে।'
                  : 'Submitting does not immediately publish the listing. An administrator will review and verify it.'}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-[#F3F1EB] flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} disabled={isSubmitting}>
                {language === 'bn' ? '← পূর্ববর্তী' : '← Previous'}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                isLoading={isSubmitting && !validationErrors}
              >
                {language === 'bn' ? 'খসড়া সংরক্ষণ (Draft)' : 'Save Draft'}
              </Button>

              {step < 5 ? (
                <Button type="button" variant="primary" size="sm" onClick={handleNextStep}>
                  {language === 'bn' ? 'পরবর্তী →' : 'Next →'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitForReview}
                  isLoading={isSubmitting}
                >
                  {language === 'bn' ? 'অনুমোদনের জন্য জমা দিন' : 'Submit for Review'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
