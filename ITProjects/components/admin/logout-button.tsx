"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export function LogoutButton() {
  return (
    <Form action={logout} className="logout-form">
      <Button aria-label="Выйти из аккаунта" className="sidebar-logout" type="submit">
        <LogOut aria-hidden="true" size={17} />
        Выйти
      </Button>
    </Form>
  );
}
