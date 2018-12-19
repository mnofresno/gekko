const _ = require('lodash');
const fs = require('co-fs');
const gekkoRoot = __dirname + '/../../';

module.exports = {
  get: function* () {
    let id = this.params.id;

    let fileName = gekkoRoot + 'logs/' + id + '.log';
    let logContents = yield fs.readFile(fileName, "utf8");
    this.body = logContents;
  },
  list: function* () {
    const logsDir = yield fs.readdir(gekkoRoot + 'logs');
    const logs = logsDir
      .filter(f => _.last(f, 4).join('') === '.log')
      .map(f => {
        const parts = f.split('-');
        const type = parts[parts.length - 2];
        return {
          name: f.slice(0, -4),
          timestamp: f.split('-' + type)[0],
          type: type,
          id: parts[parts.length - 1].slice(0, -4),
        }
      });
      this.body = logs;
   },
};
