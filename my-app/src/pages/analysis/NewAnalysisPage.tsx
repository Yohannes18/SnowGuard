import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { postAnalysis } from "../../services/analysis";
import Card from "../../components/Cards";

export default function NewAnalysisPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to submit analysis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await postAnalysis(token, url);
      navigate("/analysis/history", {
        state: { successMessage: "Analysis submitted successfully!" },
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to submit analysis");
    } finally {
      setLoading(false);
      setUrl("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">New URL Analysis</h1>
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-all duration-200"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Card>
    </div>
  );
}
