import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceCategory } from '../../types/index.ts';
import { useTranslation } from '../../localization/LanguageContext.tsx';

interface ServiceCardProps {
  category: ServiceCategory;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ category }) => {
  const { t, language } = useTranslation();

  const serviceMeta: Record<
    ServiceCategory,
    { title: string; desc: string; icon: React.ReactNode }
  > = {
    moving: {
      title: t.serviceMovingTitle,
      desc: t.serviceMovingDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    cleaning: {
      title: t.serviceCleaningTitle,
      desc: t.serviceCleaningDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    plumbing: {
      title: t.servicePlumbingTitle,
      desc: t.servicePlumbingDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    electrical: {
      title: t.serviceElectricalTitle,
      desc: t.serviceElectricalDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    ac_service: {
      title: t.serviceAcTitle,
      desc: t.serviceAcDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    appliance_repair: {
      title: t.serviceApplianceTitle,
      desc: t.serviceApplianceDesc,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  };

  const meta = serviceMeta[category];

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-5 sm:p-6 flex flex-col justify-between hover:border-[#B8B4AA] transition-all shadow-xs">
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mb-4">
          {meta.icon}
        </div>
        <h3 className="text-base font-semibold text-[#192420]">{meta.title}</h3>
        <p className="text-xs sm:text-sm text-[#4A5550] mt-2 leading-relaxed">
          {meta.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#F3F1EB] flex items-center justify-between">
        <span className="text-[11px] text-[#738079]">
          {language === 'bn' ? 'ম্যানুয়াল যাচাই' : 'Manual verification'}
        </span>
        <Link
          to={`/services/request?category=${category}`}
          className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0B3A2C] text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <span>{t.btnBookService}</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
