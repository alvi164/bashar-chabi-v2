import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { mapAuthError } from '../../firebase/errors.ts';
import { Input } from '../../components/common/Input.tsx';
import { Select } from '../../components/common/Select.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Logo } from '../../components/common/Logo.tsx';
import { NormalUserRole } from '../../types/index.ts';

export const RegisterPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { registerWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<NormalUserRole>('tenant');
  const [area, setArea] = useState('Mirpur');
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const areaOptions = [
    { value: 'Mirpur', label: 'Mirpur (মিরপুর)' },
    { value: 'Uttara', label: 'Uttara (উত্তরা)' },
    { value: 'Dhanmondi', label: 'Dhanmondi (ধানমন্ডি)' },
    { value: 'Badda', label: 'Badda (বাড্ডা)' },
    { value: 'Mohammadpur', label: 'Mohammadpur (মোহাম্মদপুর)' },
    { value: 'Gulshan', label: 'Gulshan (গুলশান)' },
    { value: 'Banani', label: 'Banani (বনানী)' },
    { value: 'Bashundhara R/A', label: 'Bashundhara R/A (বসুন্ধরা)' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consented) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মতি দিন'
          : 'Please accept the Terms & Privacy Policy'
      );
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanDisplayName = displayName.trim();

    if (!cleanDisplayName) {
      setError(
        language === 'bn' ? 'অনুগ্রহ করে আপনার নাম প্রদান করুন' : 'Please provide your full name'
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(
        language === 'bn' ? 'সঠিক ইমেইল ঠিকানা প্রদান করুন' : 'Please provide a valid email address'
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        language === 'bn'
          ? 'পাসওয়ার্ড অত্যন্ত দুর্বল। কমপক্ষে ৬টি অক্ষর বা সংখ্যার মিশ্রণ ব্যবহার করুন।'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      await registerWithEmail(cleanEmail, password, cleanDisplayName, role, area);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError(mapAuthError(err, language));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Google Sign Up error:', err);
      setError(mapAuthError(err, language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-[#192420]">
          {language === 'bn' ? 'বাসার চাবি তে নিবন্ধন করুন' : 'Create an Account'}
        </h1>
        <p className="text-xs sm:text-sm text-[#738079]">
          {language === 'bn'
            ? 'সঠিক ভূমিকা নির্বাচন করে সহজেই যুক্ত হোন'
            : 'Select your role to get started'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-5 shadow-xs">
        {/* Google Sign Up Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignUp}
          className="w-full min-h-[44px] rounded-xl border border-[#D8D5CD] bg-white hover:bg-[#FAF9F5] text-sm font-medium text-[#192420] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
          <span>{language === 'bn' ? 'গুগল দিয়ে দ্রুত নিবন্ধন করুন' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E8E6DF] w-full" />
          <span className="bg-white px-3 text-xs text-[#738079] uppercase">
            {language === 'bn' ? 'অথবা ইমেইল দিয়ে' : 'or with email'}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selection (Strict allowlist: tenant, landlord, provider. NEVER admin) */}
          <div>
            <label className="block text-sm font-medium text-[#192420] mb-2">
              {language === 'bn' ? 'আপনার ভূমিকা নির্বাচন করুন' : 'Select Your Role'}
              <span className="text-[#D97706] font-bold ml-1">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('tenant')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  role === 'tenant'
                    ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]'
                    : 'border-[#D8D5CD] bg-white text-[#4A5550] hover:bg-[#FAF9F5]'
                }`}
              >
                <span className="text-base">🔑</span>
                <span>{t.roleTenant}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('landlord_or_agent')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  role === 'landlord_or_agent'
                    ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]'
                    : 'border-[#D8D5CD] bg-white text-[#4A5550] hover:bg-[#FAF9F5]'
                }`}
              >
                <span className="text-base">🏢</span>
                <span>{t.roleLandlord}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('service_provider')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  role === 'service_provider'
                    ? 'border-[#0F4C3A] bg-[#E8F2EE] text-[#0F4C3A]'
                    : 'border-[#D8D5CD] bg-white text-[#4A5550] hover:bg-[#FAF9F5]'
                }`}
              >
                <span className="text-base">🛠️</span>
                <span>{t.roleProvider}</span>
              </button>
            </div>
          </div>

          <Input
            label={language === 'bn' ? 'আপনার নাম' : 'Full Name'}
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tanvir Ahmed"
          />

          <Input
            label={language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tanvir@example.com"
          />

          <Input
            label={language === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min 6 chars)'}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Select
            label={language === 'bn' ? 'প্রাথমিক এলাকা' : 'Primary Dhaka Area'}
            options={areaOptions}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-[#4A5550] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                className="mt-0.5 accent-[#0F4C3A] w-4 h-4 rounded"
              />
              <span>
                {language === 'bn' ? (
                  <>
                    আমি বাসার চাবি এর{' '}
                    <Link to="/terms" className="underline text-[#0F4C3A]">
                      শর্তাবলী
                    </Link>{' '}
                    এবং{' '}
                    <Link to="/privacy" className="underline text-[#0F4C3A]">
                      গোপনীয়তা নীতি
                    </Link>{' '}
                    পড়েছি ও সম্মতি জানাচ্ছি।
                  </>
                ) : (
                  <>
                    I have read and agree to the{' '}
                    <Link to="/terms" className="underline text-[#0F4C3A]">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline text-[#0F4C3A]">
                      Privacy Policy
                    </Link>
                    .
                  </>
                )}
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
            {t.navRegister}
          </Button>
        </form>

        <div className="text-center text-xs text-[#738079] pt-2">
          {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
          <Link to="/login" className="font-semibold text-[#0F4C3A] hover:underline">
            {t.navLogin}
          </Link>
        </div>
      </div>
    </div>
  );
};
