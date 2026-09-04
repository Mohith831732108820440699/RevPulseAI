import uuid
import datetime
from sqlalchemy.orm import Session
from ..models import RecoveryCase, RecoveryAction, AuditLog

def execute_recovery_workflow(db: Session, case_id: str, action_type: str, custom_note: str = None, override_human: bool = False):
    """
    Executes a recovery action, updates recovery case status, logs audit trail.
    """
    case = db.query(RecoveryCase).filter(RecoveryCase.id == case_id).first()
    if not case:
        raise ValueError("Recovery case not found.")

    if case.requires_human_approval and not override_human:
        raise ValueError("Case requires explicit human operator approval before execution.")

    # Create RecoveryAction record
    action_id = f"act_{uuid.uuid4().hex[:8]}"
    now = datetime.datetime.utcnow()

    # Determine execution behavior based on action_type
    if action_type == "RETRY_PAYMENT":
        case.retry_count += 1
        summary = f"Automated payment retry attempt #{case.retry_count} dispatched to payment gateway."
        case.status = "RECOVERED" if case.retry_count % 2 == 1 else "IN_PROGRESS"

    elif action_type == "SEND_SMART_LINK":
        summary = f"Personalized smart card update link delivered via Email & SMS."
        case.status = "IN_PROGRESS"

    elif action_type == "APPLY_DISCOUNT":
        summary = f"10% limited-time incentive code generated and delivered to customer."
        case.status = "RECOVERED"

    elif action_type == "SEND_WHATSAPP":
        summary = f"Interactive WhatsApp payment reminder disptached with 1-click checkout URL."
        case.status = "IN_PROGRESS"

    else:
        summary = f"Custom action executed: {action_type}."
        case.status = "IN_PROGRESS"

    if custom_note:
        summary += f" Note: {custom_note}"

    new_action = RecoveryAction(
        id=action_id,
        case_id=case.id,
        action_type=action_type,
        status="EXECUTED",
        action_payload=case.suggested_communication,
        result_summary=summary,
        executed_at=now
    )
    db.add(new_action)

    # Create AuditLog entry
    audit_id = f"aud_{uuid.uuid4().hex[:8]}"
    audit_entry = AuditLog(
        id=audit_id,
        case_id=case.id,
        action_by="HUMAN_OPERATOR" if override_human else "SYSTEM_AGENT",
        action_type=action_type,
        description=f"Action '{action_type}' executed for case {case.id}. Status changed to {case.status}. {summary}",
        policy_check_result=case.safety_notes,
        timestamp=now
    )
    db.add(audit_entry)

    case.updated_at = now
    db.commit()
    db.refresh(case)

    return case
