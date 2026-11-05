import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtelierFlow — ателье нового уровня",
  description: "Индивидуальный пошив одежды и удобное отслеживание заказа.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
