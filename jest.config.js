module.exports = {
  testMatch: [
    "**/backend/test/**/*.test.js",
    "**/backend/test_unit/**/*.test.js",
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
