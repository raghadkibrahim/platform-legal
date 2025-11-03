import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {              // <-- default export exists
  const nav = useNavigate();
  const [email, setEmail] = useState("client@example.com");
  const [password, setPassword] = useState("secret123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await login(email, password);
      nav("/cases");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="mt-1 w-full border rounded px-3 py-2"
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 w-full border rounded px-3 py-2"
                 value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full py-2 rounded bg-black text-white">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
