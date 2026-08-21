"use client";

import { useState, type FormEvent } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import type { Service } from "@/lib/services";
import { siteConfig, BASE_PATH } from "@/lib/site-config";
import CtaButton from "@/components/ui/CtaButton";

type FormState = {
  service: string;
  name: string;
  email: string;
  amount: string;
};

const initialState: FormState = { service: "", name: "", email: "", amount: "" };

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function PaymentForm({ services }: { services: Service[] }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitError(null);
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.service) nextErrors.service = "Please select a service.";
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!isValidEmail(form.email)) nextErrors.email = "Please enter a valid email address.";
    const amountNum = Number(form.amount);
    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      nextErrors.amount = "Please enter the amount you'd like to pay.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${BASE_PATH}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: form.service,
          name: form.name,
          email: form.email,
          amount: form.amount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  const tollFree = siteConfig.phones.find((p) => p.type === "Toll-Free") ?? siteConfig.phones[0];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-heading">
          Which service is this payment for?
        </label>
        <select
          id="service"
          value={form.service}
          onChange={(e) => updateField("service", e.target.value)}
          aria-invalid={Boolean(errors.service)}
          className="w-full border border-black/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-navy-800"
        >
          <option value="">Select a service&hellip;</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-heading">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="w-full border border-black/15 px-4 py-3 text-[15px] outline-none focus:border-navy-800"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-heading">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="w-full border border-black/15 px-4 py-3 text-[15px] outline-none focus:border-navy-800"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm font-semibold text-heading">
          Amount You&rsquo;d Like to Pay
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] text-muted">
            $
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => updateField("amount", e.target.value)}
            aria-invalid={Boolean(errors.amount)}
            className="w-full border border-black/15 py-3 pr-4 pl-8 text-[15px] outline-none focus:border-navy-800"
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        <p className="mt-1.5 text-xs text-muted">
          This is the exact amount you&rsquo;ll be charged on the next screen.
        </p>
      </div>

      {submitError && (
        <div className="rounded-lg bg-section p-5 text-sm text-body">
          {submitError} If this keeps happening, call us at{" "}
          <a href={tollFree.href} className="font-semibold text-navy-900 hover:text-gold-600">
            {tollFree.label}
          </a>{" "}
          or{" "}
          <a href="/contact-us" className="font-semibold text-navy-900 hover:text-gold-600">
            contact us
          </a>
          .
        </div>
      )}

      <CtaButton type="submit" disabled={submitting} className="w-full">
        {submitting ? "Redirecting to Checkout..." : "Continue to Secure Payment"}
      </CtaButton>

      <p className="flex items-center justify-center gap-2 text-xs text-muted">
        <Lock size={13} className="text-gold-600" />
        Payments are processed securely by Stripe.
        <ShieldCheck size={13} className="text-gold-600" />
      </p>
    </form>
  );
}
