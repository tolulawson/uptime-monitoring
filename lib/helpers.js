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

helpers.parseRequestBody = (str) => {
  try {
    const obj = querystring.decode(str);
    return obj;
  } catch (e) {
    return false;
  }
};

helpers.parseJSONToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return false;
  }
};

helpers.createRandomString = (_length) => {
  const length = typeof _length === 'number' && _length > 0 ? _length : null;

  if (length) {
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i += 1) {
      const chosenChar = Math.floor(Math.random() * possibleChars.length);
      str += possibleChars[chosenChar];
    }
    return str;
  }
  return null;
};

export default helpers;
