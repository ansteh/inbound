const path = require('path');
const fs   = require('fs');

const writeFile = (filepath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', (err) => {
      if(err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

const mkdir = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(filepath, (err) => {
      if(err) {
        if(err.code === 'EEXIST') {
          resolve(err.code);
        } else {
          reject(err);
        }
      } else {
        resolve(null);
      }
    });
  });
};

const ensureJSON = (filepath, json, replacer = null, space = null) => {
  const dirname = path.dirname(filepath);

  return mkdir(dirname)
    .then(() => {
      const content = JSON.stringify(json, replacer, space);
      return writeFile(filepath, content);
    });
};

module.exports = {
  ensureJSON,
};
