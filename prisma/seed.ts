// Seeds the first admin login and migrates the site's existing static
// content (services, blog, FAQs, testimonials, settings) into the database
// so the CMS starts populated instead of empty.
//
// Run with: npx prisma db seed

import { prisma } from "../lib/db";
import { hashPassword } from "../lib/auth";
import { BASE_PATH, siteConfig } from "../lib/site-config";
import { services } from "../lib/services";
import { blogPosts } from "../lib/blog";
import { faqs } from "../lib/faqs";
import { testimonials } from "../lib/testimonials";

function stripBasePath(url: string): string {
  return url.startsWith(BASE_PATH) ? url.slice(BASE_PATH.length) : url;
}

async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    console.warn(
      "⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed. Set them in your server environment and re-run."
    );
    return;
  }

  const name = (process.env.ADMIN_NAME ?? "Admin").trim() || "Admin";
  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, active: true },
    create: { email, passwordHash, name, role: "SUPER_ADMIN" },
  });
  console.log(`✓ Admin user ready: ${email}`);
}

async function seedServices() {
  for (const [index, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
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
      },
    });
  }
  console.log(`✓ Seeded ${services.length} services`);
}

async function seedBlogPosts() {
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image ? stripBasePath(post.image) : null,
        category: post.category,
        icon: post.icon,
        readTime: post.readTime,
        date: new Date(post.date),
      },
    });
  }
  console.log(`✓ Seeded ${blogPosts.length} blog posts`);
}

async function seedFaqs() {
  for (const [index, faq] of faqs.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (existing) continue;
    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: index,
      },
    });
  }
  console.log(`✓ Seeded ${faqs.length} FAQs`);
}

async function seedTestimonials() {
  for (const [index, testimonial] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { name: testimonial.name } });
    if (existing) continue;
    await prisma.testimonial.create({
      data: { name: testimonial.name, quote: testimonial.quote, order: index },
    });
  }
  console.log(`✓ Seeded ${testimonials.length} testimonials`);
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      address: siteConfig.address,
      phones: siteConfig.phones,
      social: siteConfig.social,
    },
  });
  console.log("✓ Seeded site settings");
}

async function main() {
  await seedAdminUser();
  await seedServices();
  await seedBlogPosts();
  await seedFaqs();
  await seedTestimonials();
  await seedSiteSettings();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
