from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.auth import current_active_user
from app.services.analyzer import Analyzer
from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse, HistoryItem

router = APIRouter()
analyzer = Analyzer()


# --- Analyze a URL ---
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    req: AnalyzeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Run phishing detection using Analyzer.
    Save result and service flags to DB and return them.
    """
    verdict_data = await analyzer.aggregate_url_checks(req.text)

    analysis = Analysis(
        user_id=user.id,
        url=req.text,
        result=verdict_data["verdict"],
        virustotal_flag=verdict_data["virustotal"],
        google_safebrowsing_flag=verdict_data["google_safebrowsing"],
        urlhaus_flag=verdict_data["urlhaus"],
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalyzeResponse(
        result=analysis.result,
        virustotal=analysis.virustotal_flag,
        google_safebrowsing=analysis.google_safebrowsing_flag,
        urlhaus=analysis.urlhaus_flag,
    )


# --- Get user's analysis history ---
@router.get("/history", response_model=List[HistoryItem])
async def get_history(
    db: Session = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Return all analyses for the logged-in user.
    """
    records = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    return [
        HistoryItem(
            id=rec.id,
            text=rec.url,
            result=rec.result,
            virustotal=rec.virustotal_flag,
            google_safebrowsing=rec.google_safebrowsing_flag,
            urlhaus=rec.urlhaus_flag,
            created_at=rec.created_at,
        )
        for rec in records
    ]
