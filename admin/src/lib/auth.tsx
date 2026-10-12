import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import type { Profile, StaffRole } from './types';

export const DEACTIVATED_MESSAGE = 'Your account is deactivated. Contact a MEDIUM admin.';
const NO_PROFILE_MESSAGE = 'Your account is not set up yet. Contact a MEDIUM admin.';

type Session = { user: { id: string; email?: string } } | null;

interface AuthValue {
  session: Session;
  profile: Profile | null;
  role: StaffRole | null;
  loading: boolean;
  notice: string | null;
  signIn(email: string, password: string): Promise<string | null>;
  signOut(): Promise<void>;
  refreshProfile(): Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Loads the signed-in user's profile; signs out anyone without an active profile
  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    const found = data as Profile | null;
    if (error || !found || !found.active) {
      setNotice(found && !found.active ? DEACTIVATED_MESSAGE : NO_PROFILE_MESSAGE);
      setProfile(null);
      setSession(null);
      await supabase.auth.signOut();
    } else {
      setProfile(found);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const current = data.session as Session;
      setSession(current);
      if (current) loadProfile(current.user.id);
      else setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === 'SIGNED_OUT' || !next) {
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      if (event === 'SIGNED_IN') {
        setSession(next as Session);
        loadProfile((next as NonNullable<Session>).user.id);
      }
    });
    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      profile,
      role: profile?.role ?? null,
      loading,
      notice,
      async signIn(email, password) {
        setNotice(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? 'Email or password is incorrect.' : null;
      },
      async signOut() {
        setNotice(null);
        await supabase.auth.signOut();
      },
      async refreshProfile() {
        if (session) await loadProfile(session.user.id);
      },
    }),
    [session, profile, loading, notice, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
