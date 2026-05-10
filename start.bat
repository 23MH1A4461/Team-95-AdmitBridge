@echo off
echo Starting AdmitBridge Platform...

echo Starting Flask API (College Finder)...
start cmd /k "cd project && python app.py"

echo Starting Student Frontend...
start cmd /k "cd student\frontend && npm run dev"

echo Starting Consultancy Frontend...
start cmd /k "cd consultancy\frontend && npm run dev -- --port 5174"

echo Platform started! 
echo Student Dashboard: http://localhost:5173
echo Consultancy Dashboard: http://localhost:5174
echo College Finder ML Model: http://localhost:5000
