<template>
  <div class="report-container">
    <form id="classreport" :model="schoolform">
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
      <button id="button-a" button type="button" @click="onexport">Download School Report</button>
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
      schoolform: {
        schoolname: '',
        schooldistrict: ''
      }
    }
  },
  methods: {
    onexport() {
      this.$message('submitted!')
      this.$store.dispatch('SendAPIforSchool', this.schoolform).then((res) => {
        var flattenedJSON = this.flattenJSON(res)
        // console.log(JSON.stringify(flattenedJSON))
        var wb = XLSX.utils.book_new()
        var studentInfo = XLSX.utils.json_to_sheet(flattenedJSON)
        XLSX.utils.book_append_sheet(wb, studentInfo, 'School Report') // StudentReport is name of Worksheet
        XLSX.writeFile(wb, 'test.xlsx')
      })
    },
    flattenJSON: function(jsonObj) {
      console.log('reaching flatten')
      var flatArray = []
      var heading = ['Class Name', 'ID', 'DOB', 'Task/Type', 'Task/diagnosis', 'Task/duration', 'Task/Result/EyeTested', 'Task/Result/Num_Correct', 'Task/Result/Num_Incorrect']
      flatArray.push(heading)

      for (var classIndex = 0; classIndex < jsonObj.length; classIndex++) {
        var classJson = jsonObj[classIndex]
        var entryLine = ''
        entryLine += this.readJsonPropertyValue(classJson, 'class_name')
        // console.log('EntryLine: ' + entryLine + ' len = ' + classJson.userInClass.length)

        for (var index = 0; index < classJson.userInClass.length; index++) {
          console.log('hey')
          var userJson = classJson.userInClass[index]
          console.log('userJSON: ' + JSON.stringify(userJson))
          var entryLineUserTask = ''

          entryLineUserTask += this.readJsonPropertyValue(userJson, 'id')
          entryLineUserTask += ',' + this.readJsonPropertyValue(userJson, 'dob')
          // console.log('entryLineUserTask = ' + entryLineUserTask)

          for (var indexTask = 0; indexTask < userJson.tasks.length; indexTask++) {
            var taskJson = userJson.tasks[indexTask]
            var entryLineTask = ''
            entryLineTask += this.readJsonPropertyValue(taskJson, 'type')
            entryLineTask += ',' + this.readJsonPropertyValue(taskJson, 'diagnosis')
            entryLineTask += ',' + this.readJsonPropertyValue(taskJson, 'duration')
            // console.log('entryLineTask = ' + entryLineTask)

            for (var resultIndex = 0; resultIndex < taskJson.results.length; resultIndex++) {
              var resultJson = taskJson.results[resultIndex]
              var entryResult = ''
              entryResult += this.readJsonPropertyValue(resultJson, 'eyeTested')
              entryResult += ',' + this.readJsonPropertyValue(resultJson, 'num_misses')
              entryResult += ',' + this.readJsonPropertyValue(resultJson, 'num_correct')
              // console.log(entryLine + ',' + entryLineTask + ',' + entryResult)
              var finalRow = entryLine + ',' + entryLineUserTask + ',' + entryLineTask + ',' + entryResult
              flatArray.push(finalRow.split(','))
            }
          }
        }
      }
      // console.log(JSON.stringify(flatArray))
      return flatArray
    },
    readJsonPropertyValue: function(jsonObj, propertName) {
      console.log('reaching read JSON' + propertName)
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

