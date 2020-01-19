<template>
  <div>
    <span v-for="environment in sortedEnvironments">
      <p style="margin-bottom:0px;"><span style="font-weight:bold">{{ environment.environmentName }}</span>
         <span class="font-italic" style="color:green" v-if="environment.environmentProxy === 1"> Proxied</span>
         <span class="font-italic" style="color:red" v-else> No Proxy</span>
         <v-icon>mdi-chevron-right</v-icon>
         <span class="font-weight-light"> {{ environment.environmentAddress }}</span>
      </p>
      <p class="font-italic font-weight-light">{{ environment.environmentDescription }}</p>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    environments: Array,
  },
  computed: {
    sortedEnvironments: function(){
      function compare(a, b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }
      if(this.environments) {
        return this.environments.sort(compare);
      }
    },
  }
}
</script>

<style>
</style>