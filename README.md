<div align="center">
  <h1>🎓 AdmitBridge</h1>
  <p><b>A Unified, AI-Powered University Admission & Consultancy Management Platform</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </p>
</div>

---

## 📖 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Proposed Solution](#-proposed-solution)
3. [System Architecture](#-system-architecture)
4. [Project Requirements](#-project-requirements)
5. [Scope Definitions](#-scope-definitions)
6. [Future Enhancements](#-future-enhancements)
7. [Running the Project Locally](#-running-the-project-locally)

---

## 🎯 Problem Statement

The international master's degree admission process is opaque and fragmented, making it difficult for students to assess their admission probabilities using data-driven metrics. Simultaneously, educational consultancies rely on disjointed, manual tracking systems for student applications, leading to workflow inefficiencies and poor status transparency for applicants. There is a critical need for a centralized, multi-role ecosystem that predicts admissions, bridges communication, and synchronizes application statuses in real-time.

---

## 💡 Proposed Solution

AdmitBridge is a decoupled, service-oriented ecosystem designed to unify the university application journey. The platform features three distinct React SPAs (**Student**, **Consultancy**, and **Admin** portals) to ensure role-based separation of concerns. 

Students utilize a Flask-based Machine Learning service to generate data-driven university predictions based on their academic profile. Application transparency is achieved via dynamic UI state synchronization: students track their progress on a visual stepper, while consultancies process applications via dedicated UI elements. Furthermore, an integrated Node.js AI Chatbot utilizes the Google Gemini API to provide intelligent navigational assistance.

---

## 🏗️ System Architecture

The platform leverages a modern micro-frontend and polyglot backend architecture. It operates efficiently via local file-system persistence (JSON/CSV) rather than a heavy, persistent database, prioritizing lightweight execution and rapid local prototyping.

- **Frontends (React + Vite):** Three distinct portals running concurrently (`student` on 5173, `consultancy` on 5174, `admin` on 5175). Built with `react-router-dom` for routing and `lucide-react` for iconography.
- **Machine Learning Backend (Flask/Python):** Located in `project/app.py` (Port 5000). Hosts a serialized `scikit-learn` Random Forest model loaded via `joblib`. Exposes REST APIs (`/api/recommend`, `/api/applications`) and manages local state via JSON.
- **AI Chatbot Backend (Node.js/Express):** Located in `admitbridge-chatbot/server.js` (Port 3000). Powered by the `@google/genai` SDK to serve a context-aware chat endpoint.
- **Authentication Flow:** Implemented natively within `app.py` via `PyJWT`. The `/api/auth/login` endpoint validates credentials and returns a secure JWT, consumed by React frontends for role-based portal routing.

---

## ✅ Project Requirements

1. **Multi-Portal Interface:** Three isolated React/Vite frontends configured with robust `ErrorBoundary` implementations and `prop-types` component validation.
2. **Machine Learning Integration:** Python backend utilizing `pandas` and `scikit-learn` to calculate admission probabilities dynamically.
3. **Application Tracking System:** A centralized React dashboard that fetches live synchronization data from the Flask REST API.
4. **Real-Time AI Assistance:** A Node.js backend executing Google Gemini API calls for conversational user queries.
5. **Automated Testing Environment:** Implementations of `Vitest` and `@testing-library/react` for frontend unit tests, and `pytest` for backend API endpoint validation.

---

## 🔍 Scope Definitions

### 🟢 In Scope
* AI-based admission probability calculations (College Finder).
* Role-based application routing and token generation via `PyJWT`.
* Centralized application status tracking mapping between Student and Consultancy portals.
* Mock payment gateway initialization (`/api/payments/create-intent` in Flask).
* Environment variable (`.env`) configuration to secure API routing and eliminate hardcoded origins.
* Automated UI (`Login.test.jsx`) and API testing (`test_app.py`).

### 🔴 Out of Scope
* **External Persistent Databases:** MongoDB, PostgreSQL, and Firebase are intentionally excluded. The architecture is explicitly designed to handle state via lightweight local filesystem JSON operations to reduce deployment overhead.
* **Live Financial Processing:** Real Stripe/PayPal integrations are excluded; the system strictly uses a mock `create-intent` JSON response to simulate transactional states.
* **Complex Consultancy Matching Algorithms:** Consultancy assignment operates via location/budget filtering rather than deep ML matching logic.

---

## 🚀 Future Enhancements

* **Database Migration:** Refactoring the current JSON-file architecture to integrate a scalable NoSQL database like MongoDB for robust production data persistence.
* **OAuth2 Integration:** Upgrading the current basic JWT flow to support Google/GitHub Single Sign-On (SSO) architectures.
* **Live Webhooks:** Transitioning from the current API polling system (`setInterval` in React) to a WebSocket or SSE architecture for instantaneous cross-portal notification synchronization.

---

## ⚙️ Running the Project Locally

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.9+)

### Installation
1. Install Python backend dependencies:
   ```bash
   cd project
   pip install -r requirements.txt
   ```
2. Install frontend dependencies (run inside `/student/frontend`, `/consultancy/frontend`, `/admin/frontend`, and `/admitbridge-chatbot`):
   ```bash
   npm install
   ```

### Execution (Windows)
We provide a unified startup script to boot the entire ecosystem concurrently. Ensure your `.env` variables are configured, then double-click or run:
```cmd
start.bat
```
This automatically launches all three React portals, the Python ML backend, and the Node.js AI chatbot.
