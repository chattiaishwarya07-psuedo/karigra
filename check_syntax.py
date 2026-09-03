import os

for root, dirs, files in os.walk('frontend/js'):
    for f in files:
        if f.endswith('.js'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            ob = content.count('{')
            cb = content.count('}')
            op = content.count('(')
            cp = content.count(')')
            obr = content.count('[')
            cbr = content.count(']')
            print(f"{f:25} | Braces: {ob}/{cb} | Parens: {op}/{cp} | Brackets: {obr}/{cbr}")
            if ob != cb or op != cp or obr != cbr:
                print(f"  --> MISMATCH in {p}!")
