/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@skillpath/types', '@skillpath/db'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'uploads.skillpath.dev']
  }
}

module.exports = nextConfig
