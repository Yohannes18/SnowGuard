from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime

from app.database import get_session
from app.models.user import User
from app.models.analysis import AnalysisReport
from app.schemas.analysis import AnalysisReportRead
from app.auth.deps import get_active_user

router = APIRouter()

# ---------------------------
# Submit new analysis
# ---------------------------
@router.post("/analyze", response_model=AnalysisReportRead)
async def create_report(
    url_data: dict,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_active_user)
):
    url = url_data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    verdict = "safe" if "https" in url else "malicious"

    report = AnalysisReport(
        url=url,
        verdict=verdict,
        virustotal="",
        google_safebrowsing="",
        urlhaus="",
        user_id=current_user.id
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report



# ---------------------------
# Get history
# ---------------------------
@router.get("/history", response_model=List[AnalysisReportRead])
async def list_reports(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_active_user)
):
    result = await db.execute(
        select(AnalysisReport).where(AnalysisReport.user_id == current_user.id)
    )
    return result.scalars().all()
