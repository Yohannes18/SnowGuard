import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/auth";
import { UserIcon, LockIcon, EmailIcon, SpinnerIcon } from "../../components/Icons";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await registerUser({ email, username, password });
      const token = (data as any).access_token || (data as any).token;

      if (!token) throw new Error("Registration succeeded, but login failed.");
      await login(token);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-gray-600">Join SnowGuard and start protecting your browsing experience.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <EmailIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <UserIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <LockIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 
            bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
            disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading && <SpinnerIcon className="animate-spin h-5 w-5" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}
