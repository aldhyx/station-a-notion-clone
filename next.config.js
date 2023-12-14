/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmpkinpcvccsiixmxpaa.supabase.co",
        pathname: "/storage/**",
        port: "",
      },
    ],
  },
}

module.exports = nextConfig
