const crypto = require('crypto');
const querystring = require('querystring');
const config = require('../app.config');

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

module.exports = helpers;
