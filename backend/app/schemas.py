from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CustomerBase(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    ltv_amount: float = 0.0
    tier: str = "Standard"
    churn_risk_score: float = 0.1

class CustomerCreate(CustomerBase):
    id: str

class CustomerOut(CustomerBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RevenueEventBase(BaseModel):
    event_type: str
    event_source: str = "Stripe"
    customer_id: str
    amount: float
    currency: str = "USD"
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    raw_data: Optional[str] = None

class RevenueEventCreate(RevenueEventBase):
    pass

class RevenueEventOut(RevenueEventBase):
    id: str
    created_at: datetime
    customer: Optional[CustomerOut] = None

    model_config = ConfigDict(from_attributes=True)

class RecoveryActionOut(BaseModel):
    id: str
    case_id: str
    action_type: str
    status: str
    action_payload: Optional[str] = None
    result_summary: Optional[str] = None
    executed_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuditLogOut(BaseModel):
    id: str
    case_id: Optional[str] = None
    action_by: str
    action_type: str
    description: str
    policy_check_result: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class RecoveryCaseOut(BaseModel):
    id: str
    event_id: str
    customer_id: str
    status: str
    risk_level: str
    risk_score: float
    arr_impact: float
    root_cause_category: Optional[str] = None
    root_cause_details: Optional[str] = None
    recommended_action: Optional[str] = None
    suggested_communication: Optional[str] = None
    is_safety_passed: bool
    safety_notes: Optional[str] = None
    requires_human_approval: bool
    retry_count: int
    created_at: datetime
    updated_at: datetime
    customer: Optional[CustomerOut] = None
    event: Optional[RevenueEventOut] = None
    actions: List[RecoveryActionOut] = []

    model_config = ConfigDict(from_attributes=True)

class ActionExecuteRequest(BaseModel):
    action_type: Optional[str] = None
    custom_note: Optional[str] = None
    override_human_approval: bool = False

class SimulatorEventRequest(BaseModel):
    event_type: str = "PAYMENT_FAILED"
    amount: float = 299.0
    customer_name: str = "Acme Corp"
    customer_email: str = "billing@acme.com"
    customer_tier: str = "Enterprise"
    error_code: str = "insufficient_funds"
    error_message: str = "Your card has insufficient funds."
