import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Logo } from '../../components/common/Logo.tsx';

export const LoginPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { signInWithGoogle, loginWithEmail, currentUser, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (currentUser) {
      if (userProfile && !userProfile.onboardingComplete) {
        navigate('/onboarding');
      } else if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userProfile, isAdmin, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError(
          language === 'bn'
            ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।'
            : 'Invalid email or password.'
        );
      } else {
        setError(
          language === 'bn'
            ? 'লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।'
            : 'Login failed. Please verify credentials and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Google Sign In error:', err);
      setError(
        language === 'bn'
          ? 'গুগল সাইন-ইন সম্পন্ন হয়নি। পপ-আপ বন্ধ করা হয়ে থাকতে পারে।'
          : 'Google sign-in was not completed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-[#192420]">
          {language === 'bn' ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'Sign in to Bashar Chabi'}
        </h1>
        <p className="text-xs sm:text-sm text-[#738079]">
          {language === 'bn'
            ? 'আপনার সংরক্ষিত বাসা ও অনুরোধসমূহ পরিচালনা করতে লগইন করুন'
            : 'Access your saved properties, visits, and service requests'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-5 shadow-xs">
        {/* Google Sign In Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
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
          <span>{language === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E8E6DF] w-full" />
          <span className="bg-white px-3 text-xs text-[#738079] uppercase">
            {language === 'bn' ? 'অথবা ইমেইল' : 'or with email'}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label={language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[#192420]">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#0F4C3A] hover:underline"
              >
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
            {t.navLogin}
          </Button>
        </form>

        <div className="text-center text-xs text-[#738079] pt-2">
          {language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলতে চান?' : "Don't have an account?"}{' '}
          <Link to="/register" className="font-semibold text-[#0F4C3A] hover:underline">
            {t.navRegister}
          </Link>
        </div>
      </div>
    </div>
  );
};
