'use strict';
const google =  require('googleapis');
const path = require('path');
const fs = require('fs');

let filepath = '*.json';
let key = JSON.parse(fs.readFileSync(path.join(__dirname, filepath), { encoding: 'utf8', mode: 'r' }));

//extracted from view stting on analytics-admi-dashboard
const VIEW_ID = 'ga:130909438';

let jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null
);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('success');
  }
  let analytics = google.analytics('v3');
  //console.log(analytics);
  queryData(analytics);
});

function queryData(analytics) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': VIEW_ID,
    'metrics': 'ga:uniquePageviews',
    'dimensions': 'ga:pagePath',
    'start-date': '30daysAgo',
    'end-date': 'yesterday',
    'sort': '-ga:uniquePageviews',
    'max-results': 10,
    'filters': 'ga:pagePath=~/ch_[-a-z0-9]+[.]html$',
  }, function (err, response) {
    if (err) {
      console.log('error', err);
      return;
    } else {
      console.log('success', JSON.stringify(response, null, 4));
    }
  });
}
