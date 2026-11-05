"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Dialog({ open, title, onClose, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section aria-labelledby="dialog-title" aria-modal="true" className="dialog-card" role="dialog">
        <div className="dialog-head">
          <h2 id="dialog-title">{title}</h2>
          <button aria-label="Закрыть" className="dialog-close" onClick={onClose} type="button"><X size={17} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}
