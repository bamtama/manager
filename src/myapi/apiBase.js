import axios from 'axios'
import _this from '../main.js'
import qs from 'Qs' //根据后台情况进行序列化

import store from '../store'
import {
  cookie
} from 'vux'

/* 统一配置 */
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = process.env.API_HOST;
} else {
  //axios.defaults.baseURL = '/DEMO001/'; //process.env.API_HOST;
}

axios.defaults.timeout = 1000 * 30;
axios.withCredentials = true;
// axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
  // config.params.token = cookie.get('token');
  // if(!config.params.token){
  //   console.log('cannot get token')
  // }
  return config;
}, err => {
  console.log(`request error:${err}`)
})

axios.interceptors.response.use(res => {
  return res;
}, err => {
  console.log(`request error:${err}`)
  return err;
  // return Promise.reject({
  //   status: -1,
  //   msg: 'response error'
  // });
})

export const axiosExtend = (config, showLoading) => {
  if (process.env.NODE_ENV === 'development') {
    if (!config.method) {
      config.method = 'get'; //dev
    }
  } else {
    if (!config.method) {
      config.method = 'post'; //默认post
    }
  }

  if (showLoading) {
    //显示全局loading
    store.dispatch('globalLoading', showLoading===true ? 1 : showLoading)
  }

  return new Promise((resolve, reject) => {
    axios(config)
      .then(res => {
        //请求成功
        console.log('success')
        if (showLoading) {
          //隐藏全局loading
          store.dispatch('globalLoading', 0)
        }
        if(res.data.status === 444 || res.data.status === 445){
          _this.$vux.toast.show({
            text:'登录失效<br />请重新登录',
            type:'text',
            onHide:()=>{
              if(process.env.NODE_ENV ==='production'){
                _this.$router.replace('/')
              }
            }
          })
        }
        else{
          // res.data = JSON.parse(res.data)
          resolve(res)
        }
      })
      .catch(err => {
        console.log('请求失败')
        console.log(err)
        if (showLoading) {
          //隐藏全局loading
          store.dispatch('globalLoading', 0)
        }
        //直接统一异常，不传出了
        _this.$vux.toast.show({
          text:'请求异常<br />请返回重试',
          type:'text',
          onHide:()=>{
            if(config.catchErr){
              reject(err)
            }
            else{
              //想干啥。。
            }
            // _this.$router.go(0)
          }
        })
        //resolve(err)    //then，默认http200-http300是resolve,其他是reject，此处全部传回reject
      })
  })
}
