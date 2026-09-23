import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase, one } from "@/lib/db";
import type { Testimonial } from "@/lib/db-types";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { updateTestimonial } from "@/app/admin/(dashboard)/testimonials/actions";

export const metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await props.params;
  const testimonial = await one<Testimonial>(
    supabase.from("testimonials").select("*").eq("id", id).maybeSingle()
  );
  if (!testimonial) notFound();

  const action = updateTestimonial.bind(null, testimonial.id);

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
        <h1 className="text-heading">Edit Testimonial</h1>
        <p className="mt-1 text-[14px] text-muted">{testimonial.name}</p>
      </div>
      <TestimonialForm testimonial={testimonial} action={action} />
    </div>
  );
}
