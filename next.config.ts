import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Was a static export ("output: export") — switched to a normal Next.js
  // server build so /api/create-checkout-session (server-side Stripe secret
  // key) can run. Deploy with `next build && next start` on a Node server.
  basePath: "/web/ustaxexperts",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
