'use strict';
const webmasters = require('./services/webmasters');

const key = require('./keys/google.secrets.json');
const site = require('./keys/site.json');

let service = webmasters.createClient({ key, site });

let resource = {
  // aggregationType: 'auto',
  // searchType: 'web',
  startDate: '2017-04-01',
  endDate: '2017-05-01',
  rowLimit: 10,
  // startRow: 0,
};

service.query(resource)
  .then(console.log)
  .then(() => service.query(resource))
  .then(console.log)
  .catch(console.log);
