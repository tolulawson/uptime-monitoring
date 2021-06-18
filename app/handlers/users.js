/* eslint-disable no-underscore-dangle */
const yup = require('yup');
const helpers = require('../../lib/helpers');
const { readDoc, createDoc } = require('../../lib/data');

const _users = {};

_users.post = async (data, callback) => {
  const postSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required().length(10),
    email: yup.string().email().required(),
    password: yup.string().required(),
    tosAgreement: yup.boolean(),
  });

  const valid = await postSchema.isValid(data);
  if (valid) {
    readDoc('users', email, (err, data) => {
      if (err) {
        const hashedPass = helpers.hash(data.password);
      } else {
        callback(400, { Error: 'A user with that email already exists' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

_users.get = (data, callback) => {

};

_users.put = (data, callback) => {

};

_users.delete = (data, callback) => {

};

const users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data, callback);
  } else {
    callback(405);
  }
};

module.exports = users;
