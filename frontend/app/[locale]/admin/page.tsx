'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('handleSubmit called', email, password)
  setIsLoading(true);
  setError('');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

     if (data.success && data.token) {
      localStorage.setItem('adminToken', data.token);
      document.cookie = `adminToken=${data.token}; path=/; max-age=86400`
      window.location.href = `http://localhost:3000/${locale}/admin/dashboard`;
    }else {
      setError(data.error || 'Invalid credentials');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.push(`/${newLocale}/admin`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <Button
          variant="outline"
          onClick={toggleLanguage}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          {locale === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Topicrem & Novexpert
          </CardTitle>
          <p className="text-gray-600 mt-2">Admin Dashboard Access</p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}