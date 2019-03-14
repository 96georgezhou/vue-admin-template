<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Login name" >
        <el-input v-model="form.loginName" style="width:48%;" />
      </el-form-item>
      <el-form-item label="Email" >
        <el-input v-model="form.email" style="width:48%;" />
      </el-form-item>
      <el-form-item label="First Name" >
        <el-input v-model="form.firstName" style="width:48%;" />
      </el-form-item>
      <el-form-item label="Last Name" >
        <el-input v-model="form.lastName" style="width:48%;" />
      </el-form-item>
      <el-form-item label="Gender">
        <el-select v-model="form.gender" placeholder="Please select your gender" style="width:48%;">
          <el-option label="Male" value="0"/>
          <el-option label="Female" value="1"/>
          <el-option label="Rather not say" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Date of Birth" >
        <el-date-picker
          v-model="form.dob"
          type="date"
          placeholder="Please pick your Birthday"
          style="width:48%;"/>
      </el-form-item>
      <el-form-item label="Phone" >
        <el-input v-model="form.phone" style="width:48%;" />
      </el-form-item>
      <el-form-item label="Organization" >
        <el-input v-model="form.organization" style="width:48%;" />
      </el-form-item>
      <el-form-item label="Role">
        <el-select v-model="form.role" placeholder="Please select your role" style="width:48%;">
          <el-option label="Administrator" value="0"/>
          <el-option label="Nurse" value="1"/>
          <el-option label="Parent" value="2"/>
          <el-option label="Researcher" value="3"/>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="Activity time">-->
      <!--<el-col :span="11">-->
      <!--<el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>-->
      <!--</el-col>-->
      <!--<el-col :span="2" class="line">-</el-col>-->
      <!--<el-col :span="11">-->
      <!--<el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>-->
      <!--</el-col>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="Instant delivery">-->
      <!--<el-switch v-model="form.delivery"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="Activity type">-->
      <!--<el-checkbox-group v-model="form.type">-->
      <!--<el-checkbox label="Online activities" name="type"/>-->
      <!--<el-checkbox label="Promotion activities" name="type"/>-->
      <!--<el-checkbox label="Offline activities" name="type"/>-->
      <!--<el-checkbox label="Simple brand exposure" name="type"/>-->
      <!--</el-checkbox-group>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="Resources">-->
      <!--<el-radio-group v-model="form.resource">-->
      <!--<el-radio label="Sponsor"/>-->
      <!--<el-radio label="Venue"/>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="Comment" >
        <el-input v-model="form.desc" type="textarea" style="width:48%;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">Sign Up</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        loginName: '',
        email: '',
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        phone: '',
        organization: '',
        role: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>
