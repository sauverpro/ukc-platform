"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api, AuthResponse, BACKEND_URL } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore token from localStorage and fetch user
  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    if (stored) {
      setToken(stored);
      api
        .get<User>("/me")
        .then(setUser)
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Fetch CSRF cookie to initialize the session
    await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, { credentials: "include" });

    // 2. Perform the login
    const res = await api.post<AuthResponse>("/login", { email, password });
    localStorage.setItem("auth_token", res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      // 1. Fetch CSRF cookie to initialize the session
      await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, { credentials: "include" });

      // 2. Perform the registration
      const res = await api.post<AuthResponse>("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
      localStorage.setItem("auth_token", res.token);
      setToken(res.token);
      setUser(res.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // Ignore – token may already be revoked
    }
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
