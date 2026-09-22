"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useDark } from "../../components/DarkContext";
import { useAuth } from "../../lib/auth";
import type { ApiError } from "../../lib/api";

export default function RegisterPage() {
  const { dark } = useDark();
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
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
    setFieldErrors({});

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Registration failed.");
      if (apiErr.errors) setFieldErrors(apiErr.errors);
    } finally {
      setLoading(false);
    }
  }

  const fieldErr = (field: string) =>
    fieldErrors[field]?.[0] ? (
      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
        {fieldErrors[field][0]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <Navbar active="" />

      <main className="flex-1 flex items-center justify-center px-4" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: textPrimary }}>Create Account</h1>
          <p className="text-sm text-center mb-8" style={{ color: textMuted }}>
            Join UKC Platform today
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ background: dark ? "#3b1010" : "#fef2f2", color: "#ef4444", border: "1px solid #ef4444" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="John Doe" />
              {fieldErr("name")}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="you@example.com" />
              {fieldErr("email")}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="••••••••" />
              {fieldErr("password")}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: textMuted }}>Confirm password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: inputBg, color: textPrimary, border: `1px solid ${border}` }}
                placeholder="••••••••" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: loading ? "#6b7280" : "#0d9e72", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: textMuted }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color: "#0d9e72" }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
