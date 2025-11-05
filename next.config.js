/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // ⚠️ Permite build mesmo com erros de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Permite build mesmo com erros de ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
