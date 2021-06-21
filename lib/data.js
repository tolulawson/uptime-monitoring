/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import fs from 'fs';
import path from 'path';
import __dirname from './directories.js';

const baseDir = path.join(__dirname, '/../.data/');

const createCollection = (collection, callback = () => {}) => {
  try {
    if (!fs.existsSync(`${baseDir + collection}`)) {
      fs.mkdirSync(`${baseDir + collection}`);
    }
  } catch (err) {
    callback('Error creating collection');
  }
};

const createDoc = (collection, document, data, callback = () => {}) => {
  createCollection(collection, callback);

  fs.open(`${baseDir + collection}/${document}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new document');
            }
          });
        } else {
          callback('Error writing to new document');
        }
      });
    } else {
      callback(`Could not create new document, it may already exist${err.message}`);
    }
  });
};

const readDoc = (collection, document, callback) => {
  fs.readFile(`${baseDir + collection}/${document}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

const updateDoc = (collection, document, data, callback) => {
  fs.open(`${baseDir + collection}/${document}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing existing document');
                }
              });
            } else {
              callback('Error writing to existing document');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open the file for updating, it may not exist yet.');
    }
  });
};

const deleteDoc = (collection, document, callback) => {
  const documentPath = path.join(baseDir, collection, `${document}.json`);
  if (fs.existsSync(documentPath)) {
    fs.unlink(documentPath, (err) => {
      if (!err) {
        callback(false);
      } else {
        callback('Error deleting existing document');
      }
    });
  } else {
    callback('Error, document may not exist');
  }
};

export {
  baseDir, createCollection, createDoc, readDoc, updateDoc, deleteDoc,
};
