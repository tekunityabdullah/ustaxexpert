import Link from "next/link";
import { CreditCard, Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  AdminTable,
  AdminTableHead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/admin/ui/Table";
import { AdminBadge, paymentStatusTone } from "@/components/admin/ui/Badge";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";
import { AdminPagination } from "@/components/admin/ui/Pagination";
import { AdminInput, AdminSelect } from "@/components/admin/ui/Field";

export const metadata = { title: "Payments" };

const PAGE_SIZE = 15;
const STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
const SORTS = {
  newest: { createdAt: "desc" } as Prisma.PaymentOrderByWithRelationInput,
  oldest: { createdAt: "asc" } as Prisma.PaymentOrderByWithRelationInput,
  amount_desc: { amount: "desc" } as Prisma.PaymentOrderByWithRelationInput,
  amount_asc: { amount: "asc" } as Prisma.PaymentOrderByWithRelationInput,
};

function formatMoney(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminPaymentsPage(props: PageProps<"/admin/payments">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status =
    typeof sp.status === "string" && (STATUSES as readonly string[]).includes(sp.status)
      ? sp.status
      : "";
  const sortKey = typeof sp.sort === "string" && sp.sort in SORTS ? sp.sort : "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.PaymentWhereInput = {
    ...(status ? { status: status as (typeof STATUSES)[number] } : {}),
    ...(q
      ? {
          OR: [
            { customerName: { contains: q } },
            { customerEmail: { contains: q } },
            { serviceTitle: { contains: q } },
            { stripeSessionId: { contains: q } },
          ],
        }
      : {}),
  };

  function buildHref(overrides: Record<string, string | number>) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (sortKey !== "newest") params.set("sort", sortKey);
    if (page !== 1) params.set("page", String(page));
    for (const [key, value] of Object.entries(overrides)) {
      if (value === "" || value === 1) params.delete(key);
      else params.set(key, String(value));
    }
    const qs = params.toString();
    return `/admin/payments${qs ? `?${qs}` : ""}`;
  }

  let payments: Awaited<ReturnType<typeof prisma.payment.findMany>> = [];
  let total = 0;
  let dbError = false;

  try {
    [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: SORTS[sortKey as keyof typeof SORTS],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.payment.count({ where }),
    ]);
  } catch {
    dbError = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading">Payments</h1>
        <p className="mt-1 text-[14px] text-muted">
          {dbError ? "Database not connected." : `${total} payment${total === 1 ? "" : "s"} total`}
        </p>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" action="/admin/payments">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <AdminInput
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, service, or session ID"
            className="pl-9"
          />
        </div>
        <AdminSelect name="status" defaultValue={status} className="sm:w-44">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect name="sort" defaultValue={sortKey} className="sm:w-48">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_desc">Amount: high to low</option>
          <option value="amount_asc">Amount: low to high</option>
        </AdminSelect>
      </form>

      {dbError ? (
        <AdminEmptyState
          icon={CreditCard}
          title="Database not connected"
          description="Set the DB_HOST/DB_USER/DB_PASSWORD/DB_NAME env vars and run migrations."
        />
      ) : payments.length === 0 ? (
        <AdminEmptyState
          icon={CreditCard}
          title={q || status ? "No matching payments" : "No payments yet"}
          description={
            q || status
              ? "Try a different search term or clear the filters."
              : "Payments will appear here once customers complete checkout."
          }
        />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Service</AdminTh>
              <AdminTh>Amount</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Date</AdminTh>
            </AdminTableHead>
            <AdminTbody>
              {payments.map((payment) => (
                <AdminTr key={payment.id} className="cursor-pointer">
                  <AdminTd>
                    <Link href={`/admin/payments/${payment.id}`} className="block">
                      <p className="font-semibold text-heading">{payment.customerName}</p>
                      <p className="text-[12.5px] text-muted">{payment.customerEmail}</p>
                    </Link>
                  </AdminTd>
                  <AdminTd>
                    <Link href={`/admin/payments/${payment.id}`}>{payment.serviceTitle}</Link>
                  </AdminTd>
                  <AdminTd>
                    <Link href={`/admin/payments/${payment.id}`} className="font-semibold text-heading">
                      {formatMoney(payment.amount, payment.currency)}
                    </Link>
                  </AdminTd>
                  <AdminTd>
                    <Link href={`/admin/payments/${payment.id}`}>
                      <AdminBadge tone={paymentStatusTone(payment.status)}>{payment.status}</AdminBadge>
                    </Link>
                  </AdminTd>
                  <AdminTd>
                    <Link href={`/admin/payments/${payment.id}`} className="text-[13px] text-muted">
                      {formatDate(payment.createdAt)}
                    </Link>
                  </AdminTd>
                </AdminTr>
              ))}
            </AdminTbody>
          </AdminTable>
          <AdminPagination page={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: p })} />
        </>
      )}
    </div>
  );
}
