import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import { updateBlogPost } from "@/app/admin/(dashboard)/blog/actions";

export const metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage(props: PageProps<"/admin/blog/[id]">) {
  const { id } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updateBlogPost.bind(null, post.id);

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
        <h1 className="text-heading">Edit Blog Post</h1>
        <p className="mt-1 text-[14px] text-muted">{post.title}</p>
      </div>
      <BlogPostForm post={post} action={action} />
    </div>
  );
}
