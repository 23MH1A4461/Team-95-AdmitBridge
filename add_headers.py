import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all fetch calls
    # We want to match: fetch(url, { ... }) or fetch(url)
    
    # Let's use a simple approach: find `fetch(` and replace it with a wrapper or inject headers.
    # Actually, injecting headers into existing fetch calls might be tricky because some have an options object and some don't.
    # It's better to replace `fetch(` with a custom `authFetch(` and add a custom function at the top.
    
    if 'authFetch(' in content or filepath.endswith('Register.jsx') or filepath.endswith('Login.jsx'):
        return # Skip

    if 'fetch(' not in content:
        return

    # Create the authFetch function
    auth_func = """
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

"""
    
    # Insert it after imports
    imports_end = 0
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('import '):
            imports_end = i + 1
            
    content = '\n'.join(lines[:imports_end]) + '\n' + auth_func + '\n'.join(lines[imports_end:])
    
    # Replace fetch( with authFetch(
    # Be careful not to replace things like `fetchResources` or `const fetch = ...`
    content = re.sub(r'\bfetch\(', 'authFetch(', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

dirs = ['student/frontend/src', 'consultancy/frontend/src', 'admin/frontend/src']
for d in dirs:
    base = os.path.join('d:\\admitbridge', d)
    for root, _, files in os.walk(base):
        for file in files:
            if file.endswith('.jsx'):
                process_file(os.path.join(root, file))

print("All files processed.")
