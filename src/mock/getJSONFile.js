var fs = require('fs')
var finaljson = []

function Task(type, diagnosis, duration, results) {
  this.type = type
  this.diagnosis = diagnosis
  this.duration = duration
  this.results = results
}
var readStudentInfo = function(user) {
  function Student(id, dob) {
    this.id = id
    this.dob = dob
  }
  var student = new Student(user.student_id, user.date_of_birth)
  return student
}
var printTestResults = function(tests) {
  console.log('finalJSON = ' + JSON.stringify(name))
  console.log('test summary:')
  for (var i = 0; i < tests.length; i++) {
    // console.log( "Test Name : " + tests[i].type + " Result: " + tests[i].diagnosis );
    finaljson.push(tests[i])
    // console.log(JSON.stringify(tests[i]));
  }
  console.log(JSON.stringify(finaljson))
}
var taskResults = function(results) {
  var res = []
  for (var i = 0; i < results.length; i++) {
    // creating object of Result
    var r = { eye: results[i].eye, eyeTested: results[i].eyeTested, num_misses: results[i].num_misses, num_correct: results[i].num_correct }
    res.push(r)
  }
  return res
}
var readResults = function(tasks) {
  var tests = [] // Near V, Dv, Stereopsis, CISS
  // var surveySummary
  var surveyQuestions = []

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    if (task.toolbox_task_type === 'Near' || task.toolbox_task_type === 'Distance No Flippers' ||
      task.toolbox_task_type === 'Distance With Flippers' || task.toolbox_task_type === 'Stereopsis') {
      var results = taskResults(task.results)// results portion of the tasks
      var newTask = new Task(task.toolbox_task_type, task.diagnosis, task.duration, results)
      tests.push(newTask)
    } else if (task.toolbox_task_type === 'CISS') {
      // surveySummary = task
    } else {
      surveyQuestions.push(task) // CISS questions
    }
  }
  printTestResults(tests)
}

export function readFile() {
  console.log('finalJSON = ' + JSON.stringify(finaljson))
  var obj = JSON.parse(fs.readAsText('input.json', 'utf8'))
  //	console.log( obj );
  var student = readStudentInfo(obj.user) // get "user" portion from the json
  readResults(obj.tasks)// get "tasks" portion from the json
  console.log(student)
  console.log('with student : ' + JSON.stringify(finaljson))
  return finaljson
}
