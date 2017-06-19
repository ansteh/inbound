'use strict';

const forEachDelayed = (collection, func, milliseconds = 1000) => {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if(collection.length === 0) {
        clearInterval(interval);
        resolve(true);
      } else {
        func(collection.shift());
      }
    }, milliseconds);
  });
};

module.exports = {
  forEachDelayed,
}
