<template>
  <div class="report-container">
    <form id="classreport" :model="classform" name= "formClass" onsubmit="return onexport()">
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
        <label>School Name</label>
        <select name="school name">
          <option value="Bellevue Grade School">Bellevue Grade School</option>
          <option value="Seattle Grade School">Seattle Grade School</option>
          <option value="Redmond Grade School">Redmond Grade School</option>
          <option value="Mont Grade School">Mont Grade School</option>
        </select>
      </p><br>
      <p>
        <label>Class Name</label>
        <input v-model="classform.classname" type="text" name= "cname" placeholder="Class Name" required>
      </p><br>
      <button id="button-a" button type="submit" @click="onexport">Download Class Report</button>
      <br>
      <br>
    </form>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    return {
      classform: {
        schoolname: '',
        schooldistrict: '',
        classname: ''
      }
    }
  },
  methods: {
    onexport() {
      if (document.forms['formClass']['cname'].value === '') {
        this.$message('Error: Input is empty!')
      } else {
        this.$message('submitted!')
        this.$store.dispatch('SendAPIforClass', this.classform).then((res) => {
          var flatten = this.flattenJSON(res)
          var studentInfo = XLSX.utils.aoa_to_sheet(flatten)
          var wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, studentInfo, 'StudentReport') // StudentReport is name of Worksheet
          XLSX.writeFile(wb, 'book.xlsx')
        })
      }
    },
    flattenJSON: function(jsonObj) {
      var flatArray = []
      //  var flatObject = {}
      var heading = ['ID', 'DOB', 'Task/Type', 'Task/diagnosis', 'Task/duration', 'Task/Result/EyeTested', 'Task/Result/Num_Correct', 'Task/Result/Num_Incorrect']
      flatArray.push(heading)
      for (var index = 0; index < jsonObj.length; index++) {
        var userJson = jsonObj[index]
        var entryLine = ''
        entryLine += this.readJsonPropertyValue(userJson, 'id')
        entryLine += ',' + this.readJsonPropertyValue(userJson, 'dob')
        for (var indexTask = 0; indexTask < userJson.tasks.length; indexTask++) {
          var taskJson = jsonObj[index].tasks[indexTask]
          var entryLineTask = ''
          entryLineTask += this.readJsonPropertyValue(taskJson, 'type')
          entryLineTask += ',' + this.readJsonPropertyValue(taskJson, 'diagnosis')
          entryLineTask += ',' + this.readJsonPropertyValue(taskJson, 'duration')
          for (var resultIndex = 0; resultIndex < taskJson.results.length; resultIndex++) {
            var resultJson = taskJson.results[resultIndex]
            var entryResult = ''
            entryResult += this.readJsonPropertyValue(resultJson, 'eyeTested')
            entryResult += ',' + this.readJsonPropertyValue(resultJson, 'num_misses')
            entryResult += ',' + this.readJsonPropertyValue(resultJson, 'num_correct')
            // console.log(entryLine + ',' + entryLineTask + ',' + entryResult)
            var finalRow = entryLine + ',' + entryLineTask + ',' + entryResult
            flatArray.push(finalRow.split(','))
          }
        }
      }
      console.log(JSON.stringify(flatArray))
      return flatArray
    },
    readJsonPropertyValue: function(jsonObj, propertName) {
      try {
        return jsonObj[propertName]
      } catch (ex) {
        return ' '
      }
    }
  }
}
</script>

<style scoped>
  form  { display: table;      }
  p     { display: table-row;  }
  label { display: table-cell; }
  input { display: table-cell; }
</style>

