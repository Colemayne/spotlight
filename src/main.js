import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Keycloak from 'keycloak-js'

let initOptions = {}
let keycloak = null;
// Get configuration for keycloak (location of your Vue Config Server)
// Once we've gotten the message, we are good to start up.
fetch('http://localhost:8079/api/vue/v1/config',{
  method: 'GET'
}).then(val => val.json())
.then(data => {
  initOptions = data;
  keycloak = Keycloak(initOptions);
  startup();
});

import './assets/css/main.css'
import './assets/css/n.css'
Vue.config.productionTip = false

export function startup() {

  keycloak.init({ onLoad: initOptions.onLoad }).success((auth) => {
  if(!auth) {
    console.log("not authenticated.");
    window.location.reload();
  }

  new Vue({
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')

  localStorage.setItem("vue-token", keycloak.token);
  localStorage.setItem("vue-refresh-token", keycloak.refreshToken);
  console.log(keycloak);
  setTimeout(() => {
    refreshToken();
  }, 60000)

  }).error(()=> {
    console.log("error has occurred");
  });
}

export function logout() {
  keycloak.logout();
}

export function refreshTokenTimeout() {
  console.log("waiting");
  setTimeout(() => {
    refreshToken();
  }, 100000);
}

export function refreshToken() {
  keycloak.updateToken().success((refreshed)=>{
    console.log(refreshed)
    if(refreshed) {
      console.log("token refreshed!!");
    } else {
      console.log("no refresh");
    }
    refreshTokenTimeout();
  });
}

export function HeadersWithAuth(headers) {
  let newHeaders = {
    Authorization: "Bearer "+keycloak.token,
    User: keycloak.tokenParsed.preferred_username,
  }
  for (const key in headers) {
    newHeaders[key] = headers[key];
  }
  return newHeaders;
}

export function getToken() {
  return keycloak.token;
}

export function getUsername() {
  let username = keycloak.tokenParsed.preferred_username
  return username;
}
