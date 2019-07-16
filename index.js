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

const query = (resource) => {
  client.query(resource)
    .then((json) => {
      console.log(JSON.stringify(json, null, 2));
      console.log(_.get(json, 'rows.length', 0));
    })
    .catch(console.log);
};

const queryDefaultDimensions = () => {
  let resource = {
    startDate: '2017-04-01',
    endDate: '2017-05-01',
    // searchType: 'image',
    dimensions: ['country', 'device', 'query'],
  };

  query(resource);
};

const queryDimensionsAgainstPage = () => {
  let resource = {
    startDate: '2017-04-01',
    endDate: '2017-05-01',
    dimensions: ['country', 'device', 'query', 'page'],
  };

  query(resource);
};

const querySearchAppearance = () => {
  let resource = {
    startDate: '2017-04-01',
    endDate: '2017-05-01',
    dimensions: ['searchAppearance']
  };

  query(resource);
};

//queryDefaultDimensions();
//queryDimensionsAgainstPage();
//querySearchAppearance();

const resources = require('./services/webmasters/requests/query.resources');
//console.log(JSON.stringify(resources.createSearchModel(), null, 2));

const queryByDimensions = (dimensions) => {
  let resource = {
    startDate: '2019-07-01',
    endDate: '2019-07-07',
    // dimensions: ['country', 'device', 'page', 'query'],
    dimensions,
    rowLimit: 25000,
  };

  return client.query(resource)
    .then((json) => {
      if(_.has(json, 'rows')) {
        // console.log(JSON.stringify(json, null, 2));
        // console.log('rows', json.rows.length);
        // console.log('countries', _.chain(json.rows).map('keys.0').uniq().value());

        const clicks = _.sumBy(json.rows, 'clicks');
        const impressions = _.sumBy(json.rows, 'impressions');
        const ctr = impressions > 0 ? (clicks || 0) / impressions : null;

        return {
          dimensions,
          clicks,
          impressions,
          ctr,
        };
      } else {
        return Promise.reject('Now rows returned!');
      }
    })
    .then(console.log)
    .catch(console.log);
};

// Promise.all(['country', 'device', 'page', 'query'].map(queryByDimensions))
//   .catch(console.log)

const queryCountry = () => {
  let resource = {
    startDate: '2019-07-01',
    endDate: '2019-07-07',
    // dimensions: ['country', 'device', 'page', 'query'],
    // dimensions: ['country'],
    dimensions: ['searchAppearance'],
    rowLimit: 25000,
  };

  client.query(resource)
    .then((json) => {
      if(_.has(json, 'rows')) {
        console.log(JSON.stringify(json, null, 2));
        console.log('rows', json.rows.length);
        console.log('countries', _.chain(json.rows).map('keys.0').uniq().value());

        const clicks = _.sumBy(json.rows, 'clicks');
        const impressions = _.sumBy(json.rows, 'impressions');
        const ctr = impressions > 0 ? (clicks || 0) / impressions : null;

        return {
          clicks,
          impressions,
          ctr,
        };
      } else {
        return Promise.reject('Now rows returned!');
      }
    })
    .then(console.log)
    .catch(console.log);
};

queryCountry();
