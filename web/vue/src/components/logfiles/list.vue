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
      component(href='#', v-bind:is='prevDisabled ? "span" : "a"', v-on:click.prevent='prevPage') << prev
      span  {{ ` ${logfiles.page} / ${logfiles.total_pages} ` }}
      component(href='#', v-bind:is='nextDisabled ? "span" : "a"', v-on:click.prevent='nextPage') next >>
    a.w100--s.btn--primary.new-btn(href='#', v-on:click.prevent='update') Refresh logfiles list
</template>

<script>
import { get } from '../../tools/ajax';

export default {
  created: function() {
    this.update();
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
    prevDisabled: function() {
      return this.logfiles.page == 1;
    },
    nextDisabled: function() {
      return this.logfiles.page == this.logfiles.total_pages;
    },
  },
  methods: {
    nextPage: function() {
      if (this.nextDisabled) return;
      this.logfiles.page++;
      this.update();
    },
    prevPage: function() {
      if (this.prevDisabled) return;
      this.logfiles.page--;
      this.update();
    },
    update: function() {
      get(`logfiles?page=${this.logfiles.page}`, (err, response) => {
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
