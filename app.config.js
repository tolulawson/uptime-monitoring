/* eslint-disable import/prefer-default-export */
const environments = {};

environments.dev = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'dev',
  hashingSecret: 'myLittleSecret',
  maxChecks: 5,
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: 'myLittleSecretest',
  maxChecks: 5,
};

const currentEnvironment = process.env.NODE_ENV || 'dev';
const config = environments[currentEnvironment];

export default config;
