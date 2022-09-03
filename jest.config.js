/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src/',
    '<rootDir>/scripts/',
    '<rootDir>/tests/',
    '<rootDir>/tests/__mocks__',
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/e2e/**',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.ts',
  },
  transform: {
    '^.+\\.mdx?$': '@storybook/addon-docs/jest-transform-mdx',
  },
}
