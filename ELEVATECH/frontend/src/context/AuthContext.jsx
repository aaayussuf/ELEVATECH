import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "elevatech_token";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistToken = useCallback((nextToken) => {
    setToken(nextToken);
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const bootstrap = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await authService.me(token);
      setUser(me);
    } catch {
      persistToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [persistToken, token]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      persistToken(null);
      setUser(null);
    }
  }, [persistToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login: persistToken,
      logout,
    }),
    [token, user, isLoading, persistToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

