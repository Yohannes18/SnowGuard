import { api } from "./api";

export interface Analysis {
  id: number;
  url: string;
  verdict: string;        // aligned with backend field
  created_at: string;    // ISO timestamp
}

// Submit new analysis
export async function postAnalysis(url: string): Promise<Analysis> {
  const res = await api.post<Analysis>("/analysis/analyze", { url });
  return res.data;
}

// Fetch analysis history
export async function getAnalysisHistory(): Promise<Analysis[]> {
  const res = await api.get<Analysis[]>("/analysis/history");
  return res.data;
}
