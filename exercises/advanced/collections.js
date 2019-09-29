/**
 * Using Promise.all, write a function, combineFirstLineOfManyFiles, that:
 *    1. Reads each file at the path in the `filePaths` array
 *    2. Plucks the first line of each file
 *    3. Joins each first line into a new file
 *      - The lines should be in the same order with respect to the input array
 *      - i.e. the second line in the new file should be the first line of `filePaths[1]`
 *    4. Writes the new file to the file located at `writePath`
 */

let Promise = require('bluebird');
let fs = require('fs');

var combineFirstLineOfManyFiles = function(filePaths, writePath) {
  let pluckFirstLineFromFilePromise = function(filePath) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data.split('\n')[0]);
      });
    });
  };

  let promisesOfFirstLinesFromEachFile = filePaths.map(function(filePath) {
    return pluckFirstLineFromFilePromise(filePath);
  });

  return Promise.all(promisesOfFirstLinesFromEachFile)
    .then(function(firstLinesOfEachFile) {
      firstLinesOfEachFile = firstLinesOfEachFile.reduce(function(acc, currentValue) {
        return acc + currentValue + '\n';
      }, '');

      firstLinesOfEachFile = firstLinesOfEachFile.slice(0, -1);

      console.log(firstLinesOfEachFile);
      fs.writeFile(writePath, firstLinesOfEachFile, function(err) {
        if (err) {
          return err;
        }
      });
    })
    .catch(function(err) {
      throw err;
    });
};

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};