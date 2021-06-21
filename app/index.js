/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import http from 'http';
import config from '../app.config.js';
import unifiedServer from './unifiedServer.js';

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(`Listening on port ${config.httpPort} in ${config.envName} mode`);
});
