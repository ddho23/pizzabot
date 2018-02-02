const Promise = require('bluebird');

const prettyJson = (obj) => JSON.stringify(obj, null, 2);

const prettyPrint = function prettyPrint(obj) {
  return console.log(prettyJson(obj));
};

// Promisify a callback which doesn't return errors
const promisifier = function promisifier(originalMethod) {
  return Promise.promisify(function(callback) {
    originalMethod.call(
      this,
      (response) => {
        callback(null, response);
      }
    );
  });
};

exports.prettyJson = prettyJson;
exports.prettyPrint = prettyPrint;
exports.promisifier = promisifier;