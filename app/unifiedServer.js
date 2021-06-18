const { StringDecoder } = require('string_decoder');
const { URL } = require('url');
const qs = require('querystring');
const handlers = require('./handlers');
const router = require('./router');

const unifiedServer = (req, res) => {
  const { headers } = req;
  const baseURL = `http://${headers.host}/`;
  const reqUrl = new URL(req.url, baseURL);
  const { pathname: reqPath } = reqUrl;
  const method = req.method.toLowerCase();
  const { query: queryStringObject } = reqUrl;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    const body = qs.parse(buffer);
    const chosenHandler = typeof (router[reqPath]) !== 'undefined' ? router[reqPath] : handlers.notFound;

    const data = {
      reqPath,
      queryStringObject,
      headers,
      method,
      payload: body,
    };

    chosenHandler(data, (_statusCode, payload = {}) => {
      const statusCode = typeof _statusCode === 'number' ? _statusCode : 200;
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('Returning response:', buffer);
    });

    res.end('Hello world!\n');
  });
};

module.exports = unifiedServer;
