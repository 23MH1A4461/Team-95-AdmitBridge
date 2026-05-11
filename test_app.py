import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test that the index endpoint returns successfully."""
    response = client.get('/')
    assert response.status_code == 200

def test_options_api(client):
    """Test that the options API returns valid JSON."""
    response = client.get('/api/options')
    assert response.status_code == 200
    assert response.is_json
