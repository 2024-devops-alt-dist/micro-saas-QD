export default {
  'pwa-planteau-api/client/**/*.{ts,tsx}': [
    'cd pwa-planteau-api/client && npm run lint:fix',
    'cd pwa-planteau-api/client && npm run format'
  ],
  'pwa-planteau-api/api/**/*.ts': [
    'cd pwa-planteau-api/api && npm run lint:fix',
    'cd pwa-planteau-api/api && npm run format'
  ]
};