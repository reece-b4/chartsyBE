// /** @type {import('ts-jest').JestConfigWithTsJest} **/
// module.exports = {
//   preset: 'ts-jest/preset',
//   testEnvironment: 'node',
//   rootDir: '.',
//   transform: {
//     '^.+\\.tsx?$': ['ts-jest', {}],
//   },
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
// };

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  rootDir: ".",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};