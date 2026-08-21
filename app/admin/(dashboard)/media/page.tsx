import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminCard } from "@/components/admin/ui/Card";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import UploadForm from "@/components/admin/media/UploadForm";
import CopyPathButton from "@/components/admin/media/CopyPathButton";
import { deleteMedia } from "./actions";

export const metadata = { title: "Media Library" };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  let media: Awaited<ReturnType<typeof prisma.media.findMany>> = [];
  let dbError = false;

  try {
    media = await prisma.media.findMany({ orderBy: { uploadedAt: "desc" } });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading">Media Library</h1>
        <p className="mt-1 text-[14px] text-muted">
          Upload images to use as service, blog, or content photos. Copy an image&rsquo;s path to
          paste into the Image Path field on other CMS forms.
        </p>
      </div>

      <AdminCard>
        <UploadForm />
      </AdminCard>

      {dbError ? (
        <AdminEmptyState
          icon={ImageIcon}
          title="Database not connected"
          description="Set the DB_HOST/DB_USER/DB_PASSWORD/DB_NAME env vars and run migrations."
        />
      ) : media.length === 0 ? (
        <AdminEmptyState
          icon={ImageIcon}
          title="No media yet"
          description="Uploaded images will appear here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-black/10 bg-white">
              <div className="relative aspect-square bg-section">
                <Image src={item.url} alt={item.filename} fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-1.5 p-3">
                <p className="truncate text-[13px] font-semibold text-heading" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-[11.5px] text-muted">{formatSize(item.size)}</p>
                <CopyPathButton path={item.url} />
                <form action={deleteMedia} className="pt-1">
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmitButton
                    confirmMessage={`Delete "${item.filename}"? This removes the file permanently.`}
                    size="sm"
                    className="w-full justify-center"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
