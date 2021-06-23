/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import * as yup from 'yup';
import {
  createDoc, readDoc, updateDoc, deleteDoc,
} from '../../lib/data.js';
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

tokens.verifyToken = (id, email, callback) => {
  readDoc('tokens', id, (err, data) => {
    if (!err && data) {
      if (data.email === email && data.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
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
          const expires = Date.now() + (1000 * 60 * 60);
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

_tokens.get = (_data, callback) => {
  const queryStringSchema = yup.object().shape({
    id: yup.string().required().length(20),
  });
  const valid = queryStringSchema.isValidSync(_data.queryStringObject);

  if (valid) {
    const { id } = _data.queryStringObject;
    readDoc('tokens', id, (err, data) => {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404, {});
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

_tokens.put = (_data, callback) => {
  const putSchema = yup.object().shape({
    id: yup.string().required().length(20),
    extend: yup.boolean().required().oneOf([true]),
  });
  const { payload } = _data;
  const valid = putSchema.isValidSync(payload);

  if (valid) {
    readDoc('tokens', payload.id, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          const newTokenObject = {
            ...tokenData,
            expires: tokenData.expires + (60 * 60 * 1000),
          };
          updateDoc('tokens', payload.id, newTokenObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not update the token\'s expiration' });
            }
          });
        } else {
          callback(400, { Error: 'The token has already expired, cannot be extended' });
        }
      } else {
        callback(400, { Error: 'Specified token does not exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field(s) or field(s) are invalid' });
  }
};

_tokens.delete = (_data, callback) => {
  const deleteSchema = yup.object().shape({
    id: yup.string().required().length(20),
  });
  const { payload } = _data;
  const valid = deleteSchema.isValidSync(payload);

  if (valid) {
    readDoc('tokens', payload.id, (err, data) => {
      if (!err && data) {
        deleteDoc('tokens', payload.id, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the specified token' });
          }
        });
      } else {
        callback(400, { Error: 'Could not find the specified token' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

export default tokens;
