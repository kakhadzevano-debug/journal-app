/** @type {import('next').NextConfig} */
const nextConfig = {
  // For mobile app, we'll use static export
  // Note: This disables API routes - we'll need to handle them differently
  // Uncomment the line below when ready to build for mobile:
  // output: 'export',
  
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig


