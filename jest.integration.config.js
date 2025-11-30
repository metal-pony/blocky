import regConfig from './jest.config.js';

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = Object.assign({}, regConfig, {
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)",
    "**/?(*.)+(integration).js?(x)"
  ]
});

export default config;
