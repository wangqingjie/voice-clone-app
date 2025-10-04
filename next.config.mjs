/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出，适配 Cloudflare Pages
  output: 'export',

  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 禁用 trailing slash（确保路由正确）
  trailingSlash: true,
};

export default nextConfig;
