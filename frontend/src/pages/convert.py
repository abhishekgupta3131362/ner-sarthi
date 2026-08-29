import re
import os

filepath = r'c:\Users\gupta\SIH PROJECT PRO\frontend\src\pages\Deliveries.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Outer wrapper
content = content.replace('p-6 min-h-screen bg-slate-950 text-white space-y-5', 'p-6 min-h-full bg-slate-50 text-slate-900 space-y-5')

# 2. Badges and pills
content = content.replace('bg-slate-800 text-slate-300', 'bg-slate-100 text-slate-600')
content = content.replace('bg-slate-800 text-slate-400', 'bg-slate-100 text-slate-500')

# 3. Hover states
content = content.replace('hover:bg-slate-800', 'hover:bg-slate-100')
content = content.replace('hover:bg-slate-700', 'hover:bg-slate-50')
content = content.replace('hover:border-slate-700', 'hover:border-slate-300')
content = content.replace('hover:border-slate-600', 'hover:border-slate-200')
content = content.replace('hover:text-white', 'hover:text-slate-900')

# 4. Inputs and form elements specific
content = content.replace('bg-slate-800/50', 'bg-slate-50')
content = content.replace('placeholder:text-slate-500', 'placeholder:text-slate-400')
content = content.replace('focus:border-slate-600', 'focus:border-emerald-500')
content = content.replace('focus:ring-slate-500', 'focus:ring-emerald-100')

# 5. Cards and containers (we need to add shadow-sm to exact matches of "bg-slate-900 border border-slate-800" if no shadow)
def replace_cards(match):
    prefix = match.group(1)
    suffix = match.group(2)
    if 'shadow-' not in prefix and 'shadow-' not in suffix:
        return prefix + 'bg-white border border-slate-200 shadow-sm' + suffix
    return prefix + 'bg-white border border-slate-200' + suffix

content = re.sub(r'(className="[^"]*)bg-slate-900 border border-slate-800([^"]*")', replace_cards, content)
content = re.sub(r'(className="[^"]*)bg-slate-900/50 border border-slate-800([^"]*")', replace_cards, content)

# 6. Dividers, Shadows, Rings
content = content.replace('divide-slate-800', 'divide-slate-200')
content = content.replace('border-b border-slate-800', 'border-b border-slate-200')
content = content.replace('ring-slate-800', 'ring-slate-200')

# 7. Colored accents and backgrounds
colors = ['emerald', 'red', 'amber', 'blue', 'orange', 'cyan', 'yellow']
for color in colors:
    # background /10 to -50
    content = content.replace(f'bg-{color}-500/10', f'bg-{color}-50')
    # background /20 to -100
    content = content.replace(f'bg-{color}-500/20', f'bg-{color}-100')
    # background /5 to -50
    content = content.replace(f'bg-{color}-500/5', f'bg-{color}-50')
    # border /20 to -200
    content = content.replace(f'border-{color}-500/20', f'border-{color}-200')
    # border /30 to -300
    content = content.replace(f'border-{color}-500/30', f'border-{color}-300')
    # text-400 to text-600 (active states / general)
    content = content.replace(f'text-{color}-400', f'text-{color}-600')

# 8. Remaining generic text and backgrounds
# Text colors:
content = content.replace('text-white', 'text-slate-900')
content = content.replace('text-slate-300', 'text-slate-600')
content = content.replace('text-slate-400', 'text-slate-500')
content = content.replace('text-slate-500', 'text-slate-400')

# Backgrounds
content = content.replace('bg-slate-950', 'bg-slate-50')
content = content.replace('bg-slate-900', 'bg-white')
content = content.replace('bg-slate-800', 'bg-slate-200') # covers progress bars and remaining

# Borders
content = content.replace('border-slate-800', 'border-slate-200')
content = content.replace('border-slate-700', 'border-slate-300')

# Write back
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Conversion complete.")
