// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import * as api from './myapi'
import URL from './myapi/URL'
import { AlertPlugin, ToastPlugin, DatetimePlugin, ConfirmPlugin} from 'vux'
import Mback from './js/back'
// import vconsole from './js/vconsole'
// Vue.use(vconsole)
Vue.use(Mback)

//axios低版本兼容Polyfill
require('es6-promise').polyfill()

// FastClick.attach(document.body)
Vue.config.productionTip = false

//接口挂载
Vue.prototype.publicApi = api;
console.log(URL)
Vue.prototype.URL = URL;
//全局调用alert,toast,dataTime,confirm弹出插件
Vue.use(DatetimePlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

/* eslint-disable no-new */
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
