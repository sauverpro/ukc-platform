"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useDark } from "../../components/DarkContext";
import { useAuth } from "../../lib/auth";
import type { ApiError } from "../../lib/api";

export default function LoginPage() {
  const { dark } = useDark();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = dark ? "#0d1f10" : "#f9fafb";
  const cardBg = dark ? "#1a2e1e" : "white";
  const textPrimary = dark ? "#f0fdf4" : "#1a1a1a";
  const textMuted = dark ? "#9ca3af" : "#6b7280";
  const border = dark ? "#2d4a32" : "#e5e7eb";
  const inputBg = dark ? "#152318" : "white";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <Navbar active="" />

      <main className="flex-1 flex items-center justify-center px-4" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: textPrimary }}>Welcome Back</h1>
          <p className="text-sm text-center mb-8" style={{ color: textMuted }}>
            Sign in to your UKC account
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ background: dark ? "#3b1010" : "#fef2f2", color: "#ef4444", border: "1px solid #ef4444" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: loading ? "#6b7280" : "#0d9e72", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: textMuted }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold" style={{ color: "#0d9e72" }}>
              Create one
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
