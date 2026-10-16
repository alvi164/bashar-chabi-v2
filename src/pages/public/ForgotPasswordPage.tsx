import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../localization/LanguageContext.tsx';
import { useAuth } from '../../firebase/auth.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Logo } from '../../components/common/Logo.tsx';

export const ForgotPasswordPage: React.FC = () => {
  const { language, t } = useTranslation();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setError(
        language === 'bn'
          ? 'রিসেট লিংক পাঠানো যায়নি। ইমেইল ঠিকানাটি সঠিক কিনা পুনরায় যাচাই করুন।'
          : 'Could not send reset link. Please check your email and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <Logo size="lg" />
        <h1 className="text-2xl font-bold text-[#192420]">
          {language === 'bn' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Your Password'}
        </h1>
        <p className="text-xs sm:text-sm text-[#738079]">
          {language === 'bn'
            ? 'আপনার নিবন্ধিত ইমেইল দিলে আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব'
            : 'Enter your registered email to receive a password reset link'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-8 space-y-5 shadow-xs">
        {sent ? (
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EE] text-[#0F4C3A] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h2 className="text-base font-bold text-[#192420]">
              {language === 'bn' ? 'রিসেট লিংক পাঠানো হয়েছে' : 'Password Reset Email Sent'}
            </h2>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              {language === 'bn'
                ? `${email} ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। আপনার ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`
                : `A secure password reset email has been sent to ${email}. Please check your inbox or spam folder.`}
            </p>
            <Link to="/login">
              <Button variant="outline" size="sm" className="mt-2">
                {language === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-medium">
                {error}
              </div>
            )}
            <Input
              label={language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="salvi@example.com"
            />
            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
              {language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-[#738079] pt-2">
          <Link to="/login" className="font-semibold text-[#0F4C3A] hover:underline">
            ← {t.btnBack}
          </Link>
        </div>
      </div>
    </div>
  );
};
