import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { createTestimonial } from "@/app/admin/(dashboard)/testimonials/actions";

export const metadata = { title: "New Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
      >
        <ArrowLeft size={14} />
        Back to Testimonials
      </Link>
      <div>
        <h1 className="text-heading">New Testimonial</h1>
        <p className="mt-1 text-[14px] text-muted">Add a new client testimonial.</p>
      </div>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
