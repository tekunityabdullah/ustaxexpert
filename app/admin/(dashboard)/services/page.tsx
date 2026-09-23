import Link from "next/link";
import { Briefcase, Plus, Pencil } from "lucide-react";
import { supabase, many } from "@/lib/db";
import type { Service } from "@/lib/db-types";
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
import { deleteService, toggleServicePublished } from "./actions";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  let services: Service[] = [];
  let dbError = false;

  try {
    services = await many<Service>(supabase.from("services").select("*").order("order", { ascending: true }));
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">Services</h1>
          <p className="mt-1 text-[14px] text-muted">Manage the service packages shown on the site.</p>
        </div>
        <AdminButtonLink href="/admin/services/new">
          <Plus size={15} />
          New Service
        </AdminButtonLink>
      </div>

      {dbError ? (
        <AdminEmptyState
          icon={Briefcase}
          title="Database not connected"
          description="Check SUPABASE_SERVICE_ROLE_KEY in your environment and that the Supabase project is not paused."
        />
      ) : services.length === 0 ? (
        <AdminEmptyState
          icon={Briefcase}
          title="No services yet"
          description="Add your first service package to get started."
          action={
            <AdminButtonLink href="/admin/services/new" size="sm">
              <Plus size={14} />
              New Service
            </AdminButtonLink>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Order</AdminTh>
            <AdminTh>Title</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTbody>
            {services.map((service) => (
              <AdminTr key={service.id}>
                <AdminTd className="text-muted">{service.order}</AdminTd>
                <AdminTd className="font-semibold text-heading">{service.title}</AdminTd>
                <AdminTd className="text-muted">{service.slug}</AdminTd>
                <AdminTd>
                  <form action={toggleServicePublished}>
                    <input type="hidden" name="id" value={service.id} />
                    <button type="submit">
                      <AdminBadge tone={service.published ? "success" : "neutral"}>
                        {service.published ? "Published" : "Draft"}
                      </AdminBadge>
                    </button>
                  </form>
                </AdminTd>
                <AdminTd>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-black/15 text-muted hover:border-navy-900 hover:text-heading"
                      aria-label={`Edit ${service.title}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={service.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Delete "${service.title}"? This cannot be undone.`}
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
