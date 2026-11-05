import { AdminHeader } from "@/components/admin/admin-header";
import { KanbanBoard } from "@/components/admin/kanban-board";

export default function OrdersPage() {
  return (
    <>
      <AdminHeader description="Перемещайте заказы между этапами пошива." title="Заказы" />
      <KanbanBoard />
    </>
  );
}
