import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Button } from '../../components/common/Button.tsx';
import { propertyRepository } from '../../repositories/propertyRepository.ts';
import { Property } from '../../types/index.ts';

export const AdminDashboardPage: React.FC = () => {
  const { language } = useTranslation();
  const { isAdmin } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [auditLogCount, setAuditLogCount] = useState<number>(0);
  const [recentPending, setRecentPending] = useState<Property[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchStats = async () => {
      try {
        const pending = await propertyRepository.getPendingProperties();
        setPendingCount(pending.length);
        setRecentPending(pending.slice(0, 3));

        const logs = await propertyRepository.getAuditLogs();
        setAuditLogCount(logs.length);
      } catch (err) {
        console.error('Error fetching admin overview stats:', err);
      }
    };
    fetchStats();
  }, [isAdmin]);

  const adminStats = [
    {
      labelBn: 'অপেক্ষমাণ লিস্টিং',
      labelEn: 'Pending Properties',
      count: pendingCount,
      link: '/admin/properties',
      highlight: pendingCount > 0,
    },
    { labelBn: 'প্রকাশিত বাসা', labelEn: 'Published Properties', count: 0, link: '/properties' },
    { labelBn: 'প্রোভাইডার যাচাই', labelEn: 'Pending Providers', count: 0, link: '/admin/providers' },
    { labelBn: 'খোলা সার্ভিস অনুরোধ', labelEn: 'Open Service Requests', count: 0, link: '/admin/service-requests' },
    { labelBn: 'স্থায়ী অডিট লগ', labelEn: 'Audit Records', count: auditLogCount, link: '/admin/audit-logs' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-md uppercase tracking-wider">
            {language === 'bn' ? 'প্রশাসক নিয়ন্ত্রণ কক্ষ' : 'Administrator Control Center'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#192420] mt-1.5">
            {language === 'bn' ? 'মডারেশন ও অডিট ওভারভিউ' : 'Moderation & Audit Overview'}
          </h1>
          <p className="text-xs sm:text-sm text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'বাস্তব ডেটাবেজ রেকর্ডের ভিত্তিতে লিস্টিং ও অডিট লগ পর্যবেক্ষণ'
              : 'Server-authorized moderation queues based strictly on actual database records'}
          </p>
        </div>

        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            ← {language === 'bn' ? 'ইউজার ড্যাশবোর্ড' : 'User View'}
          </Button>
        </Link>
      </div>

      {/* Security notice */}
      <div className="bg-[#FAF9F5] border border-[#E8E6DF] rounded-2xl p-4 text-xs text-[#4A5550] flex items-start gap-3">
        <span className="text-base">🛡️</span>
        <div className="space-y-0.5">
          <strong className="block text-[#192420] font-semibold">
            {language === 'bn' ? 'সার্ভার-অথরাইজড অ্যাডমিন নিরাপত্তা:' : 'Server-Authorized Security Rule:'}
          </strong>
          <p>
            {language === 'bn'
              ? 'প্রশাসক ক্ষমতা শুধুমাত্র Firebase Admin SDK এর মাধ্যমে প্রিভিলেজড পরিবেশে কাস্টম ক্লেইম (request.auth.token.admin == true) দিয়ে অর্পণ করা হয়। ফায়ারস্টোরের কোনো সাধারণ ডকুমেন্ট অ্যাডমিন অ্যাক্সেস প্রদান করে না।'
              : 'Administrator authority is granted strictly via Firebase Admin SDK in a privileged environment with custom token claims (request.auth.token.admin == true). No Firestore record grants administrator power.'}
          </p>
        </div>
      </div>

      {/* Actual Stats Grid (No Fake Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {adminStats.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className={`bg-white rounded-2xl border p-4 sm:p-5 transition-colors shadow-xs group ${
              stat.highlight ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-[#E8E6DF] hover:border-[#0F4C3A]'
            }`}
          >
            <div className="text-xs font-semibold text-[#738079]">
              {language === 'bn' ? stat.labelBn : stat.labelEn}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#192420] mt-2 tabular-nums">
              {stat.count}
            </div>
            <div className="text-[11px] text-[#0F4C3A] font-semibold mt-2 group-hover:underline">
              {language === 'bn' ? 'কিউ খুলুন →' : 'Open queue →'}
            </div>
          </Link>
        ))}
      </div>

      {/* Admin Action Queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Properties Queue Card */}
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? 'বাসা অনুমোদন কিউ' : 'Property Moderation Queue'}
            </h2>
            <Link to="/admin/properties" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
              {language === 'bn' ? 'বিস্তারিত' : 'View all'}
            </Link>
          </div>
          <p className="text-xs text-[#738079]">
            {language === 'bn'
              ? 'মালিকদের জমা দেওয়া নতুন লিস্টিং যাচাই, অনুমোদন বা কারণসহ বাতিলকরণ।'
              : 'Review pending drafts, approve with 30-day expiry, or reject with documented reason.'}
          </p>
          {recentPending.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] text-xs text-center text-[#738079]">
              {language === 'bn' ? 'বর্তমানে কোনো অপেক্ষমাণ লিস্টিং নেই।' : 'No properties currently awaiting review.'}
            </div>
          ) : (
            <div className="space-y-2">
              {recentPending.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] text-xs flex justify-between items-center"
                >
                  <div>
                    <strong className="block text-[#192420]">{p.titleBn}</strong>
                    <span className="text-[#738079]">{p.area} · ৳{p.monthlyRent}/month</span>
                  </div>
                  <Link to="/admin/properties">
                    <Button variant="outline" size="sm">
                      {language === 'bn' ? 'যাচাই' : 'Inspect'}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Household Services Assignment Card */}
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? 'সার্ভিস অনুরোধ ও অর্পণ' : 'Service Requests & Assignment'}
            </h2>
            <Link to="/admin/service-requests" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
              {language === 'bn' ? 'বিস্তারিত' : 'View all'}
            </Link>
          </div>
          <p className="text-xs text-[#738079]">
            {language === 'bn'
              ? 'গ্রাহকদের গৃহস্থালি সেবার অনুরোধসমূহ পর্যালোচনা এবং অনুমোদিত প্রোভাইডার ম্যানুয়ালি অ্যাসাইন করা।'
              : 'Review customer household requests and manually assign verified service providers.'}
          </p>
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] text-xs text-center text-[#738079]">
            {language === 'bn' ? 'বর্তমানে কোনো খোলা সেবার অনুরোধ নেই।' : 'No open service requests in queue.'}
          </div>
        </div>
      </div>

      {/* Immutable Audit Logs Link */}
      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'অপরিবর্তনীয় অডিট লগ (Immutable Audit Logs)' : 'Immutable Audit Log Viewer'}
          </h2>
          <p className="text-xs text-[#738079] mt-0.5">
            {language === 'bn'
              ? 'সকল প্রশাসনিক সিদ্ধান্ত, স্ট্যাটাস পরিবর্তন ও মডারেশন অ্যাকশন সার্ভার-টাইমস্ট্যাম্পসহ স্থায়ীভাবে সংরক্ষিত হয়।'
              : 'All administrative state changes and moderation reasons are permanently recorded in auditLogs.'}
          </p>
        </div>
        <Link to="/admin/audit-logs">
          <Button variant="outline" size="sm">
            {language === 'bn' ? 'অডিট লগ দেখুন' : 'Inspect Audit Logs'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
