import { useLocation, useNavigate } from "react-router-dom";
import type { Analysis } from "../../services/analysis";
import Card from "../../components/Cards";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as Analysis | undefined;

  if (!result) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">No Analysis Result Found</h1>
          <button
            onClick={() => navigate("/analysis/analyze")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-200"
          >
            Submit New Analysis
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Card className="p-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Analysis Result</h1>
        <p className="text-black"><strong>URL:</strong> {result.url}</p>
        <p className="text-black">
          <strong>Result:</strong>{" "}
          <span className={result.verdict.toLowerCase() === "safe" ? "text-green-600" : "text-red-600"}>
            {result.verdict}
          </span>
        </p>
        <p className="text-black"><strong>Flags:</strong> {result.verdict.toLowerCase() === "safe" ? "Passed" : "Failed"}</p>
        <p className="text-black"><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>

        <div className="mt-6 flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/analysis/analyze")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-200"
          >
            Submit Another
          </button>
          <button
            onClick={() => navigate("/analysis/history")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-200"
          >
            View History
          </button>
        </div>
      </Card>
    </div>
  );
}
