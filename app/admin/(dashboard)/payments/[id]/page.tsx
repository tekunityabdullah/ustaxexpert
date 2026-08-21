import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, Briefcase, Hash, Calendar, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminCard } from "@/components/admin/ui/Card";
import { AdminBadge, paymentStatusTone } from "@/components/admin/ui/Badge";

export const metadata = { title: "Payment Details" };

function formatMoney(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-section text-muted">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold tracking-wide text-muted uppercase">{label}</p>
        <p className="mt-0.5 text-[14px] break-words text-heading">{value}</p>
      </div>
    </div>
  );
}

export default async function AdminPaymentDetailPage(props: PageProps<"/admin/payments/[id]">) {
  const { id } = await props.params;

  let payment;
  try {
    payment = await prisma.payment.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!payment) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
        >
          <ArrowLeft size={14} />
          Back to Payments
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">{payment.customerName}</h1>
          <p className="mt-1 text-[14px] text-muted">{payment.serviceTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-extrabold text-heading">
            {formatMoney(payment.amount, payment.currency)}
          </span>
          <AdminBadge tone={paymentStatusTone(payment.status)}>{payment.status}</AdminBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h3 className="mb-1 text-[15px] font-bold text-heading">Customer</h3>
          <div className="divide-y divide-black/5">
            <DetailRow icon={User} label="Name" value={payment.customerName} />
            <DetailRow icon={Mail} label="Email" value={payment.customerEmail} />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-1 text-[15px] font-bold text-heading">Payment</h3>
          <div className="divide-y divide-black/5">
            <DetailRow icon={Briefcase} label="Service" value={payment.serviceTitle} />
            <DetailRow
              icon={CreditCard}
              label="Amount"
              value={`${formatMoney(payment.amount, payment.currency)} ${payment.currency.toUpperCase()}`}
            />
            <DetailRow icon={Calendar} label="Date & Time" value={formatDate(payment.createdAt)} />
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h3 className="mb-1 text-[15px] font-bold text-heading">Stripe Reference</h3>
          <div className="divide-y divide-black/5">
            <DetailRow icon={Hash} label="Checkout Session ID" value={payment.stripeSessionId} />
            <DetailRow
              icon={Hash}
              label="Payment Intent ID"
              value={payment.stripePaymentIntentId ?? "—"}
            />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
