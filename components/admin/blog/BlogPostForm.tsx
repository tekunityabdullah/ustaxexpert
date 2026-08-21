"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import RichTextEditor from "@/components/admin/blog/RichTextEditor";
import type { BlogPost } from "@prisma/client";
import type { ActionState } from "@/lib/admin-form";
import { isLegacyBlockContent, blockArrayToHtml } from "@/lib/blog-content";

const ICONS = ["Mail", "LifeBuoy", "TrendingUp", "Calculator"];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <Save size={14} />
      {pending ? "Saving..." : label}
    </AdminButton>
  );
}

function toDateInputValue(date?: Date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
}

export default function BlogPostForm({
  post,
  action,
}: {
  post?: BlogPost;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  const initialContent = post
    ? isLegacyBlockContent(post.content)
      ? blockArrayToHtml(post.content)
      : ((post.content as string | null) ?? "")
    : "";

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {state.error}
        </div>
      )}

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Basics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Title" htmlFor="title">
            <AdminInput id="title" name="title" defaultValue={post?.title} required />
          </AdminFormField>
          <AdminFormField
            label="Slug"
            htmlFor="slug"
            hint="Used in the URL. Leave blank to auto-generate from title (create only)."
          >
            <AdminInput id="slug" name="slug" defaultValue={post?.slug} placeholder="auto-generated" />
          </AdminFormField>
        </div>
        <AdminFormField label="Excerpt" htmlFor="excerpt">
          <AdminTextarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} required />
        </AdminFormField>
        <AdminFormField
          label="Content"
          htmlFor="content"
          hint="Use the toolbar to format text, change fonts, add headings/lists/links, and insert icons."
        >
          <RichTextEditor name="content" defaultValue={initialContent} />
        </AdminFormField>
      </AdminCard>

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Metadata</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Category" htmlFor="category">
            <AdminInput id="category" name="category" defaultValue={post?.category} required />
          </AdminFormField>
          <AdminFormField label="Icon" htmlFor="icon">
            <AdminSelect id="icon" name="icon" defaultValue={post?.icon ?? "Mail"}>
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </AdminSelect>
          </AdminFormField>
          <AdminFormField label="Read Time" htmlFor="readTime">
            <AdminInput
              id="readTime"
              name="readTime"
              defaultValue={post?.readTime ?? "3 min read"}
              placeholder="3 min read"
            />
          </AdminFormField>
          <AdminFormField label="Publish Date" htmlFor="date">
            <AdminInput
              id="date"
              name="date"
              type="date"
              defaultValue={toDateInputValue(post?.date)}
              required
            />
          </AdminFormField>
        </div>
        <AdminFormField
          label="Featured Image Path"
          htmlFor="image"
          hint="Optional. e.g. /images/post-photo.jpg — falls back to an icon badge when unset."
        >
          <AdminInput id="image" name="image" defaultValue={post?.image ?? ""} />
        </AdminFormField>
        <label className="flex items-center gap-2 text-[14px] font-medium text-heading">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? true}
            className="h-4 w-4 rounded border-black/25"
          />
          Published (visible on the live site)
        </label>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton label={post ? "Save Changes" : "Create Post"} />
        <AdminButtonLink href="/admin/blog" variant="secondary">
          Cancel
        </AdminButtonLink>
      </div>
    </form>
  );
}
