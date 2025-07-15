module.exports = {
    // ... other config ...
    // Remove moduleNameMapper entirely, or at least remove the react-router-dom mapping
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };