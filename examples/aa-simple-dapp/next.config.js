/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  experimental: { appDir: true },
  reactStrictMode: true,
  images: {
    domains: ["recruitnft.s3.us-east-2.amazonaws.com"],
  },
};
