<template lang='pug'>
  section.contain.grd-row
    .grd-row-col-3-6
      span(v-html='left')
      importExport
    .grd-row-col-3-6.txt--center
      img(src='static/gekko.jpg')
      p
        em Adapted by Adrian and Mariano.
</template>

<script>
import marked from '../../tools/marked';
import importExport from '../importExport/main.vue';

const left = marked(`

## Futura Trading

Futura Trading is a Bitcoin trading bot and backtesting platform that
connects to popular Bitcoin exchanges. It is written in javascript
and runs on nodejs.



`);

export default {
  data: () => {
    return {
      left
    };
  },
  components: {
    importExport,
  },
}
</script>
