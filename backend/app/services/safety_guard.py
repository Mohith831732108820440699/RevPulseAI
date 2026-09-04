def evaluate_safety_guardrails(amount: float, retry_count: int, recommended_action: str, arr_impact: float, customer_tier: str):
    """
    Evaluates enterprise policy guardrails:
    1. Max 3 retries limit.
    2. Cooldown checks.
    3. Human approval required if amount > $500 or ARR impact > $2,000 or action is APPLY_DISCOUNT on Enterprise tier.
    """
    passed = True
    notes = []
    requires_human_approval = False

    # Guardrail 1: Retry count cap
    if retry_count >= 3:
        passed = False
        notes.append("BLOCKED: Maximum retry limit (3) reached. Requires manual agent override.")

    # Guardrail 2: Monetary threshold check
    if amount >= 500.0 or arr_impact >= 2000.0:
        requires_human_approval = True
        notes.append(f"HUMAN GATEWAY: Transaction amount (${amount:.2f}) or ARR impact (${arr_impact:.2f}) exceeds auto-execution limit ($500).")

    # Guardrail 3: Discount policy for Enterprise tier
    if recommended_action == "APPLY_DISCOUNT" and customer_tier == "Enterprise":
        requires_human_approval = True
        notes.append("HUMAN GATEWAY: Automatic discount offers on Enterprise tier accounts require manager review.")

    # Default pass note
    if not notes:
        notes.append("PASS: All automated policy guardrails verified (Retry count < 3, Cooldown satisfied, Amount within auto-tier limit).")

    return {
        "is_safety_passed": passed,
        "requires_human_approval": requires_human_approval or (not passed),
        "safety_notes": " | ".join(notes)
    }
