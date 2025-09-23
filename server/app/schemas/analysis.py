from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- Schemas for route request/response ---
class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    result: str
    virustotal: bool
    google_safebrowsing: bool
    urlhaus: bool


class HistoryItem(BaseModel):
    id: int
    text: str
    result: str
    virustotal: bool
    google_safebrowsing: bool
    urlhaus: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Schemas for DB operations ---
class AnalysisCreate(BaseModel):
    url: str
    result: Optional[str] = None  # optional because result will be computed
    virustotal_flag: Optional[bool] = False
    google_safebrowsing_flag: Optional[bool] = False
    urlhaus_flag: Optional[bool] = False


class AnalysisRead(BaseModel):
    id: int
    user_id: str
    url: str
    result: str
    virustotal_flag: bool
    google_safebrowsing_flag: bool
    urlhaus_flag: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisUpdate(BaseModel):
    url: Optional[str] = None
    result: Optional[str] = None
    virustotal_flag: Optional[bool] = None
    google_safebrowsing_flag: Optional[bool] = None
    urlhaus_flag: Optional[bool] = None
