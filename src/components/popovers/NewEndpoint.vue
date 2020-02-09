<template>
  <div class="popover-container">
    <div class="popover-background" @click="close"></div>
    <div class="new-team-container">
      <h1><v-icon size="30">mdi-check-network</v-icon> New Endpoint</h1>
      <div style="height:30px;"></div>
      <v-text-field outlined
                    label="Endpoint Name"
             v-model="endpoint.endpointName">
      </v-text-field>
      <v-textarea outlined
                label="Endpoint Description"
                v-model="endpoint.endpointDescription">
      </v-textarea>
      <v-btn color="success" @click="addEndpoint(endpoint)">Add Endpoint</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    close: Function,
    addEndpoint: Function
  },
  data: () => ({
    endpoint: {
      endpointName: "",
      endpointDescription: "",
    },
  }),
  methods: {

  }
}
</script>

<style>
.new-team-container {
  position: absolute;
  box-sizing: border-box;
  padding: 20px 40px;
  height: auto;
  width: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #ffffff;
  border-radius: 3px;
  z-index: 101;
}
</style>