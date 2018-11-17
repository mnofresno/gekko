<template lang='pug'>

  .grd
    .grd-row
      .grd-row-col-5-6.px1
        div
          label(for='strat').wrapper Strategy:
            .custom-select.button
              select(v-model='strategy')
                option(v-for='strat in strategies') {{ strat.name }}
      .grd-row-col-5-6.px1
        div
          a.w100--s.btn--primary.new-btn(href='#', v-on:click.prevent='createNew') New strategy
    .grd-row
      .grd-row-col-5-6.px1
        div
          textarea(rows=20).params(v-model='stratContent')
        div
          a.w100--s.btn--primary.save-btn(href='#', v-on:click.prevent='save') Save file
</template>

<script>

import stratPicker from '../global/configbuilder/stratpicker.vue'
import _ from 'lodash'
import { get, post } from '../../tools/ajax'

export default {
  created: function() {
    get('strategies', (err, data) => {
      this.strategies = data;
      this.updateStrat(this.strategy);
    });
  },
  data: () => {
    return {
      strategies: [],
      strategy: 'MACD',
      strat: {},
      stratContent: '',
    }
  },
  watch: {
    strategy: function(strat) {
      this.strat = _.find(this.strategies, { name: strat });
      if(!this.strat.isNew) this.updateStrat(this.strat.name);
    }
  },
  methods: {
    updateStrat: function(stratName) {
      get('strategies/' + stratName, (error, response) => {
        this.stratContent = response.content;
      });
    },
    save: function() {
      let data = { content: this.stratContent };
      let stratName = this.strat.name;
      post('strategies/' + stratName, data, (error, response) => {
        this.strat.isNew = false;
        if(error)
          return alert(error);
      });
    },
    createNew: function() {
      let newStratName = prompt('Input new strategy name');
      this.strategies.push({name: newStratName, isNew: true});
      this.strategy = newStratName;
    },
  }
}
</script>

<style>
  .new-btn {
    margin-top: 60px;
    margin-bottom: 30px;
  }
  .save-btn {
    margin-top: 10px;
  }
</style>
