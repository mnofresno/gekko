<template lang='pug'>
  div
    h3 Log files
    span.text(v-if='!logfiles.data.length')
      p You don't have any logfiles.
    table.full(v-if='logfiles.data.length')
      thead
        tr
          th type
          th timestamp
          th last modified
          th id
      tbody
        tr.clickable(v-for='logfile in logfiles.data')
          td {{ logfile.type }}
          td {{ logfile.timestamp }}
          td {{ logfile.mtime }}
          td
            a(v-bind:href="'api/logfiles/' + logfile.name") {{ logfile.id }}
      component(href='#', v-bind:is='logsPrevComponentIs', v-on:click.prevent='logPrevPage') << prev
      span  {{logfiles.page}} / {{logfiles.total_pages}}
      component(href='#', v-bind:is='logsNextComponentIs', v-on:click.prevent='logNextPage')  next >>
    a.w100--s.btn--primary.new-btn(href='#', v-on:click.prevent='updateLogfiles') Refresh logfiles list
</template>

<script>
import { get } from '../../tools/ajax';

export default {
  created: function() {
    this.updateLogfiles();
  },
  data: () => {
    return {
      logfiles: {
        data: [],
        total_pages: 0,
        page: 1,
      },
    };
  },
  computed: {
    logsPrevComponentIs: function() {
      return this.logfiles.page == 1 ? 'span' : 'a';
    },
    logsNextComponentIs: function() {
      return this.logfiles.page == this.logfiles.total_pages ? 'span' : 'a';
    },
  },
  methods: {
    logNextPage: function() {
      this.logfiles.page++;
      this.updateLogfiles();
    },
    logPrevPage: function() {
      this.logfiles.page--;
      this.updateLogfiles();
    },
    updateLogfiles: function() {
      get('logfiles?page=' + this.logfiles.page, (err, response) => {
        this.logfiles = response;
      });
    },
  },
};
</script>

<style>
table.clickable {
  border-collapse: separate;
}

tr.clickable td:nth-child(1) {
  padding-left: 5px;
}

tr.clickable {
  cursor: pointer;
}
tr.clickable:hover {
  background: rgba(216, 216, 216, 0.99);
}
</style>
