export default {
  'client/**/*.{ts,tsx}': [
    'cd client && npm run lint:fix',
    'cd client && npm run format'
  ],
  'api/**/*.ts': [
    'cd api && npm run lint:fix',
    'cd api && npm run format'
  ],
  '**/*.{json,md}': [
    'prettier --write'
  ]
};