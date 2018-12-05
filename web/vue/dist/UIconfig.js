// Note: this file gets copied around, make sure you edit
// the UIconfig located at `gekko/web/vue/dist/UIconfig.js`.

// This config is used by both the frontend as well as the web server.
// see https://gekko.wizb.it/docs/installation/installing_gekko_on_a_server.html#Configuring-Gekko
var program = require('commander');

program.option('-p, --port <port>', 'HTTP Port')
  .option('--ui', 'launch a web UI')
  .option('-h, --host <host>', 'Hostname')
  .option('-s, --secrets <file>', 'Secrets file')
  .parse(process.argv);

console.log('Http PORT:', program.port);
console.log('Http HOST:', program.host);

const CONFIG = {
  headless: false,
  api: {
    host: '127.0.0.1',
    port: program.port,
    timeout: 120000 // 2 minutes
  },
  ui: {
    ssl: false,
    host: program.host,
    port: 3000,
    path: '/'
  },
  adapter: 'mysql'
}

if(typeof window === 'undefined')
  module.exports = CONFIG;
else
  window.CONFIG = CONFIG;
