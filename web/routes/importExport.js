const _ = require('lodash');
const cache = require('../state/cache');
const gekkoManager = cache.get('gekkos');
const apiKeyManager = cache.get('apiKeyManager');
const moment = require('moment');

const mapGekkoToExport = x => {
  return {
    mode: x.mode,
    config: Object.assign({}, x.config, {
      mysql: undefined,
      mongodb: undefined,
      postgresql: undefined,
      sqlite: undefined,
      trader: undefined,
      adapter: undefined,
      candleWriter: undefined,
    })
  };
};

module.exports = {
  import: function* () {
    let success = true,
      error = '';
    try {
      const data = this.request.body;
      const content = Buffer.from(data.content.split(',')[1], 'base64').toString('ascii');
      const gekkos = JSON.parse(content);
      const liveGekkos = gekkos;
      const baseConfig = require('./baseConfig');
      for (let id in liveGekkos) {
        const gekko = liveGekkos[id];
        let config = { trader: {} };
        const keys = apiKeyManager._getApiKeyPair(gekko.config.watch.exchange);
        _.merge(config, baseConfig, gekko.config);
        _.merge(config.trader, keys);
        const mode = gekko.mode;
        gekkoManager.add({
          config,
          mode
        });
      }
    } catch (e) {
      error = e.message;
      success = false;
      this.status = 422;
    }
    this.body = {
      success: success,
      error: error
    };
  },
  export: function* () {
    const timeStamp = moment().format('YYYY-MM-DD-HH-mm-ss');
    this.set('Content-disposition', `attachment; filename=gekkoexport_${timeStamp}.json`)
    const data = _.map(Object.values(gekkoManager.list().live), mapGekkoToExport);
    this.body = JSON.stringify(data);
  },
};
