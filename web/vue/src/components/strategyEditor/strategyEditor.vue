<template lang='pug'>
  div
    h2.contain Strategy editor
    config-builder(v-on:config='check')
</template>

<script>
import configBuilder from './strategyEditorConfigBuilder.vue'
import { post } from '../../tools/ajax'
import { get } from '../../tools/ajax'
import spinner from '../global/blockSpinner.vue'

export default {
  data: () => {
    return {
      backtestable: false,
      backtestState: 'idle',
      backtestResult: false,
      config: false,
    }
  },
  methods: {
    check: function(config) {
      // console.log('CHECK', config);
      this.config = config;

      if(!config.valid)
        return this.backtestable = false;

      this.backtestable = true;
    },
    run: function() {
      this.backtestState = 'fetching';

      post('backtest', this.config, (error, response) => {
        this.backtestState = 'fetched';
        this.backtestResult = response;
      });
    }
  },
  components: {
    configBuilder,
    spinner
  }
}
</script>
