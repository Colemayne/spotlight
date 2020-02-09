<template>
  <div class="ad-container">
    <div class="ad-card" style="padding:20px 40px;">
      <div class="n-content-container">
        <div class="row-end-button" style="grid-template-columns: auto 100px">
          <h2 class="heading-text">Select A Team.</h2>
        </div>
        <p>Select a team to view their applications.</p>
        <button class="n-row-button" v-for="group in groups" @click="chooseTeam(group.id)">
          <div class="team-button-layout">
            <v-icon color="black">mdi-account-group</v-icon>
            <p style="margin-top:15px;">{{group.groupName}}</p>
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
    groups: [],
  }),
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      fetch('/api/group/v1/select',{
        method: 'GET',
        headers: HeadersWithAuth({})
      }).then(res => res.json())
      .then(data => {
        this.groups = data;
      });
    },
    chooseTeam: function(id) {
      this.$router.push('/documentation/'+id);
    },
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