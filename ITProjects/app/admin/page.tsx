import { AdminHeader } from "@/components/admin/admin-header";
import { Card } from "@/components/ui/card";
import orders from "@/data/orders.json";

export default function DashboardPage() {
  const activeOrders = orders.filter((order) => order.status !== "issued").length;
  return (
    <>
      <AdminHeader description="Сводка работы ателье на сегодня." title="Дашборд" />
      <section aria-label="Ключевые показатели" className="stat-grid">
        {[["Активные заказы", String(activeOrders)], ["Новые клиенты", "8"], ["На этой неделе", "12"], ["Выручка за месяц", "684 000 ₸"]].map(([label, value]) => <Card className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></Card>)}
      </section>
      <div className="dashboard-grid">
        <section className="panel"><div className="panel-heading">Последние заказы <a className="muted" href="/admin/orders" style={{ fontSize: 12 }}>Все заказы →</a></div><div className="simple-list">{orders.slice(0, 4).map((order) => <div className="simple-row" key={order.id}><div><strong>{order.client}</strong><div className="muted" style={{ marginTop: 4 }}>{order.item}</div></div><span className="badge">{order.id}</span></div>)}</div></section>
        <section className="panel"><div className="panel-heading">Сегодня в ателье</div><div className="simple-list"><div className="simple-row"><span>Примерка · Анна Смирнова</span><span className="muted">11:30</span></div><div className="simple-row"><span>Снятие мерок · Новый клиент</span><span className="muted">14:00</span></div><div className="simple-row"><span>Выдача · Данияр Ким</span><span className="muted">16:30</span></div></div></section>
      </div>
    </>
  );
}
