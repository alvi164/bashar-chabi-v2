import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { PropertyCard } from '../../components/properties/PropertyCard.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Property } from '../../types/index.ts';

// Initial sample demonstration listings for Phase 1 UI preview
const INITIAL_SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'demo-prop-1',
    landlordId: 'demo-landlord-1',
    titleBn: 'মিরপুর ২ এ মনোরম পারিবারিক ফ্ল্যাট',
    titleEn: 'Spacious Family Flat in Mirpur 2',
    descriptionBn: 'মিরপুর ২ এর প্রধান সড়কের কাছে সম্পূর্ণ খোলামেলা ৩ বেডের ফ্ল্যাট। লিফট, জেনারেটর ও সার্বক্ষণিক নিরাপত্তা সুবিধা রয়েছে।',
    descriptionEn: 'Well-ventilated 3-bedroom apartment near main road in Mirpur 2 with lift, backup generator and 24/7 security.',
    propertyType: 'apartment',
    monthlyRent: 24000,
    deposit: 48000,
    serviceCharge: 3500,
    area: 'Mirpur',
    neighbourhood: 'Section 2, Block C',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqFt: 1350,
    furnishing: 'unfurnished',
    tenantEligibility: 'family',
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
    availableFrom: '2026-11-01',
    imageUrls: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
  },
  {
    id: 'demo-prop-2',
    landlordId: 'demo-landlord-2',
    titleBn: 'উত্তরা সেক্টর ৭ এ আধুনিক ২ বেড অ্যাপার্টমেন্ট',
    titleEn: 'Modern 2-Bed Apartment in Uttara Sector 7',
    descriptionBn: 'উত্তরা ৭ নম্বর সেক্টরে খোলামেলা ও শান্ত পরিবেশে ২ বেডের ফ্ল্যাট। পরিবার বা ছোট পরিবারের জন্য উপযোগী।',
    descriptionEn: 'Quiet residential location in Uttara Sector 7. Ideal for small families with full utility support.',
    propertyType: 'apartment',
    monthlyRent: 28000,
    deposit: 56000,
    serviceCharge: 4000,
    area: 'Uttara',
    neighbourhood: 'Sector 7, Road 14',
    bedrooms: 2,
    bathrooms: 2,
    sizeSqFt: 1100,
    furnishing: 'semi_furnished',
    tenantEligibility: 'family',
    utilities: {
      gas: true,
      water: true,
      electricity: true,
      generator: true,
      lift: true,
      security: true,
      wifi: true,
      parking: false,
    },
    availableFrom: '2026-11-15',
    imageUrls: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
  },
  {
    id: 'demo-prop-3',
    landlordId: 'demo-landlord-3',
    titleBn: 'বাড্ডা লিঙ্ক রোডের কাছে আলো-বাতাসপূর্ণ রুম সাবলেট',
    titleEn: 'Ventilated Single Room Sublet Near Badda Link Road',
    descriptionBn: 'চাকুরিজীবী বা শিক্ষার্থীর জন্য খোলামেলা ১ রুমের সাবলেট। নিরিবিলি পরিবেশ এবং যাতায়াত অত্যন্ত সহজ।',
    descriptionEn: 'Single room sublet for working professionals or students. Easy commute to Gulshan and Rampura.',
    propertyType: 'room',
    monthlyRent: 8500,
    deposit: 8500,
    serviceCharge: 1000,
    area: 'Badda',
    neighbourhood: 'Link Road',
    bedrooms: 1,
    bathrooms: 1,
    sizeSqFt: 220,
    furnishing: 'furnished',
    tenantEligibility: 'bachelor_male',
    utilities: {
      gas: true,
      water: true,
      electricity: true,
      generator: false,
      lift: false,
      security: true,
      wifi: true,
      parking: false,
    },
    availableFrom: '2026-11-01',
    imageUrls: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
  },
  {
    id: 'demo-prop-4',
    landlordId: 'demo-landlord-4',
    titleBn: 'বসুন্ধরা আবাসিক এলাকায় ৩ বেডরুমের লাক্সারি অ্যাপার্টমেন্ট',
    titleEn: '3-Bed Apartment in Bashundhara R/A',
    descriptionBn: 'বসুন্ধরা ব্লকে অত্যন্ত নিরাপদ ও আধুনিক সুযোগ-সুবিধা সম্বলিত ৩ বেডের ফ্ল্যাট। ২৪ ঘণ্টা লিফট ও সার্বক্ষণিক পানির ব্যবস্থা।',
    descriptionEn: 'Prestigious gated community living in Bashundhara Residential Area. 3 bedrooms with parking and lift.',
    propertyType: 'apartment',
    monthlyRent: 42000,
    deposit: 84000,
    serviceCharge: 5500,
    area: 'Bashundhara R/A',
    neighbourhood: 'Block D, Road 6',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqFt: 1850,
    furnishing: 'semi_furnished',
    tenantEligibility: 'family',
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
    availableFrom: '2026-12-01',
    imageUrls: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
  },
];

