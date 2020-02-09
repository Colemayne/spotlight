<template>
  <div class="popover-container">
    <div class="popover-background" @click="close"></div>
    <div class="new-team-container">
      <h1><v-icon size="30">mdi-account-group</v-icon> New Team</h1>
      <p>Upon group creation, other users will be unable to edit documentation until specified.</p>
      <div style="height:5px;"></div>
      <v-text-field outlined
             label="Group Name"
             v-model="groupName">
      </v-text-field>
      <v-btn color="success" @click="addTeam(groupName)">Add Team</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    close: Function,
    addTeam: Function
  },
  data: () => ({
    groupName: "",
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