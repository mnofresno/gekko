const moment = require('moment');
const _ = require('lodash');
const fs = require('co-fs');
const logsDir = __dirname + '/../../logs/';

function getPaginatedItems(items, page) {
  var page = page || 1,
    per_page = 10,
    offset = (page - 1) * per_page,
    paginatedItems = _.rest(items, offset).slice(0, per_page);
  return {
    page: page,
    per_page: per_page,
    total: items.length,
    total_pages: Math.ceil(items.length / per_page),
    data: paginatedItems
  };
}

module.exports = {
  get: function* () {
    let id = this.params.id;

    let fileName = logsDir + id + '.log';
    let logContents = yield fs.readFile(fileName, "utf8");
    this.body = logContents;
  },
  list: function* () {
    let page = parseInt(this.request.query.page);
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
    this.body = getPaginatedItems(logs, page);
   },
};
