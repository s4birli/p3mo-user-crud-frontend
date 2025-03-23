/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FRONTEND_PORT: process.env.NEXT_PUBLIC_FRONTEND_PORT,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    BACKEND_PORT: process.env.BACKEND_PORT,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  },
  // Ensure index page is properly routed
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = nextConfig; 