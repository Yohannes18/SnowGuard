from pydantic import BaseModel
from datetime import datetime

class AnalysisReportCreate(BaseModel):
    url: str

class AnalysisReportRead(BaseModel):
    id: int
    url: str
    verdict: str
    virustotal: str
    google_safebrowsing: str
    urlhaus: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }