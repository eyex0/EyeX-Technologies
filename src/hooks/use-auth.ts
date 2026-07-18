import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import type { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const getInitialSession = async () => {
      try {
        const currentSession = await AuthService.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for changes
    const subscription = AuthService.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, signOut: AuthService.signOut };
}
