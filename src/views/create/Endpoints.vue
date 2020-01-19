<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="grid-title" style="grid-template-columns:auto 50px 200px;">
        <h2 class="heading-text">{{ application.applicationName }}</h2>
        <button class="ad-button" style="height:50px;" @click="saveApplication"><v-icon>mdi-content-save</v-icon></button>
        <button class="ad-button" style="height:50px;" @click="newEndpoint=true">Create Endpoint</button>
      </div>
      <p>{{ application.applicationDescription }}</p>
      <p style="display:inline-block;margin-right:25px;">What port does this application use?</p>
      <input class="ad-input" v-model="application.applicationPort" style="width:150px;" placeholder="Port" />
      <div style="height:30px"></div>
      <div class="grid-title">
        <h3 class="title-text">Environments:</h3>
        <button class="ad-button" style="height:50px;" @click="addEnvironment"><v-icon>mdi-plus</v-icon></button>
      </div>
      <div style="height:15px;width:100%;" />
      <div class="grid-environment" v-if="application.applicationEnvironments.length > 0" v-for="(environment,index) in sortedEnvironments">
        <input class="ad-input" v-model="environment.environmentName" placeholder="Name" />
        <button class="ad-button" style="height:50px;" v-if="environment.environmentProxy === 1" @click="environment.environmentProxy = 0"><v-icon color="success" size="30">mdi-check</v-icon> Proxy</button>
        <button class="ad-button" style="height:50px;" v-else @click="environment.environmentProxy = 1"><v-icon color="error" size="30">mdi-crop-square</v-icon> No Proxy</button>
        <input class="ad-input" v-model="environment.environmentAddress" placeholder="Address" />
        <input class="ad-input" v-model="environment.environmentDescription" placeholder="Description" />
        <button class="ad-button" style="height:50px;" @click="deleteEnvironment(environment,index)"><v-icon>mdi-delete</v-icon></button>
      </div>
      <h3 class="title-text">Endpoints: </h3>
      <div class="app-grid">
        <button class="ad-button" style="height:100px;" v-for="endpoint in endpoints" @click="chooseEndpoint(endpoint.id)">
          <p>{{ endpoint.endpointName }}</p>
        </button>
      </div>
    </div>
    <!-- Popovers -->
    <NewEndpoint v-if="newEndpoint" :close="closePopover" :addEndpoint="createEndpoint"/>
  </div>
</template>

<script>
import NewEndpoint from '@/components/popovers/NewEndpoint';
export default {
  data: () => ({
    application: {},
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
      let gid = this.$route.params.app;
      // Application Info
      fetch('/api/application/v1/select/'+gid,{
        method: 'GET'
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.application)
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.application = data;
      });
    },
    createEndpoint: function(endpoint) {
      endpoint.applicationId = this.application.id;
      fetch('/api/endpoint/v1/add', {
        method: 'POST',
        headers: {
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
      this.$router.push('/versions/'+id);
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