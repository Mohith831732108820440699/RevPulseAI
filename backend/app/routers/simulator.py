import random
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import SimulatorEventRequest, RevenueEventOut, RevenueEventCreate
from .events import receive_webhook_event

router = APIRouter(prefix="/api/simulator", tags=["Simulator"])

PRESET_FAILURES = [
    {
        "customer_name": "Stripe Customer: Tesla Inc.",
        "customer_email": "finance@tesla.com",
        "customer_tier": "Enterprise",
        "event_type": "PAYMENT_FAILED",
        "amount": 2400.0,
        "error_code": "do_not_honor",
        "error_message": "The customer's bank declined the transaction with error 'do_not_honor'."
    },
    {
        "customer_name": "Shopify Cart: Sarah Jenkins",
        "customer_email": "s.jenkins@gmail.com",
        "customer_tier": "Standard",
        "event_type": "CART_ABANDONED",
        "amount": 149.0,
        "error_code": "checkout_abandoned",
        "error_message": "Customer abandoned checkout at payment details input step."
    },
    {
        "customer_name": "Chargebee Sub: CloudScale Systems",
        "customer_email": "billing@cloudscale.io",
        "customer_tier": "Pro",
        "event_type": "CARD_EXPIRING",
        "amount": 899.0,
        "error_code": "card_expired",
        "error_message": "Visa ending in 4242 expires at the end of the current billing cycle."
    },
    {
        "customer_name": "SaaS B2B Invoice: Apex Innovations",
        "customer_email": "ar@apexinnovations.com",
        "customer_tier": "Enterprise",
        "event_type": "INVOICE_OVERDUE",
        "amount": 4500.0,
        "error_code": "past_due_30",
        "error_message": "Invoice #INV-2026-881 is 30 days overdue."
    },
    {
        "customer_name": "Stripe Sub: Growthly Labs",
        "customer_email": "ops@growthly.co",
        "customer_tier": "Pro",
        "event_type": "PAYMENT_FAILED",
        "amount": 350.0,
        "error_code": "insufficient_funds",
        "error_message": "Insufficient funds in customer account."
    }
]

@router.post("/trigger-random", response_model=RevenueEventOut)
def trigger_random_event(db: Session = Depends(get_db)):
    """
    Simulates a live incoming payment failure event for real-time demonstration.
    """
    preset = random.choice(PRESET_FAILURES)
    customer_id = f"cust_{uuid.uuid4().hex[:6]}"

    payload = RevenueEventCreate(
        event_type=preset["event_type"],
        event_source=random.choice(["Stripe", "Shopify", "Chargebee", "QuickBooks"]),
        customer_id=customer_id,
        amount=preset["amount"],
        currency="USD",
        error_code=preset["error_code"],
        error_message=preset["error_message"],
        raw_data=f"{{\"simulated\": true, \"customer_name\": \"{preset['customer_name']}\", \"tier\": \"{preset['customer_tier']}\"}}"
    )

    event = receive_webhook_event(payload=payload, db=db)
    return event


@router.post("/trigger-custom", response_model=RevenueEventOut)
def trigger_custom_event(req: SimulatorEventRequest, db: Session = Depends(get_db)):
    """
    Simulates a custom user-defined failure event.
    """
    customer_id = f"cust_{uuid.uuid4().hex[:6]}"

    payload = RevenueEventCreate(
        event_type=req.event_type,
        event_source="UserSimulator",
        customer_id=customer_id,
        amount=req.amount,
        currency="USD",
        error_code=req.error_code,
        error_message=req.error_message,
        raw_data=f"{{\"simulated\": true, \"customer_name\": \"{req.customer_name}\", \"tier\": \"{req.customer_tier}\"}}"
    )

    event = receive_webhook_event(payload=payload, db=db)
    return event
