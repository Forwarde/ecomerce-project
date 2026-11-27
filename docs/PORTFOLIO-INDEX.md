# 📂 Итоговое портфолио PM-артефактов проекта AtelierFlow (Недели 1–15)

Репозиторий: **`Forwarde/ecomerce-project`** | Курс: *«Управление ИТ-проектами» (2026/2027)*
Все 15 обязательных артефактов итогового портфолио выполнены на **100% бесплатном и открытом стеке** 

| № | Пункт итогового портфолио (Силлабус, Неделя 15) | Неделя | Готовые файлы и ссылки в репозитории |
| :---: | :--- | :---: | :--- |
| **1** | **Устав проекта и бизнес-кейс с моделью TCO/ROI** | 1, 3 | [`docs/lab01-market-and-case.md`](./lab01-market-and-case.md)<br>[`docs/lab03-business-case-charter.md`](./lab03-business-case-charter.md)<br>[`docs/lab03-tco-roi.csv`](./lab03-tco-roi.csv) |
| **2** | **ADR-лог (не менее 3 решений по шаблону MADR)** | 2, 10, 12 | [`docs/adr/ADR-001-delivery-model.md`](./adr/ADR-001-delivery-model.md)<br>[`docs/adr/ADR-002-ai-feature-decision.md`](./adr/ADR-002-ai-feature-decision.md)<br>[`docs/adr/ADR-003-hosting-and-cicd.md`](./adr/ADR-003-hosting-and-cicd.md)<br>[`docs/lab02-delivery-models.md`](./lab02-delivery-models.md) |
| **3** | **Матрица стейкхолдеров и план коммуникаций** | 4 | [`docs/lab04-stakeholders-storymap-nfr.md`](./lab04-stakeholders-storymap-nfr.md) |
| **4** | **Story Map, бэклог в трекере, спецификация НФТ (14 шт.)** | 4 | [`docs/lab04-stakeholders-storymap-nfr.md`](./lab04-stakeholders-storymap-nfr.md)<br>[GitHub Issues (16+ историй)](https://github.com/Forwarde/ecomerce-project/issues) |
| **5** | **WBS, план релизов, карта зависимостей, RACI, Capacity** | 5 | [`docs/lab05-wbs-releases-raci.md`](./lab05-wbs-releases-raci.md) |
| **6** | **Вероятностная оценка сроков (Монте-Карло, 10 000 прогонов)** | 6 | [`scripts/monte_carlo.py`](../scripts/monte_carlo.py)<br>[`docs/lab06-monte-carlo.md`](./lab06-monte-carlo.md) |
| **7** | **RAID-лог (20 рисков), модель угроз STRIDE, чек-лист соответствия** | 7 | [`docs/lab07-raid-stride-compliance.md`](./lab07-raid-stride-compliance.md) |
| **8** | **SoW, SLA/SLO (Error Budget), бюджет и FinOps юнит-экономика** | 8 | [`docs/lab08-sow-sla-budget-finops.md`](./lab08-sow-sla-budget-finops.md) |
| **9** | **Отчет по метрикам потока за 2 спринта (CFD) и ретроспектива** | 9 | [`docs/lab09-sprints-flow-metrics.md`](./lab09-sprints-flow-metrics.md) |
| **10** | **CI/CD-пайплайн и дашборд 4 метрик DORA** | 10 | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)<br>[`.github/workflows/dora.yml`](../.github/workflows/dora.yml)<br>[`scripts/dora_dashboard.py`](../scripts/dora_dashboard.py)<br>[`docs/lab10-dora-release-plan.md`](./lab10-dora-release-plan.md) |
| **11** | **План тестирования, k6, протокол UAT, Postmortem, Runbook** | 11 | [`k6/load-test.js`](../k6/load-test.js)<br>[`.github/workflows/k6.yml`](../.github/workflows/k6.yml)<br>[`docs/lab11-testing-uat-postmortem-runbook.md`](./lab11-testing-uat-postmortem-runbook.md) |
| **12** | **Карточка ИИ-функции, eval-набор (30 шт.), расчет инференса** | 12 | [`docs/lab12-ai-feature-evals-cost.md`](./lab12-ai-feature-evals-cost.md)<br>[`docs/lab12-eval-dataset.csv`](./lab12-eval-dataset.csv) |
| **13** | **Автоматизация PM-процесса + журнал верификации ИИ** | 13 | [`scripts/pm_ai_assistant.py`](../scripts/pm_ai_assistant.py)<br>[`.github/workflows/pm-assistant.yml`](../.github/workflows/pm-assistant.yml)<br>[`docs/lab13-pm-ai-assistant.md`](./lab13-pm-ai-assistant.md) |
| **14** | **Таблица WSJF, дашборд руководителя, статус-отчет, Change Plan** | 14 | [`docs/lab14-wsjf-dashboard-status-change.md`](./lab14-wsjf-dashboard-status-change.md)<br>[`scripts/executive_dashboard.py`](../scripts/executive_dashboard.py) |
| **15** | **Документ извлеченных уроков, презентация защиты и резюме** | 15 | [`docs/lab15-defense-lessons-resume.md`](./lab15-defense-lessons-resume.md) |

---

### 🔗 Живые результаты автоматизации (GitHub Actions)
- **Все прогоны CI, DORA, k6 и PM-ассистента:** [GitHub Actions Dashboard](https://github.com/Forwarde/ecomerce-project/actions)
