import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { formatTaka } from '../../utils/currency.ts';
import { formatDhakaDate } from '../../utils/date.ts';
import { Button } from '../../components/common/Button.tsx';
import { Modal } from '../../components/common/Modal.tsx';
import { Input } from '../../components/common/Input.tsx';

export const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { language, t } = useTranslation();

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  // Form states for visit request
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [note, setNote] = useState('');

  // Sample data fallback for Phase 1 view
  const property = {
    id: propertyId || 'demo-prop-1',
    titleBn: 'মিরপুর ২ এ মনোরম পারিবারিক ৩ বেডের ফ্ল্যাট',
    titleEn: 'Spacious 3-Bedroom Family Flat in Mirpur 2',
    descriptionBn:
      'মিরপুর ২ এর প্রধান সড়কের কাছে সম্পূর্ণ খোলামেলা ও আলো-বাতাসপূর্ণ ৩ বেডরুমের পারিবারিক ফ্ল্যাট। ড্রয়িং ও ডাইনিং স্পেস আলাদা। দুটি এটাচড ও একটি কমন বাথরুম। সার্বক্ষণিক লিফট, জেনারেটর ব্যাকআপ ও ২৪/৭ সিকিউরিটি গার্ড সুবিধা রয়েছে।',
    descriptionEn:
      'Spacious and airy 3-bedroom apartment located near the main road in Mirpur 2. Separate drawing and dining area, 2 attached bathrooms, and 1 common bathroom. Full amenities including 24/7 lift, backup generator, and round-the-clock security guards.',
    monthlyRent: 24000,
    deposit: 48000,
    serviceCharge: 3500,
    area: 'Mirpur',
    neighbourhood: 'Section 2, Block C',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqFt: 1350,
    furnishing: 'unfurnished',
    tenantEligibility: 'family',
    availableFrom: '2026-11-01',
    lastConfirmedAt: '2026-10-14',
    utilities: {
      gas: true,
      water: true,
      electricity: true,
      generator: true,
      lift: true,
      security: true,
      wifi: true,
      parking: true,
    },
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSubmitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t.btnBack}</span>
        </Link>
      </div>

      {/* Mandatory Safety Notice Banner */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="text-xs sm:text-sm text-[#78350F]">
          <strong className="block font-bold mb-0.5">{t.safetyNoticeHeadline}</strong>
          “{t.safetyNoticeBody}”
        </div>
      </div>

      {/* Main Grid: Details + Sticky Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery placeholder */}
          <div className="aspect-[16/10] bg-[#F3F1EB] rounded-2xl border border-[#E8E6DF] flex flex-col items-center justify-center text-[#738079] p-6">
            <svg
              className="w-12 h-12 text-[#0F4C3A]/30 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <p className="text-xs font-medium">
              {language === 'bn'
                ? 'বাসার চাবি — নিরাপদ ইমেজ প্রিভিউ গ্যালারি'
                : 'Bashar Chabi — Secure Preview Gallery'}
            </p>
          </div>

          {/* Title & Location */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#192420]">
              {language === 'bn' ? property.titleBn : property.titleEn}
            </h1>
            <p className="text-sm text-[#738079]">
              {property.area} · {property.neighbourhood}
            </p>
          </div>

          {/* Key Facts Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-4 border-y border-[#E8E6DF] text-center">
            <div className="p-2">
              <span className="block text-xs text-[#738079]">{t.propertyBedrooms}</span>
              <span className="text-base sm:text-lg font-bold text-[#192420] tabular-nums">
                {property.bedrooms}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-xs text-[#738079]">{t.propertyBathrooms}</span>
              <span className="text-base sm:text-lg font-bold text-[#192420] tabular-nums">
                {property.bathrooms}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-xs text-[#738079]">{t.propertySize}</span>
              <span className="text-base sm:text-lg font-bold text-[#192420] tabular-nums">
                {property.sizeSqFt} sqft
              </span>
            </div>
            <div className="p-2 col-span-3 sm:col-span-1">
              <span className="block text-xs text-[#738079]">{t.propertyEligibility}</span>
              <span className="text-sm font-semibold text-[#0F4C3A]">
                {property.tenantEligibility === 'family' ? 'পরিবার' : 'সবার জন্য'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#192420]">
              {language === 'bn' ? 'বাসার বিস্তারিত বিবরণ' : 'Property Description'}
            </h2>
            <p className="text-sm text-[#4A5550] leading-relaxed">
              {language === 'bn' ? property.descriptionBn : property.descriptionEn}
            </p>
          </div>

          {/* Utilities & Amenities */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#192420]">{t.propertyUtilities}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(property.utilities).map(([key, enabled]) => (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    enabled
                      ? 'border-[#D4E6DF] bg-[#E8F2EE] text-[#0F4C3A] font-medium'
                      : 'border-[#E8E6DF] bg-white text-[#9DA7A2]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span className="capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 shadow-sm space-y-6 sticky top-20">
            <div>
              <span className="text-xs text-[#738079]">{t.propertyRent}</span>
              <div className="text-3xl font-extrabold text-[#0F4C3A] tabular-nums mt-0.5">
                {formatTaka(property.monthlyRent, language)}
                <span className="text-xs font-normal text-[#738079] ml-1">
                  {language === 'bn' ? '/মাস' : '/month'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#4A5550] py-3 border-y border-[#F3F1EB]">
              <div className="flex justify-between">
                <span>{t.propertyDeposit}:</span>
                <span className="font-semibold tabular-nums">
                  {formatTaka(property.deposit, language)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.propertyServiceCharge}:</span>
                <span className="font-semibold tabular-nums">
                  {formatTaka(property.serviceCharge, language)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.propertyAvailableFrom}:</span>
                <span className="font-semibold tabular-nums">
                  {formatDhakaDate(property.availableFrom, language)}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setIsVisitModalOpen(true)}
              >
                {t.btnRequestVisit}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  {isCopied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : t.btnShare}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  {t.btnReport}
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-[#738079] text-center leading-relaxed">
              {language === 'bn'
                ? 'লগইন করে বাড়িওয়ালার সাথে সরাসরি নিরাপদ ভিজিট বুক করুন।'
                : 'Sign in to schedule a direct, verified property inspection visit.'}
            </p>
          </div>
        </div>
      </div>

      {/* Visit Request Modal Dialog */}
      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setVisitSubmitted(false);
        }}
        title={t.btnRequestVisit}
      >
        {visitSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? 'ভিজিট অনুরোধ প্রস্তুত' : 'Visit Request Ready'}
            </h3>
            <p className="text-xs text-[#4A5550]">
              {language === 'bn'
                ? 'ফেজ ১ এ স্থাপত্য ও ইন্টারফেস তৈরি সম্পন্ন হয়েছে। ফেজ ২ এ ফায়ারবেস অথেন্টিকেশন কানেক্ট হলে এই অনুরোধ সরাসরি মালিকের ড্যাশবোর্ডে জমা হবে।'
                : 'Phase 1 architectural UI ready. In Phase 2, this request will be securely submitted to Cloud Firestore for landlord confirmation.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsVisitModalOpen(false);
                setVisitSubmitted(false);
              }}
            >
              {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitVisit} className="space-y-4">
            <Input
              label={language === 'bn' ? 'পছন্দের তারিখ' : 'Preferred Date'}
              type="date"
              required
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-[#192420] mb-1">
                {language === 'bn' ? 'পছন্দের সময়সূচি' : 'Preferred Time Slot'}
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] bg-white text-sm"
              >
                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#192420] mb-1">
                {language === 'bn' ? 'মালিকের উদ্দেশ্যে বার্তা (ঐচ্ছিক)' : 'Note for Landlord (Optional)'}
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={language === 'bn' ? 'সর্বোচ্চ ৩০০ অক্ষর' : 'Max 300 characters'}
                className="w-full p-3 rounded-xl border border-[#D8D5CD] bg-white text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsVisitModalOpen(false)}
              >
                {t.btnCancel}
              </Button>
              <Button type="submit" variant="primary">
                {t.btnSubmit}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Report Modal Dialog */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportSubmitted(false);
        }}
        title={t.btnReport}
      >
        {reportSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <p className="text-sm font-semibold text-[#192420]">
              {language === 'bn' ? 'অভিযোগ সফলভাবে জমা দেওয়া হয়েছে' : 'Report submitted successfully'}
            </p>
            <p className="text-xs text-[#738079]">
              {language === 'bn' ? 'আমাদের মডারেশন টিম তথ্যটি পর্যবেক্ষণ করবে।' : 'Our moderation team will review this listing.'}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportSubmitted(false);
                }}
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#738079]">
              {language === 'bn'
                ? 'সন্দেহজনক লিস্টিং বা ভুল তথ্যের বিরুদ্ধে অভিযোগ করুন। আমাদের মডারেশন টিম এটি খতিয়ে দেখবে।'
                : 'Submit a report for suspicious listings or incorrect information for administrator review.'}
            </p>
            <select className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8D5CD] bg-white text-sm">
              <option>{language === 'bn' ? 'ভুল ভাড়ার পরিমাণ' : 'Incorrect rent price'}</option>
              <option>{language === 'bn' ? 'অবিশ্বস্ত বা সন্দেহজনক মালিক' : 'Suspicious landlord'}</option>
              <option>{language === 'bn' ? 'ইতিমধ্যে ভাড়া হয়ে গেছে' : 'Already rented'}</option>
              <option>{language === 'bn' ? 'অন্যান্য কারণ' : 'Other reasons'}</option>
            </select>
            <textarea
              rows={3}
              placeholder={language === 'bn' ? 'অভিযোগের বিবরণ দিন...' : 'Describe the issue...'}
              className="w-full p-3 rounded-xl border border-[#D8D5CD] bg-white text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportSubmitted(false);
                }}
              >
                {t.btnCancel}
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setReportSubmitted(true);
                }}
              >
                {t.btnSubmit}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
