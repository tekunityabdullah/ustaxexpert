import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { updateService } from "@/app/admin/(dashboard)/services/actions";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage(props: PageProps<"/admin/services/[id]">) {
  const { id } = await props.params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  const action = updateService.bind(null, service.id);

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
        <h1 className="text-heading">Edit Service</h1>
        <p className="mt-1 text-[14px] text-muted">{service.title}</p>
      </div>
      <ServiceForm service={service} action={action} />
    </div>
  );
}
