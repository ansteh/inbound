'use strict';
const _ = require('lodash');

const searchTypes = ['web', 'image', 'video'];

const dimensions = {
  dimensions: ['country', 'device']
};

const queryDimensions = {
  dimensions: ['country', 'device', 'query']
};

const pagebaleDimensions = {
  dimensions: ['country', 'device', 'page']
};

const pagebaleQueryDimensions = {
  dimensions: ['country', 'device', 'query', 'page']
};

const searchAppearance = {
  dimensions: ['searchAppearance']
};

const createSearchModel = () => {
  let stack = {};

  stack.dimensions = {};
  _.forEach(searchTypes, (searchType) => {
    let resource = _.assign(dimensions, { searchType });
    _.set(stack, `dimensions.${searchType}`, resource);
  });

  stack.pages = {};
  _.forEach(searchTypes, (searchType) => {
    let resource = _.assign(pagebaleDimensions, { searchType });
    _.set(stack, `pages.${searchType}`, resource);
  });

  stack.appearance = {
    richcards: searchAppearance,
  }

  return stack;
};

module.exports = {
  searchTypes,
  dimensions,
  pagebaleDimensions,
  searchAppearance,
  createSearchModel,
};
