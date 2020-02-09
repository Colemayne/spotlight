<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:10px 40px;">
      <div class="row-end-button" style="grid-template-columns: auto 100px">
        <span>
          <a href="/edit" class="heading-link inline-block">Teams</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <a :href="getTeamLink" class="heading-link inline-block">{{ team.groupName }}</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <a :href="getAppLink" class="heading-link inline-block" style="margin-right:8px;">{{ application.applicationName }}</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <h2 class="heading-text inline-block">{{ endpoint.endpointName }}</h2>
        </span>
      </div>

      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px;grid-gap:8px;">
          <h2 class="heading-text">Endpoint</h2>
          <v-btn v-if="needSave" color="primary" @click="saveEndpoint">Save</v-btn>
          <v-btn v-else disabled color="primary" @click="saveEndpoint">Save</v-btn>
        </div>
        <p>Information related to the endpoint.</p>

        <v-text-field solo
                      v-model="endpoint.endpointName"
                      @input="needSave=true"
                      label="Name"
                      placeholder="Name" />
        <v-textarea solo
                    v-model="endpoint.endpointDescription"
                    @input="needSave=true"
                    label="Description"
                    placeholder="Description" />

        <div class="grid-address">
          <v-select solo
                    :items="methods"
                    @input="needSave=true"
                    v-model="endpoint.endpointMethod"
                    label="Method">
          </v-select>
          <v-btn style="height:50px;" color="white" v-if="endpoint.endpointAuthRequired === 1" @click="endpoint.endpointAuthRequired = 0; needSave = true"><v-icon color="success" size="20" style="margin-right:5px;">mdi-lock</v-icon> Auth</v-btn>
          <v-btn style="height:50px;" color="white" v-else @click="endpoint.endpointAuthRequired = 1; needSave = true"><v-icon color="error" size="20" style="margin-right:5px;">mdi-lock-open</v-icon> No Auth</v-btn>
          <v-text-field solo
                        v-model="endpoint.endpointLocation"
                        @input="needSave=true"
                        placeholder="Endpoint"/>
        </div>
        <hr style="margin-bottom:15px;opacity:0.3;" />
        <div class="row-end-button" style="grid-template-columns: auto 100px;grid-gap:8px;">
          <h3>Parameters</h3>
          <v-btn color="primary" @click="addParameter">Create</v-btn>
        </div>
        <p>Defined parameters to be sent with the request.</p>
        <p v-if="checkEndpointLength">There are currently no parameters.</p>
        <div class="grid-kvd" v-else v-for="(parameter,index) in sortedParameters">
          <v-text-field solo @input="needSave=true" v-model="parameter.parameterKey" placeholder="Key" />
          <v-text-field solo @input="needSave=true" v-model="parameter.parameterType" placeholder="Type" />
          <v-btn color="white" style="height:50px;" v-if="parameter.parameterRequired === 1" @click="parameter.parameterRequired = 0; needSave = true"><v-icon color="success" size="30" style="margin-right:5px;">mdi-check</v-icon> Required</v-btn>
          <v-btn color="white" style="height:50px;" v-else @click="parameter.parameterRequired = 1; needSave = true"><v-icon color="error" size="30" style="margin-right:5px;">mdi-crop-square</v-icon> Optional</v-btn>
          <v-text-field solo @input="needSave=true" v-model="parameter.parameterDescription" placeholder="Description" />
          <v-btn color="white" @input="needSave=true" style="height:50px;" @click="deleteParameter(parameter,index)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </div>

      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px;grid-gap:8px;">
          <h2 class="heading-text">Details</h2>
        </div>
        <p>Endpoint details</p>
        <h3>Example Body:</h3>
        <v-textarea solo
               v-model="endpoint.endpointExampleBody"
               @input="needSave=true"
               type="text"
               placeholder="Example of what might be sent with a http body." />
        <h3>Expected Response:</h3>
        <v-textarea solo
               v-model="endpoint.endpointExpectation"
               @input="needSave=true"
               type="text"
               placeholder="Expected response of the endpoint" />
        <h3>Notes:</h3>
        <v-textarea solo
               v-model="endpoint.endpointNotes"
               @input="needSave=true"
               type="text"
               placeholder="Any information to better assist the user for this endpoint." />
      </div>
    </div>
  </div>
</template>

<script>
import { HeadersWithAuth } from '@/main.js'
import { getToken } from '@/main.js'
import NewEndpoint from '@/components/popovers/NewEndpoint';
export default {
  data: () => ({
    endpoint: {},
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "UPDATE",
      "HEAD"
    ],
    team:{},
    application: {
      applicationEnvironments: [],
    },
    needSave: false,
  }),
  components: {
    NewEndpoint,
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      let eid = this.$route.params.endpoint;
      fetch('/api/endpoint/v1/select/'+eid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.endpoint = data;
      });
      let tid = this.$route.params.team;
      // Group Info
      fetch('/api/group/v1/select/'+tid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.team = data[0];
      });
      let gid = this.$route.params.app;
      // Application Info
      fetch('/api/application/v1/select/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.application = data[0];
      });
    },
    addParameter: function() {
      let obj = {
        pKey: "",
        pType: "",
        parameterRequired: 1,
      };
      this.needSave = true;
      this.endpoint.endpointParameters.push(obj);
    },
    deleteParameter: function(parameter,index) {
      if(parameter.id) {
        fetch('/api/endpoint/v1/delete/parameter', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parameter)
        });
      }
      this.endpoint.endpointParameters.splice(index,1);
    },
    addHeader: function() {
      let obj = {
        hKey: "",
        hVal: "",
      };
      this.endpoint.endpointHeaders.push(obj);
    },
    deleteHeader: function(header,index) {
      if(header.id) {
        fetch('/api/endpoint/v1/delete/headers', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(header)
        });
      }
      this.endpoint.endpointHeaders.splice(index,1);
    },
    saveEndpoint: function() {
        fetch('/api/endpoint/v1/save', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.endpoint)
        }).then(res => res.json())
        .then(data => {
          console.log(data);
          this.needSave = false;
          this.endpoint = data;
        });
    }
  },
  computed: {
    sortedParameters: function(){
      function compare(a, b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }
      if(this.endpoint.endpointParameters) {
        return this.endpoint.endpointParameters.sort(compare);
      }
    },
    getTeamLink: function() {
      return "/edit/"+this.$route.params.team;
    },
    getAppLink: function() {
      return "/edit/"+this.$route.params.team+"/"+this.$route.params.app;
    },
    checkEndpointLength: function() {
      if(this.endpoint.endpointParameters) {
        if(this.endpoint.endpointParameters.length === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },

}
</script>

<style>
.grid-address {
  position:relative;
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: 150px 150px auto;
  grid-template-rows: auto;
  grid-gap: 15px;
  margin-bottom:25px;
}
.grid-kv {
  position: relative;
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto 50px;
  grid-template-rows: auto;
  grid-gap: 15px;
  margin-bottom: 25px;
}
.grid-kvd {
  position: relative;
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: 200px 200px 200px auto 50px;
  grid-template-rows: auto;
  grid-gap: 15px;
  margin-bottom: 25px;
}
.grid-title {
  position: relative;
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: auto 50px;
  grid-template-rows: auto;
  grid-gap: 15px;
  margin-bottom: 25px;
}

.halfAndHalf {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-gap: 30px;
  margin-bottom: 30px;
}
.title-text {
  font-size: 30px;
  text-decoration: underline;
}
</style>