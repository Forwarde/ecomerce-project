# AtelierFlow — Автоматизированная система учета для швейного ателье

Сквозной проект по курсу **«Управление ИТ-проектами» (15 недель, 2026/2027)**.
Система цифровизации учета заказов, индивидуальных мерок клиентов и складских остатков тканей для реального швейного ателье.

---

## 📂 Итоговое портфолио PM-артефактов (Недели 1–15)

👉 **Полное оглавление портфолио со всеми 15 обязательными артефактами:** [`docs/PORTFOLIO-INDEX.md`](./docs/PORTFOLIO-INDEX.md)

| Блок курса | Ключевые артефакты в репозитории |
| :--- | :--- |
| **Инициация и экономика (Нед. 1–4)** | [ЛЗ 1: Рынок и кейс](./docs/lab01-market-and-case.md) · [ЛЗ 2: Модели и ADR](./docs/lab02-delivery-models.md) · [ЛЗ 3: Бизнес-кейс, Устав, TCO/ROI](./docs/lab03-business-case-charter.md) ([CSV](./docs/lab03-tco-roi.csv)) · [ЛЗ 4: Story Map и 14 НФТ](./docs/lab04-stakeholders-storymap-nfr.md) |
| **Планирование, риски, FinOps (Нед. 5–8)** | [ЛЗ 5: WBS, релизы, RACI](./docs/lab05-wbs-releases-raci.md) · [ЛЗ 6: Монте-Карло](./docs/lab06-monte-carlo.md) ([код](./scripts/monte_carlo.py)) · [ЛЗ 7: RAID (20 рисков) и STRIDE](./docs/lab07-raid-stride-compliance.md) · [ЛЗ 8: SoW, SLA/SLO, FinOps](./docs/lab08-sow-sla-budget-finops.md) |
| **Поставка, DORA, k6 и UAT (Нед. 9–11)** | [ЛЗ 9: Поток и CFD](./docs/lab09-sprints-flow-metrics.md) · [ЛЗ 10: DORA и релизный план](./docs/lab10-dora-release-plan.md) ([код](./scripts/dora_dashboard.py)) · [ЛЗ 11: k6, UAT, Postmortem, Runbook](./docs/lab11-testing-uat-postmortem-runbook.md) |
| **ИИ, портфель и защита (Нед. 12–15)** | [ЛЗ 12: ИИ-функция и Evals](./docs/lab12-ai-feature-evals-cost.md) ([30 примеров CSV](./docs/lab12-eval-dataset.csv)) · [ЛЗ 13: ИИ-ассистент PM](./docs/lab13-pm-ai-assistant.md) ([код](./scripts/pm_ai_assistant.py)) · [ЛЗ 14: WSJF и Дашборд](./docs/lab14-wsjf-dashboard-status-change.md) ([код](./scripts/executive_dashboard.py)) · [ЛЗ 15: Защита, Уроки, Резюме](./docs/lab15-defense-lessons-resume.md) |
| **Архитектурные решения (ADR-лог)** | [`ADR-001` (Модель поставки)](./docs/adr/ADR-001-delivery-model.md) · [`ADR-002` (ИИ-парсер заявок)](./docs/adr/ADR-002-ai-feature-decision.md) · [`ADR-003` (Open Source стек и CI/CD)](./docs/adr/ADR-003-hosting-and-cicd.md) |

---

## 🛠️ Реальный технологический стек (100% Open Source)

* **Веб-приложение (`./ITProjects/`):** **Next.js 14 (App Router) + TypeScript + Tailwind CSS** — публичный каталог (`/`), авторизация (`/login`), защищенная панель управления заказами, мерками и тканями (`/admin` через `middleware.ts`).
* **Контейнеризация и мониторинг SLA:** [`DockerFile`](./DockerFile) + [`docker-compose.yml`](./docker-compose.yml) (приложение на порту `3000` + мониторинг доступности **Uptime Kuma** на порту `3001`).
* **CI/CD, безопасность и автотесты:**
  - [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — ESLint, автотесты (`ITProjects/tests/smoke.test.mjs`), проверка `monte_carlo.py`, сборка Next.js и скан уязвимостей **Trivy**.
  - [`.github/workflows/k6.yml`](./.github/workflows/k6.yml) — нагрузочное тестирование **Grafana k6** ([`k6/load-test.js`](./k6/load-test.js), порог `p95 < 1000ms`).
  - [`.github/workflows/dora.yml`](./.github/workflows/dora.yml) — автоматический расчет 4 метрик **DORA**.
  - [`.github/workflows/pm-assistant.yml`](./.github/workflows/pm-assistant.yml) — еженедельный ИИ-ассистент PM по расписанию (`cron`).
* **Целевая дорожная карта бэкенда (Release 3.1+):** Выделение REST API на FastAPI + PostgreSQL (зафиксировано в `docs/project-overview.md` и `for_future_tasks`).

---

## 🚀 Быстрый запуск локально

### Вариант 1: Через Docker Compose (с мониторингом Uptime Kuma)
```bash
docker compose up -d --build
# Приложение:  http://localhost:3000
# Uptime Kuma: http://localhost:3001
```

### Вариант 2: Локально (Node.js 20+)
```bash
cd ITProjects
npm install
node --test tests/smoke.test.mjs
npm run dev
```
