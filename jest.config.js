const {compilerOptions} = require('./tsconfig');
const {pathsToModuleNameMapper} = require("ts-jest");

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
  collectCoverage: true,
  coverageDirectory: '.coverage',
  coverageThreshold: {
    global: {
      lines: 80
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  })
};
