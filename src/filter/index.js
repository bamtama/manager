//全局filter,根据需要调整
import  {CommonFilter} from './common'

function enroll(VueDom,Marry) {
  Object.keys(Marry).forEach((item,idx)=> {
    VueDom.filter(item, Marry[item])
  })
}
export default {
  install:function(Vue,options) {
    enroll(Vue, CommonFilter)
  }
}