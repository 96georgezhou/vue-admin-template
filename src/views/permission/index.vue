<template>
  <div align="center" >
    <h2>Please select role:</h2>
    <el-radio-group v-model="radio3">
      <el-radio-button label="Administrator"/>
      <el-radio-button label="School Nurse"/>
      <el-radio-button label="Parent"/>
      <el-radio-button label="Researcher"/>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      radio3: 'Administrator'
    }
  }
}
</script>

<style scoped>

</style>
