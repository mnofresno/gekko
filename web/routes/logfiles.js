const moment = require('moment');
const _ = require('lodash');
const fs = require('co-fs');
const logsDir = __dirname + '/../../logs/';

module.exports = {
  get: function* () {
    let id = this.params.id;

    let fileName = logsDir + id + '.log';
    let logContents = yield fs.readFile(fileName, "utf8");
    this.body = logContents;
  },
  list: function* () {
    let page = this.params.page;
    let items = this.params.items;
    const logs = [];
    const logFiles = (yield fs.readdir(logsDir))
      .filter(f => _.last(f, 4).join('') === '.log');

    for(let i = 0; i < logFiles.length; i++) {
      let fileName = logFiles[i];
      let stat = yield fs.stat(logsDir + fileName);
      const parts = fileName.split('-');
      const type = parts[parts.length - 2];
      logs.push({
        name: fileName.slice(0, -4),
        timestamp: moment(fileName.split('-' + type)[0], 'HH:mm:ss'),
        type: type,
        id: parts[parts.length - 1].slice(0, -4),
        mtime: moment(stat.mtime, 'HH:mm:ss'),
      });
    }
    this.body = logs;
   },
};
