import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/index.ts';
import { formatTaka } from '../../utils/currency.ts';
import { formatDhakaDate } from '../../utils/date.ts';
import { useTranslation } from '../../localization/LanguageContext.tsx';

interface PropertyCardProps {
  property: Property;
  onSaveFavourite?: (propertyId: string) => void;
  isFavourite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSaveFavourite,
  isFavourite = false,
}) => {
  const { language, t, resolveBilingual } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  // Property type labels
  const propertyTypeLabels: Record<string, { bn: string; en: string }> = {
    apartment: { bn: 'অ্যাপার্টমেন্ট', en: 'Apartment' },
    house: { bn: 'সম্পূর্ণ বাড়ি', en: 'Full House' },
    room: { bn: 'সাবলেট / রুম', en: 'Single Room' },
    sublet: { bn: 'সাবলেট', en: 'Sublet' },
    mess_seat: { bn: 'মেস সিট', en: 'Mess Seat' },
  };

  // Furnishing labels
  const furnishingLabels: Record<string, { bn: string; en: string }> = {
    unfurnished: { bn: 'আসবাবপত্রহীন', en: 'Unfurnished' },
    semi_furnished: { bn: 'আংশিক আসবাবপত্র', en: 'Semi-Furnished' },
    furnished: { bn: 'পূর্ণাঙ্গ আসবাবপত্র', en: 'Furnished' },
  };

  // Tenant eligibility labels
  const eligibilityLabels: Record<string, { bn: string; en: string }> = {
    family: { bn: 'পরিবার', en: 'Family' },
    bachelor_male: { bn: 'ব্যাচেলর (ছেলে)', en: 'Bachelor (Male)' },
    bachelor_female: { bn: 'ব্যাচেলর (মেয়ে)', en: 'Bachelor (Female)' },
    any: { bn: 'সবার জন্য প্রযোজ্য', en: 'Any Tenant' },
  };

  const primaryImage =
    property.imageUrls && property.imageUrls.length > 0 && !imageFailed
      ? property.imageUrls[0]
      : null;

  const title = resolveBilingual(property.titleBn, property.titleEn) || property.titleBn || '';
  const typeText =
    (property.propertyType && propertyTypeLabels[property.propertyType]?.[language]) ||
    property.propertyType ||
    '';
  const furnishingText =
    (property.furnishing && furnishingLabels[property.furnishing]?.[language]) ||
    property.furnishing ||
    '';
  const eligibilityText =
    (property.tenantEligibility && eligibilityLabels[property.tenantEligibility]?.[language]) ||
    property.tenantEligibility ||
    '';

  return (
    <article className="group bg-white rounded-2xl border border-[#E8E6DF] overflow-hidden hover:border-[#B8B4AA] transition-all flex flex-col h-full shadow-xs">
      {/* Visual Carrier / Image */}
      <div className="relative aspect-[16/10] bg-[#F3F1EB] overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#738079] p-4 bg-[#F5F3EC]">
            <svg
              className="w-10 h-10 text-[#0F4C3A]/30 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-medium text-[#738079]">
              {language === 'bn' ? 'বাসার চাবি প্রিভিউ' : 'Bashar Chabi Preview'}
            </span>
          </div>
        )}

        {/* Favorite button */}
        {onSaveFavourite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveFavourite(property.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#192420] hover:text-[#D97706] shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
            aria-label={isFavourite ? 'Remove favourite' : 'Save favourite'}
          >
            <svg
              className={`w-5 h-5 ${isFavourite ? 'fill-[#D97706] text-[#D97706]' : 'fill-none'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rent & Type */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-lg sm:text-xl font-bold text-[#0F4C3A] tracking-tight tabular-nums">
              {formatTaka(property.monthlyRent, language)}
              <span className="text-xs font-normal text-[#738079] ml-1">
                {language === 'bn' ? '/মাস' : '/month'}
              </span>
            </div>
            <span className="text-xs font-medium text-[#738079]">{typeText}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-semibold text-[#192420] mt-1.5 line-clamp-1 group-hover:text-[#0F4C3A] transition-colors">
            {title}
          </h3>

          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#738079] mt-2">
            <span>{property.area}</span>
            {property.neighbourhood && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.neighbourhood}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>
              {language === 'bn'
                ? `${property.bedrooms} বেড`
                : `${property.bedrooms} Bed`}
            </span>
            <span aria-hidden="true">·</span>
            <span>{furnishingText}</span>
          </div>

          {/* Eligibility & Available Date */}
          <div className="flex items-center gap-2 text-xs text-[#4A5550] mt-2">
            <span className="text-[#0F4C3A] font-medium">{eligibilityText}</span>
            {property.availableFrom && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {language === 'bn'
                    ? `পাওয়া যাবে: ${formatDhakaDate(property.availableFrom, language)}`
                    : `From: ${formatDhakaDate(property.availableFrom, language)}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2 border-t border-[#F3F1EB] flex items-center justify-between">
          {property.lastConfirmedAt && (
            <span className="text-[11px] text-[#738079] tabular-nums">
              {language === 'bn'
                ? `যাচাই: ${formatDhakaDate(property.lastConfirmedAt, language)}`
                : `Verified: ${formatDhakaDate(property.lastConfirmedAt, language)}`}
            </span>
          )}
          <Link
            to={`/properties/${property.id}`}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#0F4C3A] hover:text-[#0B3A2C] transition-colors"
          >
            <span>{t.btnViewDetails}</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};
