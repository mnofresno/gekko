<template lang='pug'>
  div
    h2.contain Strategy editor
    config-builder()
</template>

<script>
import configBuilder from './strategyEditorConfigBuilder.vue'

export default {
  data: () => {
    return {
      config: false,
    }
  },
  methods: {
  },
  components: {
    configBuilder,
  }
}
</script>
