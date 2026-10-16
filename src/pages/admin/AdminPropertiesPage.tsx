import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Property, AuditLog } from '../../types/index.ts';
import { propertyRepository } from '../../repositories/propertyRepository.ts';
import { formatTaka } from '../../utils/currency.ts';
import { formatDhakaDate } from '../../utils/date.ts';

export const AdminPropertiesPage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser, isAdmin } = useAuth();

  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reject Modal State (Mandatory rejection reason)
  const [rejectModalProperty, setRejectModalProperty] = useState<Property | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchQueue = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await propertyRepository.getPendingProperties();
      setPendingProperties(data);
    } catch (err) {
      console.error('Error fetching admin moderation queue:', err);
      setError(
        language === 'bn'
          ? 'মডারেশন কিউ লোড করা সম্ভব হয়নি।'
          : 'Could not load moderation queue.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [isAdmin]);

  const handleApprove = async (property: Property) => {
    if (!currentUser || !isAdmin) return;
    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await propertyRepository.approveProperty(property.id, currentUser.uid);
      setSuccessMessage(
        language === 'bn'
          ? `লিস্টিং "${property.titleBn}" সফলভাবে অনুমোদিত ও ৩০ দিনের জন্য প্রকাশিত হয়েছে।`
          : `Listing "${property.titleBn}" successfully approved with 30-day expiration.`
      );
      await fetchQueue();
    } catch (err: unknown) {
      console.error('Error approving property:', err);
      setError((err as Error).message || 'Approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalProperty || !currentUser || !isAdmin) return;
    if (!rejectionReason.trim()) {
      setRejectionError(
        language === 'bn'
          ? 'বাতিলকরণের কারণ উল্লেখ করা বাধ্যতামূলক।'
          : 'A specific rejection reason is mandatory.'
      );
      return;
    }

    setIsProcessing(true);
    setRejectionError(null);
    try {
      await propertyRepository.rejectProperty(
        rejectModalProperty.id,
        currentUser.uid,
        rejectionReason.trim()
      );
      setSuccessMessage(
        language === 'bn'
          ? `লিস্টিংটি কারণসহ সফলভাবে বাতিল তালিকায় প্রেরণ করা হয়েছে।`
          : `Listing successfully rejected with documented reason.`
      );
      setRejectModalProperty(null);
      setRejectionReason('');
      await fetchQueue();
    } catch (err: unknown) {
      console.error('Error rejecting property:', err);
      setRejectionError((err as Error).message || 'Rejection failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto text-2xl font-bold">
          🛡️
        </div>
        <h1 className="text-xl font-bold text-[#192420]">
          {language === 'bn' ? 'অ্যাডমিন অনুমতি আবশ্যক' : 'Administrator Authorization Required'}
        </h1>
        <p className="text-xs text-[#738079] max-w-md mx-auto leading-relaxed">
          {language === 'bn'
            ? 'এই পৃষ্ঠাটি শুধুমাত্র সার্ভার-অথরাইজড অ্যাডমিনদের জন্য উন্মুক্ত। সাধারণ ব্যবহারকারী বা ক্লায়েন্ট স্টেট দিয়ে এই পৃষ্ঠার কোনো অপারেশন সম্পন্ন করা যাবে না।'
            : 'Access is restricted to accounts with server-authorized admin custom claims (request.auth.token.admin == true).'}
        </p>
        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              ← {language === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Return to Dashboard'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Overview'}</span>
          </Link>
          <div className="flex items-center gap-2 mt-1.5">
            <h1 className="text-2xl font-bold text-[#192420]">
              {language === 'bn' ? 'বাসা মডারেশন কিউ' : 'Property Moderation Queue'}
            </h1>
            <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {pendingProperties.length}
            </span>
          </div>
          <p className="text-xs text-[#738079]">
            {language === 'bn'
              ? 'বাড়িওয়ালাদের জমা দেওয়া পেন্ডিং লিস্টিং যাচাই, অনুমোদন (৩০ দিন মেয়াদসহ) অথবা কারণ দর্শিয়ে বাতিলকরণ'
              : 'Inspect pending submissions, approve with 30-day expiration, or reject with documented reason'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading || isProcessing}>
            🔄 {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
          <Link to="/admin/audit-logs">
            <Button variant="ghost" size="sm">
              📋 {language === 'bn' ? 'অডিট লগ' : 'Audit Logs'}
            </Button>
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="bg-[#E8F2EE] border border-[#A7D7C5] rounded-2xl p-4 text-xs font-semibold text-[#0F4C3A]">
          ✓ {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4 text-xs font-semibold text-[#DC2626]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-12 text-center text-xs text-[#738079]">
          {language === 'bn' ? 'মডারেশন কিউ লোড হচ্ছে...' : 'Loading moderation queue...'}
        </div>
      ) : pendingProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h2 className="text-base font-bold text-[#192420]">
            {language === 'bn' ? 'মডারেশন কিউ শূন্য' : 'Queue Empty'}
          </h2>
          <p className="text-xs text-[#738079] max-w-md mx-auto">
            {language === 'bn'
              ? 'এই মুহূর্তে কোনো নতুন বাসা পর্যালোচনার অপেক্ষায় নেই। বাড়িওয়ালারা ড্রাফট সাবমিট করলে তা সরাসরি এখানে প্রদর্শিত হবে।'
              : 'No rental properties are currently awaiting administrator review.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl border border-[#E8E6DF] p-6 space-y-5 shadow-xs"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-md">
                      Pending Review
                    </span>
                    <h2 className="text-lg font-bold text-[#192420]">{prop.titleBn}</h2>
                  </div>
                  {prop.titleEn && (
                    <p className="text-xs font-medium text-[#738079] italic">{prop.titleEn}</p>
                  )}
                  <p className="text-xs text-[#738079]">
                    {prop.area} · {prop.neighbourhood} · {language === 'bn' ? 'ধরণ:' : 'Type:'}{' '}
                    <span className="font-semibold text-[#192420] uppercase">{prop.propertyType}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[#0F4C3A] tabular-nums">
                    {formatTaka(prop.monthlyRent, language)}/মাস
                  </div>
                  <div className="text-[11px] text-[#738079]">
                    {language === 'bn' ? 'অগ্রিম/ডিপোজিট:' : 'Deposit:'}{' '}
                    {formatTaka(prop.deposit, language)} · {language === 'bn' ? 'সার্ভিস চার্জ:' : 'Service:'}{' '}
                    {formatTaka(prop.serviceCharge, language)}
                  </div>
                </div>
              </div>

              {/* Confidential Address (Admin Privileged View) */}
              <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#D8D5CD] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0F4C3A]">
                  <span>🛡️</span>
                  <span>
                    {language === 'bn'
                      ? 'অভ্যন্তরীণ সুনির্দিষ্ট ঠিকানা (প্রশাসক ভিউ):'
                      : 'Private Address (Admin Privileged Inspector):'}
                  </span>
                </div>
                <p className="text-[#192420] font-mono bg-white p-2 rounded-xl border border-[#E8E6DF]">
                  {prop.privateAddress || (language === 'bn' ? 'ঠিকানা উল্লেখ নেই' : 'No private address')}
                </p>
              </div>

              {/* Specs & Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E8E6DF]">
                <div>
                  <span className="text-[#738079] block">{language === 'bn' ? 'বেডরুম' : 'Bedrooms'}:</span>
                  <strong className="text-sm text-[#192420]">{prop.bedrooms}</strong>
                </div>
                <div>
                  <span className="text-[#738079] block">{language === 'bn' ? 'বাথরুম' : 'Bathrooms'}:</span>
                  <strong className="text-sm text-[#192420]">{prop.bathrooms}</strong>
                </div>
                <div>
                  <span className="text-[#738079] block">{language === 'bn' ? 'আয়তন' : 'Size'}:</span>
                  <strong className="text-sm text-[#192420]">{prop.sizeSqFt} sqft</strong>
                </div>
                <div>
                  <span className="text-[#738079] block">{language === 'bn' ? 'উপলব্ধ তারিখ' : 'Available'}:</span>
                  <strong className="text-sm text-[#192420]">{prop.availableFrom}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-[#738079]">{language === 'bn' ? 'বিবরণ:' : 'Description:'}</span>
                <p className="text-[#4A5550] leading-relaxed p-3 bg-white rounded-xl border border-[#E8E6DF]">
                  {prop.descriptionBn}
                </p>
              </div>

              {/* Photos preview */}
              {prop.imageUrls && prop.imageUrls.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#738079]">
                    {language === 'bn' ? 'সংযুক্ত ছবি:' : 'Images:'} ({prop.imageUrls.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {prop.imageUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#0F4C3A] font-mono underline bg-[#E8F2EE] px-2.5 py-1 rounded-lg"
                      >
                        Photo {idx + 1} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta & Landlord */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#738079] pt-2 border-t border-[#F3F1EB]">
                <div>
                  <span>Landlord UID: </span>
                  <span className="font-mono text-[#192420]">{prop.landlordId}</span>
                </div>
                <div>
                  <span>Submitted: </span>
                  <span className="font-semibold text-[#192420]">
                    {formatDhakaDate(prop.updatedAt || prop.createdAt, language)}
                  </span>
                </div>
              </div>

              {/* Protected Moderation Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRejectModalProperty(prop);
                    setRejectionReason('');
                    setRejectionError(null);
                  }}
                  disabled={isProcessing}
                >
                  <span className="text-[#DC2626]">
                    {language === 'bn' ? '✕ কারণ দর্শিয়ে বাতিল' : 'Reject with Reason'}
                  </span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(prop)}
                  isLoading={isProcessing}
                >
                  ✓ {language === 'bn' ? 'অনুমোদন ও প্রকাশ (Approve)' : 'Approve & Publish'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Rejection Reason Modal Dialog */}
      {rejectModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-3xl border border-[#E8E6DF] max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#DC2626] flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{language === 'bn' ? 'লিস্টিং বাতিলের কারণ নির্দেশ' : 'Mandatory Rejection Notice'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalProperty(null)}
                className="text-xs font-bold text-[#738079] px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#738079] leading-relaxed">
              {language === 'bn'
                ? 'লিস্টিং বাতিলের ক্ষেত্রে সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক। বাড়িওয়ালা এই কারণটি দেখতে পারবেন এবং সেই অনুযায়ী সংশোধন করে পুনরায় সাবমিট করতে পারবেন।'
                : 'A clear, documented rejection reason is mandatory under Section 16 & 21. The landlord will review this notice and resubmit the listing.'}
            </p>

            <div className="bg-[#FAF9F5] p-2.5 rounded-xl text-xs text-[#192420] font-semibold border border-[#E8E6DF]">
              Target: {rejectModalProperty.titleBn} (ID: {rejectModalProperty.id})
            </div>

            {rejectionError && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#F87171] text-xs text-[#DC2626] font-medium">
                {rejectionError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#192420] mb-1.5">
                {language === 'bn' ? 'বাতিলকরণের সুনির্দিষ্ট কারণ (Mandatory):' : 'Rejection Reason (Mandatory):'}
              </label>
              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: প্রদত্ত মাসিক ভাড়া এলাকার তুলনায় অস্বাভাবিক, অভ্যন্তরীণ ঠিকানা অসম্পূর্ণ অথবা ছবির লিংক কাজ করছে না।'
                    : 'E.g., Incomplete address details, unreasonable pricing, or broken image URLs.'
                }
                className="w-full p-3 rounded-xl border border-[#D8D5CD] text-xs focus:outline-[#0F4C3A]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectModalProperty(null)}
                disabled={isProcessing}
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isProcessing}
                disabled={!rejectionReason.trim()}
              >
                {language === 'bn' ? 'নিশ্চিত বাতিল করুন' : 'Confirm Rejection'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const AdminAuditLogsPage: React.FC = () => {
  const { language } = useTranslation();
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await propertyRepository.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-[#738079]">
        {language === 'bn' ? 'অ্যাডমিন অনুমতি আবশ্যক' : 'Administrator Authorization Required'}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Overview'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#192420] mt-1.5">
            {language === 'bn' ? 'অপরিবর্তনীয় অডিট লগ' : 'Immutable Audit Logs'}
          </h1>
          <p className="text-xs text-[#738079]">
            {language === 'bn'
              ? 'প্রশাসনিক সকল কার্যকলাপ ও স্ট্যাটাস রূপান্তরের স্থায়ী ক্রিপ্টোগ্রাফিক রেকর্ড'
              : 'Cryptographically secured records of administrative and moderation actions'}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          🔄 {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </Button>
      </div>

      <div className="bg-[#FAF9F5] border border-[#E8E6DF] rounded-2xl p-4 text-xs text-[#4A5550] flex items-start gap-3">
        <span className="text-base">🛡️</span>
        <div>
          <strong className="block text-[#192420] font-semibold">
            {language === 'bn' ? 'নিরাপত্তা নিয়ম:' : 'Immutable Security Rule:'}
          </strong>
          <span>
            {language === 'bn'
              ? 'সাধারণ ব্রাউজার বা ব্যবহারকারী অডিট লগ রেকর্ড তৈরি, পরিবর্তন বা মুছে ফেলতে পারে না (Firestore rules: allow write: if false;)।'
              : 'Clients cannot create, update, or delete records in auditLogs. All log entries are immutable.'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E8E6DF] flex justify-between items-center text-xs font-semibold text-[#738079]">
          <span>{language === 'bn' ? 'সময় (Dhaka Time)' : 'Timestamp'}</span>
          <span>{language === 'bn' ? 'অ্যাকশন ও লক্ষ্যবস্তু' : 'Action & Target'}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#738079]">
            {language === 'bn' ? 'লগ লোড হচ্ছে...' : 'Loading audit records...'}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#738079] space-y-2">
            <div className="text-2xl">📋</div>
            <p>
              {language === 'bn'
                ? 'বর্তমানে কোনো অডিট রেকর্ড নেই। মডারেশন কিউ থেকে বাসা অনুমোদন বা বাতিল করা হলে স্থায়ী লগ এখানে সংরক্ষিত হবে।'
                : 'No audit records logged yet. Actions in moderation will appear here with permanent timestamps.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F3F1EB]">
            {logs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 text-xs space-y-2 hover:bg-[#FAF9F5] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                        log.action.includes('approved')
                          ? 'bg-[#E8F2EE] text-[#0F4C3A]'
                          : log.action.includes('rejected')
                          ? 'bg-[#FEF2F2] text-[#DC2626]'
                          : 'bg-[#EFF6FF] text-[#2563EB]'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-mono text-[#738079]">
                      {log.targetType}:{log.targetId}
                    </span>
                  </div>
                  <div className="text-[#738079] font-mono">
                    {formatDhakaDate(log.createdAt, language)}
                  </div>
                </div>

                <div className="text-[#4A5550] flex flex-wrap items-center gap-4 text-[11px]">
                  <span>
                    Actor: <strong className="font-mono text-[#192420]">{log.actorId}</strong>
                  </span>
                  {log.reason && (
                    <span className="text-[#DC2626]">
                      Reason:{' '}
                      <strong className="text-[#991B1B]">{log.reason}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
