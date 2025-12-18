'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';

interface SignupFormProps {
  locale: string;
}

export type JoinType = 'individual' | 'organization';

export function SignupForm({ locale }: SignupFormProps) {
  const router = useRouter();
  const isRTL = useRTL();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [joinType, setJoinType] = useState<JoinType>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [howDidYouKnow, setHowDidYouKnow] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch;

  // Force them to be boolean
  const isStep1Valid = Boolean(
    firstName &&
    lastName &&
    phoneNumber &&
    age &&
    joinType &&
    howDidYouKnow &&
    (joinType === 'individual' || organizationName)
  );

  const isStep2Valid = Boolean(
    email && password && confirmPassword && passwordsMatch && password.length >= 8
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          parentPhoneNumber,
          age: parseInt(age),
          joinType,
          organizationName: joinType === 'organization' ? organizationName : undefined,
          howDidYouKnowNgen: howDidYouKnow,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed');
        return;
      }

      // Successful registration - redirect to verify email page
      router.push(
        `/${locale}/auth/verify-email?email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[550px] mx-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Error Message */}
      {error && (
        <div className="p-3 mb-4 rounded-[14px] bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${step === 1 ? 'w-8 bg-pumpkin' : 'w-2 bg-gray-300'
            }`}
        />
        <div
          className={`h-2 rounded-full transition-all ${step === 2 ? 'w-8 bg-pumpkin' : 'w-2 bg-gray-300'
            }`}
        />
      </div>

      {step === 1 && (
        <SignupStep1
          locale={locale}
          firstName={firstName}
          lastName={lastName}
          phoneNumber={phoneNumber}
          parentPhoneNumber={parentPhoneNumber}
          age={age}
          joinType={joinType}
          organizationName={organizationName}
          howDidYouKnow={howDidYouKnow}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhoneNumber={setPhoneNumber}
          setParentPhoneNumber={setParentPhoneNumber}
          setAge={setAge}
          setJoinType={setJoinType}
          setOrganizationName={setOrganizationName}
          setHowDidYouKnow={setHowDidYouKnow}
          isStep1Valid={isStep1Valid}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <SignupStep2
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          isStep2Valid={isStep2Valid}
          isPending={isLoading}
          showPasswordError={showPasswordError}
          onBack={handleBack}
        />
      )}

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}