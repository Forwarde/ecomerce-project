import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";

const clients = [
  { name: "Анна Смирнова", phone: "+7 701 234 56 78", orders: 3, lastVisit: "04 ноя 2026" },
  { name: "Марат Алиев", phone: "+7 777 123 45 67", orders: 1, lastVisit: "02 ноя 2026" },
  { name: "Елена Волкова", phone: "+7 702 987 65 43", orders: 2, lastVisit: "31 окт 2026" },
];

export default function ClientsPage() {
  return (
    <>
      <AdminHeader description="Контакты, мерки и история заказов." title="Клиенты" />
      <div className="toolbar"><span className="muted" style={{ fontSize: 13 }}>{clients.length} клиента</span><Link className="button" href="/admin/clients/new"><Plus size={16} />Добавить мерки</Link></div>
      <section className="panel table-wrap"><table className="data-table"><thead><tr><th>Клиент</th><th>Телефон</th><th>Заказов</th><th>Последний визит</th><th>Мерки</th></tr></thead><tbody>{clients.map((client) => <tr key={client.phone}><td><strong>{client.name}</strong></td><td>{client.phone}</td><td>{client.orders}</td><td>{client.lastVisit}</td><td><span className="badge">Профиль есть</span></td></tr>)}</tbody></table></section>
    </>
  );
}
