/* eslint-disable no-underscore-dangle */
const http = require('http');
const config = require('../app.config');
const unifiedServer = require('./unifiedServer');

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(`Listening on port ${config.httpPort} in ${config.envName} mode`);
});
