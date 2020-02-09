<template>
  <div class="popover-container">
    <div class="popover-background" @click="close"></div>
    <div class="new-team-container">
      <h1><v-icon size="30">mdi-application</v-icon> New Application</h1>
      <div style="height:5px;"></div>
      <v-text-field outlined
                    label="Application Name"
                    v-model="application.applicationName">
      </v-text-field>
      <v-textarea outlined
                  label="Application Description"
                  v-model="application.applicationDescription">
      </v-textarea>
      <v-btn color="success" @click="addApplication(application)">Add Application</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    close: Function,
    addApplication: Function
  },
  data: () => ({
    application: {
      applicationName: "",
      applicationDescription: "",
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