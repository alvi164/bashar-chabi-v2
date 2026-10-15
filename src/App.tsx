import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './localization/LanguageContext.tsx';
import { AuthProvider } from './firebase/auth.tsx';
import { RootLayout } from './layouts/RootLayout.tsx';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.tsx';
import { PropertiesPage } from './pages/public/PropertiesPage.tsx';
import { PropertyDetailPage } from './pages/public/PropertyDetailPage.tsx';
import { ServicesPage } from './pages/public/ServicesPage.tsx';
import { ServiceRequestPage } from './pages/public/ServiceRequestPage.tsx';
import { SafetyPage } from './pages/public/SafetyPage.tsx';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { PrivacyPage } from './pages/public/PrivacyPage.tsx';
import { TermsPage } from './pages/public/TermsPage.tsx';
import { LoginPage } from './pages/public/LoginPage.tsx';
import { RegisterPage } from './pages/public/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.tsx';
import { UnauthorizedPage, NotFoundPage } from './pages/public/NotFoundPage.tsx';

// Dashboard & Authenticated Pages
import { RoleDashboardPage } from './pages/dashboard/RoleDashboardPage.tsx';
import { LandlordNewListingPage } from './pages/dashboard/LandlordNewListingPage.tsx';
import {
  OnboardingPage,
  ProfilePage,
  TenantVisitsPage,
  TenantFavouritesPage,
  LandlordListingsPage,
  LandlordVisitsPage,
  CustomerServicesPage,
  ProviderProfilePage,
  ProviderJobsPage,
} from './pages/dashboard/AuthenticatedViews.tsx';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminPropertiesPage, AdminAuditLogsPage } from './pages/admin/AdminPropertiesPage.tsx';
import {
  AdminProvidersPage,
  AdminServicesPage,
  AdminReportsPage,
} from './pages/admin/AdminServicesAndReports.tsx';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/request" element={<ServiceRequestPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/not-found" element={<NotFoundPage />} />

              {/* Authenticated Dashboard Routes */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<RoleDashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/favourites" element={<TenantFavouritesPage />} />
              <Route path="/dashboard/visits" element={<TenantVisitsPage />} />
              <Route path="/dashboard/listings" element={<LandlordListingsPage />} />
              <Route path="/dashboard/listings/new" element={<LandlordNewListingPage />} />
              <Route path="/dashboard/listings/:propertyId/edit" element={<LandlordNewListingPage />} />
              <Route path="/dashboard/listing-visits" element={<LandlordVisitsPage />} />
              <Route path="/dashboard/service-requests" element={<CustomerServicesPage />} />
              <Route path="/dashboard/provider-profile" element={<ProviderProfilePage />} />
              <Route path="/dashboard/provider-jobs" element={<ProviderJobsPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/properties" element={<AdminPropertiesPage />} />
              <Route path="/admin/providers" element={<AdminProvidersPage />} />
              <Route path="/admin/service-requests" element={<AdminServicesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
