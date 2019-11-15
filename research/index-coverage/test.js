const { inspectExcludes } = require('./index');

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
