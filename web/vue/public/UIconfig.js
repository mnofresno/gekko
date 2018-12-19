// Note: this file gets copied around, make sure you edit
// the UIconfig located at `gekko/web/vue/dist/UIconfig.js`.

// This config is used by both the frontend as well as the web server.
// see https://gekko.wizb.it/docs/installation/installing_gekko_on_a_server.html#Configuring-Gekko

var host = null;
var uiPort = null;
var apiPort = null;

if (typeof window === 'undefined') {
  var util = require('../../../core/util.js');
  var program = util.getProgram();
  apiPort = program.apiPort;
  uiPort = program.uiPort;
  host = program.host;
} else {
  host = window.location.hostname;
}

const CONFIG = {
  headless: true,
  api: {
    host: '127.0.0.1',
    port: apiPort,
    timeout: 120000 // 2 minutes
  },
  ui: {
    ssl: false,
    host: host,
    port: typeof window === 'undefined' ? uiPort : window.location.port,
    path: '/'
  },
  adapter: 'mysql'
}

if (typeof window === 'undefined')
  module.exports = CONFIG;
else
  window.CONFIG = CONFIG;
