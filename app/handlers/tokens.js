/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import * as yup from 'yup';
import { createDoc, readDoc } from '../../lib/data.js';
import helpers from '../../lib/helpers.js';

const _tokens = {};

const tokens = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

_tokens.post = (_data, callback) => {
  const postSchema = yup.object().shape({
    email: yup.string().trim().lowercase().email().required(),
    password: yup.string().trim().required(),
  });

  const { payload } = _data;

  const valid = postSchema.isValidSync(payload);

  if (valid) {
    readDoc('users', payload.email, (err, data) => {
      if (!err && data) {
        const hashedPass = helpers.hash(payload.password);
        if (hashedPass === data.password) {
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObj = {
            email: payload.email,
            id: tokenId,
            expires,
          };

          createDoc('tokens', tokenId, tokenObj, (err) => {
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, { Error: 'COuld not create the new token' });
            }
          });
        } else {
          callback(400, { Error: 'Password did not match stored value' });
        }
      } else {
        callback(400, { Error: 'Could not find specified user' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// _tokens.get = (_data, callback) => {

// };

// _tokens.put = (_data, callback) => {

// };

// _tokens.delete = (_data, callback) => {

// };

export default tokens;
