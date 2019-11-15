const axios   = require('axios');
const cheerio = require('cheerio');
const _       = require('lodash');
const moment  = require('moment');

const util = require('./util');

const crawl = (url) => {
  return axios.get(url)
    .then(response => response.data);
};

const extractLinks = (html) => {
  const $ = cheerio.load(html);
  return _.map($('a'), (traget) => {
    const link = $(traget);

    // return {
    //   href: link.attr('href'),
    //   text: link.text(),
    // };

    return link.attr('href');
  });
};

const createFilename = () => {
  return `${moment().format('YYYY-MM-DD_HH:mm:ss')}.json`;
};

const crawlLinks = (url) => {
  return crawl(url)
    .then(extractLinks)
    .then((links) => {
      const filepath = `${__dirname}/resources/${createFilename()}`;
      return util.ensureJSON(filepath, { url, links }, null, 2);
    });
};

module.exports = {
  crawlLinks,
};
