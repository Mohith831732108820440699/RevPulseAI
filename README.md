# RevPulse AI - Autonomous Revenue Recovery Engine 🚀

RevPulse AI is an enterprise-grade, closed-loop **AI Revenue Recovery Agent Platform** designed to detect payment failures, diagnose root causes, enforce bounded safety policy guardrails, and execute autonomous recovery workflows.

---

## 🌟 Key Features

- **Revenue Event Ingestion**: Real-time webhook & REST listener for Stripe, Shopify, Chargebee, and B2B invoice past-due events.
- **AI Diagnosis & Root Cause Engine**: Automatic classification of payment failures (Card Expired, Insufficient Balance, Technical Gateway Timeout, High Friction).
- **Recovery Scoring & Prioritization**: Evaluates ARR impact, customer LTV, and churn risk index.
- **Bounded Safety Policy Guardrails**: Enforces 3-retry caps, 24h cooldowns, $500 auto-execution thresholds, and human operator approval gates.
- **Intervention Workflows**: Dispatches smart gateway retries, self-service payment update links, and dynamic incentive codes.
- **Google Cloud OAuth 2.0 SSO**: Verified Google Workspace Single Sign-On with Client ID integration.
- **Merchant Profile & Credentials Dashboard**: Full 8-section credentials center managing API keys, KYC status (85%), bank settlements, and team RBAC.
- **Live Event Simulator**: Interactive test sandbox allowing instant injection of payment failure events.
- **2D/3D System Architecture Topology**: Visual component connectivity and data pipeline map.

---

## 🏛️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Glassmorphic Vanilla CSS (Dark & Light Theme).
- **Backend**: Python 3.12, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, HTTPX.
- **Database**: SQLite (`revpulse.db`).
- **Authentication**: Google Identity Services SDK (OAuth 2.0).

---

## ⚡ Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
Web Application: [http://localhost:3000/](http://localhost:3000/)

### 3. Run Automated Tests
```bash
cd backend
pytest tests/test_api.py
```

---

## 📜 License
MIT License
