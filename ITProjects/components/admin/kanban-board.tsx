"use client";

import { useState } from "react";
import ordersData from "@/data/orders.json";
import type { Order, OrderStatus } from "./types";
import { OrderCard } from "./order-card";

const columns: { id: OrderStatus; title: string }[] = [
  { id: "new", title: "Новый" },
  { id: "cutting", title: "Крой" },
  { id: "sewing", title: "Пошив" },
  { id: "ready", title: "Готов" },
  { id: "issued", title: "Выдан" },
];

function loadOrders(): Order[] {
  return ordersData.map((order) => {
    const status = columns.find((column) => column.id === order.status);
    if (!status) throw new Error(`Неизвестный статус заказа ${order.id}: ${order.status}`);
    return { ...order, status: status.id };
  });
}

export function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<OrderStatus | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function moveOrder(orderId: string | null, status: OrderStatus) {
    if (!orderId) {
      setHoveredColumn(null);
      return;
    }
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status === status) {
      setDraggedOrderId(null);
      setHoveredColumn(null);
      return;
    }

    setOrders((current) => current.map((item) => item.id === orderId ? { ...item, status } : item));
    const statusTitle = columns.find((column) => column.id === status)?.title ?? status;
    setAnnouncement(`Заказ ${order.id} перемещён в этап «${statusTitle}».`);
    setDraggedOrderId(null);
    setHoveredColumn(null);
  }

  return (
    <>
      <p aria-live="polite" className="sr-only">{announcement}</p>
      <div aria-label="Канбан-доска заказов" className="kanban-scroll">
        <div className="kanban-board">
          {columns.map((column) => {
            const columnOrders = orders.filter((order) => order.status === column.id);
            return (
              <section
                aria-label={`${column.title}, ${columnOrders.length} заказов`}
                className={`kanban-column${hoveredColumn === column.id ? " is-over" : ""}`}
                key={column.id}
                onDragOver={(event) => { event.preventDefault(); setHoveredColumn(column.id); }}
                onDragLeave={() => setHoveredColumn(null)}
                onDrop={(event) => { event.preventDefault(); moveOrder(draggedOrderId, column.id); }}
              >
                <div className="kanban-column-head"><span>{column.title}</span><span className="kanban-count">{columnOrders.length}</span></div>
                {columnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    onDragEnd={() => {
                      setDraggedOrderId(null);
                      setHoveredColumn(null);
                    }}
                    onDragStart={setDraggedOrderId}
                    onStatusChange={moveOrder}
                    order={order}
                    statusOptions={columns}
                  />
                ))}
                {columnOrders.length === 0 && <p className="muted" style={{ fontSize: 12, padding: "8px 3px" }}>Перетащите заказ сюда</p>}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
