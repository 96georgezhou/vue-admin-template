import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = [{
  selected: false,
  id: 1,
  name: 'George',
  schoolName: 'UWB',
  schoolDistrict: 'KingCounty',
  grade: 'gradeOne',
  refer: 'Result',
  test: [1, 2, 3]
},
{
  selected: false,
  id: 2,
  name: 'Sarah',
  schoolName: 'UWB',
  schoolDistrict: 'KingCounty',
  grade: 'gradeTwo',
  refer: 'Result',
  test: [1, 2, 3]
},
{
  selected: false,
  id: 3,
  name: 'Donald',
  schoolName: 'UWB',
  schoolDistrict: 'KingCounty',
  grade: 'gradeThree',
  refer: 'Result',
  test: [1, 2, 3]
}]

export default {
  getList: () => {
    return List
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    data: 'success'
  })
}
