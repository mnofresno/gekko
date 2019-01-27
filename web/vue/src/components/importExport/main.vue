<template lang='pug'>
  div
    hr
    div(style='margin-bottom:-50px;') State file administration:
    input(type='file', style='display:none;', ref='inputElement', v-on:change.prevent='onFileSelected')
    spinner(v-if='runningImport')
    a.w100--s.btn--primary.new-btn(href='#', v-on:click.prevent='selectFile', v-if='!runningImport') Import
    a.w100--s.btn--primary.new-btn(href='api/state/export') Export
    div(v-if='importErrors')
      span.errorBox Error: {{importErrors}}
</template>

<script>
import { post } from '../../tools/ajax.js';
import spinner from '../global/blockSpinner.vue'

export default {
  created: function() {
    this.shutdownInProgress = () => setTimeout(() => this.runningImport = false, 300);
    this.onFileReaderFinished = (event, file) => {
      const data = { content: event.target.result, name: file.name };
      post('state/import', data, (error, response) => {
        if (error) {
          this.importErrors = error.response.body.error;
        }
        this.shutdownInProgress();
      });
    };
  },
  data: () => {
    return {
      importErrors: '',
      runningImport: false,
    };
  },
  methods: {
    selectFile: function() {
      this.importErrors = '';
      const inputElement = this.$refs.inputElement;
      inputElement.click();
    },
    onFileSelected: function(event) {
      this.runningImport = true;
      const input = event.target;
      if (input.files && input.files[0]) {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = e => {
          this.onFileReaderFinished(e, file);
        };
        reader.readAsDataURL(file);
      } else {
        this.runningImport = false;
      }
    },
  },
  components: {
    spinner
  },
};
</script>

<style>
span.errorBox {
  color: red;
}
</style>
