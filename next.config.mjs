/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, 
  },
  assetPrefix: isProd ? '/admin_ui_nextjs/' : '',
  basePath: isProd ? '/admin_ui_nextjs' : '',
  output: 'export'
};

export default nextConfig;
