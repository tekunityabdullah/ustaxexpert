import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { blogIcons, blogStyle } from "@/components/blog/blogTheme";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import ShareButtons from "@/components/blog/ShareButtons";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const [post, blogPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);
  if (!post) notFound();

  const Icon = blogIcons[post.icon];

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <ReadingProgressBar accentClassName={blogStyle.bar} />
      <BreadcrumbHero title={post.title} />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/resource-center"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-navy-900"
            >
              <ArrowLeft size={15} />
              Back to Resource Center
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                aria-hidden
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${blogStyle.iconWrap}`}
              >
                <Icon size={18} />
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${blogStyle.badge}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <Clock size={14} />
                {post.readTime}
              </span>
              <span aria-hidden className="text-black/20">
                &bull;
              </span>
              <span className="text-sm text-muted">{formattedDate}</span>
            </div>

            {post.image && (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl lg:h-96">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 768px, 100vw"
                />
              </div>
            )}

            <Reveal direction="up">
              {typeof post.content === "string" ? (
                // Written with the admin CMS's rich text editor — real HTML,
                // including any font/color/alignment the author chose.
                <div
                  className="rich-content max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                // Legacy posts seeded before the rich text editor existed.
                post.content.map((block, i) => {
                  const heading = typeof block === "string" ? undefined : block.heading;
                  const text = typeof block === "string" ? block : block.text;
                  return (
                    <div key={i}>
                      {heading && <h3 className="mt-8 mb-3">{heading}</h3>}
                      <p
                        className={
                          i === 0 && !heading
                            ? "mt-0 text-lg leading-8 text-heading first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-navy-900"
                            : "mt-5 text-body"
                        }
                      >
                        {text}
                      </p>
                    </div>
                  );
                })
              )}
            </Reveal>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
              <p className="flex items-start gap-2 text-sm text-muted">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-gold-600" />
                This article is general information, not individualized tax
                or legal advice. Talk to your specialist about how it applies
                to your specific situation.
              </p>
            </div>

            <div className="mt-8 border-t border-black/10 pt-6">
              <ShareButtons title={post.title} />
            </div>
          </div>
        </Container>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-section py-16 lg:py-25">
          <Container>
            <h2 className="text-center">More From the Blog</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <Reveal key={related.slug} direction="up" delay={index * 0.1}>
                  <BlogCard post={related} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaFinancials />
    </>
  );
}
