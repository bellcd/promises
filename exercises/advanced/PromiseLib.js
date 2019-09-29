// You should only use the `new Promise` constructor from bluebird
var Promise = require('bluebird');

/**
 * Return a function that wraps `nodeStyleFn`. When the returned function is invoked,
 * it will return a promise which will be resolved or rejected, depending on
 * the execution of the now-wrapped `nodeStyleFn`
 *
 * In other words:
 *   - If `nodeStyleFn` succeeds, the promise should be resolved with its results
 *   - If nodeStyleFn fails, the promise should be rejected with the error
 *
 * Because the returned function returns a promise, it does and should not
 * expect a callback function as one of its arguments
 */

var promisify = function(nodeStyleFn) {
  //returning a function that:
  //accepts an indefinite number of arguments
  //returns a promise
  return (...args) => {
    return new Promise((resolve, reject) => {
      //the Promise's callback invokes nodeStyleFn with however many arguments are given
      //NOTE: the nodeStyleFn is STILL INVOKED WITH A CALLBACK.
      //A main difference with this promise pattern is that instead of invoking some other callback with either err/data, err/data are invoke with reject/resolve.
      nodeStyleFn(...args, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  };
};


/**
 * Given an array which contains promises, return a promise that is
 * resolved if and when all the items in the array are resolved.
 *
 * The promise's resolve value should be an array that maps to the
 * respective positions in the original array of promises.
 *
 * If any promise in the array rejects, the returned promise
 * is rejected with the rejection reason.
 */

var all = function(arrayOfPromises) {
  return new Promise((resolve, reject) => {
    let values = [];
    let returnValue;
    let placeholder;
    //reduce through the arrayOfPromises, adding each resolved value to the value array AFTER that promise has resolved
    // [p1, p2, p3]
    // [p1.then((v1) => p2).then((v2) => p3).then((v3) => )] // [v1, v2, v3]

    // TODO: there's currently an unhandled exception, possibly because each subsequent promise in the array waits on the promise before its resolve/reject, before invoking its own .then block. How to change this??
    arrayOfPromises.reduce((acc, currentValue, i) => {
      if (acc === null) {
        placeholder = currentValue;
      } else {
        placeholder = acc;
      }
      return placeholder
        .catch((err) => {
          reject(err);
        })
        .then((data) => {
          values[i] = (data);
          if (i === arrayOfPromises.length - 1) {
            resolve(values);
          } else {
            returnValue = arrayOfPromises[++i];
          }
          return returnValue;
        });
    }, null);
  });
};

/**
 * Given an array of promises, return a promise that is resolved or rejected,
 * resolving with whatever the resolved value or rejection reason was from
 * the first to be resolved/rejected promise in the passed-in array
 */

var race = function(arrayOfPromises) {
  // add .then blocks to each promise, that call resolve/reject when their respective promises resolve/reject
  return new Promise((resolve, reject) => {
    arrayOfPromises.forEach((promise) => {
      promise
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

// Export these functions so we can unit test them
module.exports = {
  all: all,
  race: race,
  promisify: promisify
};
