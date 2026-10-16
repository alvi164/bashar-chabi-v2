import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { ServiceCategory } from '../../types/index.ts';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Select } from '../../components/common/Select.tsx';

export const ServiceRequestPage: React.FC = () => {
  const { language, t } = useTranslation();
  const [searchParams] = useSearchParams();

  const initialCat = (searchParams.get('category') as ServiceCategory) || 'moving';

  const [category, setCategory] = useState<ServiceCategory>(initialCat);
  const [area, setArea] = useState('Mirpur');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [contactPreference, setContactPreference] = useState<'phone' | 'whatsapp'>('phone');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'moving', label: t.serviceMovingTitle },
    { value: 'cleaning', label: t.serviceCleaningTitle },
    { value: 'plumbing', label: t.servicePlumbingTitle },
    { value: 'electrical', label: t.serviceElectricalTitle },
    { value: 'ac_service', label: t.serviceAcTitle },
    { value: 'appliance_repair', label: t.serviceApplianceTitle },
  ];

  const areas = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description =
        language === 'bn'
          ? 'কাজের বিবরণ প্রদান করুন (কমপক্ষে ১০ অক্ষর)'
          : 'Please describe the job or issue';
    } else if (description.length > 800) {
      newErrors.description =
        language === 'bn'
          ? 'বিবরণ সর্বোচ্চ ৮০০ অক্ষরের মধ্যে হতে হবে'
          : 'Description must be under 800 characters';
    }

    if (!preferredDate) {
      newErrors.preferredDate =
        language === 'bn' ? 'তারিখ নির্বাচন আবশ্যক' : 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t.btnBack}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#192420] mt-2">
          {language === 'bn' ? 'বাসার সেবার অনুরোধ পাঠান' : 'Book a Household Service'}
        </h1>
        <p className="text-xs sm:text-sm text-[#738079] mt-1">
          {language === 'bn'
            ? 'আপনার প্রয়োজন অনুযায়ী বিবরণ দিন। প্রশাসক যাচাই করে অনুমোদিত সার্ভিস প্রোভাইডার ঠিক করবেন।'
            : 'Fill in your requirements. An administrator will review and assign an approved provider.'}
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#192420]">
            {language === 'bn' ? 'সেবার অনুরোধ প্রস্তুত করা হয়েছে' : 'Service Request Ready'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5550] max-w-md mx-auto leading-relaxed">
            {language === 'bn'
              ? 'ধাপ ১ আর্কিটেকচার সম্পন্ন। ফায়ারবেস অথেন্টিকেশন ও ক্লাউড ফায়ারস্টোর সংযুক্ত হলে এই তথ্য ডাটাবেজে সংরক্ষিত হবে এবং প্রশাসকের মডারেশন কিউতে জমা পড়বে।'
              : 'Service request form submitted. In live mode, this request will be stored in Firestore serviceRequests collection and assigned by administrators.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSubmitted(false);
                setDescription('');
              }}
            >
              {language === 'bn' ? 'আরেকটি অনুরোধ করুন' : 'Submit Another'}
            </Button>
            <Link to="/services">
              <Button variant="primary" size="sm">
                {language === 'bn' ? 'সেবা তালিকা' : 'Back to Services'}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-5 shadow-xs">
          {/* Category */}
          <Select
            label={language === 'bn' ? 'সেবার ধরন' : 'Service Category'}
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            required
          />

          {/* Area */}
          <Select
            label={language === 'bn' ? 'ঢাকা এলাকা' : 'Dhaka Area'}
            options={areas}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={language === 'bn' ? 'কাজের তারিখ' : 'Preferred Date'}
              type="date"
              required
              error={errors.preferredDate}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-[#192420] mb-1.5">
                {language === 'bn' ? 'পছন্দের সময়' : 'Time Window'}
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] bg-white text-sm"
              >
                <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#192420] mb-1.5">
              {language === 'bn' ? 'কাজের বিবরণ (সমস্যা বা প্রয়োজনীয়তা)' : 'Job or Issue Description'}
              <span className="text-[#D97706] font-bold ml-1">*</span>
            </label>
            <textarea
              rows={4}
              maxLength={800}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'যেমন: বাসার লিভিং রুমের ১টি এসি ঠান্ডা হচ্ছে না এবং ফিল্টার পরিষ্কার প্রয়োজন...'
                  : 'E.g., Living room AC is not cooling properly and needs filter cleaning...'
              }
              className={`w-full p-3.5 rounded-xl border bg-white text-sm text-[#192420] transition-colors ${
                errors.description ? 'border-[#DC2626]' : 'border-[#D8D5CD]'
              }`}
            />
            <div className="flex justify-between items-center text-xs mt-1">
              <span className={errors.description ? 'text-[#DC2626]' : 'text-[#738079]'}>
                {errors.description || (language === 'bn' ? 'কমপক্ষে ১০ অক্ষর' : 'Min 10 characters')}
              </span>
              <span className="text-[#738079] tabular-nums">{description.length}/800</span>
            </div>
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-sm font-medium text-[#192420] mb-2">
              {language === 'bn' ? 'যোগাযোগের মাধ্যম' : 'Contact Preference'}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-[#192420] cursor-pointer">
                <input
                  type="radio"
                  name="contact"
                  value="phone"
                  checked={contactPreference === 'phone'}
                  onChange={() => setContactPreference('phone')}
                  className="accent-[#0F4C3A]"
                />
                <span>{language === 'bn' ? 'সরাসরি ফোন' : 'Direct Phone'}</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-[#192420] cursor-pointer">
                <input
                  type="radio"
                  name="contact"
                  value="whatsapp"
                  checked={contactPreference === 'whatsapp'}
                  onChange={() => setContactPreference('whatsapp')}
                  className="accent-[#0F4C3A]"
                />
                <span>WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#F3F1EB]">
            <Button type="submit" variant="primary" fullWidth size="lg">
              {t.btnSubmit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
