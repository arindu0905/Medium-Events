import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { MIN_PASSWORD_LENGTH } from '../../../supabase/functions/manage-staff/validate.ts';

const FIELD =
  'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand';

// Shown after signing in with a temporary password (new account or admin reset).
// The user can't reach any other page until they choose their own password.
export default function ChangePasswordPage() {
  const { refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (!updateError) {
      const { error: flagError } = await supabase.rpc('clear_password_flag');
      if (!flagError) {
        await refreshProfile();
        navigate('/', { replace: true });
        return;
      }
    }
    setBusy(false);
    setError("Your password couldn't be saved. Try again.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <h1 className="text-2xl font-bold text-ink">Choose a new password</h1>
        <p className="mt-2 text-sm text-body">You signed in with a temporary password. Choose your own to continue.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold text-ink mb-1.5">New password</label>
            <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} />
            <p className="mt-1 text-xs text-muted">At least {MIN_PASSWORD_LENGTH} characters.</p>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-ink mb-1.5">Confirm password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={FIELD} />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 cursor-pointer"
          >
            Save password
          </button>
        </form>
        <button type="button" onClick={signOut} className="mt-4 text-sm font-semibold text-brand hover:text-brand-hover cursor-pointer">
          Sign out
        </button>
      </div>
    </main>
  );
}
