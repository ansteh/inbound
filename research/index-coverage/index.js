const fs     = require('fs');

const _      = require('lodash');
const moment = require('moment');

const parseXMLString = require('xml2js').parseString;

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/resources/${filename}`, 'utf8', (err, data) => {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
};

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    parseXMLString(xml, function (err, data) {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
};

const parseCSV = (text, delimiter, newline) => {
  delimiter = delimiter || ",";
  newline = newline || "\n";

  return _
    .chain(text || '')
    .split("\n")
    .filter()
    .map(function(row) {
      return row.split(delimiter);
    })
    .value();
};

const parseSitemap = (filename) => {
  return readFile(filename)
    .then(parseXML)
    .then(data => _.get(data, 'urlset.url'))
};

const parseIndexCoverage = (filename) => {
  return readFile(filename)
    .then(parseCSV)
    .then((rows) => {
      return _.tail(rows).map((row) => {
        return {
          url: row[0],
          crawled: moment(row[1], 'D MMM YYYY').format('YYYY-MM-DD'),
          // date: row[1],
        };
      });
    })
};

const getAllSitemapUrls = (urls) => {
  return _
    .chain(urls)
    .map((entry) => {
      return [
        ..._.get(entry, 'loc'),
        ..._.map(_.get(entry, 'xhtml:link'), '$.href')
      ];
    })
    .flatten()
    .value();
};

const getAllCoverageUrls = (urls) => {
  return _.map(urls, 'url');
};

const inspectExcludes = (sitemap, coverage) => {
  const sitemapUrls = parseSitemap(sitemap)
    .then(getAllSitemapUrls);

  const excludedUrls = parseIndexCoverage(coverage)
    .then(getAllCoverageUrls);

  return Promise.all([sitemapUrls, excludedUrls])
    .then(([sitemapUrls, excludedUrls]) => {
      const sitemapedAndExcluded = _.intersection(sitemapUrls, excludedUrls);

      return {
        urls: {
          sitemap: sitemapUrls,
          excluded: excludedUrls,
          sitemapedAndExcluded,
          // excludedSalons: _.filter(excludedUrls, url => url.indexOf('/salon/') > -1),
        },
        stats: {
          sitemapUrls: sitemapUrls.length,
          excludedUrls: excludedUrls.length,
          sitemapedAndExcludedUrls: sitemapedAndExcluded.length,
        }
      };
    })
};

// parseSitemap('sitemap.xml')
//   // .then(result => result[99])
//   // .then(result => JSON.stringify(result, null, 2))
//   .then(console.log)
//   .catch(console.log)

// parseIndexCoverage('index_coverage.csv')
//   // .then(result => JSON.stringify(result, null, 2))
//   .then(console.log)
//   .catch(console.log)

inspectExcludes('sitemap.xml', 'index_coverage.csv')
  // .then(result => result[99])
  // .then(result => JSON.stringify(result, null, 2))
  .then(console.log)
  .catch(console.log)
