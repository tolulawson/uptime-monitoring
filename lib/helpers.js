/* eslint-disable import/extensions */
import crypto from 'crypto';
import querystring from 'querystring';
import config from '../app.config.js';

const helpers = {};

helpers.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  return false;
};

helpers.parse = (str) => {
  try {
    const obj = querystring.decode(str);
    return obj;
  } catch (e) {
    return false;
  }
};

export default helpers;
