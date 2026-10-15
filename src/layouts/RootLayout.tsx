import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar.tsx';
import { Footer } from '../components/navigation/Footer.tsx';
import { MobileBottomBar } from '../components/navigation/MobileBottomBar.tsx';
import { OfflineBanner } from '../components/common/OfflineBanner.tsx';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#192420]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomBar />

      {/* Offline Status */}
      <OfflineBanner />
    </div>
  );
};
