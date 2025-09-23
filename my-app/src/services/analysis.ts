import axios, { type AxiosResponse } from "axios";

const API_BASE = "http://localhost:8000"; // adjust to your backend URL

export interface Analysis {
  id: string;
  url: string;
  result: string;
  flags: string;
  created_at: string;
}

// Submit a new URL for analysis
export async function postAnalysis(token: string, url: string): Promise<Analysis> {
  const res: AxiosResponse<Analysis> = await axios.post(
    `${API_BASE}/analysis`,
    { url },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

// Get analysis history for current user
export async function getAnalysisHistory(token: string): Promise<Analysis[]> {
  const res: AxiosResponse<Analysis[]> = await axios.get(`${API_BASE}/analysis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
