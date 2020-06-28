module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'projects/hyperdash-angular/src/**/*.ts',
    '!**/*.module.ts',
    '!**/public_api.ts',
    '!projects/hyperdash-angular/src/test/**'
  ],
  coverageDirectory: 'coverage/hyperdash-angular',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results/hyperdash-angular'
      }
    ],
    [
      'jest-html-reporter',
      {
        outputPath: 'test-results/hyperdash-angular/test-report.html'
      }
    ]
  ],
  modulePathIgnorePatterns: ['BOGUS'], // Need to reset from app project, but empty is merged
  watchPathIgnorePatterns: ['test-results']
};
