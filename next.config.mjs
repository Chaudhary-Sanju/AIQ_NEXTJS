/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "easehub-rja9.onrender.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "yalakhom.sanjuchaudhary.com.np",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