export const PropertiesPage: React.FC = () => {
  const { language, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'all');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'all');
  const [minRent, setMinRent] = useState<string>(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState<string>(searchParams.get('maxRent') || '');
  const [minBedrooms, setMinBedrooms] = useState<string>(searchParams.get('beds') || 'all');
  const [furnishing, setFurnishing] = useState<string>(searchParams.get('furnishing') || 'all');
  const [eligibility, setEligibility] = useState<string>(searchParams.get('eligibility') || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'rent_asc' | 'rent_desc'>('newest');

  const [favourites, setFavourites] = useState<Record<string, boolean>>({});

  const handleToggleFavourite = (id: string) => {
    setFavourites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setSelectedArea('all');
    setSelectedType('all');
    setMinRent('');
    setMaxRent('');
    setMinBedrooms('all');
    setFurnishing('all');
    setEligibility('all');
    setSearchParams({});
  };

  // Filter listings based on parameters
  const filteredProperties = useMemo(() => {
    return INITIAL_SAMPLE_PROPERTIES.filter((prop) => {
      if (selectedArea !== 'all' && prop.area.toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }
      if (selectedType !== 'all' && prop.propertyType !== selectedType) {
        return false;
      }
      if (minRent && prop.monthlyRent < Number(minRent)) {
        return false;
      }
      if (maxRent && prop.monthlyRent > Number(maxRent)) {
        return false;
      }
      if (minBedrooms !== 'all' && prop.bedrooms < Number(minBedrooms)) {
        return false;
      }
      if (furnishing !== 'all' && prop.furnishing !== furnishing) {
        return false;
      }
      if (eligibility !== 'all' && prop.tenantEligibility !== eligibility && prop.tenantEligibility !== 'any') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rent_asc') return a.monthlyRent - b.monthlyRent;
      if (sortBy === 'rent_desc') return b.monthlyRent - a.monthlyRent;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [selectedArea, selectedType, minRent, maxRent, minBedrooms, furnishing, eligibility, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E6DF]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#192420]">
            {language === 'bn' ? 'ভাড়ার বাসা খুঁজুন' : 'Explore Rental Homes in Dhaka'}
          </h1>
          <p className="text-xs sm:text-sm text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'ঢাকার অনুমোদিত ও যাচাইকৃত ভাড়ার বাসার তালিকা'
              : 'Verified rental homes across Dhaka neighbourhoods'}
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#738079] whitespace-nowrap">
            {language === 'bn' ? 'সাজান:' : 'Sort by:'}
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'rent_asc' | 'rent_desc')}
            className="min-h-[38px] px-3 rounded-xl border border-[#D8D5CD] bg-white text-xs font-medium text-[#192420] focus-visible:ring-2 focus-visible:ring-[#0F4C3A]"
          >
            <option value="newest">{language === 'bn' ? 'নতুন যুক্ত' : 'Newest'}</option>
            <option value="rent_asc">{language === 'bn' ? 'কম ভাড়া থেকে বেশি' : 'Rent: Low to High'}</option>
            <option value="rent_desc">{language === 'bn' ? 'বেশি ভাড়া থেকে কম' : 'Rent: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Area */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'এলাকা' : 'Area'}
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            >
              <option value="all">{language === 'bn' ? 'সকল এলাকা' : 'All Areas'}</option>
              <option value="Mirpur">Mirpur</option>
              <option value="Uttara">Uttara</option>
              <option value="Dhanmondi">Dhanmondi</option>
              <option value="Badda">Badda</option>
              <option value="Mohammadpur">Mohammadpur</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Banani">Banani</option>
              <option value="Bashundhara R/A">Bashundhara R/A</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'ধরন' : 'Type'}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            >
              <option value="all">{language === 'bn' ? 'সকল ধরন' : 'All Types'}</option>
              <option value="apartment">{language === 'bn' ? 'অ্যাপার্টমেন্ট' : 'Apartment'}</option>
              <option value="house">{language === 'bn' ? 'সম্পূর্ণ বাড়ি' : 'House'}</option>
              <option value="room">{language === 'bn' ? 'রুম' : 'Room'}</option>
              <option value="sublet">{language === 'bn' ? 'সাবলেট' : 'Sublet'}</option>
              <option value="mess_seat">{language === 'bn' ? 'মেস সিট' : 'Mess'}</option>
            </select>
          </div>

          {/* Min Rent */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'সর্বনিম্ন ভাড়া' : 'Min Rent'}
            </label>
            <input
              type="number"
              placeholder="0"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            />
          </div>

          {/* Max Rent */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'সর্বোচ্চ ভাড়া' : 'Max Rent'}
            </label>
            <input
              type="number"
              placeholder="100000"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'বেডরুম' : 'Bedrooms'}
            </label>
            <select
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            >
              <option value="all">{language === 'bn' ? 'যেকোনো' : 'Any'}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-[11px] font-semibold text-[#192420] mb-1">
              {language === 'bn' ? 'আসবাব' : 'Furnishing'}
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#D8D5CD] bg-white text-xs text-[#192420]"
            >
              <option value="all">{language === 'bn' ? 'যেকোনো' : 'Any'}</option>
              <option value="unfurnished">{language === 'bn' ? 'আসবাবপত্রহীন' : 'Unfurnished'}</option>
              <option value="semi_furnished">{language === 'bn' ? 'আংশিক' : 'Semi-Furnished'}</option>
              <option value="furnished">{language === 'bn' ? 'পূর্ণাঙ্গ' : 'Furnished'}</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              onClick={clearFilters}
              className="w-full min-h-[38px] px-3 rounded-lg border border-[#D8D5CD] bg-[#FAF9F5] text-xs font-medium text-[#4A5550] hover:bg-[#F3F1EB] transition-colors"
            >
              {t.btnClear}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="text-xs font-semibold text-[#738079] mb-4">
          {language === 'bn'
            ? `${filteredProperties.length} টি বাসা পাওয়া গেছে`
            : `Showing ${filteredProperties.length} rental properties`}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSaveFavourite={handleToggleFavourite}
                isFavourite={!!favourites[property.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] text-[#738079] flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#192420]">
              {language === 'bn' ? 'কোনো বাসা পাওয়া যায়নি' : 'No properties found'}
            </h3>
            <p className="text-xs text-[#738079]">
              {language === 'bn'
                ? 'আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন অথবা রিসেট করুন।'
                : 'Try adjusting your filters or clearing them to explore all listings.'}
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t.btnReset}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
