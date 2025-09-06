export default {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
