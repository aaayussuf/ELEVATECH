import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";
import socket from "../services/socketService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const TOKEN_KEY = "elevatech_token";
const PENDING_VERIFICATION_KEY = "elevatech_pending_verification";

function readStoredToken() {
  try {
    return (
      sessionStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(TOKEN_KEY)
    );
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistToken = useCallback((nextToken, remember = true) => {
    setToken(nextToken);
    try {
      if (nextToken) {
        // Store in both so the token survives browser-restart refreshes
        // regardless of which storage the session started in.
        localStorage.setItem(TOKEN_KEY, nextToken);
        if (remember) {
          sessionStorage.setItem(TOKEN_KEY, nextToken);
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      } else {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // ------------------------------------------------------------------
  // Pending verification helpers — used by Register -> VerifyAccount
  // ------------------------------------------------------------------
  const savePendingVerification = useCallback((data) => {
    try {
      localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  }, []);

  const getPendingVerification = useCallback(() => {
    try {
      const raw = localStorage.getItem(PENDING_VERIFICATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const clearPendingVerification = useCallback(() => {
    try {
      localStorage.removeItem(PENDING_VERIFICATION_KEY);
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

  useEffect(() => {
    if (!token || !user?.id) {
      return;
    }

    socket.emit("join_customer_room", {
      token,
    });

  }, [token, user]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      persistToken(null);
      setUser(null);
    }
  }, [persistToken]);

  const refreshUser = useCallback(async () => {
    const currentToken =
      token ||
      (() => {
        try {
          return (
            sessionStorage.getItem(TOKEN_KEY) ||
            localStorage.getItem(TOKEN_KEY)
          );
        } catch {
          return null;
        }
      })();
    if (!currentToken) {
      setUser(null);
      return null;
    }
    try {
      const me = await authService.me(currentToken);
      setUser(me);
      return me;
    } catch {
      return user;
    }
  }, [token, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      setUser,
      refreshUser,
      login: persistToken,
      logout,
      savePendingVerification,
      getPendingVerification,
      clearPendingVerification,
    }),
    [
      token,
      user,
      isLoading,
      refreshUser,
      persistToken,
      logout,
      savePendingVerification,
      getPendingVerification,
      clearPendingVerification,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

