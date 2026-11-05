import type { FormHTMLAttributes } from "react";

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  action: (formData: FormData) => Promise<void>;
};

export function Form({ action, ...props }: FormProps) {
  return <form action={action} {...props} />;
}
