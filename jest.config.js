// jest.config.js
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.module\\.css$': 'identity-obj-proxy', // Mock CSS modules
      '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js' // Mock regular CSS imports
    },
    testEnvironment: 'jest-environment-jsdom'
  };
  