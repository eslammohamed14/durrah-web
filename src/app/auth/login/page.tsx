import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Durrah account using your phone number or email.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to Durrah</h1>
          <p className="mt-2 text-sm text-gray-600">
            Use your phone number or email to access your account
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
