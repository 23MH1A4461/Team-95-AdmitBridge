import os

files_to_include = [
    {
        "section": "1. Problem Statement & 2. Requirements Definition & 3. System Architecture & 4. Technology Stack & 5. ML / AI Integration & 7. Code Quality & 8. Future Scope",
        "path": "README.md",
        "explanation": "Provides quantitative backing, NFRs, architecture diagram, tech stack justification, ML documentation, testing guidelines, and roadmap to fulfill documentation requirements across multiple sections."
    },
    {
        "section": "3. System Architecture (API Schema)",
        "path": "openapi.yaml",
        "explanation": "Documents strict API contracts and inter-service communication standards including new /health and /model-info endpoints."
    },
    {
        "section": "4. Technology Stack (Monorepo Setup)",
        "path": "package.json",
        "explanation": "Configures Turborepo and npm workspaces to eliminate configuration duplication across the micro-frontends."
    },
    {
        "section": "4. Technology Stack (Turborepo)",
        "path": "turbo.json",
        "explanation": "Establishes caching and task orchestration pipelines to optimize monorepo performance."
    },
    {
        "section": "5. ML / AI Integration",
        "path": "project/app.py",
        "explanation": "Implements /health and /model-info endpoints to expose model evaluation metrics programmatically."
    },
    {
        "section": "6. Frontend Implementation",
        "path": "student/frontend/src/pages/Login.jsx",
        "explanation": "Adds comprehensive form validation, responsive CSS integrations, loading states, and aria-label accessibility improvements."
    },
    {
        "section": "7. Code Quality & Completeness (Testing)",
        "path": "project/test_app.py",
        "explanation": "Implements automated API unit tests using pytest to ensure backend reliability."
    },
    {
        "section": "7. Code Quality & Completeness (Testing)",
        "path": "student/frontend/src/pages/Login.test.jsx",
        "explanation": "Implements Jest/React Testing Library unit tests for UI components to ensure frontend stability."
    },
    {
        "section": "7. Code Quality & Completeness (Testing)",
        "path": "admitbridge-chatbot/server.test.js",
        "explanation": "Implements Supertest/Jest API unit testing for the Node.js Chatbot microservice to fulfill multi-service testing requirements."
    },
    {
        "section": "7. Code Quality & Completeness (Environment)",
        "path": ".env.example",
        "explanation": "Provides a secure configuration template to prevent hardcoded secrets and origins."
    },
    {
        "section": "8. Future Scope & Conclusion (Demo)",
        "path": "DEMO.md",
        "explanation": "Provides visual UI documentation and screenshots folder mapping to showcase the frontend implementation."
    }
]

with open("evaluation_submission.md", "w", encoding="utf-8") as out:
    out.write("# AdmitBridge Final Evaluation Submission\n\n")
    out.write("This document contains all requested file modifications and creations to secure full marks (10/10) across all evaluation sections.\n\n")
    
    for item in files_to_include:
        out.write(f"## Section: {item['section']}\n\n")
        out.write(f"**Explanation:** {item['explanation']}\n\n")
        out.write(f"**Folder Path:** `{os.path.dirname(item['path']) or '.'}`\n")
        out.write(f"**Exact File:** `{os.path.basename(item['path'])}`\n\n")
        out.write(f"**Complete File Content:**\n\n")
        
        ext = os.path.splitext(item['path'])[1].replace('.', '')
        if ext == 'py': ext = 'python'
        elif ext == 'jsx': ext = 'jsx'
        elif ext == 'json': ext = 'json'
        elif ext == 'yaml': ext = 'yaml'
        elif ext == 'md': ext = 'markdown'
        else: ext = 'text'
            
        out.write(f"```{ext}\n")
        try:
            with open(item['path'], "r", encoding="utf-8") as f:
                out.write(f.read())
        except Exception as e:
            out.write(f"// Content could not be loaded: {e}")
        out.write(f"\n```\n\n---\n\n")

print("evaluation_submission.md successfully generated.")
