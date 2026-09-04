import os
import uuid
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import Customer, RevenueEvent, RecoveryCase, RecoveryAction, AuditLog
from .routers import events, cases, analytics, simulator, auth
from .services.risk_engine import calculate_risk_assessment
from .services.ai_diagnosis import perform_ai_diagnosis
from .services.safety_guard import evaluate_safety_guardrails

# Create tables
Base.metadata.create_all(bind=engine)

def seed_initial_data():
    """
    Seeds database with initial enterprise demo data if empty.
    """
    db = SessionLocal()
    try:
        if db.query(Customer).count() == 0:
            print("Seeding initial enterprise demo cases into RevPulse database...")
            
            initial_customers = [
                Customer(id="cust_acme_001", name="Acme Enterprises", email="finance@acme.com", company="Acme Corp", ltv_amount=45000.0, tier="Enterprise", churn_risk_score=0.35),
                Customer(id="cust_nexus_002", name="Nexus Digital", email="billing@nexusdigital.io", company="Nexus Digital", ltv_amount=12500.0, tier="Pro", churn_risk_score=0.15),
                Customer(id="cust_vortex_003", name="Vortex Media", email="accounts@vortexmedia.co", company="Vortex Media", ltv_amount=28000.0, tier="Enterprise", churn_risk_score=0.72),
                Customer(id="cust_solis_004", name="Solis Health", email="ar@solishealth.com", company="Solis Health", ltv_amount=8200.0, tier="Standard", churn_risk_score=0.20),
                Customer(id="cust_hyper_005", name="Hyperion Labs", email="ops@hyperion.ai", company="Hyperion Labs", ltv_amount=62000.0, tier="Enterprise", churn_risk_score=0.48),
            ]
            for c in initial_customers:
                db.add(c)
            db.commit()

            demo_events_data = [
                {
                    "cust_id": "cust_acme_001",
                    "event_type": "PAYMENT_FAILED",
                    "amount": 1850.0,
                    "error_code": "do_not_honor",
                    "error_msg": "Bank decline: Customer bank blocked high value recurring charge."
                },
                {
                    "cust_id": "cust_nexus_002",
                    "event_type": "CARD_EXPIRING",
                    "amount": 499.0,
                    "error_code": "card_expired",
                    "error_msg": "Credit card on file expired this month."
                },
                {
                    "cust_id": "cust_vortex_003",
                    "event_type": "PAYMENT_FAILED",
                    "amount": 3200.0,
                    "error_code": "insufficient_funds",
                    "error_msg": "Debit account balance insufficient."
                },
                {
                    "cust_id": "cust_solis_004",
                    "event_type": "CART_ABANDONED",
                    "amount": 299.0,
                    "error_code": "abandoned_checkout",
                    "error_msg": "Abandoned checkout at credit card entry stage."
                },
                {
                    "cust_id": "cust_hyper_005",
                    "event_type": "INVOICE_OVERDUE",
                    "amount": 5400.0,
                    "error_code": "past_due_45",
                    "error_msg": "Net-30 Enterprise invoice #INV-9041 is 45 days past due."
                }
            ]

            now = datetime.datetime.now(datetime.timezone.utc)
            for idx, data in enumerate(demo_events_data):
                cust = db.query(Customer).filter(Customer.id == data["cust_id"]).first()
                evt_id = f"evt_seed_{idx+1}"
                
                event = RevenueEvent(
                    id=evt_id,
                    event_type=data["event_type"],
                    event_source="Stripe",
                    customer_id=cust.id,
                    amount=data["amount"],
                    currency="USD",
                    error_code=data["error_code"],
                    error_message=data["error_msg"],
                    created_at=now - datetime.timedelta(hours=(idx*6))
                )
                db.add(event)
                db.commit()

                # Calculate Risk & AI Diagnosis & Safety
                risk = calculate_risk_assessment(data["amount"], cust.ltv_amount, cust.churn_risk_score, data["event_type"], data["error_code"])
                ai_diag = perform_ai_diagnosis(data["event_type"], data["error_code"], data["error_msg"], data["amount"], cust.name, cust.tier)
                safety = evaluate_safety_guardrails(data["amount"], 0, ai_diag["recommended_action"], risk["arr_impact"], cust.tier)

                case_id = f"case_seed_{idx+1}"
                status = "RECOVERED" if idx == 1 else ("OPEN" if safety["requires_human_approval"] else "DIAGNOSED")
                
                recovery_case = RecoveryCase(
                    id=case_id,
                    event_id=event.id,
                    customer_id=cust.id,
                    status=status,
                    risk_level=risk["risk_level"],
                    risk_score=risk["risk_score"],
                    arr_impact=risk["arr_impact"],
                    root_cause_category=ai_diag["root_cause_category"],
                    root_cause_details=ai_diag["root_cause_details"],
                    recommended_action=ai_diag["recommended_action"],
                    suggested_communication=ai_diag["suggested_communication"],
                    is_safety_passed=safety["is_safety_passed"],
                    safety_notes=safety["safety_notes"],
                    requires_human_approval=safety["requires_human_approval"],
                    retry_count=1 if status == "RECOVERED" else 0,
                    created_at=now - datetime.timedelta(hours=(idx*6)),
                    updated_at=now - datetime.timedelta(hours=(idx*6))
                )
                db.add(recovery_case)

                if status == "RECOVERED":
                    action = RecoveryAction(
                        id=f"act_seed_{idx+1}",
                        case_id=case_id,
                        action_type=ai_diag["recommended_action"],
                        status="EXECUTED",
                        action_payload=ai_diag["suggested_communication"],
                        result_summary="Smart Card update link delivered via Email. Customer updated billing details.",
                        executed_at=now - datetime.timedelta(hours=4)
                    )
                    db.add(action)

                audit = AuditLog(
                    id=f"aud_seed_{idx+1}",
                    case_id=case_id,
                    action_by="SYSTEM_AGENT",
                    action_type="CASE_INITIALIZED",
                    description=f"Initial seed case created for {cust.name}. Amount: ${data['amount']:.2f}. Status: {status}.",
                    policy_check_result=safety["safety_notes"],
                    timestamp=now - datetime.timedelta(hours=(idx*6))
                )
                db.add(audit)

            db.commit()
            print("Successfully seeded demo data!")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_initial_data()
    yield

app = FastAPI(
    title="RevPulse AI - Autonomous Revenue Recovery Engine",
    version="1.0.0",
    description="Closed-loop AI Revenue Recovery Agent platform with risk detection, root cause diagnosis, safety policy guardrails, and automated intervention workflows.",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(events.router)
app.include_router(cases.router)
app.include_router(analytics.router)
app.include_router(simulator.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "RevPulse AI - Autonomous Revenue Recovery Engine",
        "documentation": "/docs"
    }
