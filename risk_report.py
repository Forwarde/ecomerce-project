import json
import os
import urllib.request
from datetime import datetime, timezone

REPO = os.getenv("GITHUB_REPOSITORY", "Forwarde/ecomerce-project")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")


def fetch_open_issues():
    url = f"https://api.github.com/repos/{REPO}/issues?state=open&per_page=50"
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
    issues = []
    for item in items:
        if "pull_request" in item:
            continue
        created = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
        age_days = (now - created).days
        labels = [lbl["name"] for lbl in item.get("labels", [])]
        issues.append(
            f"- #{item['number']}: {item['title']} | "
            f"Возраст: {age_days} дн. | Метки: {', '.join(labels) if labels else 'нет'} | "
            f"Комментариев: {item['comments']}"
        )
    return issues


def analyze_with_ollama(issues_text):
    prompt = f"""Ты — опытный IT Project Manager. Проанализируй открытые задачи (Issues) репозитория {REPO} и составь краткий отчёт о рисках на русском языке.

Критерии оценки:
1. Высокий риск: задачи старше 21 дня, критичные баги (bug) или задачи безопасности (SEC).
2. Блокеры: задачи с меткой question или без движения.
3. Рекомендации: конкретные действия для PM на эту неделю.

Список открытых задач:
{issues_text}

Сформируй структурированный отчёт в формате Markdown:
1. Сводка рисков
2. Задачи с высоким риском и блокеры
3. План действий PM"""

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
    issues = fetch_open_issues()
    if not issues:
        print("Открытых задач не найдено.")
        exit(0)

    issues_block = "\n".join(issues)
    print("=== ДАННЫЕ ИЗ GITHUB API ===")
    print(issues_block)

    report = analyze_with_ollama(issues_block)
    print("\n=== ОТЧЁТ OLLAMA ===")
    print(report)

    with open("risk_report.md", "w", encoding="utf-8") as f:
        f.write(report)
