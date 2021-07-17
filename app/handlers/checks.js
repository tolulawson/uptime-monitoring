/* eslint-disable newline-per-chained-call */
/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import * as yup from 'yup';
import helpers from '../../lib/helpers.js';
import {
  readDoc, createDoc, updateDoc, deleteDoc,
} from '../../lib/data.js';
import tokens from './tokens.js';

const _checks = {};

const checks = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

//
_checks.post = (_data, callback) => {
  const postSchema = yup.object().shape({
    protocol: yup.string().trim().oneOf(['http', 'https']).required(),
    url: yup.string().trim().url().required(),
    method: yup.string().trim().lowercase().oneOf(['get', 'post', 'put', 'delete']).required(),
    successCodes: yup.array().of(yup.number()).required(),
    timeoutSeconds: yup.number().positive().integer().min(1).max(5),
  });

  const { payload } = _data;

  const valid = postSchema.isValidSync(payload);
  if (valid) {
    const token = typeof _data.headers.token === 'string' ? _data.headers.token : null;
    readDoc('tokens', token, (err, tokenData) => {
      if (!err && tokenData && tokenData.expires > Date.now()) {
        readDoc('users', tokenData.email, (err, userData) => {
          
        })
        });
      } else {
        callback(403, { Error: 'Invalid or missing token' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required inputs, or inputs are invalid' });
  }
};

_checks.get = (_data, callback) => {

};

_checks.put = (_data, callback) => {

};

_checks.delete = (_data, callback) => {

};

export default checks;
