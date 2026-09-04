from fastapi.testclient import TestClient
from app.main import app

def test_root_endpoint():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "online"

def test_analytics_summary():
    with TestClient(app) as client:
        response = client.get("/api/analytics/summary")
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue_at_risk" in data
        assert "recovery_rate_percent" in data
        assert data["total_cases_count"] > 0

def test_get_cases():
    with TestClient(app) as client:
        response = client.get("/api/cases")
        assert response.status_code == 200
        cases = response.json()
        assert len(cases) > 0

def test_simulator_trigger():
    with TestClient(app) as client:
        response = client.post("/api/simulator/trigger-random")
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "amount" in data
