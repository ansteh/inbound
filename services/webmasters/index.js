'use strict';
const auth   = require('../../lib/auth');
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

module.exports = {
  createClient,
};
