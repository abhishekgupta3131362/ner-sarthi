import json
import os
import re
from deep_translator import GoogleTranslator
import sys

# Change console output to utf-8
sys.stdout.reconfigure(encoding='utf-8')

# The target JSON files
EN_JSON = 'src/i18n/locales/en.json'
HI_JSON = 'src/i18n/locales/hi.json'

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

en_data = load_json(EN_JSON)
hi_data = load_json(HI_JSON)

# Define the sections and their keys -> english text
new_translations = {
    'hospitals': {
        'title': 'Hospital Command Center',
        'subtitle': 'Emergency capacity, ambulance readiness and medical-resource intelligence',
        'emergencyNetwork': 'Emergency Healthcare Network',
        'networkReadiness': 'Network Readiness',
        'totalFacilities': 'Total Facilities',
        'activeAmbulances': 'Active Ambulances',
        'criticalCare': 'Critical Care (ICU)'
    },
    'vehicles': {
        'title': 'Fleet Monitoring',
        'subtitle': 'Live tracking and status of all logistics and emergency vehicles',
        'activeFleet': 'Active Fleet',
        'inTransit': 'In Transit',
        'available': 'Available',
        'maintenance': 'Maintenance'
    },
    'alerts': {
        'title': 'System Alerts',
        'subtitle': 'Real-time notifications, warnings and automated risk alerts',
        'criticalAlerts': 'Critical Alerts',
        'warnings': 'Warnings',
        'info': 'Information'
    },
    'routes': {
        'title': 'Smart Routing Intelligence',
        'subtitle': 'AI-optimized logistics routes avoiding high-risk corridors',
        'activeRoutes': 'Active Routes',
        'blockedRoutes': 'Blocked Routes',
        'rerouted': 'Rerouted'
    }
}

translator = GoogleTranslator(source='en', target='hi')

for section, keys in new_translations.items():
    if section not in en_data:
        en_data[section] = {}
    if section not in hi_data:
        hi_data[section] = {}
        
    for key, eng_text in keys.items():
        en_data[section][key] = eng_text
        
        try:
            hi_text = translator.translate(eng_text)
            if hi_text:
                hi_data[section][key] = hi_text
            else:
                hi_data[section][key] = eng_text
        except Exception as e:
            hi_data[section][key] = eng_text

save_json(EN_JSON, en_data)
save_json(HI_JSON, hi_data)
print('JSON files updated properly!')
