<template>
  <div>
    <span v-for="environment in allEnvironments">
      <p style="margin-bottom:0px;"><span style="font-weight:bold">{{ environment.environmentName }}</span>
         <v-icon>mdi-chevron-right</v-icon>
         <span class="font-weight-light" style="word-break:break-word;white-space:pre-wrap;">{{ environment.environmentAddress }}<span v-if="environment.environmentProxy !== 1">:{{ port }}</span>{{ endpointURL }}</span>
      </p>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    environments: Array,
    port: String,
    endpointURL: String,
  },
  data: () => ({
    allEnvironments: [],
  }),
  created() {
    this.sortedEnvironments();
  },
  methods: {
    // Complained of an infinite loop issue when this was computed.
    sortedEnvironments: function(){
      function compare(a, b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }
        this.allEnvironments = this.environments.sort(compare);
    },
  }
}
</script>

<style>
</style>