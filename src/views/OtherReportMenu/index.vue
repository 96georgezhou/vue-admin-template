<template>
  <div class ="centerButtons">
    <p>
      <router-link to="/group_report/classindex" tag="button">  Class Report </router-link><br><br>
      <router-link to="/group_report/schoolindex" tag="button">  School Reports </router-link><br><br>
      <router-link to="/group_report/districtindex" tag="button">  District Reports </router-link>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    navigate() {
      this.router.push('/table')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .centerButtons {
    text-align: center;
  }
</style>
