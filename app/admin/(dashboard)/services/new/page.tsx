import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { createService } from "@/app/admin/(dashboard)/services/actions";

export const metadata = { title: "New Service" };

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
      >
        <ArrowLeft size={14} />
        Back to Services
      </Link>
      <div>
        <h1 className="text-heading">New Service</h1>
        <p className="mt-1 text-[14px] text-muted">Add a new service package to the site.</p>
      </div>
      <ServiceForm action={createService} />
    </div>
  );
}
