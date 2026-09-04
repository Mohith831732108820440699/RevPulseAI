import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String, nullable=True)
    ltv_amount = Column(Float, default=0.0)
    tier = Column(String, default="Standard")  # Enterprise, Pro, Standard
    churn_risk_score = Column(Float, default=0.1)  # 0.0 to 1.0
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    events = relationship("RevenueEvent", back_populates="customer")
    cases = relationship("RecoveryCase", back_populates="customer")


class RevenueEvent(Base):
    __tablename__ = "revenue_events"

    id = Column(String, primary_key=True, index=True)
    event_type = Column(String, nullable=False)  # PAYMENT_FAILED, CART_ABANDONED, INVOICE_OVERDUE, CARD_EXPIRING
    event_source = Column(String, default="Stripe")  # Stripe, Shopify, Chargebee, Custom
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    error_code = Column(String, nullable=True)  # e.g., insufficient_funds, card_expired, do_not_honor, network_decline
    error_message = Column(Text, nullable=True)
    raw_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="events")
    recovery_case = relationship("RecoveryCase", back_populates="event", uselist=False)


class RecoveryCase(Base):
    __tablename__ = "recovery_cases"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("revenue_events.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    status = Column(String, default="OPEN")  # OPEN, DIAGNOSED, IN_PROGRESS, RECOVERED, ESCALATED, FAILED
    risk_level = Column(String, default="MEDIUM")  # CRITICAL, HIGH, MEDIUM, LOW
    risk_score = Column(Float, default=50.0)  # 0 to 100
    arr_impact = Column(Float, default=0.0)
    root_cause_category = Column(String, nullable=True)  # Technical Error, Insufficient Balance, Expired Card, Customer Hesitation
    root_cause_details = Column(Text, nullable=True)
    recommended_action = Column(String, nullable=True)
    suggested_communication = Column(Text, nullable=True)
    is_safety_passed = Column(Boolean, default=True)
    safety_notes = Column(Text, nullable=True)
    requires_human_approval = Column(Boolean, default=False)
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="cases")
    event = relationship("RevenueEvent", back_populates="recovery_case")
    actions = relationship("RecoveryAction", back_populates="case")
    audit_logs = relationship("AuditLog", back_populates="case")


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, ForeignKey("recovery_cases.id"), nullable=False)
    action_type = Column(String, nullable=False)  # RETRY_PAYMENT, SEND_SMART_LINK, APPLY_DISCOUNT, SEND_WHATSAPP, HUMAN_REVIEW
    status = Column(String, default="PENDING")  # PENDING, EXECUTED, FAILED, CANCELLED
    action_payload = Column(Text, nullable=True)
    result_summary = Column(Text, nullable=True)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("RecoveryCase", back_populates="actions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, ForeignKey("recovery_cases.id"), nullable=True)
    action_by = Column(String, default="SYSTEM_AGENT")  # SYSTEM_AGENT, HUMAN_OPERATOR
    action_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    policy_check_result = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("RecoveryCase", back_populates="audit_logs")
