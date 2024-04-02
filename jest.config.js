// jest.config.js
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.module\\.css$': 'identity-obj-proxy', // Mock CSS modules
      "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js", // Mock regular CSS imports
      "/\.(css|less|scss)$/": "D:\OnlineOrderWeb\__mocks__\styleMock.js"
    },
    testEnvironment: 'jest-environment-jsdom',
    "resolver": undefined
  };
  