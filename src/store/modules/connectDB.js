import { postapi } from '@/api/StudentReport'
import { readFile } from '@/mock/getJSONFile'
const connectDB = {
  state: {
  },

  actions: {
    SendAPI({ commit }, payload) {
      console.log('reaching connectDB ' + payload.firstname)
      var o = {}
      var key = 'User'
      var json = readFile()
      o[key].push(json)
      postapi(payload, 'http://ec2-52-15-205-54.us-east-2.compute.amazonaws.com:8080/appdata/getstudents', 'EYEgroup', 'uwbothell')
      return o
    }
  }
}

export default connectDB

/* var o = {}
      var key = 'User'
      o[key] = []
      var data = {
        sampleTime: '1450632410296',
        data: '76.36731:3.4651554:0.5665419'
      }
      var data2 = {
        sampleTime: '1450632410296',
        data: '78.15431:0.5247617:-0.20050584'
      }
      o[key].push(data)
      o[key].push(data2)*/
