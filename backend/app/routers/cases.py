from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import RecoveryCase, AuditLog
from ..schemas import RecoveryCaseOut, ActionExecuteRequest
from ..services.workflow_exec import execute_recovery_workflow

router = APIRouter(prefix="/api/cases", tags=["Recovery Cases"])

@router.get("", response_model=List[RecoveryCaseOut])
def get_cases(
    status: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Lists recovery cases with optional filtering by status and risk level.
    """
    query = db.query(RecoveryCase).options(
        joinedload(RecoveryCase.customer),
        joinedload(RecoveryCase.event),
        joinedload(RecoveryCase.actions)
    )

    if status:
        query = query.filter(RecoveryCase.status == status)
    if risk_level:
        query = query.filter(RecoveryCase.risk_level == risk_level)

    cases = query.order_by(RecoveryCase.created_at.desc()).all()
    return cases


@router.get("/{case_id}", response_model=RecoveryCaseOut)
def get_case_detail(case_id: str, db: Session = Depends(get_db)):
    """
    Retrieves detailed information for a single recovery case.
    """
    case = db.query(RecoveryCase).options(
        joinedload(RecoveryCase.customer),
        joinedload(RecoveryCase.event),
        joinedload(RecoveryCase.actions)
    ).filter(RecoveryCase.id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Recovery case not found.")

    return case


@router.post("/{case_id}/execute", response_model=RecoveryCaseOut)
def execute_case_action(case_id: str, req: ActionExecuteRequest, db: Session = Depends(get_db)):
    """
    Triggers recovery action workflow for a specific case.
    """
    case = db.query(RecoveryCase).filter(RecoveryCase.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Recovery case not found.")

    action_to_run = req.action_type or case.recommended_action or "RETRY_PAYMENT"

    try:
        updated_case = execute_recovery_workflow(
            db=db,
            case_id=case_id,
            action_type=action_to_run,
            custom_note=req.custom_note,
            override_human=req.override_human_approval
        )
        return updated_case
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{case_id}/escalate")
def escalate_case(case_id: str, db: Session = Depends(get_db)):
    """
    Escalates a case for senior manual intervention.
    """
    case = db.query(RecoveryCase).filter(RecoveryCase.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Recovery case not found.")

    case.status = "ESCALATED"
    case.requires_human_approval = True

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:8]}",
        case_id=case.id,
        action_by="HUMAN_OPERATOR",
        action_type="CASE_ESCALATED",
        description=f"Case {case.id} escalated for manual tier-2 revenue team intervention.",
        policy_check_result="MANUAL_ESCALATION"
    )
    db.add(audit)
    db.commit()
    db.refresh(case)

    return {"status": "success", "message": f"Case {case_id} escalated successfully.", "case": case}
