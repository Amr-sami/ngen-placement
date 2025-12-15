'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';

interface SignupFormProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export type JoinType = 'individual' | 'organization';

export function SignupForm({ action, locale }: SignupFormProps) {
  const router = useRouter();
  const isRTL = useRTL();

  const [step, setStep] = useState(1);

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

  const [isPending, startTransition] = useTransition();

  const passwordsMatch = password === confirmPassword;
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch;

  // 🔧 Force them to be boolean
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
    email && password && confirmPassword && passwordsMatch
  );

  const handleSubmit = async (formData: FormData) => {
    if (!passwordsMatch) {
      console.error('Passwords do not match');
      return;
    }

    startTransition(async () => {
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phoneNumber', phoneNumber);
      formData.append('parentPhoneNumber', parentPhoneNumber);
      formData.append('age', age);
      formData.append('joinType', joinType);
      formData.append('organizationName', organizationName);
      formData.append('howDidYouKnow', howDidYouKnow);
      formData.append('email', email);
      formData.append('password', password);

      const result = await action(formData);

      if (result.ok) {
        router.push(
          `/${locale}/auth/verify-email?email=${encodeURIComponent(email)}`
        );
      } else {
        console.error('Signup failed');
      }
    });
  };

  const handleSocialSignup = (provider: 'google' | 'apple' | 'facebook') => {
    console.log(`Signup with ${provider}`);
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-[550px] mx-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${
            step === 1 ? 'w-8 bg-pumpkin' : 'w-2 bg-gray-300'
          }`}
        />
        <div
          className={`h-2 rounded-full transition-all ${
            step === 2 ? 'w-8 bg-pumpkin' : 'w-2 bg-gray-300'
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
          isPending={isPending}
          showPasswordError={showPasswordError}
          onBack={handleBack}
          onSocialSignup={handleSocialSignup}
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