<template>
  <div class = "report-container">
    <form id = "report" :model="studentform">
      <label>First Name</label>
      <input v-model="studentform.firstname" type = "text" placeholder="First Name : " ><br>
      <label>Middle Name</label>
      <input v-model="studentform.middlename" type = "text" placeholder="Middle Name : " ><br>
      <label>Last Name</label>
      <input v-model="studentform.lastname" type = "text" placeholder="Last Name : " ><br>
      <label>Date of Birth</label>
      <input v-model="studentform.dob" type = "date" placeholder="Date Of Birth : " ><br>
      <label>Grade</label>
      <input v-model="studentform.grade" type = "text" placeholder="Grade : " ><br>
      <label>School Name</label>
      <input v-model="studentform.schoolname" type = "text" placeholder="School Name : " ><br>
      <label>School District</label>
      <input v-model="studentform.schooldistrict" type = "text" placeholder="School District : " ><br>
      <label>Class Name</label>
      <input v-model="studentform.classname" type = "text" placeholder="Class Name : " ><br>
      <button type="button" @click="onexport">Student Report</button>
    </form>
  </div>
</template>
// We will make a Workbook contains 2 Worksheets
/* 'User': [{
  'type': 'Near',
  'diagnosis': 'Pass',
  'duration': '00:25:269',
  'results': [{
    'eye': 0,
    'eyeTested': 'Left',
    'num_misses': 3,
    'num_correct': 1
  }, {
    'eye': 1,
    'eyeTested': 'Right',
    'num_misses': 3,
    'num_correct': 1
  }, {
    'eye': 2,
    'eyeTested': 'Both',
    'num_misses': 3,
    'num_correct': 1
  }]
}, {
  'type': 'Distance No Flippers',
  'diagnosis': 'Fail',
  'duration': '00:14:355',
  'results': [{
    'eye': 0,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }, {
    'eye': 1,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }, {
    'eye': 2,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }]
}, {
  'type': 'Distance With Flippers',
  'diagnosis': 'Pass',
  'duration': '00:16:322',
  'results': [{
    'eye': 0,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }, {
    'eye': 1,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }, {
    'eye': 2,
    'eyeTested': 'None',
    'num_misses': 0,
    'num_correct': 4
  }]
}, {
  'type': 'Stereopsis',
  'diagnosis': 'Pass',
  'duration': '00:03:669',
  'results': [{
    'eye': 2,
    'eyeTested': 'None',
    'num_misses': 3,
    'num_correct': 1
  }]
}, {
  'id': '123AK234',
  'dob': '2000-10-02'
}]*/
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
      this.$message('submitted!')
      this.$store.dispatch('SendAPI', this.studentform).then((res) => {
        var studentInfo = XLSX.utils.json_to_sheet(JSON.stringify(res))
        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, studentInfo, 'StudentReport') // StudentReport is name of Worksheet
        XLSX.writeFile(wb, 'book.xlsx')
      }).catch(() => {
        console.log('not entered')
      })
    }
  }
}
</script>
      // }
      /* var studentInfo = XLSX.utils.json_to_sheet(this.Datas.Users)
      // var animalWS = XLSX.utils.json_to_sheet(this.Datas.animals)
      // var pokemonWS = XLSX.utils.json_to_sheet(this.Datas.pokemons)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, studentInfo, 'StudentReport') // sheetAName is name of Worksheet
      // XLSX.utils.book_append_sheet(wb, pokemonWS, 'pokemons')
      XLSX.writeFile(wb, 'book.xlsx') */
      // }
      /* onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    } */
      // }

    <!--<div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="First Name" >
            <el-input v-model="form.firstName" style="width:48%;" />
          </el-form-item>
          <el-form-item label="Last Name" >
            <el-input v-model="form.lastName" style="width:48%;" />
          </el-form-item>
          <el-form-item label="Date of Birth" >
            <el-date-picker
              v-model="form.dob"
              type="date"
              placeholder="Please pick your Birthday"
              style="width:48%;"/>
          </el-form-item>
      <el-input v-model="form.desc" type="textarea" style="width:48%;"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Generate Report</el-button>
      <el-button @click="onCancel">Cancel</el-button>
    </el-form-item>-->

<!-- </div>&ndash;&gt;-->

<style scoped>
  .line{
    text-align: center;
  }
</style>

