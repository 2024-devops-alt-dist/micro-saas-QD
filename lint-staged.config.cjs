module.exports = {
  'pwa-planteau-api/client/**/*.{ts,tsx}': [
    'npm --prefix pwa-planteau-api/client run lint:fix',
    'npm --prefix pwa-planteau-api/client run format'
  ],
  'pwa-planteau-api/api/**/*.ts': [
    'npm --prefix pwa-planteau-api/api run lint:fix',
    'npm --prefix pwa-planteau-api/api run format'
  ]
};
