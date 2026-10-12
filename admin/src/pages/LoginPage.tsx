import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const FIELD =
  'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand';
const BUTTON =
  'w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 cursor-pointer';

export default function LoginPage() {
  const { profile, notice, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (profile) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (resetMode) {
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/set-password` });
      setResetSent(true);
    } else {
      setError(await signIn(email.trim(), password));
    }
    setBusy(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">MEDIUM Events</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{resetMode ? 'Reset your password' : 'Sign in to MEDIUM Admin'}</h1>

        {notice && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
            {notice}
          </p>
        )}

        {resetSent ? (
          <p role="status" className="mt-6 text-sm text-body">
            If that email has an account, we've sent a link to reset the password.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} required />
            </div>
            {!resetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">Password</label>
                <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} required />
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className={BUTTON}>
              {resetMode ? 'Send reset link' : 'Sign in'}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => {
            setResetMode(!resetMode);
            setResetSent(false);
            setError(null);
          }}
          className="mt-4 text-sm font-semibold text-brand hover:text-brand-hover cursor-pointer"
        >
          {resetMode ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </div>
    </main>
  );
}
