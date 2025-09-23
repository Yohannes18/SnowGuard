import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAnalysisHistory, type Analysis as AnalysisType } from "../../services/analysis";
import Card from "../../components/Cards";
import { SpinnerIcon } from "../../components/Icons";

interface LocationState {
  successMessage?: string;
}

export default function AnalysisHistory() {
  const { token } = useAuth();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [history, setHistory] = useState<AnalysisType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success] = useState<string | null>(locationState?.successMessage || null);

  useEffect(() => {
    async function fetchHistory() {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getAnalysisHistory(token);
        setHistory(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch analysis history");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Analysis History</h1>

        {success && <p className="text-green-600">{success}</p>}
        {loading && (
          <div className="flex justify-center py-6">
            <SpinnerIcon className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["URL", "Result", "Flags", "Date"].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.length > 0 ? (
                  history.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-200 text-center">
                      <td className="px-4 py-2 text-sm text-gray-700">{a.url}</td>
                      <td
                        className={`px-4 py-2 text-sm font-semibold ${
                          a.result.toLowerCase() === "safe" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {a.result}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{a.flags}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {new Date(a.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-gray-600 text-center">
                      No analysis history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
