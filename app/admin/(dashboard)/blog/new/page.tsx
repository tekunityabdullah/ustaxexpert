import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import { createBlogPost } from "@/app/admin/(dashboard)/blog/actions";

export const metadata = { title: "New Blog Post" };

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>
      <div>
        <h1 className="text-heading">New Blog Post</h1>
        <p className="mt-1 text-[14px] text-muted">Write a new article for the Resource Center.</p>
      </div>
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
