import json
import os
import glob
from deep_translator import GoogleTranslator
import sys
sys.stdout.reconfigure(encoding='utf-8')

LOCALES_DIR = 'src/i18n/locales'
en_path = os.path.join(LOCALES_DIR, 'en.json')

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Map file names to Google Translate lang codes
lang_map = {
    'as.json': 'as',
    'bn.json': 'bn',
    'hi.json': 'hi',
    'ne.json': 'ne',
    'brx.json': 'bho', # Bodo might not be there, bho is bhojpuri. fallback to hindi?
    'mni.json': 'mni-Mtei'
}

def translate_dict(d_en, d_target, lang_code):
    translator = GoogleTranslator(source='en', target=lang_code)
    for k, v in d_en.items():
        if isinstance(v, dict):
            if k not in d_target or not isinstance(d_target[k], dict):
                d_target[k] = {}
            translate_dict(v, d_target[k], lang_code)
        else:
            if k not in d_target or not d_target[k]:
                try:
                    res = translator.translate(v)
                    d_target[k] = res if res else v
                    print(f"[{lang_code}] Translated: {k}")
                except Exception as e:
                    print(f"[{lang_code}] Failed: {k} - {e}")
                    d_target[k] = v # fallback to english

for filename in os.listdir(LOCALES_DIR):
    if filename == 'en.json': continue
    filepath = os.path.join(LOCALES_DIR, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        target_data = json.load(f)
        
    lang_code = lang_map.get(filename)
    if lang_code:
        print(f"Translating {filename} to {lang_code}...")
        translate_dict(en_data, target_data, lang_code)
    else:
        print(f"Skipping translation for {filename} (unsupported), using English fallbacks...")
        # Just copy english strings for unsupported languages
        def copy_dict(d_en, d_target):
            for k, v in d_en.items():
                if isinstance(v, dict):
                    if k not in d_target or not isinstance(d_target[k], dict):
                        d_target[k] = {}
                    copy_dict(v, d_target[k])
                else:
                    if k not in d_target or not d_target[k]:
                        d_target[k] = v
        copy_dict(en_data, target_data)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(target_data, f, ensure_ascii=False, indent=2)

print('All languages updated!')
