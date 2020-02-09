<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="row-end-button" style="grid-template-columns: auto 100px">
        <span>
          <a href="/edit" class="heading-link inline-block">Teams</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <a :href="getTeamLink" class="heading-link inline-block">{{ team.groupName }}</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <h2 class="heading-text inline-block" style="margin-right:8px;">{{ application.applicationName }}</h2>
        </span>
      </div>

      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px 100px;grid-gap:8px;">
          <h2 class="heading-text">{{ application.applicationName }}</h2>
          <v-btn v-if="needSave"color="primary" @click="saveApplication">Save</v-btn>
          <v-btn v-else disabled color="primary" @click="saveApplication">Save</v-btn>
          <v-btn color="primary" @click="addEnvironment">Create</v-btn>
        </div>
        <p>{{ application.applicationDescription }}</p>
        <v-text-field label="Port" @input="needSave=true" solo style="width:150px;" v-model="application.applicationPort" />
        <h3>Environments</h3>
        <div class="grid-environment" v-if="application.applicationEnvironments.length > 0" v-for="(environment,index) in sortedEnvironments">
          <v-text-field @input="needSave=true" solo label="Name" v-model="environment.environmentName" />
          <v-btn style="height:50px;" v-if="environment.environmentProxy === 1" @click="environment.environmentProxy = 0; needSave = true">Proxy</v-btn>
          <v-btn style="height:50px;" v-else @click="environment.environmentProxy = 1; needSave = true">No Proxy</v-btn>
          <v-text-field @input="needSave=true" solo v-model="environment.environmentAddress" label="Address" />
          <v-text-field @input="needSave=true" solo v-model="environment.environmentDescription" label="Description" />
          <v-btn style="height:47px;" @click="deleteEnvironment(environment,index)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
        <p v-if="application.applicationEnvironments.length === 0">Define environments for this application.</p>

      </div>
      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px;">
          <h2 class="heading-text">Endpoints</h2>
          <v-btn color="primary" @click="newEndpoint=true">Create</v-btn>
        </div>
        <p>Define the endpoints for this application.</p>
        <button class="n-row-button" v-for="endpoint in endpoints" @click="chooseEndpoint(endpoint.id)">
          <div class="application-button-layout" style="grid-template-columns: 75px 150px 150px auto">
            <v-icon size="30">mdi-check-network</v-icon>
            <p style="margin-top:15px;">{{endpoint.endpointName}}</p>
            <p style="margin-top:15px;" v-if="endpoint.endpointMethod" >{{endpoint.endpointMethod}}</p>
            <p style="margin-top:15px;" v-if="endpoint.endpointLocation" >{{endpoint.endpointLocation}}</p>
          </div>
        </button>
      </div>

    </div>
    <!-- Popovers -->
    <NewEndpoint v-if="newEndpoint" :close="closePopover" :addEndpoint="createEndpoint"/>
  </div>
</template>

<script>
import { HeadersWithAuth } from '@/main.js'
import { getToken } from '@/main.js'
import NewEndpoint from '@/components/popovers/NewEndpoint';
export default {
  data: () => ({
    team:{},
    application: {
      applicationEnvironments: [],
    },
    needSave: false,
    endpoints: [],
    newEndpoint: false,
  }),
  components: {
    NewEndpoint,
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      let tid = this.$route.params.team;
      // Group Info
      fetch('/api/group/v1/select/'+tid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.team = data[0];
        console.log(data);
      });
      let gid = this.$route.params.app;
      // Application Info
      fetch('/api/application/v1/select/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.application = data[0];
        this.endpoints = data[0].endpoints;
      });
    },
    closePopover: function() {
      this.newEndpoint = false;
    },
    addEnvironment: function() {
      let obj = {
        environmentProxy: 1,
      };
      this.application.applicationEnvironments.push(obj);
    },
    deleteEnvironment: function(environment,index) {
      if(environment.id) {
        fetch('/api/application/v1/delete/environment', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(environment)
        });
      }
      this.application.applicationEnvironments.splice(index,1);
    },
    saveApplication: function() {
      fetch('/api/application/v1/save', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.application)
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.needSave = false;
        this.application = data;
      });
    },
    createEndpoint: function(endpoint) {
      endpoint.applicationId = this.application.id;
      fetch('/api/endpoint/v1/add', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(endpoint)
      }).then(res => res.json())
      .then(data => {
        this.endpoints.push(data);
      });
      this.closePopover();
    },
    chooseEndpoint: function(id) {
      this.$router.push('/edit/'+this.$route.params.team+'/'+this.$route.params.app+'/'+id);
    }
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
      if(this.application.applicationEnvironments) {
        return this.application.applicationEnvironments.sort(compare);
      }
    },
    getTeamLink: function() {
      return "/edit/"+this.$route.params.team;
    }
  },

}
</script>

<style>
.app-grid {
  position: relative;
  min-height: 250px;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(100px);
  grid-gap: 15px;
  text-align: center;
  font-weight: bold;
}
.grid-environment {
  position: relative;
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: 150px 150px auto auto 50px;
  grid-template-rows: auto;
  grid-gap: 15px;
  margin-bottom: 25px;
}
</style>