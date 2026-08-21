"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { UploadCloud } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/Button";
import { uploadMedia } from "@/app/admin/(dashboard)/media/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <UploadCloud size={14} />
      {pending ? "Uploading..." : "Upload"}
    </AdminButton>
  );
}

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await uploadMedia(prevState as never, formData);
    if (!result?.error) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="file"
        name="file"
        required
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="flex-1 text-[13.5px] text-body file:mr-3 file:rounded-md file:border file:border-black/15 file:bg-white file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-heading"
      />
      <SubmitButton />
      {state?.error && <p className="text-[13px] text-red-600">{state.error}</p>}
    </form>
  );
}
