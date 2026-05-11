import pytest
import json
import os
from app import app, applications_path

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

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
