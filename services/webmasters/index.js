'use strict';
const moment = require('moment');
const DP     = require('datepress');

const auth   = require('../../modules/auth');
const google = require('googleapis');

const query = require('./requests/query');

const authorize = ({ client, site }) => {
  return client.authorize()
    .then(({ jwtClient }) => {
      return { jwtClient, site };
    });
};

const createClient = ({ key, site }) => {
  let client = auth.createClient({
    key: key,
    urls: ['https://www.googleapis.com/auth/webmasters.readonly']
  });

  return {
    query: (resource) => {
      return authorize({ client, site })
        .then(query(resource));
    }
  };
};

const format = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const getLastDateOfState = () => {
  return moment().subtract(91, 'days').toDate();
};

const rangeDaysOfStates = () => {
  let start = getLastDateOfState();
  let end = moment().subtract(1, 'days');
  return DP.range(start, end, 'days');
};

module.exports = {
  createClient,
  getLastDateOfState,
  rangeDaysOfStates,
};
