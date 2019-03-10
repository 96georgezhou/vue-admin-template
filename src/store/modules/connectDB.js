// import { postapi } from '@/api/StudentReport'
import { readFile } from '@/mock/getJSONFile'
const connectDB = {
  state: {
  },

  actions: {
    SendAPI({ commit }, payload) {
      // console.log('reaching connectDB ' + payload)
      var json = readFile('singlestudent')
      // console.log('send api received json : ' + JSON.stringify(json))
      return json
    },
    SendAPIforClass({ commit }, payload) {
      console.log('reaching connectDB ' + payload)
      var json = readFile('classwise')
      // console.log('send api received json : ' + JSON.stringify(json))
      return json
    },
    SendAPIforSchool({ commit }, payload) {
      console.log('reaching connectDB ' + payload)
      var json = readFile('schoolwise')
      // console.log('length2 = ' + json.length)
      // console.log('send api received json : ' + JSON.stringify(json))
      return json
    },
    SendAPIforDistrict({ commit }, payload) {
      console.log('reaching connectDB ' + payload)
      var json = readFile('districtwise')
      // console.log('send api received json : ' + JSON.stringify(json))
      return json
    }
  }
}

export default connectDB
