/* eslint-disable import/extensions */
import { StringDecoder } from 'string_decoder';
import { URL } from 'url';
import handlers from './handlers/index.js';
import router from './router.js';
import helpers from '../lib/helpers.js';

const unifiedServer = (req, res) => {
  const { headers } = req;
  const baseURL = `http://${headers.host}/`;
  const reqUrl = new URL(req.url, baseURL);
  const { pathname: reqPath } = reqUrl;
  const method = req.method.toLowerCase();
  const queryStringObject = Object.fromEntries(reqUrl.searchParams);

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    const payload = helpers.parseRequestBody(buffer);
    const chosenHandler = typeof (router[reqPath]) !== 'undefined' ? router[reqPath] : handlers.notFound;

    const data = {
      reqPath,
      queryStringObject,
      headers,
      method,
      payload,
    };

    chosenHandler(data, (_statusCode, _responseObject = {}) => {
      const statusCode = typeof _statusCode === 'number' ? _statusCode : 200;
      const responseObjectString = JSON.stringify(_responseObject);

      res.writeHead(statusCode, { 'Content-type': 'application/json' });
      res.end(responseObjectString);
    });
  });
};

export default unifiedServer;
