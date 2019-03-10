// var cors = require('cors')
// var express = require('express')
// var app = express()

export function postapi(studentinfo, url, username, password) {
  var authorizationBasic = window.btoa(username + ':' + password)
  console.log('authorizationBasic ' + authorizationBasic)
  var request = new XMLHttpRequest()
  request.open('POST', url, true)
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  request.setRequestHeader('Authorization', 'Basic ' + authorizationBasic)
  request.setRequestHeader('Accept', '*')
  request.setRequestHeader('Access-Control-Allow-Origin', '*')
  request.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization, Content-Length, X-Requested-With')
  request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
  console.log(JSON.stringify(studentinfo))
  request.send(JSON.stringify(studentinfo))
  console.log('Status ' + request.status)
  console.log('output: ' + request.responseText)
}
// Send a POST request
// axios({
//   method: 'post',
//   url: url,
//   data: studentinfo,
//   headers: {
//     'Content-Type': 'application/json;charset=UTF-8',
//     'Cache-Control': 'no-cache',
//     'Authorization': 'Basic ' + authorizationBasic
//   }
// }).then(function(response) {
//   console.log('Head With Authentication :' + response)
// })
//   .catch(function(error) {
//     console.log('Post Error : ' + error)
//   })

