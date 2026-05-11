@echo off
echo Starting AdmitBridge Platform...

echo Starting Flask API (College Finder)...
start cmd /k "cd project && python app.py"

echo Starting Student Frontend...
start cmd /k "cd student\frontend && npm run dev"

echo Starting Consultancy Frontend...
start cmd /k "cd consultancy\frontend && npm run dev -- --port 5174"

echo Starting Admin Frontend...
start cmd /k "cd admin\frontend && npm run dev -- --port 5175"


echo Starting Chatbot Backend...
start cmd /k "cd admitbridge-chatbot && node server.js"

echo Platform started! 
echo Student Dashboard: http://localhost:5173
echo Consultancy Dashboard: http://localhost:5174
echo Admin Dashboard: http://localhost:5175
echo College Finder ML Model: http://localhost:5000
