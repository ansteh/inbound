const Loki           = require('lokijs');

let db;

const getDb = () => {
  return new Promise((resolve, reject) => {
    if(!db) {
      db = new Loki('repository/db.json');
      db.loadDatabase({}, () => {
        resolve(db);
      });
    } else {
      resolve(db);
    }
  });
};

module.exports = {
  getDb
};
