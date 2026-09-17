/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Our own in-house SVG product graphics live in /public/images/products.
    // Next.js blocks SVG through the image optimizer unless this is enabled, so
    // the CSP below sandboxes them and blocks any scripting inside an SVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
