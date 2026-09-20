import type { PublicMemberDto, SelfMemberDto } from "@gov-portal/shared";
import { createContext, useContext, useEffect, useState } from "react";

import { fetchOwnProfile } from "./api";

interface SessionContextValue {
  profile: SelfMemberDto | null;
  loading: boolean;
  refresh: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  profile: null,
  loading: true,
  refresh: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SelfMemberDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const own = await fetchOwnProfile();
        if (!cancelled) setProfile(own);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  function refresh() {
    setTick((t) => t + 1);
  }

  return (
    <SessionContext.Provider value={{ profile, loading, refresh }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
