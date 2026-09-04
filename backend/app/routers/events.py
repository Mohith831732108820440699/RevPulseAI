import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Customer, RevenueEvent, RecoveryCase, AuditLog
from ..schemas import RevenueEventCreate, RevenueEventOut
from ..services.risk_engine import calculate_risk_assessment
from ..services.ai_diagnosis import perform_ai_diagnosis
from ..services.safety_guard import evaluate_safety_guardrails

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.post("/webhook", response_model=RevenueEventOut)
def receive_webhook_event(payload: RevenueEventCreate, db: Session = Depends(get_db)):
    """
    Webhooks / Event Ingestion Endpoint.
    Ingests payment events, checks/creates customer, triggers Risk Assessment, AI Diagnosis, and creates a RecoveryCase.
    """
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if not customer:
        customer = Customer(
            id=payload.customer_id,
            name=f"Customer {payload.customer_id[-4:]}",
            email=f"contact_{payload.customer_id[-4:]}@example.com",
            ltv_amount=payload.amount * 5.0,
            tier="Pro",
            churn_risk_score=0.2
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    event_id = f"evt_{uuid.uuid4().hex[:8]}"
    now = datetime.datetime.utcnow()

    event = RevenueEvent(
        id=event_id,
        event_type=payload.event_type,
        event_source=payload.event_source,
        customer_id=customer.id,
        amount=payload.amount,
        currency=payload.currency,
        error_code=payload.error_code,
        error_message=payload.error_message,
        raw_data=payload.raw_data,
        created_at=now
    )
    db.add(event)
    db.commit()

    # Step 1: Risk Assessment
    risk_info = calculate_risk_assessment(
        amount=payload.amount,
        customer_ltv=customer.ltv_amount,
        churn_score=customer.churn_risk_score,
        event_type=payload.event_type,
        error_code=payload.error_code or ""
    )

    # Step 2: AI Diagnosis
    ai_info = perform_ai_diagnosis(
        event_type=payload.event_type,
        error_code=payload.error_code or "",
        error_msg=payload.error_message or "",
        amount=payload.amount,
        customer_name=customer.name,
        customer_tier=customer.tier
    )

    # Step 3: Safety Guardrails Check
    safety_info = evaluate_safety_guardrails(
        amount=payload.amount,
        retry_count=0,
        recommended_action=ai_info["recommended_action"],
        arr_impact=risk_info["arr_impact"],
        customer_tier=customer.tier
    )

    # Create Recovery Case
    case_id = f"case_{uuid.uuid4().hex[:8]}"
    new_case = RecoveryCase(
        id=case_id,
        event_id=event.id,
        customer_id=customer.id,
        status="DIAGNOSED" if safety_info["is_safety_passed"] else "OPEN",
        risk_level=risk_info["risk_level"],
        risk_score=risk_info["risk_score"],
        arr_impact=risk_info["arr_impact"],
        root_cause_category=ai_info["root_cause_category"],
        root_cause_details=ai_info["root_cause_details"],
        recommended_action=ai_info["recommended_action"],
        suggested_communication=ai_info["suggested_communication"],
        is_safety_passed=safety_info["is_safety_passed"],
        safety_notes=safety_info["safety_notes"],
        requires_human_approval=safety_info["requires_human_approval"],
        retry_count=0,
        created_at=now,
        updated_at=now
    )
    db.add(new_case)

    # Log Audit Entry
    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:8]}",
        case_id=new_case.id,
        action_by="SYSTEM_AGENT",
        action_type="EVENT_INGESTED_AND_DIAGNOSED",
        description=f"Event {event_id} ({payload.event_type}) ingested for {customer.name}. Risk Score: {risk_info['risk_score']} ({risk_info['risk_level']}). Root Cause: {ai_info['root_cause_category']}.",
        policy_check_result=safety_info["safety_notes"],
        timestamp=now
    )
    db.add(audit)

    db.commit()
    db.refresh(event)

    return event
