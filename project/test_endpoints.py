import pytest
from app import app, data_store
import json

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
