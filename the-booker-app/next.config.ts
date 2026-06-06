/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'urban-happiness-6vqpwg6wrvv2r5q4-3000.app.github.dev', // Il tuo URL di Codespaces
        'localhost:3000'
      ],
    },
  },
};

export default nextConfig;