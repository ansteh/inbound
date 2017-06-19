'use strict';
const _          = require('lodash');
const moment     = require('moment');
const DP         = require('datepress');
const util       = require('./modules/util');

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

  util.forEachDelayed(dates, saveStateBy)
    .then(() => console.log('finished'))
    .catch(console.log);
};

// saveAllCurrentStates();

//searchType : web, image, video
let resource = {
  startDate: '2017-04-01',
  endDate: '2017-05-01',
  // aggregationType: 'auto',
  // searchType: 'web',
  //dimensions: ['country', 'device', 'query'],
  dimensions: ['page'],
  // startRow: 0,
  // rowLimit: 10,
};

let resourceByPage = {
  startDate: '2017-04-01',
  endDate: '2017-05-01',
  // aggregationType: 'auto',
  // searchType: 'web',
  dimensions: ['country', 'device', 'query', 'page'],
  // startRow: 0,
  // rowLimit: 10,
};

let resourceSearchAppearance = {
  startDate: '2017-04-01',
  endDate: '2017-05-01',
  // aggregationType: 'auto',
  // searchType: 'web',
  dimensions: ['searchAppearance'],
  // startRow: 0,
  // rowLimit: 10,
};

client.query(resource)
  .then((json) => {
    console.log(JSON.stringify(json, null, 2));
    console.log(json.rows.length);
  })
  .catch(console.log);
