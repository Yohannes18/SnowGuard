import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAnalysisHistory, type Analysis } from "../../services/analysis";

const AnalysisHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Optional success message passed from previous navigation
  const successMessage = (location.state as { successMessage?: string })?.successMessage;

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAnalysisHistory();
        setHistory(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch analysis history");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const handleRowClick = (analysis: Analysis) => {
    navigate("/analysis/result", { state: analysis });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Analysis History
        </h2>

        {successMessage && (
          <p className="text-green-600 text-sm mb-4">{successMessage}</p>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600">No analysis history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    URL
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Result
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t cursor-pointer hover:bg-gray-100 transition-all duration-150"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-4 py-2 text-sm text-gray-900">{item.url}</td>
                    <td className={`px-4 py-2 text-sm font-medium ${
                      item.verdict.toLowerCase() === "safe" ? "text-green-600" : "text-red-600"
                    }`}>
                      {item.verdict}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistoryPage;
