import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-navy-900/85 to-transparent" />
        <span className="absolute bottom-3 left-4 text-xs font-semibold tracking-wide text-white uppercase">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4 className="relative mb-2.5 w-fit transition-colors duration-300 group-hover:text-navy-900">
          {post.title}
          <span className="bg-gold-gradient absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </h4>
        <p className="mb-5 flex-1 text-[14.5px] leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs text-muted">
          <span className="flex items-center gap-3">
            <span>{formattedDate}</span>
            <span aria-hidden className="text-black/20">
              &bull;
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.readTime}
            </span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-navy-900 transition-all duration-300 group-hover:gap-2">
            Read
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
