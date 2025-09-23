from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    url = Column(String, nullable=False)
    result = Column(String, nullable=False)  # verdict: "phishing" / "safe"
    virustotal_flag = Column(Boolean, default=False)
    google_safebrowsing_flag = Column(Boolean, default=False)
    urlhaus_flag = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="analyses")
