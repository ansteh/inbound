'use strict';
const _          = require('lodash');
const moment     = require('moment');
const DP         = require('datepress');

const webmasters = require('./services/webmasters');

const service = require('./modules/service');
const storage = require('./modules/storage');

const key     = require('./keys/google.secrets.json');
const site    = require('./keys/site.json');

const COLLECTION_NAME = 'traffic';

const insert = (info) => {
  return service.getDb()
    .then((db) => {
      return storage.insert(db, COLLECTION_NAME, info);
    });
};

const format = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

// console.log(webmasters.getLastDateOfState());
// console.log(format(webmasters.getLastDateOfState()));
// console.log(webmasters.rangeDaysOfStates());

let client = webmasters.createClient({ key, site });

const saveStateBy = (date) => {
  let dateStr = format(date);

  let resource = {
    startDate: dateStr,
    endDate: dateStr,
    rowLimit: 10,
  };

  return client.query(resource)
    .then(res => _.get(res, 'rows.0'))
    .then(traffic => _.assign(traffic, { date: dateStr }))
    .then(insert)
    .then(console.log)
    .catch(console.log);
};

// saveStateBy(webmasters.getLastDateOfState());

const saveAllCurrentStates = () => {
  let dates = webmasters.rangeDaysOfStates();

  let interval = setInterval(() => {
    if(dates.length === 0) {
      clearInterval(interval);
    } else {
      let date = dates.shift();
      saveStateBy(date);
    }
  }, 1000);
};

saveAllCurrentStates();

// let resource = {
//   // aggregationType: 'auto',
//   // searchType: 'web',
//   startDate: '2017-04-01',
//   endDate: '2017-05-01',
//   rowLimit: 10,
//   // startRow: 0,
// };
//
// client.query(resource)
//   .then(console.log)
//   .then(() => client.query(resource))
//   .then(console.log)
//   .catch(console.log);
