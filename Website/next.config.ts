import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages serves static files only, so prerender every page to HTML.
  output: "export",
};

export default nextConfig;
