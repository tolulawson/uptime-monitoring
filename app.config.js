/* eslint-disable import/prefer-default-export */
const environments = {};

environments.dev = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'dev',
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
};

const currentEnvironment = process.env.NODE_ENV || 'dev';
const config = environments[currentEnvironment];

module.exports = config;
