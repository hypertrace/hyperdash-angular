module.exports = {
  rootDir: '../..',
  modulePathIgnorePatterns: ['BOGUS'], // Need to reset from app project, but empty is merged
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/node_modules/@angular-builders/jest/dist/jest-config/setup.js'],
  testMatch: ['<rootDir>/projects/hyperdash-angular/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  watchPathIgnorePatterns: ['test-results']
};
