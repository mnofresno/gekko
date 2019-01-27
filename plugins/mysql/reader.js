var _ = require('lodash');
var util = require('../../core/util.js');
var log = require('../../core/log');
var handle = require('./handle');
var config = util.getConfig();
var mysqlUtil = require('./util');

var Reader = function() {
  _.bindAll(this);
  this.db = handle;

  this.watch = config.watch;
}

// returns the furtherst point (up to `from`) in time we have valid data from
Reader.prototype.mostRecentWindow = function(from, to, next) {
  to = to.unix();
  from = from.unix();

  var maxAmount = to - from + 1;

  var queryStr = `
    SELECT start from ${mysqlUtil.table('candles', this.watch)}
    WHERE start <= ${to} AND start >= ${from}
    ORDER BY start DESC
    `;

  var query = this.db.query(queryStr, function (err, rows) {
    if (err) {
      // bail out if the table does not exist
      if (err.message.indexOf(' does not exist') !== -1)
      return next(false);

      log.error(err);
      return util.die('DB error while reading mostRecentWindow');
    }

    // no candles are available
    if(rows.length === 0) {
      return next(false);
    }

    if(rows.length === maxAmount) {

      // full history is available!

      return next({
        from: from,
        to: to
      });
    }

    // we have at least one gap, figure out where
    var mostRecent = _.first(rows).start;

    var gapIndex = _.findIndex(rows, function(r, i) {
      return r.start !== mostRecent - i * 60;
    });

    // if there was no gap in the records, but
    // there were not enough records.
    if(gapIndex === -1) {
      var leastRecent = _.last(rows).start;
      return next({
        from: leastRecent,
        to: mostRecent
      });
    }

    // else return mostRecent and the
    // the minute before the gap
    return next({
      from: rows[ gapIndex - 1 ].start,
      to: mostRecent
    });
  });
}

Reader.prototype.tableExists = function (name, next) {
  var queryStr =`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='${config.mysql.database}'
      AND table_name='${mysqlUtil.table(name, this.watch)}';
  `;

  this.db.query(queryStr, function(err, result) {
    if (err) {
      log.error(err);
      return util.die('DB error at `tableExists`');
    }

    next(null, result.length === 1);
  });
}

Reader.prototype.get = function(from, to, what, next) {
  if(what === 'full'){
    what = '*';
  }

  const queryStr = `
  SELECT ${what} from ${mysqlUtil.table('candles', this.watch)}
  WHERE start <= ${to} AND start >= ${from}
  ORDER BY start ASC
  `;

  var query = this.db.query(queryStr, (err, rows)=> {
    if (err) {
      log.error(err);
    }
    next(err, rows);
  });
}

Reader.prototype.count = function(from, to, next) {
  var queryStr = `
    SELECT COUNT(*) as count from ${mysqlUtil.table('candles', this.watch)}
    WHERE start <= ${to} AND start >= ${from}
    `;

  var query = this.db.query(queryStr, (err, rows)=> {
    if (err){
      log.error(err);
    }
    next(err, _.first(rows).count);
  });
}

Reader.prototype.countTotal = function(next) {
  var queryStr = `SELECT COUNT(*) as count from ${mysqlUtil.table('candles', this.watch)}`;

  var query = this.db.query(queryStr, (err, rows)=> {
    if (err){
      log.error(err);
    }
    next(err, _.first(rows).count);
  });
}

Reader.prototype.getBoundry = function(next) {
  var queryStr =`
  SELECT (
    SELECT start
    FROM ${mysqlUtil.table('candles', this.watch)}
    ORDER BY start LIMIT 1
  ) as first,
  (
    SELECT start
    FROM ${mysqlUtil.table('candles', this.watch)}
    ORDER BY start DESC
    LIMIT 1
  ) as last
  `;

  var query = this.db.query(queryStr, (err, rows)=> {
    if (err){
      log.error(err);
    }
    next(err, _.first(rows));
  });
}

Reader.prototype.close = function() {
  // let pool manage connections
}

module.exports = Reader;
