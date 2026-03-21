import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user?.email) await checkAdmin(session.user.email);
        else setIsAdmin(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Auth getSession:', err);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);
      if (session?.user?.email) await checkAdmin(session.user.email);
      else setIsAdmin(false);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function checkAdmin(email) {
    const { data } = await supabase.from('admin_users').select('id').eq('email', email).single();
    setIsAdmin(!!data);
  }

  const value = { user, isAdmin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
