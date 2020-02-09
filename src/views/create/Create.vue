<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px">
          <h2 class="heading-text">Select A Team.</h2>
          <v-btn color="primary" @click="newGroup=true">Create</v-btn>
        </div>
        <p>Team's marked with a lock require more access than this account currently possess.</p>
        <button class="n-row-button" v-for="group in myGroups" @click="chooseGroup(group.id)">
          <div class="team-button-layout">
            <v-icon color="black">mdi-account-group</v-icon>
            <p style="margin-top:15px;">{{group.groupName}}</p>
          </div>
        </button>
        <div class="n-row-button-no-hover" v-for="group in otherGroups">
          <div class="team-button-layout">
            <v-icon color="black">mdi-lock</v-icon>
            <p style="margin-top:15px;">{{group.groupName}}</p>
            <div />
            <v-btn text color="error" v-if="!checkRequest(group.id)" style="margin-top:10px;" @click="requestAccess(group.id)" >Request Access</v-btn>
            <v-btn text color="error" disabled v-else style="margin-top:10px;" @click="requestAccess(group.id)" >Access Requested</v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- POPOVERS -->
    <NewTeam v-if="newGroup" :close="closePopover" :addTeam="createTeam"/>
  </div>
</template>

<script>
import { HeadersWithAuth } from '@/main.js'
import NewTeam from '@/components/popovers/NewTeam';
import { getUsername } from '@/main.js'
export default {
  data: () => ({
    myGroups: [],
    otherGroups:[],
    newGroup: false,
    requests:[],
  }),
  components: {
    NewTeam,
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      fetch('/api/group/v1/tailoredSelect',{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.myGroups = data.myGroups;
        this.otherGroups = data.otherGroups;
        console.log(data);
      });
      fetch('/api/group/v1/requests',{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.requests = data;
      });
    },
    closePopover: function() {
      this.newGroup = false;
    },
    createTeam: function(name) {
      console.log(name);
      fetch('/api/group/v1/add', {
        method: 'POST',
        headers: HeadersWithAuth({
          'Content-Type': 'application/json'
        }),
        body: name
      }).then(res => res.json())
      .then(data => {
        data.groupMembership = [];
        this.myGroups.push(data);
      });
      this.newGroup = false;
    },
    requestAccess: function(id) {
      let obj = {}
      obj.groupId = id;
      obj.username = getUsername();
      fetch('/api/group/v1/requestMembership/'+id, {
        method: 'POST',
        headers: HeadersWithAuth({
          'Content-Type': 'application/json'
        }),
      }).then(data => {
        this.requests.push(obj);
      });
    },
    checkRequest: function(id) {
        let found = false;
        for(let i = 0; i < this.requests.length; i ++) {
          if(this.requests[i].groupId === id) {
            found = true;
            break;
          }
        }
        return found;
    },
    chooseGroup: function(groupId) {
      this.$router.push('/edit/'+groupId);
    }
  },


}

</script>

<style>
.create-button {
  position: absolute;
  height: 60px;
  width: 200px;
  top: 15px;
  right: 15px;
}
.team-button-layout {
  height: 100%;
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 75px 300px auto 200px;
  grid-template-rows: auto;
}
</style>