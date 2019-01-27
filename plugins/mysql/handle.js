var _ = require('lodash');
var mysql = require('mysql');

var util = require('../../core/util.js');
var config = util.getConfig();
var dirs = util.dirs();

var log = require('../../core/log');

// verify the correct dependencies are installed
var pluginHelper = require(dirs.core + 'pluginUtil');
var pluginMock = {
  slug: 'mysql adapter',
  dependencies: config.mysql.dependencies
};

var cannotLoad = pluginHelper.cannotLoad(pluginMock);
if(cannotLoad){
  util.die(cannotLoad);
}

var plugins = require(util.dirs().gekko + 'plugins');

var database = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

database.getConnection((err, connection) =>{
  if(err) {
    util.die(err);
  }
  log.debug("Verified MySQL setup: connection possible");
  connection.release();
})

module.exports = database;
