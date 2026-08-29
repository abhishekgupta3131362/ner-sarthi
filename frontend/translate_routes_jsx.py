import re

file_path = 'src/pages/Routes.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('Route Optimization', '{t("routes.routeOptimization")}'),
    ('AI-assisted route selection using distance, risk, weather and road conditions', '{t("routes.routeSubtitle")}'),
    ('ROUTES EVALUATED', '{t("routes.routesEvaluated")}'),
    ('SAFE ROUTES', '{t("routes.safeRoutes")}'),
    ('HIGH RISK', '{t("routes.highRisk")}'),
    ('AVG ETA', '{t("routes.avgEta")}'),
    ('COST SAVING', '{t("routes.costSaving")}'),
    ('OPTIMIZATION OBJECTIVE', '{t("routes.optObjective")}'),
    ('Select how the AI should prioritize routes', '{t("routes.selectPriority")}'),
    ('Smart Route Planner', '{t("routes.smartPlanner")}'),
    ('Candidate Routes', '{t("routes.candidateRoutes")}'),
    ('SELECTED ROUTE', '{t("routes.selectedRoute")}'),
    ('>FASTEST<', '>{t("routes.fastest")}<'),
    ('>SAFEST<', '>{t("routes.safest")}<'),
    ('>LOWEST COST<', '>{t("routes.lowestCost")}<'),
    ('>BALANCED<', '>{t("routes.balanced")}<')
]

for old, new in replacements:
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated Routes.jsx')
