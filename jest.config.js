module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.spec.json'
    }
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results/hyperdash-angular-app'
      }
    ],
    [
      'jest-html-reporter',
      {
        outputPath: 'test-results/hyperdash-angular-app/test-report.html'
      }
    ]
  ],
  modulePathIgnorePatterns: ['<rootDir>/projects'],
  watchPathIgnorePatterns: ['test-results'],
  moduleNameMapper: {
    '^@hypertrace/hyperdash-angular$': '<rootDir>/projects/hyperdash-angular/src/public_api.ts'
  }
};
