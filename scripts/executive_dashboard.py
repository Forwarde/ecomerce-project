"""
ЛЗ 14. Интерактивный дашборд руководителя проекта AtelierFlow (Executive Dashboard).
Поддерживает 2 бесплатных режима запуска:
  1. Веб-дашборд в браузере (Streamlit): streamlit run scripts/executive_dashboard.py
  2. Консольный режим (без установки зависимостей): python scripts/executive_dashboard.py
"""

PROJECT_DATA = {
    "project": "AtelierFlow — ИС учета заказов, мерок и склада тканей",
    "status": "GREEN (Локальный AMBER по гигиене старых Issues)",
    "milestones": [
        {"name": "Веха 1: MVP Витрина и CI (Неделя 5)", "plan": 100, "fact": 100},
        {"name": "Веха 2: Панель /admin и РК-1 (Неделя 8)", "plan": 100, "fact": 100},
        {"name": "Веха 3: DORA, k6 и UAT (Неделя 11)", "plan": 100, "fact": 100},
        {"name": "Веха 4: ИИ-функция, WSJF и Защита (Неделя 15)", "plan": 100, "fact": 95},
    ],
    "flow_metrics": {
        "throughput_per_week": 5.0,
        "avg_cycle_time_hours": 29.5,
        "p85_cycle_time_hours": 42.0,
        "wip_current": 2.4,
    },
    "dora_metrics": {
        "deployment_frequency": "5.2 поставок/нед. (High)",
        "lead_time_hours": "4.5 ч (High/Elite)",
        "change_failure_rate": "14.3% (High)",
        "mttr_hours": "1.2 ч (Elite)",
    },
    "budget_kzt": {
        "capex_plan": 1_560_000,
        "capex_fact": 1_560_000,
        "licenses_plan": 0,
        "licenses_fact": 0,
        "monthly_opex_vps": 10_000,
        "roi_3yr_percent": 500.0,
    },
    "top_risks": [
        "R-01 (Score 15): Обход авторизации /admin — СНИЖЕН (middleware.ts + UAT-02)",
        "R-02 (Score 15): CVE в npm-зависимостях — СНИЖЕН (Trivy в ci.yml)",
        "R-07 (Score 10): Деградация скорости под нагрузкой — СНИЖЕН (k6.yml p95<1000ms)",
    ],
}


def render_cli() -> None:
    print("=" * 68)
    print(f"📊 EXECUTIVE DASHBOARD: {PROJECT_DATA['project']}")
    print(f"Статус светофора: {PROJECT_DATA['status']}")
    print("=" * 68)
    print("\n1. ПРОГРЕСС ПО ВЕХАМ:")
    for m in PROJECT_DATA["milestones"]:
        bar = "█" * (m["fact"] // 5) + "░" * ((100 - m["fact"]) // 5)
        print(f"  - {m['name']:<46} [{bar}] {m['fact']}%")

    f = PROJECT_DATA["flow_metrics"]
    print("\n2. МЕТРИКИ ПОТОКА (Спринт 2):")
    print(f"  Throughput: {f['throughput_per_week']} зад./нед. | Avg Cycle Time: {f['avg_cycle_time_hours']} ч | p85: {f['p85_cycle_time_hours']} ч | WIP: {f['wip_current']}")

    d = PROJECT_DATA["dora_metrics"]
    print("\n3. МЕТРИКИ DORA:")
    for k, v in d.items():
        print(f"  - {k}: {v}")

    b = PROJECT_DATA["budget_kzt"]
    print("\n4. БЮДЖЕТ И FINOPS:")
    print(f"  CAPEX План/Факт: {b['capex_plan']:,} / {b['capex_fact']:,} ₸ | Лицензии: {b['licenses_fact']} ₸ | VPS: {b['monthly_opex_vps']:,} ₸/мес. | ROI 3 года: {b['roi_3yr_percent']}%")

    print("\n5. ТОП-3 РИСКА:")
    for r in PROJECT_DATA["top_risks"]:
        print(f"  - {r}")
    print("=" * 68)


def render_streamlit() -> None:
    import streamlit as st

    st.set_page_config(page_title="AtelierFlow Executive Dashboard", layout="wide")
    st.title(f"📊 {PROJECT_DATA['project']}")
    st.success(f"Общий статус: {PROJECT_DATA['status']}")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Throughput", f"{PROJECT_DATA['flow_metrics']['throughput_per_week']}/нед.", "+66.7%")
    col2.metric("p85 Cycle Time", f"{PROJECT_DATA['flow_metrics']['p85_cycle_time_hours']} ч", "-62 ч")
    col3.metric("Change Failure Rate", "14.3%", "High Performer")
    col4.metric("ROI (3 года)", f"{PROJECT_DATA['budget_kzt']['roi_3yr_percent']}%", "0 ₸ лицензии")

    st.subheader("Прогресс по вехам")
    for m in PROJECT_DATA["milestones"]:
        st.write(f"**{m['name']}** — {m['fact']}%")
        st.progress(m["fact"] / 100)

    st.subheader("Метрики DORA и Топ-риски")
    st.json({"DORA": PROJECT_DATA["dora_metrics"], "Top_Risks": PROJECT_DATA["top_risks"]})


if __name__ == "__main__":
    try:
        import streamlit.runtime.scriptrunner as sr

        if sr.get_script_run_ctx() is not None:
            render_streamlit()
        else:
            render_cli()
    except Exception:
        render_cli()
