import json
import os
import urllib.request
from datetime import datetime, timedelta, timezone

REPO = os.getenv("GITHUB_REPOSITORY", "Forwarde/ecomerce-project")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")


def fetch_two_sprints_issues():
    since = (datetime.now(timezone.utc) - timedelta(days=28)).strftime("%Y-%m-%dT%H:%M:%SZ")
    url = f"https://api.github.com/repos/{REPO}/issues?state=all&since={since}&per_page=100"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "PM-Risk-Analyzer",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        items = json.loads(resp.read().decode("utf-8"))

    now = datetime.now(timezone.utc)
    sprint_1, sprint_2 = [], []

    for item in items:
        if "pull_request" in item:
            continue
        created = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
        age_days = (now - created).days
        labels = [lbl["name"] for lbl in item.get("labels", [])]
        status = "ЗАКРЫТА" if item["state"] == "closed" else "ОТКРЫТА"
        line = (
            f"- #{item['number']} [{status}]: {item['title']} | "
            f"Возраст: {age_days} дн. | Метки: {', '.join(labels) if labels else 'нет'} | "
            f"Комментариев: {item['comments']}"
        )
        if age_days > 14:
            sprint_1.append(line)
        else:
            sprint_2.append(line)

    return sprint_1, sprint_2


def analyze_with_ollama(sprint_1, sprint_2):
    s1_block = "\n".join(sprint_1) if sprint_1 else "Нет задач"
    s2_block = "\n".join(sprint_2) if sprint_2 else "Нет задач"

    prompt = f"""Ты — опытный IT Project Manager. Проанализируй задачи репозитория {REPO} за два прошедших двухнедельных спринта (28 дней) и составь отчёт на русском языке.

Спринт 1 (15–28 дней назад):
{s1_block}

Спринт 2 (последние 14 дней):
{s2_block}

Сформируй структурированный отчёт в формате Markdown:
1. Сводка по двум спринтам (сколько закрыто, сколько зависло)
2. Рисковые задачи и блокеры (старше 21 дня, баги, вопросы, безопасность)
3. План действий PM на следующий спринт"""

    payload = json.dumps({
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }).encode("utf-8")

    req = urllib.request.Request(
        OLLAMA_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result.get("response", "")


if __name__ == "__main__":
    sprint_1, sprint_2 = fetch_two_sprints_issues()
    print("=== ФАКТЫ ИЗ GITHUB API (2 СПРИНТА) ===")
    print("Спринт 1 (15-28 дн.):")
    print("\n".join(sprint_1) or "Нет задач")
    print("\nСпринт 2 (0-14 дн.):")
    print("\n".join(sprint_2) or "Нет задач")

    report = analyze_with_ollama(sprint_1, sprint_2)
    print("\n=== ОТЧЁТ OLLAMA ===")
    print(report)

    with open("risk_report.md", "w", encoding="utf-8") as f:
        f.write(report)
