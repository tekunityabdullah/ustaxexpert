"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/lib/services";
import CtaButton from "@/components/ui/CtaButton";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!isValidEmail(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!form.message.trim()) nextErrors.message = "Please tell us a bit about your situation.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-section p-8 text-center">
        <h4 className="mb-2">Thank you for reaching out.</h4>
        <p className="text-body">
          A member of our team will contact you shortly to discuss your
          situation and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-heading">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full border border-black/15 px-4 py-3 text-[15px] outline-none focus:border-navy-800"
          />
        </div>

        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-heading">
            Service Needed
          </label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => updateField("service", e.target.value)}
            className="w-full border border-black/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-navy-800"
          >
            <option value="">General Inquiry</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-heading">
          How can we help?
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          className="w-full border border-black/15 px-4 py-3 text-[15px] outline-none focus:border-navy-800"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending your message. Please try again or call
          us directly.
        </p>
      )}

      <CtaButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </CtaButton>
    </form>
  );
}
