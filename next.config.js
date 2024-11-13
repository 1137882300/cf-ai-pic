/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flux.robus.us.kg',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
}

module.exports = nextConfig 