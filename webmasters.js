'use strict';
const google =  require('googleapis');

let filepath = '';
let key = require('./keys/google.secrets.json');
let site = require('./keys/site.json');

let jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/webmasters.readonly'],
  null
);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  }

  let webmasters = google.webmasters('v3');
  // console.log(webmasters);

  //http://google.github.io/google-api-nodejs-client/16.1.0/webmasters.html#.SearchAnalyticsQueryRequest
  webmasters.searchanalytics.query({
    auth: jwtClient,
    siteUrl: encodeURIComponent(site.url),
    resource: {
      // aggregationType: 'auto',
      // searchType: 'web',
      startDate: '2017-01-01',
      endDate: '2017-05-01',
      rowLimit: 10,
      // startRow: 0,
    }
  }, (err, res) => {
    if(err) {
      console.log('err', err);
    }
    console.log('success', res);
  });
});
