import type { Order, OrderStatus } from "./types";

type OrderCardProps = {
  order: Order;
  statusOptions: { id: OrderStatus; title: string }[];
  onDragStart: (orderId: string) => void;
  onDragEnd: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
};

export function OrderCard({ order, statusOptions, onDragStart, onDragEnd, onStatusChange }: OrderCardProps) {
  return (
    <article
      aria-label={`${order.id}, ${order.client}, ${order.item}`}
      className="order-card"
      draggable
      onDragStart={() => onDragStart(order.id)}
      onDragEnd={onDragEnd}
    >
      <div className="order-card-id">{order.id}</div>
      <h3>{order.client}</h3>
      <p>{order.item}</p>
      <div className="order-card-footer"><span className="muted">Срок: {order.dueDate}</span><span className="price">{order.price.toLocaleString("ru-RU")} ₸</span></div>
      <label className="order-card-status">
        <span>Этап заказа</span>
        <select
          aria-label={`Изменить этап заказа ${order.id}`}
          onChange={(event) => {
            const selectedStatus = statusOptions.find((status) => status.id === event.target.value);
            if (selectedStatus) onStatusChange(order.id, selectedStatus.id);
          }}
          value={order.status}
        >
          {statusOptions.map((status) => <option key={status.id} value={status.id}>{status.title}</option>)}
        </select>
      </label>
    </article>
  );
}
