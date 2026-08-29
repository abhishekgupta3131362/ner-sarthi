for file in ['src/pages/Vehicles.jsx', 'src/pages/Routes.jsx', 'src/pages/Alerts.jsx', 'src/pages/Hospitals.jsx']:
    content = open(file, 'r', encoding='utf-8').read()
    content = content.replace('{t("vehicles.title")}', 'Fleet Monitoring')
    content = content.replace('{t("vehicles.subtitle")}', 'Live tracking and status of all logistics and emergency vehicles')
    content = content.replace('{t("vehicles.activeFleet")}', 'ACTIVE FLEET')
    content = content.replace('{t("vehicles.inTransit")}', 'IN TRANSIT')
    content = content.replace('un{t("vehicles.available")}', 'unavailable')
    content = content.replace('{t("vehicles.available")}', 'AVAILABLE')
    content = content.replace('{t("vehicles.maintenance")}', 'MAINTENANCE')
    
    content = content.replace('{t("routes.title")}', 'Smart Routing Intelligence')
    content = content.replace('{t("routes.subtitle")}', 'AI-optimized logistics routes avoiding high-risk corridors')
    content = content.replace('{t("routes.activeRoutes")}', 'ACTIVE ROUTES')
    content = content.replace('{t("routes.blockedRoutes")}', 'BLOCKED ROUTES')
    content = content.replace('{t("routes.rerouted")}', 'REROUTED')
    
    content = content.replace('{t("alerts.title")}', 'System Alerts')
    content = content.replace('{t("alerts.subtitle")}', 'Real-time notifications, warnings and automated risk alerts')
    content = content.replace('{t("alerts.criticalAlerts")}', 'CRITICAL ALERTS')
    content = content.replace('{t("alerts.warnings")}', 'WARNINGS')
    content = content.replace('{t("alerts.info")}', 'INFORMATION')
    
    content = content.replace('{t("hospitals.title")}', 'Hospital Command Center')
    content = content.replace('{t("hospitals.subtitle")}', 'Emergency capacity, ambulance readiness and medical-resource intelligence')
    content = content.replace('{t("hospitals.emergencyNetwork")}', 'Emergency Healthcare Network')
    content = content.replace('{t("hospitals.networkReadiness")}', 'NETWORK READINESS')
    content = content.replace('{t("hospitals.totalFacilities")}', 'TOTAL FACILITIES')
    content = content.replace('{t("hospitals.activeAmbulances")}', 'ACTIVE AMBULANCES')
    content = content.replace('{t("hospitals.criticalCare")}', 'CRITICAL CARE (ICU)')

    content = content.replace('import { useTranslation } from \'react-i18next\';\n', '')
    content = content.replace('\nimport { useTranslation } from "react-i18next";', '')
    
    content = content.replace('function Alerts() {\n  const { t } = useTranslation();', 'function Alerts() {')
    content = content.replace('function Routes() {\n  const { t } = useTranslation();', 'function Routes() {')
    content = content.replace('function Vehicles() {\n  const { t } = useTranslation();', 'function Vehicles() {')
    content = content.replace('function Hospitals() {\n  const { t } = useTranslation();', 'function Hospitals() {')
    
    open(file, 'w', encoding='utf-8').write(content)
