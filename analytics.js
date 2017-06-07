'use strict';
const google =  require('googleapis');

let key = require('./keys/analytics.secrets.json');
let view = require('./keys/analytics.view.json');

const VIEW_ID = `ga:${view.view_id}`;

let jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null
);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('success');
  }
  let analytics = google.analytics('v3');
  // console.log(analytics);
  queryData(analytics);
});

const queryData = (analytics) => {
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
  }, (err, response) => {
    if (err) {
      console.log('error', err);
      return;
    } else {
      console.log('success', JSON.stringify(response, null, 4));
    }
  });
}
