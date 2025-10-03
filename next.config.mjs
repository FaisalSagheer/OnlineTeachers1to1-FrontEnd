// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'onlineteachers1to1.com',
      //   pathname: '/media/**',
      // },
      {
        protocol:'https',
        hostname:'online-teachers1to1.vercel.app',
        pathname: '/media/**',
      }
    ],
  },
};

export default nextConfig; // 👈 Use this for ESM projects