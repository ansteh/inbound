'use strict';
const google =  require('googleapis');
const path = require('path');
const fs = require('fs');

let filepath = '';
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
  let webmasters = google.webmasters('v3');
  console.log(webmasters);
  // queryData(analytics);
});
