import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- SVG Icons ---
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" />
  </svg>
);

const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-8 text-center mt-5 sm:mt-10">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl border border-gray-100">
        {/* Hero Section */}
        <ShieldCheckIcon className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to SnowGuard
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          SnowGuard is your companion for detecting suspicious or malicious URLs. 
          Whether you’re browsing the web or running security analysis, our 
          system uses advanced algorithms to flag risks and keep you safe.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/analysis/analyze")}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
            Start New Analysis
          </button>
        </div>

        {/* Auth Callout */}
        {!user && (
            <div className="bg-gray-50 p-6 rounded-lg border">
            <p className="text-gray-700">
            New here?{" "}
            <span
                onClick={() => navigate("/register")}
                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
                Create an account
            </span>{" "}
            or{" "}
            <span
                onClick={() => navigate("/login")}
                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
                Login
            </span>{" "}
              to save your analysis history.
             </p>
            </div>
            )}

      </div>
    </div>
  );
}
