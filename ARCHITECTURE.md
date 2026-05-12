# Architecture Overview

This document outlines the architectural topology of the AdmitBridge platform. The system operates as a monorepo, decoupled into separate frontends and backend services.

## Services & Port Mapping

The platform runs multiple services concurrently:

- **Student Portal (Vite SPA)**: Port `5173`
- **Consultancy Portal (Vite SPA)**: Port `5174`
- **Admin Portal (Vite SPA)**: Port `5175`
- **Machine Learning API (Flask Backend)**: Port `5000`
- **AI Chatbot Service (Node.js/Express)**: Port `3000`

## Build Orchestration (Turborepo)

The repository leverages **Turborepo** to orchestrate tasks across the monorepo. Turborepo handles:
- **Parallel Execution**: Starting the 3 Vite React applications concurrently alongside backend services.
- **Caching**: Drastically reducing build times by caching artifacts of the Vite applications across environments.
- **Workspace Management**: Eliminating redundant dependency installations by hoisting shared npm packages.

## Machine Learning Pipeline

Our predictive admissions engine is powered by a scikit-learn Random Forest model integrated within the Flask backend. 

- **Serialization**: The trained model pipeline is serialized and exported as `model.pkl` via the **joblib** library.
- **Inference**: During runtime, the Flask app (`app.py`) loads `model.pkl` into memory. When a recommendation is requested, it vectorizes the input parameters, processes them through the loaded model, and returns probability scores instantly without recalculating weights.
