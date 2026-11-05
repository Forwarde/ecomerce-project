import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-shell"><Sidebar /><main className="admin-main">{children}</main></div>;
}
