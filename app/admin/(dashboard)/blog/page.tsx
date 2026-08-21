import Link from "next/link";
import { Newspaper, Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  AdminTable,
  AdminTableHead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/admin/ui/Table";
import { AdminBadge } from "@/components/admin/ui/Badge";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";
import { AdminButtonLink } from "@/components/admin/ui/Button";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteBlogPost, toggleBlogPostPublished } from "./actions";

export const metadata = { title: "Blog" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function AdminBlogPage() {
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  let dbError = false;

  try {
    posts = await prisma.blogPost.findMany({ orderBy: { date: "desc" } });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">Blog</h1>
          <p className="mt-1 text-[14px] text-muted">Manage Resource Center articles.</p>
        </div>
        <AdminButtonLink href="/admin/blog/new">
          <Plus size={15} />
          New Post
        </AdminButtonLink>
      </div>

      {dbError ? (
        <AdminEmptyState
          icon={Newspaper}
          title="Database not connected"
          description="Set DATABASE_URL in your server environment and run migrations."
        />
      ) : posts.length === 0 ? (
        <AdminEmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Write your first article for the Resource Center."
          action={
            <AdminButtonLink href="/admin/blog/new" size="sm">
              <Plus size={14} />
              New Post
            </AdminButtonLink>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Title</AdminTh>
            <AdminTh>Category</AdminTh>
            <AdminTh>Date</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTbody>
            {posts.map((post) => (
              <AdminTr key={post.id}>
                <AdminTd className="max-w-sm font-semibold text-heading">{post.title}</AdminTd>
                <AdminTd className="text-muted">{post.category}</AdminTd>
                <AdminTd className="text-muted">{formatDate(post.date)}</AdminTd>
                <AdminTd>
                  <form action={toggleBlogPostPublished}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit">
                      <AdminBadge tone={post.published ? "success" : "neutral"}>
                        {post.published ? "Published" : "Draft"}
                      </AdminBadge>
                    </button>
                  </form>
                </AdminTd>
                <AdminTd>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-black/15 text-muted hover:border-navy-900 hover:text-heading"
                      aria-label={`Edit ${post.title}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteBlogPost}>
                      <input type="hidden" name="id" value={post.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Delete "${post.title}"? This cannot be undone.`}
                        size="sm"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      )}
    </div>
  );
}
