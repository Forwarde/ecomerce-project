"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email !== "admin@atelier.kz" || password !== "admin123") {
    redirect("/login?error=invalid");
  }

  cookies().set("auth-token", "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  cookies().set("auth-token", "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
  redirect("/login");
}
