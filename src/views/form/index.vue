<template>
  <div class="report-container">
    <form id="report" :model="studentform" name= "formStudent" onsubmit="return onexport()">
      <p>
        <label>First Name</label>
        <input v-model="studentform.firstname" type="text" name="fname" required >
      </p><br>
      <p>
        <label>Middle Name</label>
        <input v-model="studentform.middlename" type="text" name="mname" required >
      </p><br>
      <p>
        <label>Last Name</label>
        <input v-model="studentform.lastname" type="text" name="lname" required >
      </p><br>
      <p>
        <label>Date of Birth</label>
        <input v-model="studentform.dob" type="date" name="dob" required >
      </p><br>
      <p>
        <label>Grade</label>
        <input v-model="studentform.grade" type="text" name="grade" required >
      </p><br>
      <p>
        <label>School Name</label>
        <select name="school name">
          <option value="Bellevue Grade School">Bellevue Grade School</option>
          <option value="Seattle Grade School">Seattle Grade School</option>
          <option value="Redmond Grade School">Redmond Grade School</option>
          <option value="Mont Grade School">Mont Grade School</option>
        </select>
      </p><br>
      <p>
        <label>School District</label>
        <select name="school District">
          <option value="District 1">District 1</option>
          <option value="District 2">District 2</option>
          <option value="District 3">District 3</option>
          <option value="District 4">District 4</option>
        </select>
      </p><br>
      <p>
        <label>Class Name</label>
        <input v-model="studentform.classname" type="text" name="cname" required>
      </p>
      <br>
      <br>
      <button type="submit" @click="onexport">Download Student Report</button>
    </form>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    return {
      studentform: {
        firstname: '',
        middlename: '',
        lastname: '',
        dob: '',
        schoolname: '',
        schooldistrict: '',
        classname: ''
      }
    }
  },
  methods: {
    onexport() {
      if (document.forms['formStudent']['fname'].value === '' || document.forms['formStudent']['mname'].value === '' || document.forms['formStudent']['lname'].value === '' ||
        document.forms['formStudent']['dob'].value === '' ||
        document.forms['formStudent']['grade'].value === '' ||
        document.forms['formStudent']['cname'].value === '') {
        this.$message('Error: Input is empty!')
      } else {
        this.$message('submitted!')
        this.$store.dispatch('SendAPI', this.studentform).then((res) => {
          var studentInfo = XLSX.utils.json_to_sheet(res)
          var wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, studentInfo, 'StudentReport') // StudentReport is name of Worksheet
          XLSX.writeFile(wb, 'book.xlsx')
        })
      }
    }
  }
}
</script>
<style>
  form  { display: table;      }
  p     { display: table-row;  }
  label { display: table-cell; }
  input { display: table-cell; }
</style>

