import re
import sys

file_path = r"c:\Users\gupta\SIH PROJECT PRO\frontend\src\pages\LiveMap.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First replace the full container wrapper
content = content.replace('min-h-screen bg-slate-950 text-white', 'min-h-full bg-slate-50 text-slate-900')
content = content.replace('bg-slate-950 text-white', 'bg-slate-50 text-slate-900')

# Outer container replacements
content = content.replace('bg-slate-950', 'bg-slate-50')

# Cards and containers
content = content.replace('bg-slate-900/50 border border-slate-800', 'bg-white/80 border border-slate-200 shadow-sm')
content = content.replace('bg-slate-900 border border-slate-800', 'bg-white border border-slate-200 shadow-sm')
content = content.replace('bg-slate-900', 'bg-white')
content = content.replace('border-slate-800', 'border-slate-200')
content = content.replace('border-slate-700', 'border-slate-300')

# Colored accent borders (keep their color but adjust opacity)
content = content.replace('border-emerald-500/20', 'border-emerald-200')
content = content.replace('border-red-500/20', 'border-red-200')
content = content.replace('border-amber-500/20', 'border-amber-200')
content = content.replace('border-blue-500/20', 'border-blue-200')
content = content.replace('border-cyan-500/20', 'border-cyan-200')

# Colored backgrounds (adjust for light theme)
content = content.replace('bg-emerald-500/10 text-emerald-400', 'bg-emerald-50 text-emerald-700')
content = content.replace('bg-cyan-500/10 text-cyan-400', 'bg-cyan-50 text-cyan-700')
content = content.replace('bg-red-500/10 text-red-400', 'bg-red-50 text-red-700')
content = content.replace('bg-amber-500/10 text-amber-400', 'bg-amber-50 text-amber-700')
content = content.replace('bg-blue-500/10 text-blue-400', 'bg-blue-50 text-blue-700')

content = content.replace('bg-emerald-500/10', 'bg-emerald-50')
content = content.replace('bg-cyan-500/10', 'bg-cyan-50')
content = content.replace('bg-red-500/10', 'bg-red-50')
content = content.replace('bg-amber-500/10', 'bg-amber-50')
content = content.replace('bg-blue-500/10', 'bg-blue-50')

content = content.replace('bg-emerald-500/20', 'bg-emerald-100')
content = content.replace('bg-cyan-500/20', 'bg-cyan-100')

# Active/selected states text colors
content = content.replace('text-emerald-400', 'text-emerald-600')
content = content.replace('text-cyan-400', 'text-cyan-600')
content = content.replace('text-red-400', 'text-red-600')
content = content.replace('text-amber-400', 'text-amber-600')
content = content.replace('text-blue-400', 'text-blue-600')

# Hover states
content = content.replace('hover:bg-slate-800', 'hover:bg-slate-100')
content = content.replace('hover:bg-slate-700', 'hover:bg-slate-50')
content = content.replace('hover:border-slate-700', 'hover:border-slate-300')
content = content.replace('hover:border-slate-600', 'hover:border-slate-200')
content = content.replace('hover:text-white', 'hover:text-slate-900')

# Inputs and form elements
content = content.replace('bg-slate-800/50', 'bg-slate-50')
# Before doing bg-slate-800 -> bg-slate-50, handle badges:
content = content.replace('bg-slate-800 text-slate-300', 'bg-slate-100 text-slate-600')
content = content.replace('bg-slate-800 text-slate-400', 'bg-slate-100 text-slate-500')
# Now the rest of bg-slate-800:
# Wait, for progress bars, bg-slate-800 should be bg-slate-200.
# Without a good regex, let's just make it bg-slate-100 which is often fine, or I can use a regex for w-full bg-slate-800.
# Progress bars usually look like `<div className="w-full bg-slate-800 rounded-full h-2">`
content = re.sub(r'bg-slate-800(?!.*?(text-slate-300|text-slate-400))', 'bg-slate-100', content) # General fallback to slate-100

content = content.replace('placeholder:text-slate-500', 'placeholder:text-slate-400')
content = content.replace('focus:border-slate-600', 'focus:border-emerald-500')
content = content.replace('focus:ring-slate-500', 'focus:ring-emerald-100')

# Dividers
content = content.replace('divide-slate-800', 'divide-slate-200')
content = content.replace('border-b border-slate-800', 'border-b border-slate-200')

# Shadows and rings
content = content.replace('ring-slate-800', 'ring-slate-200')

# Text Colors (Use placeholders to swap)
content = content.replace('text-slate-400', 'TEMP_TEXT_SLATE_400')
content = content.replace('text-slate-300', 'text-slate-600')
content = content.replace('text-slate-500', 'text-slate-400')
content = content.replace('TEMP_TEXT_SLATE_400', 'text-slate-500')

# Replace text-white that are standalone.
# I'll replace all text-white, and if it breaks colored buttons, I'll fix them. In the snippet shown, there were no filled buttons, mostly outlined/tinted.
content = content.replace('text-white', 'text-slate-900')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
