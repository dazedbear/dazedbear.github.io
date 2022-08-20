module.exports = {
  '*': () => ['npm run format'],
  '*.{js,jsx,ts,tsx,cjs}': () => ['npm run lint:eslint', 'npm run test:unit'],
  '*.css': () => ['npm run lint:stylelint'],
}
