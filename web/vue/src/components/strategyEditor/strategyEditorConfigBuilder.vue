<template lang='pug'>
  div
    .hr
    strat-picker.my2(v-on:stratConfig='updateStrat').contain
    .hr
    textarea.params(v-model='stratContent')
    a.w100--s.btn--primary.scan-btn(href='#', v-on:click.prevent='save') Save file
</template>

<script>

import stratPicker from '../global/configbuilder/stratpicker.vue'
import _ from 'lodash'
import { get, post } from '../../tools/ajax'

export default {
  created: function() {
    get('configPart/performanceAnalyzer', (error, response) => {
      this.performanceAnalyzer = toml.parse(response.part);
      this.performanceAnalyzer.enabled = true;
    });
  },
  data: () => {
    return {
      dataset: {},
      strat: {},
      paperTrader: {},
      performanceAnalyzer: {},
      stratContent: '',
    }
  },
  components: {
    stratPicker,
  },
  computed: {
    market: function() {
      if(!this.dataset.exchange)
        return {};

      return {
        exchange: this.dataset.exchange,
        currency: this.dataset.currency,
        asset: this.dataset.asset
      }
    },
    range: function() {
      if(!this.dataset.exchange)
        return {};

      return {
        from: this.dataset.from,
        to: this.dataset.to
      }
    },
    config: function() {
      let config = {};
      Object.assign(
        config,
        { watch: this.market },
        { paperTrader: this.paperTrader },
        this.strat,
        {
          backtest: {
            daterange: this.range
          },
          backtestResultExporter: {
            enabled: true,
            writeToDisk: false,
            data: {
              stratUpdates: false,
              roundtrips: true,
              stratCandles: true,
              stratCandleProps: ['open'],
              trades: true
            }
          }
        },
        { performanceAnalyzer: this.performanceAnalyzer },
      );

      config.valid = this.validConfig(config);
      config.backtestResultExporter.enabled = true;

      return config;
    }
  },
  methods: {
    validConfig: function(config) {
      if(!config.backtest)
        return false;

      if(!config.backtest.daterange)
        return false;

      if(_.isEmpty(config.backtest.daterange))
        return false;

      if(!config.watch)
        return false;

      if(!config.tradingAdvisor)
        return false;

      let strat = config.tradingAdvisor.method;
      if(_.isEmpty(config[ strat ]))
        return false;

      if(config.tradingAdvisor) {
        if(_.isNaN(config.tradingAdvisor.candleSize))
          return false;
        else if(config.tradingAdvisor.candleSize == 0)
          return false;
      }

      return true;
    },
    updateDataset: function(set) {
      this.dataset = set;
      this.$emit('config', this.config);
    },
    updateStrat: function(sc) {
      this.strat = sc;
      let stratName = sc.tradingAdvisor.method;
      get('strategies/' + stratName, (error, response) => {
        this.stratContent = response.content;
      });
      this.$emit('config', this.config);
    },
    updatePaperTrader: function(pt) {
      this.paperTrader = pt;
      this.paperTrader.enabled = true;
      this.$emit('config', this.config);
    },
    save: function() {
      let data = { content: this.stratContent };
      let stratName = this.strat.tradingAdvisor.method;
      post('strategies/' + stratName, data, (error, response) => {
        if(error)
          return alert(error);

        this.credentials = {};
      });
      console.log('Saving papa', this.stratContent);
    },
  }
}
</script>

<style>
</style>
