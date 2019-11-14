const _          = require('lodash');

const { google } = require('googleapis');
const webmasters = google.webmasters('v3');

const query = _.curry((resource, { jwtClient, site }) => {
  //http://google.github.io/google-api-nodejs-client/16.1.0/webmasters.html#.SearchAnalyticsQueryRequest
  return new Promise((resolve, reject) => {
    webmasters.searchanalytics.query({
      auth: jwtClient,
      siteUrl: site.url, //encodeURIComponent(site.url),
      resource
    }, (err, res) => {
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
});

module.exports = query;
