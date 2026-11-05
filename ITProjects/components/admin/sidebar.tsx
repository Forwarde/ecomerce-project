"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, Scissors, Users, type LucideIcon } from "lucide-react";
import { LogoutButton } from "./logout-button";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Заказы", icon: ClipboardList },
  { href: "/admin/inventory", label: "Склад тканей", icon: Scissors },
  { href: "/admin/clients", label: "Клиенты", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link aria-label="AtelierFlow — главная" className="brand-mark" href="/"><span className="brand-icon"><Scissors size={18} /></span>AtelierFlow</Link>
      <div className="sidebar-label">Рабочее пространство</div>
      <nav aria-label="Навигация администратора" className="sidebar-links">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link aria-current={active ? "page" : undefined} className={`sidebar-link${active ? " active" : ""}`} href={href} key={href}><Icon size={17} />{label}</Link>;
        })}
        <LogoutButton />
      </nav>
      <div className="sidebar-bottom"><div className="user-chip"><span className="user-avatar">АК</span><span>Алия Касымова<br /><small className="muted">Администратор</small></span></div></div>
    </aside>
  );
}
