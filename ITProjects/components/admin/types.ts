export type OrderStatus = "new" | "cutting" | "sewing" | "ready" | "issued";

export type Order = {
  id: string;
  client: string;
  item: string;
  price: number;
  status: OrderStatus;
  dueDate: string;
};

export type Fabric = {
  sku: string;
  name: string;
  category: string;
  meters: number;
  color: string;
};
