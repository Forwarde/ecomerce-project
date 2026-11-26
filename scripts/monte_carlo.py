"""
ЛЗ 6. Вероятностный прогноз сроков завершения бэклога методом Монте-Карло (10 000 прогонов).
Использует исторический еженедельный throughput команды AtelierFlow (закрытые задачи в неделю).
Запуск: python scripts/monte_carlo.py
"""

import random
from collections import Counter

# Исторические данные throughput команды за прошлые 8 недель (закрыто задач/историй в неделю)
HISTORICAL_WEEKLY_THROUGHPUT = [2, 3, 2, 4, 3, 1, 3, 2]

# Оставшийся объем бэклога проекта AtelierFlow (количество пользовательских историй)
REMAINING_BACKLOG_ITEMS = 18

# Количество симуляций Монте-Карло
NUM_SIMULATIONS = 10_000
RANDOM_SEED = 42


def simulate_single_run(remaining_items: int, throughput_history: list[int]) -> int:
    """Моделирует один сценарий выполнения бэклога и возвращает число недель до завершения."""
    items_left = remaining_items
    weeks = 0
    while items_left > 0:
        weekly_done = random.choice(throughput_history)
        items_left -= weekly_done
        weeks += 1
    return weeks


def run_monte_carlo(
    remaining_items: int = REMAINING_BACKLOG_ITEMS,
    throughput_history: list[int] = HISTORICAL_WEEKLY_THROUGHPUT,
    simulations: int = NUM_SIMULATIONS,
) -> dict:
    random.seed(RANDOM_SEED)
    results = [
        simulate_single_run(remaining_items, throughput_history)
        for _ in range(simulations)
    ]
    results.sort()

    def percentile(p: float) -> int:
        idx = min(int(len(results) * p), len(results) - 1)
        return results[idx]

    distribution = Counter(results)
    return {
        "simulations": simulations,
        "remaining_items": remaining_items,
        "mean_throughput": sum(throughput_history) / len(throughput_history),
        "p50": percentile(0.50),
        "p70": percentile(0.70),
        "p85": percentile(0.85),
        "p95": percentile(0.95),
        "min_weeks": results[0],
        "max_weeks": results[-1],
        "distribution": dict(sorted(distribution.items())),
    }


if __name__ == "__main__":
    stats = run_monte_carlo()
    print("=== Результаты симуляции Монте-Карло (AtelierFlow) ===")
    print(f"Количество прогонов: {stats['simulations']}")
    print(f"Оставшийся бэклог:   {stats['remaining_items']} историй")
    print(f"Средний throughput:  {stats['mean_throughput']:.2f} историй/нед.\n")
    print(f"P50 (вероятность 50%): {stats['p50']} нед.")
    print(f"P70 (вероятность 70%): {stats['p70']} нед.")
    print(f"P85 (вероятность 85% - стандарт SLA): {stats['p85']} нед.")
    print(f"P95 (вероятность 95%): {stats['p95']} нед.\n")
    print("Распределение вероятностей по неделям (Кумулятивная кривая):")
    cumulative = 0
    for week, count in stats["distribution"].items():
        cumulative += count
        prob = (count / stats["simulations"]) * 100
        cum_prob = (cumulative / stats["simulations"]) * 100
        bar = "#" * int(prob)
        print(f"  {week:2d} нед.: {prob:5.1f}% (кумулятивно {cum_prob:5.1f}%) | {bar}")
