import Link from "next/link";
import { MessageSquareQuote, Plus, Pencil } from "lucide-react";
import { supabase, many } from "@/lib/db";
import type { Testimonial } from "@/lib/db-types";
import {
  AdminTable,
  AdminTableHead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/admin/ui/Table";
import { AdminBadge } from "@/components/admin/ui/Badge";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";
import { AdminButtonLink } from "@/components/admin/ui/Button";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteTestimonial, toggleTestimonialPublished } from "./actions";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];
  let dbError = false;

  try {
    testimonials = await many<Testimonial>(
      supabase.from("testimonials").select("*").order("order", { ascending: true })
    );
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">Testimonials</h1>
          <p className="mt-1 text-[14px] text-muted">Manage client testimonials shown on the site.</p>
        </div>
        <AdminButtonLink href="/admin/testimonials/new">
          <Plus size={15} />
          New Testimonial
        </AdminButtonLink>
      </div>

      {dbError ? (
        <AdminEmptyState
          icon={MessageSquareQuote}
          title="Database not connected"
          description="Check SUPABASE_SERVICE_ROLE_KEY in your environment and that the Supabase project is not paused."
        />
      ) : testimonials.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquareQuote}
          title="No testimonials yet"
          description="Add your first client testimonial."
          action={
            <AdminButtonLink href="/admin/testimonials/new" size="sm">
              <Plus size={14} />
              New Testimonial
            </AdminButtonLink>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Name</AdminTh>
            <AdminTh>Quote</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTbody>
            {testimonials.map((testimonial) => (
              <AdminTr key={testimonial.id}>
                <AdminTd className="font-semibold text-heading">{testimonial.name}</AdminTd>
                <AdminTd className="max-w-md truncate text-muted">{testimonial.quote}</AdminTd>
                <AdminTd>
                  <form action={toggleTestimonialPublished}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <button type="submit">
                      <AdminBadge tone={testimonial.published ? "success" : "neutral"}>
                        {testimonial.published ? "Published" : "Draft"}
                      </AdminBadge>
                    </button>
                  </form>
                </AdminTd>
                <AdminTd>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-black/15 text-muted hover:border-navy-900 hover:text-heading"
                      aria-label={`Edit ${testimonial.name}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={testimonial.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Delete testimonial from "${testimonial.name}"? This cannot be undone.`}
                        size="sm"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      )}
    </div>
  );
}
