<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="row-end-button" style="grid-template-columns: auto 100px">
        <span>
          <a href="/edit" class="heading-link inline-block">Teams</a>
          <h2 class="heading-text inline-block" style="margin-right:8px;">/</h2>
          <h2 class="heading-text inline-block">{{ team.groupName }}</h2>
        </span>
      </div>

      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px">
          <h2 class="heading-text"> Select an application</h2>
          <v-btn color="primary" @click="newApplication=true">Create</v-btn>
        </div>
        <p>Applications contain documentation and endpoints.</p>
        <button class="n-row-button" v-for="application in applications" @click="chooseApplication(application.id)">
          <div class="application-button-layout">
            <v-icon color="black">mdi-application</v-icon>
            <p style="margin-top:15px;">{{application.applicationName}}</p>
            <p class="truncate" style="margin-top:15px;">{{application.applicationDescription}}</p>
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
      <div class="n-content-container">
        <h2>Users</h2>
        <div class="row-end-button" style="grid-template-columns: 500px 100px; grid-gap:15px;">
          <v-autocomplete v-model="userToAdd"
                          :items="allUsersFiltered"
                          item-text="username"
                          item-value="username"
                          placeholder="Start typing to Search"
                          prepend-icon="mdi-database-search"/>
          <v-btn color="success" style="top:50%;transform:translateY(-50%);" @click="addUserToGroup">Add</v-btn>
        </div>
        <v-simple-table style="width:615px;margin-bottom:15px;">
          <thead>
            <tr>
              <th class="text-left">Username</th>
              <th class="text-left">Role</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in sortedUsers">
              <td>{{ member.username }}</td>
              <td>{{ member.role }}</td>
              <td><v-btn color="error" style="height:30px;width:100%;" @click="removeUserFromGroup(member.id, index)">Remove</v-btn></td>
            </tr>
          </tbody>
        </v-simple-table>
        <h2>Requests</h2>
        <v-simple-table v-if="requests.length > 0" style="width:615px;margin-bottom:15px;">
          <thead>
            <tr>
              <th class="text-left">Username</th>
              <th class="text-left">Role</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in sortedRequests">
              <td>{{ request.username }}</td>
              <td>ADMIN</td>
              <td>
                <v-btn color="success" style="height:30px;width:50%;" @click="acceptRequest(request.id, index)">Accept</v-btn>
                <v-btn color="error" style="height:30px;width:50%;" @click="denyRequest(request.id, index)">Deny</v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <p v-else>There are currently no requests.</p>
      </div>
    </div>
    <!-- Popovers -->
    <NewApplication v-if="newApplication" :close="closePopover" :addApplication="createApplication"/>
  </div>
</template>

<script>
import { HeadersWithAuth } from '@/main.js'
import { getToken } from '@/main.js'
import NewApplication from '@/components/popovers/NewApplication';
export default {
  data: () => ({
    team: {},
    applications: [],
    allUsers: [],
    requests: [],
    newApplication: false,
    userToAdd: "",
  }),
  components: {
    NewApplication,
  },
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
      });
      // Application Info
      fetch('/api/application/v1/select/group/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.applications = data;
      });
      // Users Info
      fetch('/api/group/v1/showUsers',{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.allUsers = data;
      });
      // Requests
      fetch('/api/group/v1/requests/'+gid,{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.requests = data;
      });
    },
    closePopover: function() {
      this.newApplication = false;
    },
    createApplication: function(application) {
      application.groupId = this.team.id;
      fetch('/api/application/v1/add', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(application)
      }).then(res => res.json())
      .then(data => {
        data.endpoints = [];
        data.applicationEnvironments = [];
        this.applications.push(data);
      });
      this.closePopover();
    },
    chooseApplication: function(id) {
      let gid = this.$route.params.team
      this.$router.push('/edit/'+gid+'/'+id);
    },
    addUserToGroup: function() {
      let obj = {};
      obj.username = this.userToAdd;
      obj.group = this.$route.params.team;
      obj.role = "ADMIN";

      fetch('/api/group/v1/addMembership', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      }).then(res => res.json())
      .then(data => {
        this.team.groupMembership.push(data);
      });
    },
    acceptRequest: function(id,index) {
      fetch('/api/group/v1/accept/'+id, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.requests.splice(index,1);
        this.team.groupMembership.push(data);
      });
    },
    denyRequest: function(id, index) {
      fetch('/api/group/v1/deny/'+id, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        },
      }).then(data => {
        this.requests.splice(index,1);
      });
    },
    removeUserFromGroup: function(id, index) {
      let obj = {}
      obj.id = id;
      fetch('/api/group/v1/deleteMembership/'+id, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+getToken(),
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        this.team.groupMembership.splice(index, 1);
      });

    },
  },
  computed: {
    allUsersFiltered: function() {
      try {
        let userList = [];
        for(let i = 0; i < this.allUsers.length; i++) {
          let found = false;
          for(let j = 0; j < this.team.groupMembership.length; j++) {
            if(this.team.groupMembership[j].username === this.allUsers[i].username) {
              found = true;
            }
          }
          if(!found) {
            userList.push(this.allUsers[i].username);
          }
        }
        return userList;
      }
      catch(err) {
        console.log("error: "+err);
      }
    },
    sortedRequests: function() {
      function compare(a, b) {
        if (a.username < b.username)
          return -1;
        if (a.username > b.username)
          return 1;
        return 0;
      }
      if(this.requests) {
        return this.requests.sort(compare);
      }
    },
    sortedUsers: function() {
      function compare(a, b) {
        if (a.username < b.username)
          return -1;
        if (a.username > b.username)
          return 1;
        return 0;
      }
      if(this.team.groupMembership) {
        return this.team.groupMembership.sort(compare);
      }
    },
  }
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
.application-button-layout {
  height: 100%;
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 75px 150px auto auto 400px;
  grid-template-rows: auto;
  grid-gap: 15px;
}
</style>