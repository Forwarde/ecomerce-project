import Link from "next/link";
import { Scissors } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type LoginPageProps = {
  searchParams: {
    error?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  if (cookies().has("auth-token")) redirect("/admin");

  return (
    <main className="login-page">
      <Link aria-label="AtelierFlow — главная" className="brand-mark login-brand" href="/">
        <span className="brand-icon"><Scissors size={18} /></span>
        AtelierFlow
      </Link>
      <Card className="login-card">
        <div className="login-heading">
          <span className="eyebrow eyebrow-dark">Рабочее пространство</span>
          <h1>Вход в ателье</h1>
          <p>Войдите, чтобы управлять заказами и клиентами.</p>
        </div>
        <Form action={login} className="login-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <Input autoComplete="username" id="email" name="email" placeholder="admin@atelier.kz" required type="email" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <Input autoComplete="current-password" id="password" name="password" placeholder="Введите пароль" required type="password" />
          </div>
          {searchParams.error === "invalid" && (
            <p className="login-error" role="alert">Неверный email или пароль. Проверьте данные и попробуйте снова.</p>
          )}
          <Button className="login-submit" type="submit">Войти</Button>
        </Form>
      </Card>
    </main>
  );
}
