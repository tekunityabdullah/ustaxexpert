// Seeds the first admin login and migrates the site's existing static
// content (services, blog, FAQs, testimonials, settings) into Supabase so
// the CMS starts populated instead of empty. Safe to re-run: content is only
// inserted when missing (it never overwrites edits made in the CMS); the
// admin account's password/active flag is re-applied from ADMIN_PASSWORD.
//
// Run with: npm run db:seed

import "./load-env";
import { supabase, one, insert, update, upsert, dbConfigured } from "../lib/db";
import { hashPassword } from "../lib/auth";
import { BASE_PATH, siteConfig } from "../lib/site-config";
import { services } from "../lib/services";
import { blogPosts } from "../lib/blog";
import { faqs } from "../lib/faqs";
import { testimonials } from "../lib/testimonials";

function stripBasePath(url: string): string {
  return url.startsWith(BASE_PATH) ? url.slice(BASE_PATH.length) : url;
}

async function exists(table: string, column: string, value: string): Promise<boolean> {
  const row = await one<{ id: string }>(
    supabase.from(table).select("id").eq(column, value).limit(1).maybeSingle()
  );
  return row !== null;
}

async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    console.warn(
      "⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed. Set them in your environment and re-run."
    );
    return;
  }

  const name = (process.env.ADMIN_NAME ?? "Admin").trim() || "Admin";
  const passwordHash = await hashPassword(password);
  const existing = await one<{ id: string }>(
    supabase.from("admin_users").select("id").eq("email", email).maybeSingle()
  );

  if (existing) {
    await update("admin_users", existing.id, { passwordHash, active: true });
  } else {
    await insert("admin_users", { email, passwordHash, name, role: "SUPER_ADMIN" });
  }
  console.log(`✓ Admin user ready: ${email}`);
}

async function seedServices() {
  for (const [index, service] of services.entries()) {
    if (await exists("services", "slug", service.slug)) continue;
    await insert("services", {
      slug: service.slug,
      title: service.title,
      excerpt: service.excerpt,
      description: service.description,
      image: stripBasePath(service.image.src),
      imageWidth: service.image.width,
      imageHeight: service.image.height,
      included: service.included,
      benefits: service.benefits,
      paymentLink: service.paymentLink ?? null,
      order: index,
    });
  }
  console.log(`✓ Seeded ${services.length} services`);
}

async function seedBlogPosts() {
  for (const post of blogPosts) {
    if (await exists("blog_posts", "slug", post.slug)) continue;
    await insert("blog_posts", {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image ? stripBasePath(post.image) : null,
      category: post.category,
      icon: post.icon,
      readTime: post.readTime,
      date: new Date(post.date).toISOString(),
    });
  }
  console.log(`✓ Seeded ${blogPosts.length} blog posts`);
}

async function seedFaqs() {
  for (const [index, faq] of faqs.entries()) {
    if (await exists("faqs", "question", faq.question)) continue;
    await insert("faqs", {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: index,
    });
  }
  console.log(`✓ Seeded ${faqs.length} FAQs`);
}

async function seedTestimonials() {
  for (const [index, testimonial] of testimonials.entries()) {
    if (await exists("testimonials", "name", testimonial.name)) continue;
    await insert("testimonials", { name: testimonial.name, quote: testimonial.quote, order: index });
  }
  console.log(`✓ Seeded ${testimonials.length} testimonials`);
}

async function seedSiteSettings() {
  const existing = await one<{ id: number }>(
    supabase.from("site_settings").select("id").eq("id", 1).maybeSingle()
  );
  if (!existing) {
    await upsert(
      "site_settings",
      {
        id: 1,
        name: siteConfig.name,
        tagline: siteConfig.tagline,
        description: siteConfig.description,
        address: siteConfig.address,
        phones: siteConfig.phones,
        social: siteConfig.social,
      },
      "id"
    );
  }
  console.log("✓ Seeded site settings");
}

async function main() {
  if (!dbConfigured) {
    console.error(
      "✗ Supabase isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then re-run."
    );
    process.exit(1);
  }

  await seedAdminUser();
  await seedServices();
  await seedBlogPosts();
  await seedFaqs();
  await seedTestimonials();
  await seedSiteSettings();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
