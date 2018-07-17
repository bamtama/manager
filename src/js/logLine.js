// import { PageControl} from './../api/index'
import { sysList, eventList} from './logList'
import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = process.env.API_HOST;
} else {
  axios.defaults.baseURL = '/justicedeptmgr';
}
axios.defaults.withCredentials=true;
class Logline {
  constructor() {
    this.sendData = {};
    this.Modal = false;
    this.$vue = null;
    this.count = 0;
    //this.sysList = sysList;
  }
  /**
   * true显示遮罩层,false关闭
   * @param {boolean} bean
   */
  addModal(bean = true) {
    this.Modal = bean;
    return this;
  }

  /**
   * 页面刚进入是调用，传入页面的pageName值
   * @param {String} pageName
   */
  pageEntry(pageName) {
    var id = sysList[pageName]
    this.count = 0;
    this.sendData = {};
    this._msg({
      inTime: Date.now(),
      "pageId": id
    });
  }
  pageOut(pathname){
    if(this.count > 0){
      return;
    }
    // debugger;
    if (Object.keys(this.sendData).length > 0 && pathname){
      this.eventStart(eventList[pathname]).eventEnd(0, "").send()
    }
    //this.send()
  }
  _getData(){
    return this.sendData;
  }
  _msg(obj) {
    this.sendData = Object.assign(this.sendData, obj, this.data);
    return this;
  }
  _check() {
    this._IsNumber([this.sendData.pageId, this.sendData.eventId, this.sendData.eventResult])
  }
  _IsNumber(num) {
    num.forEach(function (item, idx) {
      if (typeof item != "number") {
        //throw Error("The parameters " + item + " must be Number")
      }
    })
  }
  send(type = true) {
    this.count++;
    this._check();
    axios({
      method: 'post',
      url: '/page/addLog',
      params: this.sendData
    })
    .then(res=>{
      if (res.data.status == 200) {
      } else {
        console.log("上传失败")
      }
    })
    .catch(res=>{
      console.log(res)
    })
  }
  eventStart(evtId) {
    this._msg({
      eventStartTime: Date.now(),
      "eventId": evtId
    });
    return this;
  }
  eventEnd(result, desc) {
    if (!(result == 0 || result == 1)) {
      throw Error("The parameters result must be 0 or 1")
    }
    this._msg({
      "eventEndTime": Date.now(),
      "eventResult": result || 0,
      "resultDesc": desc || ""
    });
    return this
  }
  setVue(Vue,options){
    this.$vue = Vue
  }
}

export default {
  install(Vue){
    Vue.prototype.$logLine = new Logline();
  }
}
