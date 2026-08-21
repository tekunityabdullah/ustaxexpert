import type { MetadataRoute } from "next";
import { getServices } from "@/lib/services";
import { getBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, blogPosts] = await Promise.all([getServices(), getBlogPosts()]);

  const staticRoutes = [
    "",
    "/about-us",
    "/our-services",
    "/resource-center",
    "/client-hub",
    "/faqs",
    "/contact-us",
    "/enroll-now",
    "/make-a-payment",
    "/privacy-policy",
    "/terms-conditions",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${siteConfig.url}/our-services/${service.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
