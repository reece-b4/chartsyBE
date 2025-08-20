/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: require.resolve('ts-jest'),
  testEnvironment: "node",
    rootDir: '.',
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};