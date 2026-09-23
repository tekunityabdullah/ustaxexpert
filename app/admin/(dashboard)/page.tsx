import Link from "next/link";
import { CreditCard, Clock, Briefcase, Newspaper, TrendingUp } from "lucide-react";
import { supabase, many, countOf } from "@/lib/db";
import type { Payment } from "@/lib/db-types";
import RevenueChart, { type RevenueChartPoint } from "@/components/admin/dashboard/RevenueChart";
import ActivityFeed, { type ActivityItem } from "@/components/admin/dashboard/ActivityFeed";

type RecentActivity = {
  id: string;
  action: string;
  entityType: string;
  entityLabel: string;
  createdAt: Date;
  adminUser: { name: string } | null;
};
import { AdminCard, AdminStat } from "@/components/admin/ui/Card";
import { AdminBadge, paymentStatusTone } from "@/components/admin/ui/Badge";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Dashboard" };

const TREND_DAYS = 14;

function formatMoney(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
}

function buildRevenueTrend(payments: { amount: number; createdAt: Date }[]): RevenueChartPoint[] {
  const days: RevenueChartPoint[] = [];
  const totalsByDay = new Map<string, number>();

  for (const payment of payments) {
    const key = payment.createdAt.toISOString().slice(0, 10);
    totalsByDay.set(key, (totalsByDay.get(key) ?? 0) + payment.amount);
  }

  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    days.push({
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullLabel: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      value: totalsByDay.get(key) ?? 0,
    });
  }

  return days;
}

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const trendStart = new Date();
  trendStart.setHours(0, 0, 0, 0);
  trendStart.setDate(trendStart.getDate() - (TREND_DAYS - 1));

  let stats;
  let recentPayments: Payment[] = [];
  let recentActivity: RecentActivity[] = [];
  let revenueTrend: RevenueChartPoint[] = [];
  let dbError = false;

  try {
    const [paidAmounts, paidThisMonth, pendingCount, servicesCount, postsCount, payments, activity, trendPayments] =
      await Promise.all([
        many<{ amount: number }>(supabase.from("payments").select("amount").eq("status", "PAID")),
        countOf(
          supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("status", "PAID")
            .gte("createdAt", startOfMonth.toISOString())
        ),
        countOf(supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "PENDING")),
        countOf(supabase.from("services").select("*", { count: "exact", head: true }).eq("published", true)),
        countOf(supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true)),
        many<Payment>(supabase.from("payments").select("*").order("createdAt", { ascending: false }).limit(6)),
        many<RecentActivity>(
          supabase
            .from("activity_log")
            .select("*, adminUser:admin_users(name)")
            .order("createdAt", { ascending: false })
            .limit(8)
        ),
        many<{ amount: number; createdAt: Date }>(
          supabase
            .from("payments")
            .select("amount, createdAt")
            .eq("status", "PAID")
            .gte("createdAt", trendStart.toISOString())
        ),
      ]);

    stats = {
      totalRevenue: paidAmounts.reduce((sum, p) => sum + p.amount, 0),
      paidThisMonth,
      pendingCount,
      servicesCount,
      postsCount,
    };
    recentPayments = payments;
    recentActivity = activity;
    revenueTrend = buildRevenueTrend(trendPayments);
  } catch {
    dbError = true;
  }

  if (dbError || !stats) {
    return (
      <AdminEmptyState
        icon={CreditCard}
        title="Database not connected"
        description="Check SUPABASE_SERVICE_ROLE_KEY in your environment and that the Supabase project is not paused to start using the dashboard."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading">Dashboard</h1>
        <p className="mt-1 text-[14px] text-muted">An overview of payments and site activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStat label="Total Revenue" value={formatMoney(stats.totalRevenue)} hint="All-time, paid" />
        <AdminStat label="Paid This Month" value={String(stats.paidThisMonth)} hint="Completed payments" />
        <AdminStat label="Pending Payments" value={String(stats.pendingCount)} hint="Awaiting confirmation" />
        <AdminStat
          label="Published Content"
          value={`${stats.servicesCount + stats.postsCount}`}
          hint={`${stats.servicesCount} services, ${stats.postsCount} posts`}
        />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-[16px] font-bold text-heading">
              <TrendingUp size={16} className="text-navy-900/60" />
              Revenue — Last 14 Days
            </h3>
            <p className="mt-0.5 text-[12.5px] text-muted">Hover a bar for that day&rsquo;s total.</p>
          </div>
        </div>
        <RevenueChart data={revenueTrend} />
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-heading">Recent Payments</h3>
            <Link href="/admin/payments" className="text-[13px] font-semibold text-navy-900 hover:underline">
              View all
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <AdminEmptyState
              icon={CreditCard}
              title="No payments yet"
              description="Payments will appear here once customers complete checkout."
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
              <ul className="divide-y divide-black/5">
                {recentPayments.map((payment) => (
                  <li key={payment.id}>
                    <Link
                      href={`/admin/payments/${payment.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-section/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-heading">
                          {payment.customerName}
                        </p>
                        <p className="truncate text-[12.5px] text-muted">{payment.serviceTitle}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-[14px] font-semibold text-heading">
                          {formatMoney(payment.amount, payment.currency)}
                        </span>
                        <AdminBadge tone={paymentStatusTone(payment.status)}>{payment.status}</AdminBadge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-[16px] font-bold text-heading">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <AdminEmptyState
              icon={Clock}
              title="No activity yet"
              description="Admin actions (logins, edits) will show up here."
            />
          ) : (
            <ActivityFeed
              items={recentActivity.map((item) => ({
                id: item.id,
                action: item.action,
                entityType: item.entityType,
                entityLabel: item.entityLabel,
                adminUserName: item.adminUser?.name ?? null,
                createdAt: item.createdAt.toISOString(),
              }))}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/services"
          className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4 hover:border-navy-900/30"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-section text-navy-900">
            <Briefcase size={18} />
          </span>
          <span className="text-[14px] font-semibold text-heading">Manage Services</span>
        </Link>
        <Link
          href="/admin/blog"
          className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4 hover:border-navy-900/30"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-section text-navy-900">
            <Newspaper size={18} />
          </span>
          <span className="text-[14px] font-semibold text-heading">Manage Blog</span>
        </Link>
      </div>
    </div>
  );
}
