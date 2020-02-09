<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px">
          <h2 class="heading-text">Select An Application</h2>
        </div>
        <p>Select a team to view their applications.</p>
        <button class="n-row-button" v-for="application in applications" @click="chooseApplication(application.id)">
          <div class="application-button-layout">
            <v-icon color="black">mdi-application</v-icon>
            <p style="margin-top:15px;">{{application.applicationName}}</p>
            <p style="margin-top:15px;">{{application.applicationDescription}}</p>
            <div />
            <span style="padding-top:5px;text-align:right">
              <v-chip class="ma-2" color="grey" text-color="white">
                    {{application.applicationPort}}
              </v-chip>
              <v-chip class="ma-2" color="grey" text-color="white">
                    {{application.applicationEnvironments.length}}
              </v-chip>
              <v-chip class="ma-2" color="grey" text-color="white">
                    {{application.endpoints.length}}
              </v-chip>
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { HeadersWithAuth } from '@/main.js'
export default {
  data:() => ({
    team: {},
    applications: [],
  }),
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      let gid = this.$route.params.team;
      // Group Info
      fetch('/api/group/v1/select/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.team = data[0];
        console.log(data);
      });
      // Application Info
      fetch('/api/application/v1/select/group/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.applications = data;
      });
    },
    chooseApplication: function(id) {
      this.$router.push('/documentation/'+this.$route.params.team+'/'+id);
    }
  },
}
</script>

<style>
.grid-table {
  position: relative;
  min-height: 100px;
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(150px);
  grid-gap: 15px;
}
</style>