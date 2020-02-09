<template>
  <div class="nav-container">
    <v-icon color="white">mdi-train</v-icon>
    <span>
      <router-link v-for="button in buttons" class="n-menu-button" style="color:white" :to="button.to" tag="button" :key="button.name">
        {{ button.name }}
      </router-link>
    </span>
    <button class="n-menu-button" style="color:white">{{ getName() }}</button>
    <button class="n-menu-button" style="color:white" @click="logoutApp">Logout</button>
  </div>
</template>

<script>
import { logout } from '@/main.js'
import { getUsername } from '@/main.js'
export default {
  data: () => ({
    buttons: [
      {
        name: "Home",
        to: "/"
      },
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
  methods: {
    getName: function() {
      return getUsername();
    },
    logoutApp: function() {
      logout();
    }
  }

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
