import os
import re

app_path = os.path.join('d:\\admitbridge', 'project', 'app.py')

with open(app_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update SECRET_KEY to use os.environ
content = content.replace(
    'SECRET_KEY = "admitbridge_super_secret_jwt_key_for_production"',
    'SECRET_KEY = os.environ.get("SECRET_KEY", "admitbridge_super_secret_jwt_key_for_production")'
)

# 2. Add functools import if missing
if 'from functools import wraps' not in content:
    content = content.replace('import jwt', 'import jwt\nfrom functools import wraps\nfrom dotenv import load_dotenv\nload_dotenv()')

# 3. Add token_required decorator just before the first @app.route('/')
decorator = """
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user']
            request.current_user = current_user
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/')
"""

if 'def token_required' not in content:
    content = content.replace("@app.route('/')", decorator)

# 4. Apply @token_required to all endpoints except auth and root
lines = content.split('\n')
new_lines = []
skip_next = False
for i, line in enumerate(lines):
    new_lines.append(line)
    if line.startswith('@app.route'):
        if '/api/auth/login' in line or '/api/auth/register' in line or line == "@app.route('/')":
            continue
        
        # Check if next line is already @token_required
        if i + 1 < len(lines) and lines[i+1].startswith('@token_required'):
            continue
            
        new_lines.append('@token_required')

content = '\n'.join(new_lines)

# 5. Add /api/auth/register endpoint if missing
register_endpoint = """
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')
    name = data.get('name', 'User')

    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    # In a real app we'd save this to DB. Here we just mock success and issue token.
    token = jwt.encode({
        'user': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")

    user_data = {
        "id": "usr_" + email.split('@')[0],
        "name": name,
        "email": email,
        "role": role
    }

    return jsonify({"token": token, "user": user_data}), 201

"""

if '/api/auth/register' not in content:
    # Insert it right after the login endpoint
    login_end = content.find("return jsonify({\"token\": token, \"user\": user_data}), 200")
    if login_end != -1:
        insert_pos = content.find("\n", login_end) + 1
        content = content[:insert_pos] + register_endpoint + content[insert_pos:]

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Backend updated successfully.")
