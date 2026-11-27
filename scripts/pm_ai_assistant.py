"""
ЛЗ 13. Собственный ИИ-ассистент менеджера проекта (AtelierFlow PM Assistant).
Собирает реальные данные репозитория Forwarde/ecomerce-project через GitHub REST API:
- свежие коммиты за последние 14 дней;
- открытые/влитые Pull Requests;
- "зависшие" задачи (Issues старше 7 дней без обновления).
При наличии локальной модели Ollama (http://localhost:11434) или бесплатного API генерирует
черновик еженедельного статус-отчета; в CI без GPU формирует структурированный отчет и промпт.
Запуск: python scripts/pm_ai_assistant.py
"""

import json
import os
import re
import urllib.request
from datetime import datetime, timezone

REPO = os.getenv("GITHUB_REPOSITORY", "Forwarde/ecomerce-project")
API_BASE = f"https://api.github.com/repos/{REPO}"
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")

# Регулярные выражения для фильтрации запрещенных ПДн перед отправкой в LLM
PII_PATTERNS = [
    (re.compile(r"\+?[78][\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}"), "[REDACTED_PHONE]"),
    (re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"), "[REDACTED_EMAIL]"),
    (re.compile(r"\b\d{12}\b"), "[REDACTED_IIN]"),
]


def redact_pii(text: str) -> str:
    """Обязательная очистка текста от телефонов, email и ИИН перед передачей в ИИ."""
    cleaned = text
    for pattern, repl in PII_PATTERNS:
        cleaned = pattern.sub(repl, cleaned)
    return cleaned


def fetch_github_json(path: str) -> list:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AtelierFlow-PM-AI-Assistant",
    }
    token = os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{API_BASE}{path}", headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parse_iso(ts: str) -> datetime:
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


def collect_project_snapshot() -> dict:
    now = datetime.now(timezone.utc)
    commits = fetch_github_json("/commits?per_page=30")
    pulls = fetch_github_json("/pulls?state=all&per_page=20")
    raw_issues = fetch_github_json("/issues?state=open&per_page=50")
    issues = [i for i in raw_issues if "pull_request" not in i]

    stale_issues = []
    for iss in issues:
        updated_at = parse_iso(iss["updated_at"])
        age_days = (now - updated_at).days
        if age_days >= 7:
            stale_issues.append(
                {
                    "number": iss["number"],
                    "title": redact_pii(iss["title"]),
                    "age_days": age_days,
                }
            )

    recent_commits = [
        {
            "sha": c["sha"][:7],
            "message": redact_pii(c["commit"]["message"].splitlines()[0]),
            "date": c["commit"]["author"]["date"][:10],
        }
        for c in commits[:10]
    ]

    open_prs = [
        {
            "number": p["number"],
            "title": redact_pii(p["title"]),
            "age_days": (now - parse_iso(p["created_at"])).days,
        }
        for p in pulls
        if p["state"] == "open"
    ]

    return {
        "repo": REPO,
        "generated_at": now.strftime("%Y-%m-%d %H:%M UTC"),
        "total_open_issues": len(issues),
        "stale_issues_count": len(stale_issues),
        "stale_issues": stale_issues[:8],
        "open_prs": open_prs,
        "recent_commits": recent_commits,
    }


def build_prompt(snapshot: dict) -> str:
    return (
        "Ты — ассистент ИТ-менеджера проекта AtelierFlow. "
        "На основе ТОЛЬКО переданных JSON-фактов составь краткий еженедельный статус-отчет (на русском): "
        "1) Что сделано (по коммитам); 2) Зависшие рисковые задачи (age >= 7 дн.); 3) Открытые PR; "
        "4) 2 рекомендации PM на следующую неделю. Не выдумывай цифры и факты.\n\n"
        f"DATA:\n{json.dumps(snapshot, ensure_ascii=False, indent=2)}"
    )


def try_ollama_summary(prompt: str) -> str | None:
    try:
        payload = json.dumps(
            {"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}
        ).encode("utf-8")
        req = urllib.request.Request(
            OLLAMA_URL,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response")
    except Exception:
        return None


def format_markdown_report(snapshot: dict, llm_text: str | None) -> str:
    lines = [
        f"# 🤖 Еженедельный статус-отчет PM-ассистента ({snapshot['repo']})",
        f"- **Дата формирования:** {snapshot['generated_at']}",
        f"- **Открытых задач (Issues):** {snapshot['total_open_issues']} (из них зависших ≥ 7 дней: **{snapshot['stale_issues_count']}**)",
        f"- **Открытых Pull Requests:** {len(snapshot['open_prs'])}",
        "",
        "## 1. Последние изменения в ветке `main`",
    ]
    for c in snapshot["recent_commits"][:6]:
        lines.append(f"- `{c['sha']}` ({c['date']}): {c['message']}")

    lines.append("\n## 2. Рисковые / зависшие задачи (Work Item Age ≥ 7 дней)")
    if snapshot["stale_issues"]:
        for iss in snapshot["stale_issues"]:
            lines.append(f"- **#{iss['number']}** — {iss['title']} *(возраст: {iss['age_days']} дн.)*")
    else:
        lines.append("- Зависших задач не обнаружено.")

    lines.append("\n## 3. Открытые Pull Requests (требуют ревью)")
    if snapshot["open_prs"]:
        for pr in snapshot["open_prs"]:
            lines.append(f"- **PR #{pr['number']}** — {pr['title']} *(открыт {pr['age_days']} дн. назад)*")
    else:
        lines.append("- Все Pull Requests влиты.")

    if llm_text:
        lines.append("\n## 4. Аналитика ИИ-модели (требует ручной верификации PM)")
        lines.append(llm_text.strip())
    else:
        lines.append("\n## 4. Рекомендации PM (автоматическое правило эскалации)")
        if snapshot["open_prs"]:
            lines.append("- **Риск интеграции:** Закрыть/влить открытые PR (правило Review First, WIP ≤ 2).")
        if snapshot["stale_issues_count"] > 5:
            lines.append("- **Риск бэклога:** Провести refinement и закрыть/актуализировать зависшие Issues старше 7 дней.")

    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    snap = collect_project_snapshot()
    prompt = build_prompt(snap)
    ai_summary = try_ollama_summary(prompt)
    report = format_markdown_report(snap, ai_summary)

    with open("pm-weekly-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(report)
