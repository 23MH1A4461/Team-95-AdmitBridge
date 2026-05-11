# AdmitBridge 🎓

AdmitBridge is a multi-portal University Admission Platform connecting **Students**, **Educational Consultancies**, and **Administrators**.

## Problem Statement

The international master's degree admission process is opaque and fragmented. Students struggle to assess their admission probabilities across universities using data-driven metrics. Simultaneously, consultancies rely on disjointed tools to track multiple student applications, leading to workflow inefficiencies, poor status tracking, and a lack of transparency for the applicant. 

## Proposed Solution

AdmitBridge provides a decoupled, service-oriented ecosystem. It features distinct React portals for Students, Consultancies, and Admins. Students use a Flask-based Machine Learning predictor to find universities. Application transparency is achieved via dynamic UI state synchronization: students track their progress on a visual stepper, while consultancies process reviews and verify documents via dedicated verification UI elements in the `AssignedStudents.jsx` dashboard. Additionally, an integrated Node.js AI Chatbot provides real-time navigational and informational assistance.

## Requirements

1. **Isolated React Portals:** Three distinct frontends (Student, Consultancy, Admin) built with React and Vite.
2. **Machine Learning Predictor:** A Python/Flask backend utilizing `scikit-learn` to calculate university admission probabilities.
3. **Consultancy Dashboard:** A centralized interface (`AssignedStudents.jsx`) for consultancies to review student applications and verify documents.
4. **Student Tracking:** A dynamic status tracking interface for students to monitor their application progress.
5. **AI Chatbot:** A Node.js backend integrating Google's Gemini API for real-time user assistance.

## System Architecture

The architecture relies on decoupled micro-frontends and specialized backends communicating over local ports. **Crucially, this build utilizes local React state and mock data rather than a persistent database.**

### 1. Frontends (React + Vite + lucide-react)
- **Student Portal** (`localhost:5173`): Interface for university prediction, chatbot interaction, and application status tracking.
- **Consultancy Portal** (`localhost:5174`): Dashboard for reviewing profiles and updating application statuses.
- **Admin Portal** (`localhost:5175`): High-level overview dashboard for monitoring students and consultancies.

### 2. Machine Learning Microservice (Flask + Python)
Located in `project/app.py`, running on `localhost:5000`.
- Hosts a serialized `scikit-learn` `.pkl` model loaded via `joblib`.
- Exposes REST endpoints to calculate admission probabilities based on academic profiles.

### 3. AI Chatbot Service (Node.js + Express)
Located in `admitbridge-chatbot/server.js`, running on `localhost:3000`.
- Powered by the `@google/genai` SDK.
- Provides context-aware assistance.

## In Scope
- AI-based admission probability prediction (College Finder).
- Multi-portal routing using `react-router-dom`.
- Document verification UI and status tracking logic.
- Real-time conversational AI integration.

## Out of Scope
- **Persistent Database Storage:** MongoDB, PostgreSQL, Firebase, etc., are explicitly excluded from this build.
- **Backend Authentication:** JWT/OAuth2 workflows and secure session management.
- **Dedicated Consultancy Recommendation UI:** The ML model handles university prediction, but consultancy assignment operates primarily via basic routing rather than a complex matching algorithm.
- **Payment Processing:** Live financial API integrations.

## Future Enhancements
- Integration of a persistent database (MongoDB) for robust data persistence.
- Implementation of secure JWT-based authentication.
- Automated email notifications for status updates.

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Install dependencies in respective folders (`npm install`, `pip install -r project/requirements.txt`)

### Startup
Run the unified Windows script:
```cmd
start.bat
```
This script will concurrently launch:
- Flask ML Backend (`localhost:5000`)
- Chatbot Backend (`localhost:3000`)
- Student Portal (`localhost:5173`)
- Consultancy Portal (`localhost:5174`)
- Admin Portal (`localhost:5175`)
