import os

replacements = {
    'src/pages/Vehicles.jsx': [
        ('Fleet Monitoring', '{t("vehicles.title")}'),
        ('Live tracking and status of all logistics and emergency vehicles', '{t("vehicles.subtitle")}'),
        ('ACTIVE FLEET', '{t("vehicles.activeFleet")}'),
        ('IN TRANSIT', '{t("vehicles.inTransit")}'),
        ('Location unavailable', 'Location un{t("vehicles.available")}'), # special case if matched
        ('AVAILABLE', '{t("vehicles.available")}'),
        ('MAINTENANCE', '{t("vehicles.maintenance")}'),
        ('function Vehicles() {\n', 'function Vehicles() {\n  const { t } = useTranslation();\n')
    ],
    'src/pages/Routes.jsx': [
        ('Smart Routing Intelligence', '{t("routes.title")}'),
        ('AI-optimized logistics routes avoiding high-risk corridors', '{t("routes.subtitle")}'),
        ('ACTIVE ROUTES', '{t("routes.activeRoutes")}'),
        ('BLOCKED ROUTES', '{t("routes.blockedRoutes")}'),
        ('REROUTED', '{t("routes.rerouted")}'),
        ('function Routes() {\n', 'function Routes() {\n  const { t } = useTranslation();\n')
    ],
    'src/pages/Alerts.jsx': [
        ('System Alerts', '{t("alerts.title")}'),
        ('Real-time notifications, warnings and automated risk alerts', '{t("alerts.subtitle")}'),
        ('CRITICAL ALERTS', '{t("alerts.criticalAlerts")}'),
        ('WARNINGS', '{t("alerts.warnings")}'),
        ('INFORMATION', '{t("alerts.info")}'),
        ('function Alerts() {\n', 'function Alerts() {\n  const { t } = useTranslation();\n')
    ],
    'src/pages/Hospitals.jsx': [
        ('Hospital Command Center', '{t("hospitals.title")}'),
        ('Emergency capacity, ambulance readiness and medical-resource intelligence', '{t("hospitals.subtitle")}'),
        ('Emergency Healthcare Network', '{t("hospitals.emergencyNetwork")}'),
        ('NETWORK READINESS', '{t("hospitals.networkReadiness")}'),
        ('TOTAL FACILITIES', '{t("hospitals.totalFacilities")}'),
        ('ACTIVE AMBULANCES', '{t("hospitals.activeAmbulances")}'),
        ('CRITICAL CARE (ICU)', '{t("hospitals.criticalCare")}'),
        ('function Hospitals() {\n', 'function Hospitals() {\n  const { t } = useTranslation();\n')
    ]
}

for file, pairs in replacements.items():
    content = open(file, 'r', encoding='utf-8').read()
    
    # inject import if not present
    if 'useTranslation' not in content:
        content = content.replace('import {', 'import { useTranslation } from "react-i18next";\nimport {', 1)
        
    for old, new in pairs:
        content = content.replace(old, new)
        
    # fix the special case for location unavailable
    content = content.replace('Location un{t("vehicles.available")}', 'Location unavailable')
        
    open(file, 'w', encoding='utf-8').write(content)
    print(f'Translated {file}')
