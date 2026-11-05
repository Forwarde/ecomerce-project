import { Bell } from "lucide-react";

export function AdminHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="admin-top">
      <div><h1>{title}</h1><p>{description}</p></div>
      <button aria-label="Уведомления" className="avatar-button" type="button"><Bell size={17} /></button>
    </header>
  );
}
