const fs = require('fs');
const _ = require('lodash');
const cache = require('./state/cache');
const broadcast = cache.get('broadcast');
var program = require('commander');

const apiKeysFile = __dirname + '/../' +  program.secrets;

console.log('secrets: ', apiKeysFile);

// on init:
const noApiKeysFile = !fs.existsSync(apiKeysFile);

if(noApiKeysFile)
  fs.writeFileSync(
    apiKeysFile,
    JSON.stringify({})
  );

const apiKeys = JSON.parse( fs.readFileSync(apiKeysFile, 'utf8') );

module.exports = {
  get: () => _.keys(apiKeys),

  // note: overwrites if exists
  add: (exchange, props) => {
    apiKeys[exchange] = props;
    fs.writeFileSync(apiKeysFile, JSON.stringify(apiKeys));

    broadcast({
      type: 'apiKeys',
      exchanges: _.keys(apiKeys)
    });
  },
  remove: exchange => {
    if(!apiKeys[exchange])
      return;

    delete apiKeys[exchange];
    fs.writeFileSync(apiKeysFile, JSON.stringify(apiKeys));

    broadcast({
      type: 'apiKeys',
      exchanges: _.keys(apiKeys)
    });
  },

  // retrieve api keys
  // this cannot touch the frontend for security reaons.
  _getApiKeyPair: key => apiKeys[key]
}
