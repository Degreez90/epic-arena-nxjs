/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote images from Unsplash used across the app
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
