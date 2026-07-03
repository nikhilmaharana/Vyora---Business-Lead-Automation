import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, saveSession } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your email or phone.");
    setLoading(true); setError("");
    try {
      const data = await api("/auth/login", { 
        method: "POST", 
        body: { email: email.includes("@") ? email : "", phone: !email.includes("@") ? email : "" } 
      });
      saveSession(data);
      navigate("/search");
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true); setError("");
    try {
      // Use demo accounts from seed data
      const data = await api("/auth/login", { 
        method: "POST", 
        body: { email: "customer@demo.com" } 
      });
      saveSession(data);
      navigate("/search");
    } catch (err) {
      // If demo user not found (fresh db), create one
      try {
        const data = await api("/auth/signup", { 
          method: "POST", 
          body: { name: "Demo User", email: "customer@demo.com", phone: "9876543210", role: "user" } 
        });
        saveSession(data);
        navigate("/search");
      } catch (signupErr) {
        setError(signupErr.message);
      }
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm lg:grid-cols-2">
        <div className="bg-[#111827] p-10 text-white">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-[#22C55E]">
            Welcome Back
          </span>

          <h1 className="mt-6 text-3xl font-bold md:text-4xl">
            Login to discover trusted businesses
          </h1>

          <p className="mt-4 text-gray-300">
            Search services, compare vendors, and connect with businesses faster.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Fast access</h3>
              <p className="mt-1 text-sm text-gray-300">
                Login instantly and continue your search quickly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Save businesses</h3>
              <p className="mt-1 text-sm text-gray-300">
                Save vendors and track your requirements from your dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-[#1F2937]">Login</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Enter your email or phone to login.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                Email or Mobile Number
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or mobile number"
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white hover:bg-green-600"
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-sm text-[#6B7280]">or</span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB]"
            >
              {loading ? "Logging in…" : "Continue with Demo Account"}
            </button>

            <p className="text-center text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#22C55E] hover:underline"
              >
                Signup
              </Link>
            </p>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Login
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;