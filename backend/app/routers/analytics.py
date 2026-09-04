from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import RecoveryCase, RevenueEvent, AuditLog
from ..schemas import AuditLogOut

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Governance"])

@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    """
    Computes high-level Executive Dashboard KPIs:
    Total Revenue at Risk, Total Recovered Revenue, Recovery Rate %, Active Cases, Churn Saved count.
    """
    total_at_risk = db.query(func.sum(RecoveryCase.arr_impact)).scalar() or 0.0

    recovered_query = db.query(func.sum(RecoveryCase.arr_impact)).filter(RecoveryCase.status == "RECOVERED")
    recovered_revenue = recovered_query.scalar() or 0.0

    total_cases_count = db.query(func.count(RecoveryCase.id)).scalar() or 0
    recovered_cases_count = db.query(func.count(RecoveryCase.id)).filter(RecoveryCase.status == "RECOVERED").scalar() or 0
    active_cases_count = db.query(func.count(RecoveryCase.id)).filter(RecoveryCase.status.in_(["OPEN", "DIAGNOSED", "IN_PROGRESS"])).scalar() or 0
    escalated_cases_count = db.query(func.count(RecoveryCase.id)).filter(RecoveryCase.status == "ESCALATED").scalar() or 0

    recovery_rate = round((recovered_cases_count / total_cases_count * 100.0) if total_cases_count > 0 else 0.0, 1)

    # Root Cause Breakdown
    root_causes = db.query(
        RecoveryCase.root_cause_category,
        func.count(RecoveryCase.id),
        func.sum(RecoveryCase.arr_impact)
    ).group_by(RecoveryCase.root_cause_category).all()

    cause_breakdown = [
        {
            "category": cause[0] or "Unclassified",
            "count": cause[1],
            "arr_impact": round(cause[2] or 0.0, 2)
        }
        for cause in root_causes
    ]

    return {
        "total_revenue_at_risk": round(total_at_risk, 2),
        "total_recovered_revenue": round(recovered_revenue, 2),
        "recovery_rate_percent": recovery_rate,
        "total_cases_count": total_cases_count,
        "recovered_cases_count": recovered_cases_count,
        "active_cases_count": active_cases_count,
        "escalated_cases_count": escalated_cases_count,
        "root_cause_breakdown": cause_breakdown
    }


@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    """
    Returns recent immutable audit & governance logs.
    """
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs
