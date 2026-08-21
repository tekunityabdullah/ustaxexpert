import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FaqForm from "@/components/admin/faqs/FaqForm";
import { createFaq } from "@/app/admin/(dashboard)/faqs/actions";

export const metadata = { title: "New FAQ" };

export default function NewFaqPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
      >
        <ArrowLeft size={14} />
        Back to FAQs
      </Link>
      <div>
        <h1 className="text-heading">New FAQ</h1>
        <p className="mt-1 text-[14px] text-muted">Add a new frequently asked question.</p>
      </div>
      <FaqForm action={createFaq} />
    </div>
  );
}
