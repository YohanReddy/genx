/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.igebra.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blackforestlabs.ai",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
