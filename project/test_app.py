import pytest
import os
import json

# Set JWT secret before importing app to avoid RuntimeError
os.environ['JWT_SECRET_KEY'] = 'test-secret'

from app import app, data_store

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def auth_token(client):
    response = client.post('/api/auth/login', json={
        "email": "test@example.com",
        "password": "password"
    })
    return response.json['token']

def test_health_check(client):
    """Test that the frontend is served correctly"""
    response = client.get('/')
    assert response.status_code == 200

def test_login_missing_credentials(client):
    """Test login endpoint with missing credentials"""
    response = client.post('/api/auth/login', json={})
    assert response.status_code == 400
    assert b"Missing credentials" in response.data

def test_login_success(client):
    """Test successful login returns a JWT token"""
    response = client.post('/api/auth/login', json={
        "email": "test@example.com",
        "password": "password"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"

def test_recommend_endpoint(client, auth_token):
    response = client.post('/api/recommend', 
                           json={
                               "cgpa": 3.8,
                               "budget": 30000,
                               "exam_type": "gre",
                               "exam_score": 320,
                               "back_logs": 0,
                               "country": "",
                               "branch": "",
                               "intake": ""
                           },
                           headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 200
    data = response.json
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

def test_consultancies_endpoint(client, auth_token):
    response = client.post('/api/consultancies',
                           json={
                               "budget": 15000,
                               "state": "",
                               "area": "",
                               "country": ""
                           },
                           headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 200
    data = response.json
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

def test_messages_endpoints(client, auth_token):
    msg_data = {
        "sender_id": "usr_test",
        "sender_name": "Test User",
        "receiver_id": "usr_admin",
        "receiver_name": "Admin",
        "text": "Hello world"
    }
    
    post_res = client.post('/api/messages', 
                           json=msg_data,
                           headers={'Authorization': f'Bearer {auth_token}'})
    
    assert post_res.status_code == 201
    assert post_res.json["success"] is True
    
    get_res = client.get('/api/messages', 
                         headers={'Authorization': f'Bearer {auth_token}'})
    assert get_res.status_code == 200
    messages = get_res.json
    assert isinstance(messages, list)
    assert any(m["text"] == "Hello world" for m in messages)

def test_meetings_endpoints(client, auth_token):
    mtg_data = {
        "month": "Nov",
        "day": "12",
        "title": "Test Meeting",
        "time": "02:00 PM EST",
        "studentName": "John Doe"
    }
    
    post_res = client.post('/api/meetings',
                           json=mtg_data,
                           headers={'Authorization': f'Bearer {auth_token}'})
                           
    assert post_res.status_code == 201
    assert post_res.json["success"] is True
    
    get_res = client.get('/api/meetings',
                         headers={'Authorization': f'Bearer {auth_token}'})
                         
    assert get_res.status_code == 200
    meetings = get_res.json
    assert isinstance(meetings, list)
    assert any(m["title"] == "Test Meeting" for m in meetings)
