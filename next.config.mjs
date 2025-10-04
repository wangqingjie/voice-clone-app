/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出，适配 Cloudflare Pages
  output: 'export',
  
  // 图片优化配置
  images: {
    unoptimized: true, // Cloudflare Pages 需要
  },
};

export default nextConfig;
