<template lang="html">
  <div id="changePass">
    <el-form ref="form" :model="form" label-width="170px" title="Change Password">
      <h1 align="center">Change Password</h1>
      <hr style="border: 0.5px solid #EAEAEA;" >
      <el-form-item label="Old Password: ">
        <el-input v-model="form.oldPass" type="password" name="oldPass" />
      </el-form-item>
      <el-form-item align="right">
        <el-button type="infor" @click="forgotPass()">Forgot Password</el-button>
      </el-form-item>
      <hr style="border: 0.5px solid #EAEAEA;" >
      <el-form-item label="New Password: ">
        <el-input v-model="form.newPass" type="password" name="newPass"/>
      </el-form-item>
      <hr style="border: 0.5px solid #EAEAEA;" >
      <el-form-item label="Confirm Password:">
        <el-input v-model="form.confirmPass" type="password" name="confirmPass"/>
      </el-form-item>
      <hr style="border: 0.5px solid #EAEAEA;" >
      <el-form-item align="right">
        <el-button type="primary" @click="changePassword()">Change Password</el-button>
      </el-form-item>
      <p id="message"/>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ChangePass',
  data() {
    return {
      form: {
        oldPass: '',
        newPass: '',
        comfirmPass: ''
      }
    }
  },
  methods: {
    changePassword() {
      if (this.form.oldPass !== '') {
        // insert code that will check if the oldPass == the actual old password
        if (this.form.newPass !== '' && this.form.confirmPass !== '') {
          if (this.form.newPass === this.form.confirmPass) {
            // this.$emit("authenticated", true);
            document.getElementById('message').innerHTML = 'Password changed'
            // this.$router.replace({ name: "secure" });
          } else {
            document.getElementById('message').innerHTML = 'Passwords do not match'
          }
        } else {
          document.getElementById('message').innerHTML = 'Please enter and confirm your new password'
        }
      } else {
        document.getElementById('message').innerHTML = 'Please enter your old password.'
      }
    },

    forgotPass() {
      alert('Please check your inbox for your old password.')
    }
  }
}
</script>

<style scoped>
  #changePass {
    width: 545px;
    border: 1px solid #CCCCCC;
    background-color: #FFFFFF;
    margin: auto;
    margin-top: 120px;
    padding: 10px;
  }
</style>
