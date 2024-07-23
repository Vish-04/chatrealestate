/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['mediarem.metrolist.net'],
  },
  output: 'standalone', // Feel free to modify/remove this option
    
    // Indicate that these packages should not be bundled by webpack
    experimental: {
        serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    },
}

export default nextConfig;