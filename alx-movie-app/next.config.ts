import withPWA from '@ducanh2912/next-pwa'

const nextConfig = {
  reactStrictMode: true,

  // ✅ Explicitly disable Turbopack
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default withPWA({
  dest: 'public',
})(nextConfig)
