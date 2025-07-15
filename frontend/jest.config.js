// frontend/jest.config.js
module.exports = {
    // ... other Jest configurations you might have
    moduleNameMapper: {
        '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};