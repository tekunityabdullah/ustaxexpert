"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import type { Service } from "@/lib/services";
import { integrations } from "@/lib/site-config";
import CtaButton from "@/components/ui/CtaButton";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

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

// reCAPTCHA only renders once NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set (see
// .env.example) — no fake/placeholder checkbox is shown before then.
const RECAPTCHA_ENABLED = Boolean(integrations.recaptchaSiteKey);

export default function ContactForm({ services }: { services: Service[] }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>> & { recaptcha?: string }
  >({});
  const [status, setStatus] = useState<Status>("idle");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!RECAPTCHA_ENABLED || !recaptchaReady || !recaptchaRef.current) return;
    if (widgetId.current !== null) return;
    if (!window.grecaptcha) return;

    widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
      sitekey: integrations.recaptchaSiteKey,
      callback: (token) => setRecaptchaToken(token),
      "expired-callback": () => setRecaptchaToken(""),
    });
  }, [recaptchaReady]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> & { recaptcha?: string } = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!isValidEmail(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!form.message.trim()) nextErrors.message = "Please tell us a bit about your situation.";

    if (RECAPTCHA_ENABLED && !recaptchaToken) {
      nextErrors.recaptcha = "Please complete the reCAPTCHA verification.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      if (integrations.formEndpoint) {
        const payload = new FormData();
        payload.set("name", form.name);
        payload.set("email", form.email);
        payload.set("phone", form.phone);
        payload.set("service", form.service);
        payload.set("message", form.message);
        if (RECAPTCHA_ENABLED) payload.set("g-recaptcha-response", recaptchaToken);

        const res = await fetch(integrations.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload,
        });
        if (!res.ok) throw new Error(`Form submission failed with status ${res.status}`);
      } else {
        // NEXT_PUBLIC_FORM_ENDPOINT isn't configured yet — see .env.example.
        // Submission is not sent anywhere until a form-backend URL is set.
        console.warn(
          "ContactForm: NEXT_PUBLIC_FORM_ENDPOINT is not set, so this submission was not sent anywhere."
        );
      }

      setStatus("success");
      setForm(initialState);
      setRecaptchaToken("");
      if (RECAPTCHA_ENABLED && window.grecaptcha && widgetId.current !== null) {
        window.grecaptcha.reset(widgetId.current);
      }
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
      {RECAPTCHA_ENABLED && (
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="lazyOnload"
          onReady={() => setRecaptchaReady(true)}
        />
      )}

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

      {RECAPTCHA_ENABLED && (
        <div>
          <div ref={recaptchaRef} />
          {errors.recaptcha && <p className="mt-1 text-sm text-red-600">{errors.recaptcha}</p>}
        </div>
      )}

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
