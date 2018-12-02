const _ = require('lodash');
var log = require('../../core/log.js');
var mysql = require('mysql');
var handle = require('./handle');
const util = require('../../core/util.js');
const config = util.getConfig();

module.exports = done => {

  this.db = handle;

  var queryStr = `
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = '${config.mysql.database}'`;

  var query = this.db.query(queryStr, (err, result) =>{
    if(err) {
      log.error(err);
      return util.die("DB error while scanning tables");
    }

    const markets = result.map((table) => {
      let parts = table.table_name.split('_');
      let exchangeName = parts.shift();
      let first = parts.shift();

      if(first === 'candles') {
        return {
          exchange: exchangeName,
          currency: _.first(parts),
          asset: _.last(parts)
        };
      }
    }).filter(n => n); // remove empty items

    done(err, markets);
  });
}
