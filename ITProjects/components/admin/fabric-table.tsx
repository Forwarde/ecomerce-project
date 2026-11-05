import type { Fabric } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function FabricTable({ fabrics }: { fabrics: Fabric[] }) {
  return (
    <section aria-label="Остатки тканей" className="panel table-wrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Артикул</TableHead>
            <TableHead scope="col">Название</TableHead>
            <TableHead scope="col">Категория</TableHead>
            <TableHead scope="col">Цвет</TableHead>
            <TableHead scope="col">Метраж</TableHead>
            <TableHead scope="col">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fabrics.map((fabric) => (
            <TableRow key={fabric.sku}>
              <TableCell>{fabric.sku}</TableCell>
              <TableCell><strong>{fabric.name}</strong></TableCell>
              <TableCell>{fabric.category}</TableCell>
              <TableCell>{fabric.color}</TableCell>
              <TableCell>{fabric.meters.toLocaleString("ru-RU")} м</TableCell>
              <TableCell>
                <span className={`badge${fabric.meters < 10 ? " badge-low" : ""}`}>
                  {fabric.meters < 10 ? "Заканчивается" : "В наличии"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
