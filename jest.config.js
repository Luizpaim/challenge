module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  testMatch: ['<rootDir>/test/**/*.unit.test.ts', '<rootDir>/test/**/*.integration.test.ts'],
  testEnvironment: 'node',
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/domain/**/*.{ts,tsx}',
    'src/application/**/*.{ts,tsx}',
    'src/infrastructure/**/*.{ts,tsx}',
    'src/infrastructure/database/*.module.ts',
    'src/presentation/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/main.ts',
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/config/',
    '/types/',
    '/errors/',
    '/dto/',
    '/migration/',
  ],
  coverageReporters: ['lcovonly', 'text'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
