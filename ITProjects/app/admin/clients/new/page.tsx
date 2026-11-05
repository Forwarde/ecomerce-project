"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

const measurementSchema = z.object({
  name: z.string().trim().min(2, "Введите имя (не менее 2 символов).").max(80, "Имя слишком длинное."),
  phone: z.string().trim().regex(/^\+?[0-9\s()-]{10,18}$/, "Введите корректный номер телефона."),
  sleeveLength: z.coerce.number().min(30, "Минимум 30 см.").max(100, "Максимум 100 см."),
  chest: z.coerce.number().min(50, "Минимум 50 см.").max(180, "Максимум 180 см."),
});

type MeasurementForm = z.infer<typeof measurementSchema>;

export default function NewClientPage() {
  const [saved, setSaved] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MeasurementForm>({
    resolver: zodResolver(measurementSchema),
    defaultValues: { name: "", phone: "", sleeveLength: undefined, chest: undefined },
  });

  const onSubmit = (values: MeasurementForm) => {
    setSaved(`Профиль клиента «${values.name}» сохранён. (Демо: данные не отправляются на сервер.)`);
  };

  return (
    <>
      <AdminHeader description="Заполните контакты и основные мерки клиента." title="Новый профиль клиента" />
      <section className="panel form-panel">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="client-name">Имя клиента</label><input autoComplete="name" className="field-input" id="client-name" placeholder="Например, Анна Смирнова" {...register("name")} />{errors.name && <span className="field-error">{errors.name.message}</span>}</div>
            <div className="form-field"><label htmlFor="client-phone">Телефон</label><input autoComplete="tel" className="field-input" id="client-phone" placeholder="+7 701 234 56 78" {...register("phone")} />{errors.phone && <span className="field-error">{errors.phone.message}</span>}</div>
            <div className="form-field"><label htmlFor="sleeve-length">Длина рукава, см</label><input className="field-input" id="sleeve-length" max="100" min="30" placeholder="Например, 62" type="number" {...register("sleeveLength")} />{errors.sleeveLength && <span className="field-error">{errors.sleeveLength.message}</span>}</div>
            <div className="form-field"><label htmlFor="chest">Обхват груди, см</label><input className="field-input" id="chest" max="180" min="50" placeholder="Например, 92" type="number" {...register("chest")} />{errors.chest && <span className="field-error">{errors.chest.message}</span>}</div>
          </div>
          <div className="form-footer"><Button disabled={isSubmitting} type="submit">{isSubmitting ? "Сохранение..." : "Сохранить профиль"}</Button>{saved && <span aria-live="polite" className="success-message">{saved}</span>}</div>
        </form>
      </section>
    </>
  );
}
