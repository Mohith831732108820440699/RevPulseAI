def calculate_risk_assessment(amount: float, customer_ltv: float, churn_score: float, event_type: str, error_code: str):
    """
    Calculates risk score (0-100), risk level (CRITICAL, HIGH, MEDIUM, LOW), and ARR impact.
    """
    base_score = 30.0

    # Amount impact
    if amount > 1000:
        base_score += 30
    elif amount > 300:
        base_score += 20
    elif amount > 100:
        base_score += 10

    # Churn risk impact
    base_score += (churn_score * 30.0)

    # Event type severity
    if event_type == "PAYMENT_FAILED":
        base_score += 15
    elif event_type == "INVOICE_OVERDUE":
        base_score += 20
    elif event_type == "CART_ABANDONED":
        base_score += 10
    elif event_type == "CARD_EXPIRING":
        base_score += 5

    # Error code specific weight
    if error_code in ["stolen_card", "do_not_honor", "fraudulent"]:
        base_score += 25
    elif error_code == "insufficient_funds":
        base_score += 10
    elif error_code == "expired_card":
        base_score += 5

    # Cap score between 0 and 100
    risk_score = round(min(max(base_score, 10.0), 99.0), 1)

    # Determine risk level
    if risk_score >= 80 or amount >= 1500:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # ARR Impact calculation (annualized value)
    arr_impact = round(amount * 12.0 if event_type != "CART_ABANDONED" else amount * 4.0, 2)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "arr_impact": arr_impact
    }
