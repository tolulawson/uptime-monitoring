/* eslint-disable no-shadow */
const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.createCollection = (collection, callback = () => {}) => {
  try {
    if (!fs.existsSync(`${lib.baseDir + collection}`)) {
      fs.mkdirSync(`${lib.baseDir + collection}`);
    }
  } catch (err) {
    callback('Error creating collection');
  }
};

lib.createDoc = (collection, document, data, callback = () => {}) => {
  lib.createCollection(collection, callback);

  fs.open(`${lib.baseDir + collection}/${document}.json`, 'wx', (err, fileDescriptor) => {
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

lib.readDoc = (collection, document, callback) => {
  fs.readFile(`${lib.baseDir + collection}/${document}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

lib.updateDoc = (collection, document, data, callback) => {
  fs.open(`${lib.baseDir + collection}/${document}.json`, 'r+', (err, fileDescriptor) => {
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

lib.deleteDoc = (collection, document, callback) => {
  const documentPath = path.join(lib.baseDir, collection, `${document}.json`);
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

module.exports = lib;
