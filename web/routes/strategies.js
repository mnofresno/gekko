const _ = require('lodash');
const fs = require('co-fs');
const sFs = require('fs');

const gekkoRoot = __dirname + '/../../';

module.exports = {
  list: function *() {
    const strategyDir = yield fs.readdir(gekkoRoot + 'strategies');
    const strats = strategyDir
      .filter(f => _.last(f, 3).join('') === '.js')
      .map(f => {
        return { name: f.slice(0, -3) }
      });

    // for every strat, check if there is a config file and add it
    const stratConfigPath = gekkoRoot + 'config/strategies';
    const strategyParamsDir = yield fs.readdir(stratConfigPath);

    for(let i = 0; i < strats.length; i++) {
      let strat = strats[i];
      if(strategyParamsDir.indexOf(strat.name + '.toml') !== -1)
        strat.params = yield fs.readFile(stratConfigPath + '/' + strat.name + '.toml', 'utf8')
      else
        strat.params = '';
    }

    this.body = strats;
  },
  post: function * () {
    let stratName = this.params.stratName;
    let fileName = gekkoRoot + 'strategies/' + stratName + '.js';

    sFs.writeFileSync(fileName, this.request.body.content);
    this.body = {status: 'ok'};
  },
  get: function *() {
    let stratName = this.params.stratName;

    let fileName = gekkoRoot + 'strategies/' + stratName + '.js';
    let stratContent = yield fs.readFile(fileName , "utf8");
    this.body = {
      content: stratContent
    };
  }
}
