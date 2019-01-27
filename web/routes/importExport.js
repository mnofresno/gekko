const _ = require('lodash');
const cache = require('../state/cache');
const gekkoManager = cache.get('gekkos');
const moment = require('moment');

module.exports = {
  import: function* () {
    let success = true,
      error = '';
    try {
      const data = this.request.body;
      const content = Buffer.from(data.content.split(',')[1], 'base64').toString('ascii');
      const gekkos = JSON.parse(content);
      const liveGekkos = gekkos.live;
      for (let id in liveGekkos) {
        const gekko = liveGekkos[id];
        const config = gekko.config;
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
    const data = _.map(gekkoManager.list(), x => {
      return {
        mode: x.mode,
        config: x.config
      };
    });
    this.body = JSON.stringify(data);
  },
};
