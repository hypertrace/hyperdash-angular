module.exports = {
  preset: 'jest-preset-angular',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  watchPathIgnorePatterns: ['test-results'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^@hypertrace/hyperdash-angular$': '<rootDir>/projects/hyperdash-angular/src/public_api.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/node_modules/@angular-builders/jest/dist/jest-config/setup.js'],
  testMatch: ['<rootDir>/**/+(*.)+(spec|test).+(ts|js)?(x)']
};
