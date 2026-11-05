import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "light";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const variantClass = variant === "light" ? "button-light" : variant === "outline" ? "button-outline" : "";
  return <button className={`button ${variantClass} ${className}`} {...props} />;
}
