<template lang='pug'>
  div
    hr
    div(style='margin-bottom:-50px;') State file administration:
    input(type='file', style='display:none;', ref='inputElement', v-on:change.prevent='onFileSelected')
    a.w100--s.btn--primary.new-btn(href='#', v-on:click.prevent='selectFile') Import
    a.w100--s.btn--primary.new-btn(href='api/state/export') Export
    div(v-if='importErrors')
      span.errorBox {{importErrors}}
</template>

<script>
import { post } from '../../tools/ajax.js';

export default {
  created: function() {
    this.onFileReaderFinished = (event, file) => {
      const data = { content: event.target.result, name: file.name };
      post('state/import', data, (error, response) => {
        if (error) {
          this.importErrors = error.response.body.error;
        }
        console.debug(error, response);
      });
    };
  },
  data: () => {
    return {
      importErrors: '',
    };
  },
  methods: {
    selectFile: function() {
      this.importErrors = '';
      const inputElement = this.$refs.inputElement;

      inputElement.click();
    },
    onFileSelected: function(event) {
      const input = event.target;
      if (input.files && input.files[0]) {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = e => {
          this.onFileReaderFinished(e, file);
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style>
span.errorBox {
  color: red;
}
</style>
