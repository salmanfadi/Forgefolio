/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@forgefolio/types', '@forgefolio/db'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'uploads.forgefolio.dev']
  }
}

module.exports = nextConfig
