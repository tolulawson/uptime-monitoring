/* eslint-disable newline-per-chained-call */
/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import * as yup from 'yup';
import helpers from '../../lib/helpers.js';
import {
  readDoc, createDoc, updateDoc, deleteDoc,
} from '../../lib/data.js';

const _users = {};

const users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data, callback);
  } else {
    callback(405);
  }
};

_users.post = (_data, callback) => {
  const postSchema = yup.object().shape({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    phone: yup.string().trim().required().min(10),
    email: yup.string().trim().lowercase().email().required(),
    password: yup.string().trim().required(),
  });

  const { payload } = _data;

  const valid = postSchema.isValidSync(payload);
  if (valid) {
    readDoc('users', payload.email, (err, readData) => {
      if (err && !readData) {
        const hashedPass = helpers.hash(payload.password);
        if (hashedPass) {
          const userObject = {
            ...payload,
            password: hashedPass,
            tosAgreement: true,
          };
          createDoc('users', payload.email, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not create new user' });
            }
          });
        } else {
          callback(500, { Error: 'Could not hash user\'s password' });
        }
      } else {
        callback(400, { Error: 'A user with that email already exists' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

_users.get = (_data, callback) => {
  const queryStringSchema = yup.object().shape({
    email: yup.string().email().required(),
  });
  const valid = queryStringSchema.isValidSync(_data.queryStringObject);

  if (valid) {
    const { email } = _data.queryStringObject;
    readDoc('users', email, (err, data) => {
      if (!err && data) {
        const dataWithoutPass = { ...data };
        delete dataWithoutPass.password;
        delete dataWithoutPass.tosAgreement;
        callback(200, dataWithoutPass);
      } else {
        callback(404, {});
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

_users.put = (_data, callback) => {
  const putSchema = yup.object().shape({
    email: yup.string().email().required(),
    firstName: yup.string(),
    lastName: yup.string(),
    phone: yup.string().min(10),
  }).test('at least one', 'Provide valid update data', (value) => !!(value.firstName || value.lastName || value.phone));

  const { payload } = _data;
  const valid = putSchema.isValidSync(payload);

  if (valid) {
    readDoc('users', payload.email, (err, data) => {
      if (!err && data) {
        const update = { ...payload };
        delete update.email;
        const updatedUser = {
          ...data,
          ...update,
        };

        updateDoc('users', payload.email, updatedUser, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not update the user' });
          }
        });
      } else {
        callback(400, { Error: 'The specified user does not exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

_users.delete = (_data, callback) => {
  const deleteSchema = yup.object().shape({
    email: yup.string().email().required(),
  });
  const { payload } = _data;
  const valid = deleteSchema.isValidSync(payload);

  if (valid) {
    readDoc('users', payload.email, (err, data) => {
      if (!err && data) {
        deleteDoc('users', payload.email, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Unable to delete user' });
          }
        });
      } else {
        callback(400, { Error: 'The specified user does not exist' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

export default users;
