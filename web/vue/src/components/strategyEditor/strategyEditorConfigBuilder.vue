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
          textarea.params(v-model='stratContent', rows=20)
        div.txt--center
          a.w100--s.btn--primary.save-btn(v-if='!saving', v-bind:class='isDirty ? "" : "disabled"', href='#', v-on:click.prevent='save') Save file
          spinner(v-if='saving')
</template>

<script>
import stratPicker from '../global/configbuilder/stratpicker.vue'
import _ from 'lodash'
import { get, post } from '../../tools/ajax'
import spinner from '../global/blockSpinner.vue'

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
      strat: {name: 'MACD'},
      stratContent: '',
      saving: false,
      initialContent: '',
    }
  },
  components: {
    spinner
  },
  watch: {
    strategy: function(strat) {
      this.strat = _.find(this.strategies, { name: strat });
      if(!this.strat.isNew) this.updateStrat(this.strat.name);
    }
  },
  computed: {
    isDirty: function() {
      return this.initialContent !== this.stratContent;
    },
  },
  methods: {
    updateStrat: function(stratName) {
      get('strategies/' + stratName, (error, response) => {
        this.stratContent = response.content;
        this.initialContent = response.content;
      });
    },
    save: function() {
      if(!this.isDirty) return;
      this.saving = true;
      let data = { content: this.stratContent };
      let stratName = this.strat.name;
      post('strategies/' + stratName, data, (error, response) => {
        this.strat.isNew = false;
        this.initialContent = this.stratContent;
        setTimeout(() => this.saving = false, 300);

        if(error)
          return alert(error);
      });
    },
    createNew: function() {
      let newStratName = prompt('Input new strategy name');

      if(!newStratName) return;

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
  .save-btn.disabled {
    background-color: grey;
  }
</style>
