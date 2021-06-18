/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
const yup = require('yup');
const helpers = require('../../lib/helpers');
const { readDoc, createDoc } = require('../../lib/data');

const _users = {};

_users.post = async (data, callback) => {
  const postSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required().min(10),
    email: yup.string().email().required(),
    password: yup.string().required(),
    tosAgreement: yup.string(),
  });

  const valid = await postSchema.isValid(data);
  if (valid) {
    readDoc('users', data.email, (err, readData) => {
      if (err && !readData) {
        const hashedPass = helpers.hash(data.password);
        if (hashedPass) {
          const userObject = {
            ...data,
            password: hashedPass,
            tosAgreement: true,
          };
          createDoc('users', data.email, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
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

// _users.get = (data, callback) => {

// };

// _users.put = (data, callback) => {

// };

// _users.delete = (data, callback) => {

// };

const users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data.payload, callback);
  } else {
    callback(405);
  }
};

module.exports = users;
