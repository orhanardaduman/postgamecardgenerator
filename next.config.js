/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com',
      'media.valorant-api.com',
      'api.henrikdev.xyz',
      'cdn.valorantapi.com',
      'static.wikia.nocookie.net',
      'titles.trackercdn.com'
    ],
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
