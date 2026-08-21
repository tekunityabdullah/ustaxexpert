import Link from "next/link";
import { HelpCircle, Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
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
import { deleteFaq, toggleFaqPublished } from "./actions";

export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  let faqs: Awaited<ReturnType<typeof prisma.faq.findMany>> = [];
  let dbError = false;

  try {
    faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">FAQs</h1>
          <p className="mt-1 text-[14px] text-muted">Manage frequently asked questions.</p>
        </div>
        <AdminButtonLink href="/admin/faqs/new">
          <Plus size={15} />
          New FAQ
        </AdminButtonLink>
      </div>

      {dbError ? (
        <AdminEmptyState
          icon={HelpCircle}
          title="Database not connected"
          description="Set DATABASE_URL in your server environment and run migrations."
        />
      ) : faqs.length === 0 ? (
        <AdminEmptyState
          icon={HelpCircle}
          title="No FAQs yet"
          description="Add your first frequently asked question."
          action={
            <AdminButtonLink href="/admin/faqs/new" size="sm">
              <Plus size={14} />
              New FAQ
            </AdminButtonLink>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Question</AdminTh>
            <AdminTh>Category</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTbody>
            {faqs.map((faq) => (
              <AdminTr key={faq.id}>
                <AdminTd className="max-w-md font-semibold text-heading">{faq.question}</AdminTd>
                <AdminTd className="text-muted">{faq.category}</AdminTd>
                <AdminTd>
                  <form action={toggleFaqPublished}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button type="submit">
                      <AdminBadge tone={faq.published ? "success" : "neutral"}>
                        {faq.published ? "Published" : "Draft"}
                      </AdminBadge>
                    </button>
                  </form>
                </AdminTd>
                <AdminTd>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-black/15 text-muted hover:border-navy-900 hover:text-heading"
                      aria-label={`Edit ${faq.question}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteFaq}>
                      <input type="hidden" name="id" value={faq.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Delete this FAQ? This cannot be undone.`}
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
