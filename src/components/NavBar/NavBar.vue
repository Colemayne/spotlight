<template>
  <div class="nav-container">
    <v-icon color="white">mdi-train</v-icon>
    <span>
      <v-btn v-for="button in buttons" text class="n-menu-button"
             :class="mode === button.name ? 'n-menu-button-pressed':''"
             style="color:white" @click="gotoLink(button.to, button.name)"
             :key="button.name">
        {{ button.name }}
      </v-btn>
    </span>
    <v-btn text class="n-menu-button" style="color:white">{{ getName() }}</v-btn>
    <v-btn text class="n-menu-button" style="color:white" @click="logoutApp">Logout</v-btn>
  </div>
</template>

<script>
import { logout } from '@/main.js'
import { getUsername } from '@/main.js'
export default {
  data: () => ({
    mode: "Home",
    buttons: [
      {
        name: "Teams",
        to: "/edit"
      },
      {
        name: "Documentation",
        to: "/documentation"
      }
    ],
  }),
  created() {
    this.buttonLogic();
  },
  methods: {
    getName: function() {
      return getUsername();
    },
    logoutApp: function() {
      logout();
    },
    gotoLink: function(link, name) {
      this.mode = name;
      this.$router.push(link).catch(err => {});
    },
    buttonLogic: function() {
      let route = this.$router.currentRoute.path.slice(1);
      let routes = route.split("/");
      if(routes[0] === "") {
        this.mode = "Home";
      }
      if(routes[0] === "edit") {
        this.mode = "Teams";
      }
      if(routes[0] === "documentation") {
        this.mode = "Documentation";
      }

    }
  },

}
</script>

<style>
.nav-container {
  position: absolute;
  box-sizing: border-box;
  padding: 10px;
  height: 60px;
  width: 100%;
  padding-left: 50px;
  top: 0;
  left: 0;
  background: #000000;
  background: #ffffff;
  background: #0068c9;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.25);
  color: black;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 75px auto 150px 150px;
  grid-template-rows: 100%;
}
</style>
