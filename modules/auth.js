const _      = require('lodash');

const { google } = require('googleapis');

const authorize = (jwtClient) => {
  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if(err) {
        reject(err);
      } else {
        resolve({ tokens, jwtClient });
      }
    });
  });
};

const createClient = ({ key, urls }) => {
  let tokens;
  let expireDate;

  let jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    urls,
    null
  );

  const isExpired = () => {
    if(!expireDate) {
      return true;
    }
    return expireDate < new Date();
  };

  const request = () => {
    if(isExpired()) {
      return authorizeClient();
    } else {
      return Promise.resolve({
        tokens, jwtClient
      });
    }
  };

  const authorizeClient = () => {
    return authorize(jwtClient)
      .then((options) => {
        // console.log('tokens', options.tokens);
        // console.log(new Date(options.tokens.expiry_date));
        expireDate = new Date(options.tokens.expiry_date);
        tokens = options.tokens;
        return options;
      });
  };

  return {
    authorize: request,
  };
};

module.exports = {
  createClient,
};
