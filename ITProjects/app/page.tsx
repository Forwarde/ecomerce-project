"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Ruler, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleOrders = {
  "AF-1048": { client: "Анна", status: "Пошив", progress: 58, message: "Ваш костюм уже в работе" },
  "AF-1051": { client: "Данияр", status: "Готов", progress: 84, message: "Заказ готов к примерке" },
};

const services = [
  { title: "Пошив на заказ", text: "Создаём одежду по вашим меркам — от первой встречи до идеальной посадки.", icon: Scissors },
  { title: "Ремонт одежды", text: "Бережно обновляем любимые вещи: посадка, подгонка и аккуратный ремонт.", icon: Sparkles },
  { title: "Снятие мерок", text: "Точные мерки и консультация мастера — основа вещи, которая сидит безупречно.", icon: Ruler },
];

export default function HomePage() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const order = sampleOrders[orderId.trim().toUpperCase() as keyof typeof sampleOrders];

  return (
    <main className="public-shell">
      <nav aria-label="Основная навигация" className="public-nav">
        <Link className="brand-mark" href="/"><span className="brand-icon"><Scissors size={18} /></span>AtelierFlow</Link>
        <div className="public-links"><a href="#services">Услуги</a><a href="#tracking">Мой заказ</a><Link className="button" href="/admin">Кабинет ателье <ArrowRight size={15} /></Link></div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">Ателье индивидуального пошива · Алматы</div>
            <h1>Одежда, созданная именно для вас</h1>
            <p className="hero-copy">Точный крой, благородные ткани и внимание к каждой детали. Вещи, в которых вы чувствуете себя собой.</p>
            <div className="hero-actions"><a className="button button-light" href="mailto:hello@atelierflow.kz">Оставить заявку <ArrowRight size={16} /></a><a className="button button-outline" href="#services">Наши услуги</a></div>
          </div>
          <div aria-label="Премиальная ткань и образец работы ателье" className="hero-art" role="img"><div className="fabric-note"><small>Индивидуальный пошив</small><strong>Посадка, которую вы почувствуете</strong></div></div>
        </div>
      </section>

      <section className="section-wrap" id="services">
        <div className="section-heading"><span className="eyebrow eyebrow-dark">Наши услуги</span><h2>Продумано до последнего стежка</h2><p>Мастерская, где мастерство портного встречается с заботой о вашем времени.</p></div>
        <div className="service-grid">{services.map(({ title, text, icon: Icon }) => <article className="service-card" key={title}><Icon aria-hidden="true" size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="tracking" id="tracking">
        <div className="section-wrap">
          <div className="section-heading"><span className="eyebrow">Всегда в курсе</span><h2>Как продвигается ваш заказ?</h2><p>Введите номер заказа — покажем, на каком этапе работа. Например: AF-1048.</p></div>
          <div className="tracking-card">
            <form className="tracking-form" onSubmit={(event) => { event.preventDefault(); setSearched(true); }}>
              <label className="sr-only" htmlFor="order-id">Номер заказа</label>
              <input autoComplete="off" id="order-id" onChange={(event) => { setOrderId(event.target.value); setSearched(false); }} placeholder="Например, AF-1048" value={orderId} />
              <Button type="submit">Проверить</Button>
            </form>
            {searched && (order ? <div aria-live="polite" className="tracking-result"><strong>{order.message}</strong><p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>Заказ {orderId.trim().toUpperCase()} · {order.client} · Этап: {order.status}</p><div aria-label={`Выполнено ${order.progress}%`} className="progress-track" role="progressbar" aria-valuenow={order.progress} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${order.progress}%` }} /></div><div className="progress-labels"><span>Принят</span><span>Крой</span><span>Пошив</span><span>Готов</span></div></div> : <p aria-live="polite" className="muted" style={{ margin: "17px 0 0", fontSize: 13 }}>Заказ не найден. Проверьте номер или свяжитесь с ателье.</p>)}
          </div>
        </div>
      </section>

      <footer className="site-footer"><span>© 2026 AtelierFlow. Сделано с заботой.</span><span><Check aria-hidden="true" size={14} /> Алматы · По предварительной записи</span></footer>
    </main>
  );
}
