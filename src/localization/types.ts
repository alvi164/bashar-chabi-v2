export type Language = 'bn' | 'en';

export interface Translations {
  // Navigation
  navHome: string;
  navProperties: string;
  navServices: string;
  navSafety: string;
  navAbout: string;
  navDashboard: string;
  navLogin: string;
  navLogout: string;
  navRegister: string;

  // Common buttons
  btnBack: string;
  btnCancel: string;
  btnClear: string;
  btnReset: string;
  btnSearch: string;
  btnSubmit: string;
  btnShare: string;
  btnFindHome: string;
  btnListProperty: string;
  btnBookService: string;
  btnRequestVisit: string;
  btnReport: string;
  btnViewDetails: string;

  // Footer & Branding
  allRightsReserved: string;
  brandDescription: string;
  dhakaCoverage: string;
  privacyPolicy: string;
  termsAndConditions: string;

  // Offline
  offlineBanner: string;

  // Safety
  safetyNoticeHeadline: string;
  safetyNoticeBody: string;
  safetyLearnMore: string;

  // Property Details & Listing
  propertyRent: string;
  propertyDeposit: string;
  propertyServiceCharge: string;
  propertyBedrooms: string;
  propertyBathrooms: string;
  propertySize: string;
  propertyFurnishing: string;
  propertyEligibility: string;
  propertyAvailableFrom: string;
  propertyUtilities: string;

  // Roles
  roleTenant: string;
  roleLandlord: string;
  roleProvider: string;
  roleAdmin: string;

  // Services
  serviceAcTitle: string;
  serviceAcDesc: string;
  serviceApplianceTitle: string;
  serviceApplianceDesc: string;
  serviceCleaningTitle: string;
  serviceCleaningDesc: string;
  serviceElectricalTitle: string;
  serviceElectricalDesc: string;
  serviceMovingTitle: string;
  serviceMovingDesc: string;
  servicePlumbingTitle: string;
  servicePlumbingDesc: string;
}
