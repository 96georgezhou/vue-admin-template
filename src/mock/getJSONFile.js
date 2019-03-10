// var fs = require('fs')

function Task(type, diagnosis, duration, results) {
  this.type = type
  this.diagnosis = diagnosis
  this.duration = duration
  this.results = results
}
var readStudentInfo = function(jsonobj) {
  function Student(id, dob) {
    this.id = id
    this.dob = dob
  }
  var student = new Student(jsonobj.student_id, jsonobj.date_of_birth)
  return student
}
function User(id, dob, tasks) {
  this.id = id
  this.dob = dob
  this.tasks = tasks
}
function Class(class_name, userInClass) {
  this.class_name = class_name
  this.userInClass = userInClass
}
function School(school_name, classInSchool) {
  this.school_name = school_name
  this.classInSchool = classInSchool
}
var printTestResults = function(querytype, tests, userObj) {
  var finaljson = []
  if (querytype === 'singlestudent') {
    var student = readStudentInfo(userObj.user) // get "user" portion from the json
    finaljson.push(student)
  }
  // console.log('test summary:' + tests.length)
  for (var i = 0; i < tests.length; i++) {
    // console.log( "Test Name : " + tests[i].type + " Result: " + tests[i].diagnosis );
    finaljson.push(tests[i])
    // console.log(JSON.stringify(tests[i]));
  }
  // console.log('final json: ' + JSON.stringify(finaljson))
  return finaljson
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
var readResults = function(querytype, jsonObj) {
  var parsedJSON = {}
  // testsjson[key] = []
  switch (querytype) {
    case 'singlestudent':
      parsedJSON = getResultsFromTasks(querytype, jsonObj.tasks, jsonObj)
      break
    case 'classwise':
      parsedJSON = getResultsFromUsers(querytype, jsonObj.Users, jsonObj)
      break
    case 'schoolwise':
      parsedJSON = getResultsFromSchools(querytype, jsonObj.classes, jsonObj)
      break
    case 'districtwise':
      parsedJSON = getResultsFromDistrict(querytype, jsonObj.Schools, jsonObj)
      break
    default:
      break
  }
  return parsedJSON
}
var getResultsFromTasks = function(querytype, tasks, mainobj) {
  var tests = []// Near V, Dv, Stereopsis, CISS
  // var surveySummary
  // console.log(JSON.stringify(tasks))
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
  // console.log('tests' + JSON.stringify(tests))
  var jsonOfTasks = printTestResults(querytype, tests, mainobj)
  return jsonOfTasks
}
var getResultsFromUsers = function(querytype, users, jsonObj) {
  var usersResults = []
  for (var i = 0; i < users.length; i++) {
    var user = users[i]
    var tasksUnderUser = getResultsFromTasks('classwise', user.tasks, user)
    var userobj = new User(user.student_id, user.date_of_birth, tasksUnderUser)
    usersResults.push(userobj)
  }
  // console.log('tests' + JSON.stringify(usersResults))
  var jsonOfUsers = printTestResults(querytype, usersResults, jsonObj)
  return jsonOfUsers
}
var getResultsFromSchools = function(querytype, classes, jsonObj) {
  var classesResults = []
  for (var i = 0; i < classes.length; i++) {
    var classname = classes[i]
    var userUnderClass = getResultsFromUsers('schoolwise', classname.Users, classname)
    var classObj = new Class(classname.class_name, userUnderClass)
    classesResults.push(classObj)
  }
  var jsonOfClasses = printTestResults(querytype, classesResults, jsonObj)
  return jsonOfClasses
}

var getResultsFromDistrict = function(querytype, schools, jsonObj) {
  var districtResults = []
  for (var i = 0; i < schools.length; i++) {
    var school = schools[i]
    var classesInSchool = getResultsFromSchools('districtwise', school.classes, school)
    var schoolObj = new School(school.school_name, classesInSchool)
    districtResults.push(schoolObj)
  }
  var jsonOfSchools = printTestResults(querytype, districtResults, jsonObj)
  return jsonOfSchools
}

function loadJSON() {
  var obj = {
    'app_name': 'QuickVisionCheck',
    'start_time': '2019-01-17 01:39:33',
    'total_time': '',
    'device': 'mobile',
    'app_version': '',
    'os': '',
    'os_build_version': '',
    'tasks': [
      {
        'toolbox_task_type': 'Near',
        'results': [
          {
            'eye': 0,
            'eyeTested': 'Left',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 1,
            'eyeTested': 'Right',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 2,
            'eyeTested': 'Both',
            'num_misses': 3,
            'num_correct': 1
          }
        ],
        'diagnosis': 'Pass',
        'duration': '00:25:269'
      },
      {
        'toolbox_task_type': 'Distance No Flippers',
        'results': [
          {
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
        ],
        'diagnosis': 'Fail',
        'duration': '00:14:355'
      },
      {
        'toolbox_task_type': 'Distance With Flippers',
        'results': [
          {
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
        ],
        'diagnosis': 'Pass',
        'duration': '00:16:322'
      },
      {
        'toolbox_task_type': 'Stereopsis',
        'results': [
          {
            'num_misses': 3,
            'num_correct': 1
          }
        ],
        'diagnosis': 'Pass',
        'duration': '00:03:669'
      },
      {
        'toolbox_task_type': 'CISS',
        'score': 16,
        'diagnosis': 'Student is showing symptoms.',
        'duration': '00:06:320'
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 0,
        'answer': '1. Do your eyes feel tired when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 1,
        'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 2,
        'answer': '3. Do you have headaches when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 3,
        'answer': '4. Do you feel sleepy when reading or doing class work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 4,
        'answer': '5. Do you lose concentration when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 5,
        'answer': '6. Do you have trouble remembering what you have read?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 6,
        'answer': '7. Do you have double vision when reading of doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 7,
        'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 8,
        'answer': '9. Do you feel like you read slowly?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 9,
        'answer': '10. Do your eyes ever hurt when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 10,
        'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 11,
        'answer': '12. Do you feel a \'pulling\' feeling around your eyes when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 12,
        'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 13,
        'answer': '14. Do you lose your place while reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 14,
        'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
        'time_spent_sec': 0
      }
    ],
    'user': {
      'student_id': '123AK234',
      'date_of_birth': '2000-10-02',
      'student_first_name': 'John',
      'student_last_name': 'Doe',
      'student_grade': '1',
      'school_name': 'school',
      'school_district': 'district'
    }
  }

  return obj
}
function loadClassJSON() {
  var obj = {
    'app_name': 'QuickVisionCheck',
    'class_name': 'a',
    'Users': [{
      'student_id': '123AK234',
      'date_of_birth': '2000-10-02',
      'tasks': [{
        'toolbox_task_type': 'Near',
        'results': [{
          'eye': 0,
          'eyeTested': 'Left',
          'num_misses': 3,
          'num_correct': 1
        },
        {
          'eye': 1,
          'eyeTested': 'Right',
          'num_misses': 3,
          'num_correct': 1
        },
        {
          'eye': 2,
          'eyeTested': 'Both',
          'num_misses': 3,
          'num_correct': 1
        }
        ],
        'diagnosis': 'Pass',
        'duration': '00:25:269'
      },
      {
        'toolbox_task_type': 'Distance No Flippers',
        'results': [{
          'eye': 0,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 1,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 2,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        }
        ],
        'diagnosis': 'Fail',
        'duration': '00:14:355'
      },
      {
        'toolbox_task_type': 'Distance With Flippers',
        'results': [{
          'eye': 0,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 1,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 2,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        }
        ],
        'diagnosis': 'Pass',
        'duration': '00:16:322'
      },
      {
        'toolbox_task_type': 'Stereopsis',
        'results': [{
          'num_misses': 3,
          'num_correct': 1
        }],
        'diagnosis': 'Pass',
        'duration': '00:03:669'
      },
      {
        'toolbox_task_type': 'CISS',
        'score': 16,
        'diagnosis': 'Student is showing symptoms.',
        'duration': '00:06:320'
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 0,
        'answer': '1. Do your eyes feel tired when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 1,
        'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 2,
        'answer': '3. Do you have headaches when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 3,
        'answer': '4. Do you feel sleepy when reading or doing class work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 4,
        'answer': '5. Do you lose concentration when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 5,
        'answer': '6. Do you have trouble remembering what you have read?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 6,
        'answer': '7. Do you have double vision when reading of doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 7,
        'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 8,
        'answer': '9. Do you feel like you read slowly?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 9,
        'answer': '10. Do your eyes ever hurt when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 10,
        'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 11,
        'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 12,
        'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 13,
        'answer': '14. Do you lose your place while reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 14,
        'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
        'time_spent_sec': 0
      }
      ]
    },
    {
      'student_id': '754BT897',
      'date_of_birth': '2000-06-12',
      'tasks': [{
        'toolbox_task_type': 'Near',
        'results': [{
          'eye': 0,
          'eyeTested': 'Left',
          'num_misses': 2,
          'num_correct': 2
        },
        {
          'eye': 1,
          'eyeTested': 'Right',
          'num_misses': 1,
          'num_correct': 3
        },
        {
          'eye': 2,
          'eyeTested': 'Both',
          'num_misses': 1,
          'num_correct': 3
        }
        ],
        'diagnosis': 'Fail',
        'duration': '00:20:269'
      },
      {
        'toolbox_task_type': 'Distance No Flippers',
        'results': [{
          'eye': 0,
          'eyeTested': 'None',
          'num_misses': 1,
          'num_correct': 3
        },
        {
          'eye': 1,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 2,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        }
        ],
        'diagnosis': 'Pass',
        'duration': '00:14:355'
      },
      {
        'toolbox_task_type': 'Distance With Flippers',
        'results': [{
          'eye': 0,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 1,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        },
        {
          'eye': 2,
          'eyeTested': 'None',
          'num_misses': 0,
          'num_correct': 4
        }
        ],
        'diagnosis': 'Pass',
        'duration': '00:16:322'
      },
      {
        'toolbox_task_type': 'Stereopsis',
        'results': [{
          'num_misses': 2,
          'num_correct': 2
        }],
        'diagnosis': 'Fail',
        'duration': '00:02:139'
      },
      {
        'toolbox_task_type': 'CISS',
        'score': 16,
        'diagnosis': 'Student is showing symptoms.',
        'duration': '00:06:320'
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 0,
        'answer': '1. Do your eyes feel tired when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 1,
        'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 2,
        'answer': '3. Do you have headaches when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 3,
        'answer': '4. Do you feel sleepy when reading or doing class work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 4,
        'answer': '5. Do you lose concentration when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 5,
        'answer': '6. Do you have trouble remembering what you have read?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 6,
        'answer': '7. Do you have double vision when reading of doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 7,
        'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 8,
        'answer': '9. Do you feel like you read slowly?',
        'time_spent_sec': 0
      },
      {

        'toolbox_task_type': 'CISS_Question',
        'question_num': 9,
        'answer': '10. Do your eyes ever hurt when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 10,
        'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 11,
        'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 12,
        'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 13,
        'answer': '14. Do you lose your place while reading or doing close work?',
        'time_spent_sec': 0
      },
      {
        'toolbox_task_type': 'CISS_Question',
        'question_num': 14,
        'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
        'time_spent_sec': 0
      }
      ]
    }
    ]
  }
  return obj
}
function loadSchoolJSON() {
  var obj = {
    'app_name': 'QuickVisionCheck',
    'school_name': 'Bellevue School',
    'classes': [{
      'class_name': 'a',
      'Users': [{
        'student_id': 7658,
        'date_of_birth': '2000-10-02',
        'tasks': [{
          'toolbox_task_type': 'Near',
          'results': [{
            'eye': 0,
            'eyeTested': 'Left',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 1,
            'eyeTested': 'Right',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 2,
            'eyeTested': 'Both',
            'num_misses': 3,
            'num_correct': 1
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:25:269'
        },
        {
          'toolbox_task_type': 'Distance No Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Fail',
          'duration': '00:14:355'
        },
        {
          'toolbox_task_type': 'Distance With Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:16:322'
        },
        {
          'toolbox_task_type': 'Stereopsis',
          'results': [{
            'num_misses': 3,
            'num_correct': 1
          }],
          'diagnosis': 'Pass',
          'duration': '00:03:669'
        },
        {
          'toolbox_task_type': 'CISS',
          'score': 16,
          'diagnosis': 'Student is showing symptoms.',
          'duration': '00:06:320'
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 0,
          'answer': '1. Do your eyes feel tired when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 1,
          'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 2,
          'answer': '3. Do you have headaches when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 3,
          'answer': '4. Do you feel sleepy when reading or doing class work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 4,
          'answer': '5. Do you lose concentration when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 5,
          'answer': '6. Do you have trouble remembering what you have read?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 6,
          'answer': '7. Do you have double vision when reading of doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 7,
          'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 8,
          'answer': '9. Do you feel like you read slowly?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 9,
          'answer': '10. Do your eyes ever hurt when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 10,
          'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 11,
          'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 12,
          'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 13,
          'answer': '14. Do you lose your place while reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 14,
          'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
          'time_spent_sec': 0
        }
        ]
      },
      {
        'student_id': 2543,
        'date_of_birth': '2000-10-02',
        'tasks': [{
          'toolbox_task_type': 'Near',
          'results': [{
            'eye': 0,
            'eyeTested': 'Left',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 1,
            'eyeTested': 'Right',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 2,
            'eyeTested': 'Both',
            'num_misses': 3,
            'num_correct': 1
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:25:269'
        },
        {
          'toolbox_task_type': 'Distance No Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Fail',
          'duration': '00:14:355'
        },
        {
          'toolbox_task_type': 'Distance With Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:16:322'
        },
        {
          'toolbox_task_type': 'Stereopsis',
          'results': [{
            'num_misses': 3,
            'num_correct': 1
          }],
          'diagnosis': 'Pass',
          'duration': '00:03:669'
        },
        {
          'toolbox_task_type': 'CISS',
          'score': 16,
          'diagnosis': 'Student is showing symptoms.',
          'duration': '00:06:320'
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 0,
          'answer': '1. Do your eyes feel tired when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 1,
          'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 2,
          'answer': '3. Do you have headaches when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 3,
          'answer': '4. Do you feel sleepy when reading or doing class work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 4,
          'answer': '5. Do you lose concentration when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 5,
          'answer': '6. Do you have trouble remembering what you have read?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 6,
          'answer': '7. Do you have double vision when reading of doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 7,
          'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 8,
          'answer': '9. Do you feel like you read slowly?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 9,
          'answer': '10. Do your eyes ever hurt when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 10,
          'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 11,
          'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 12,
          'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 13,
          'answer': '14. Do you lose your place while reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 14,
          'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
          'time_spent_sec': 0
        }
        ]
      }]
    },
    {
      'class_name': 'b',
      'Users': [{
        'student_id': 7658,
        'date_of_birth': '2000-10-02',
        'tasks': [{
          'toolbox_task_type': 'Near',
          'results': [{
            'eye': 0,
            'eyeTested': 'Left',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 1,
            'eyeTested': 'Right',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 2,
            'eyeTested': 'Both',
            'num_misses': 3,
            'num_correct': 1
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:25:269'
        },
        {
          'toolbox_task_type': 'Distance No Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Fail',
          'duration': '00:14:355'
        },
        {
          'toolbox_task_type': 'Distance With Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:16:322'
        },
        {
          'toolbox_task_type': 'Stereopsis',
          'results': [{
            'num_misses': 3,
            'num_correct': 1
          }],
          'diagnosis': 'Pass',
          'duration': '00:03:669'
        },
        {
          'toolbox_task_type': 'CISS',
          'score': 16,
          'diagnosis': 'Student is showing symptoms.',
          'duration': '00:06:320'
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 0,
          'answer': '1. Do your eyes feel tired when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 1,
          'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 2,
          'answer': '3. Do you have headaches when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 3,
          'answer': '4. Do you feel sleepy when reading or doing class work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 4,
          'answer': '5. Do you lose concentration when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 5,
          'answer': '6. Do you have trouble remembering what you have read?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 6,
          'answer': '7. Do you have double vision when reading of doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 7,
          'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 8,
          'answer': '9. Do you feel like you read slowly?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 9,
          'answer': '10. Do your eyes ever hurt when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 10,
          'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 11,
          'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 12,
          'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 13,
          'answer': '14. Do you lose your place while reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 14,
          'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
          'time_spent_sec': 0
        }
        ]
      },
      {
        'student_id': 2543,
        'date_of_birth': '2000-10-02',
        'tasks': [{
          'toolbox_task_type': 'Near',
          'results': [{
            'eye': 0,
            'eyeTested': 'Left',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 1,
            'eyeTested': 'Right',
            'num_misses': 3,
            'num_correct': 1
          },
          {
            'eye': 2,
            'eyeTested': 'Both',
            'num_misses': 3,
            'num_correct': 1
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:25:269'
        },
        {
          'toolbox_task_type': 'Distance No Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Fail',
          'duration': '00:14:355'
        },
        {
          'toolbox_task_type': 'Distance With Flippers',
          'results': [{
            'eye': 0,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 1,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          },
          {
            'eye': 2,
            'eyeTested': 'None',
            'num_misses': 0,
            'num_correct': 4
          }
          ],
          'diagnosis': 'Pass',
          'duration': '00:16:322'
        },
        {
          'toolbox_task_type': 'Stereopsis',
          'results': [{
            'num_misses': 3,
            'num_correct': 1
          }],
          'diagnosis': 'Pass',
          'duration': '00:03:669'
        },
        {
          'toolbox_task_type': 'CISS',
          'score': 16,
          'diagnosis': 'Student is showing symptoms.',
          'duration': '00:06:320'
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 0,
          'answer': '1. Do your eyes feel tired when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 1,
          'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 2,
          'answer': '3. Do you have headaches when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 3,
          'answer': '4. Do you feel sleepy when reading or doing class work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 4,
          'answer': '5. Do you lose concentration when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 5,
          'answer': '6. Do you have trouble remembering what you have read?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 6,
          'answer': '7. Do you have double vision when reading of doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 7,
          'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 8,
          'answer': '9. Do you feel like you read slowly?',
          'time_spent_sec': 0
        },
        {

          'toolbox_task_type': 'CISS_Question',
          'question_num': 9,
          'answer': '10. Do your eyes ever hurt when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 10,
          'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 11,
          'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 12,
          'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 13,
          'answer': '14. Do you lose your place while reading or doing close work?',
          'time_spent_sec': 0
        },
        {
          'toolbox_task_type': 'CISS_Question',
          'question_num': 14,
          'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
          'time_spent_sec': 0
        }
        ]
      }]
    }
    ]

  }
  return obj
}
function loadDistrictJSON() {
  var obj = {
    'app_name': 'QuickVisionCheck',
    'school_district': 'Bellevue',
    'Schools': [{
      'school_name': 'Bellevue School',
      'classes': [{
        'class_name': 'a',
        'Users': [{
          'student_id': 7658,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        },
        {
          'student_id': 2543,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        }]
      },
      {
        'class_name': 'b',
        'Users': [{
          'student_id': 7658,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        },
        {
          'student_id': 2543,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        }]
      }
      ]
    },
    {
      'school_name': 'Seattle School',
      'classes': [{
        'class_name': 'a',
        'Users': [{
          'student_id': 7658,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        },
        {
          'student_id': 2543,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        }]
      },
      {
        'class_name': 'b',
        'Users': [{
          'student_id': 7658,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        },
        {
          'student_id': 2543,
          'date_of_birth': '2000-10-02',
          'tasks': [{
            'toolbox_task_type': 'Near',
            'results': [{
              'eye': 0,
              'eyeTested': 'Left',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 1,
              'eyeTested': 'Right',
              'num_misses': 3,
              'num_correct': 1
            },
            {
              'eye': 2,
              'eyeTested': 'Both',
              'num_misses': 3,
              'num_correct': 1
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:25:269'
          },
          {
            'toolbox_task_type': 'Distance No Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Fail',
            'duration': '00:14:355'
          },
          {
            'toolbox_task_type': 'Distance With Flippers',
            'results': [{
              'eye': 0,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 1,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            },
            {
              'eye': 2,
              'eyeTested': 'None',
              'num_misses': 0,
              'num_correct': 4
            }
            ],
            'diagnosis': 'Pass',
            'duration': '00:16:322'
          },
          {
            'toolbox_task_type': 'Stereopsis',
            'results': [{
              'num_misses': 3,
              'num_correct': 1
            }],
            'diagnosis': 'Pass',
            'duration': '00:03:669'
          },
          {
            'toolbox_task_type': 'CISS',
            'score': 16,
            'diagnosis': 'Student is showing symptoms.',
            'duration': '00:06:320'
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 0,
            'answer': '1. Do your eyes feel tired when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 1,
            'answer': '2. Do your eyes feel uncomfortable when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 2,
            'answer': '3. Do you have headaches when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 3,
            'answer': '4. Do you feel sleepy when reading or doing class work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 4,
            'answer': '5. Do you lose concentration when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 5,
            'answer': '6. Do you have trouble remembering what you have read?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 6,
            'answer': '7. Do you have double vision when reading of doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 7,
            'answer': '8. Do you see the words move, jump, swim, or appear to float on the page when reading or doing close work?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 8,
            'answer': '9. Do you feel like you read slowly?',
            'time_spent_sec': 0
          },
          {

            'toolbox_task_type': 'CISS_Question',
            'question_num': 9,
            'answer': '10. Do your eyes ever hurt when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 10,
            'answer': '11. Do your eyes ever feel sore when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 11,
            'answer': '12. Do you feel a "pulling" feeling around your eyes when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 12,
            'answer': '13. Do you notice the words blurring or coming in and out of focus when reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 13,
            'answer': '14. Do you lose your place while reading or doing close work?',
            'time_spent_sec': 0
          },
          {
            'toolbox_task_type': 'CISS_Question',
            'question_num': 14,
            'answer': '/*15. Do you have to re-read the same line of words when reading?*/',
            'time_spent_sec': 0
          }
          ]
        }]
      }
      ]
    }

    ]

  }
  return obj
}

export function readFile(query) {
  var testsjson = []
  switch (query) {
    case 'singlestudent':
      var obj = loadJSON()
      testsjson = readResults('singlestudent', obj)
      break
    case 'classwise':
      console.log('inside switch 1 classwise')
      obj = loadClassJSON()
      testsjson = readResults('classwise', obj)
      break
    case 'schoolwise':
      obj = loadSchoolJSON()
      testsjson = readResults('schoolwise', obj)
      console.log(testsjson)
      break
    case 'districtwise':
      obj = loadDistrictJSON()
      testsjson = readResults('districtwise', obj)
      break
    default:
      break
  }
  // console.log('obj = ' + JSON.stringify(obj))
  // get "tasks" portion from the json
  // finaljson[key].push(jsonOfTasks)
  // console.log('string of json in read file 1 ' + JSON.stringify(testsjson))
  // console.log('with student : ' + JSON.stringify(finaljson))
  return testsjson
}
