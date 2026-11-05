"use client";

import { useState } from "react";
import { Plus, Scissors } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FabricTable } from "@/components/admin/fabric-table";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import initialFabrics from "@/data/fabrics.json";
import type { Fabric } from "@/components/admin/types";

export default function InventoryPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>(initialFabrics);
  const [selectedSku, setSelectedSku] = useState(fabrics[0]?.sku ?? "");
  const [meters, setMeters] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  function writeOff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(meters);
    const selected = fabrics.find((fabric) => fabric.sku === selectedSku);
    if (!selected || !Number.isFinite(amount) || amount <= 0) {
      setError("Укажите ткань и корректный метраж больше нуля.");
      return;
    }
    if (amount > selected.meters) {
      setError(`На складе доступно только ${selected.meters} м.`);
      return;
    }
    setFabrics((current) => current.map((fabric) => fabric.sku === selectedSku ? { ...fabric, meters: Math.round((fabric.meters - amount) * 100) / 100 } : fabric));
    setError("");
    setMeters("");
    setDialogOpen(false);
  }

  return (
    <>
      <AdminHeader description="Остатки тканей и управление складом." title="Склад тканей" />
      <div className="toolbar"><span className="muted" style={{ fontSize: 13 }}>{fabrics.length} вида ткани</span><Button onClick={() => setDialogOpen(true)} type="button"><Plus size={16} />Списать ткань</Button></div>
      <FabricTable fabrics={fabrics} />
      <Dialog onClose={() => { setDialogOpen(false); setError(""); }} open={dialogOpen} title="Списать ткань">
        <form onSubmit={writeOff}>
          <div className="form-field"><label htmlFor="fabric-sku">Рулон ткани</label><select className="field-input" id="fabric-sku" onChange={(event) => setSelectedSku(event.target.value)} value={selectedSku}>{fabrics.map((fabric) => <option key={fabric.sku} value={fabric.sku}>{fabric.sku} — {fabric.name} ({fabric.meters} м)</option>)}</select></div>
          <div className="form-field"><label htmlFor="writeoff-meters">Метраж, м</label><input className="field-input" id="writeoff-meters" min="0.01" onChange={(event) => setMeters(event.target.value)} placeholder="Например, 2.5" step="0.01" type="number" value={meters} /></div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <div className="form-footer"><Button type="submit"><Scissors size={16} />Подтвердить списание</Button></div>
        </form>
      </Dialog>
    </>
  );
}
