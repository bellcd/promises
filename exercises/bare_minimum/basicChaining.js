/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

// var fs = require('fs');
var Promise = require('bluebird');
var getGitHubProfileAsync = require('./promisification.js').getGitHubProfileAsync;
var pluckFirstLineFromFileAsync = require('./promiseConstructor').pluckFirstLineFromFileAsync;
var fs = Promise.promisifyAll(require('fs'));

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return pluckFirstLineFromFileAsync(readFilePath)
    .then(function (username) {
      return getGitHubProfileAsync(username);
    })
    .then(function (profile) {
      // console.log(profile)
      // console.log(JSON.stringify(profile));
      return fs.writeFileAsync(writeFilePath, JSON.stringify(profile), (err) => {
        if (err) {
          throw err;
        }
      });
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
