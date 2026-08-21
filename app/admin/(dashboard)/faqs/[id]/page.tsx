import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import FaqForm from "@/components/admin/faqs/FaqForm";
import { updateFaq } from "@/app/admin/(dashboard)/faqs/actions";

export const metadata = { title: "Edit FAQ" };

export default async function EditFaqPage(props: PageProps<"/admin/faqs/[id]">) {
  const { id } = await props.params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  const action = updateFaq.bind(null, faq.id);

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
        <h1 className="text-heading">Edit FAQ</h1>
        <p className="mt-1 text-[14px] text-muted">{faq.question}</p>
      </div>
      <FaqForm faq={faq} action={action} />
    </div>
  );
}
