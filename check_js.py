import os
import re

js_dir = os.path.join('frontend', 'js')
all_js = []
for root, dirs, files in os.walk(js_dir):
    for f in files:
        if f.endswith('.js'):
            all_js.append(os.path.join(root, f))

print(f"Checking {len(all_js)} JS files...")
has_error = False

for fpath in all_js:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check imports
    imports = re.findall(r'from\s+[\'\"](.*?)[\'\"]', content)
    for imp in imports:
        imp_dir = os.path.dirname(fpath)
        resolved = os.path.normpath(os.path.join(imp_dir, imp))
        if not os.path.exists(resolved):
            print(f"❌ BROKEN IMPORT in {fpath}: {imp} (looked for {resolved})")
            has_error = True
        else:
            # Check if imported symbols exist
            pass

if not has_error:
    print("✅ All imports exist on disk.")
