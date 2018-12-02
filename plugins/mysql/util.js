
module.exports = {

  // returns table name
  table: function (name, watch) {
    return [watch.exchange, name, watch.currency, watch.asset].join('_');
  }
}
