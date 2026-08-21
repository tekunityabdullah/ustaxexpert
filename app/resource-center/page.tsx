import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/blog/BlogCard";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Resource Center",
  description:
    "Tax tips, IRS deadlines, and updates from the U.S. Tax Experts team to help you stay ahead of your tax and accounting obligations.",
};

export default async function ResourceCenterPage() {
  const blogPosts = await getBlogPosts();

  return (
    <>
      <BreadcrumbHero title="Resource Center" />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              eyebrow="Insights"
              title="Tax Tips, Deadlines & Updates"
              subtitle="Practical guidance from our team on IRS notices, tax debt relief, planning, and bookkeeping — written in plain language."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} direction="up" delay={(index % 3) * 0.1}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
