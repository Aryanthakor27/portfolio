import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-router-dom': path.resolve(__dirname, 'src/compat/router.jsx'),
      'react-router': path.resolve(__dirname, 'src/compat/router.jsx')
    };

    if (isServer) {
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: `
            if (typeof globalThis.localStorage === 'undefined') {
              const _storageMap = new Map();
              globalThis.localStorage = {
                getItem: (k) => _storageMap.get(String(k)) ?? null,
                setItem: (k, v) => _storageMap.set(String(k), String(v)),
                removeItem: (k) => _storageMap.delete(String(k)),
                clear: () => _storageMap.clear(),
                key: (i) => Array.from(_storageMap.keys())[i] ?? null,
                get length() { return _storageMap.size; }
              };
            }
            if (typeof globalThis.sessionStorage === 'undefined') {
              const _sessionMap = new Map();
              globalThis.sessionStorage = {
                getItem: (k) => _sessionMap.get(String(k)) ?? null,
                setItem: (k, v) => _sessionMap.set(String(k), String(v)),
                removeItem: (k) => _sessionMap.delete(String(k)),
                clear: () => _sessionMap.clear(),
                key: (i) => Array.from(_sessionMap.keys())[i] ?? null,
                get length() { return _sessionMap.size; }
              };
            }
          `,
          raw: true,
          entryOnly: false
        })
      );
    }

    return config;
  }
};

export default nextConfig;
