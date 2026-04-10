'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Step = 'request' | 'sent';

const PASSWORD_MIN_LENGTH = 8;

function validatePassword(pw: string): string | null {
  if (pw.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (!/[a-zA-Z]/.test(pw)) return 'Password must contain letters';
  if (!/\d/.test(pw)) return 'Password must contain numbers';
  return null;
}

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New password fields (shown after user clicks the reset link — handled by Firebase UI)
  // The actual new-password form is served by Firebase's hosted action page.
  // Here we only handle the "request reset link" step.

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setStep('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Only available for accounts registered with email and password
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {step === 'request' ? (
            <form onSubmit={handleRequest} className="flex flex-col gap-4" noValidate>
              {error && (
                <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <Input
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                helperText="We'll send a password reset link to this address"
              />
              <Button type="submit" loading={loading} className="w-full">
                Send reset link
              </Button>
            </form>
          ) : (
            <div className="text-center flex flex-col gap-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">
                A reset link has been sent to <span className="font-medium">{email}</span>.
                Check your inbox and follow the instructions.
              </p>
              <p className="text-xs text-gray-500">
                Didn&apos;t receive it?{' '}
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
