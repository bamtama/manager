import getOS from '../assets/libs/os'

window.setupWebViewJavascriptBridge = (callback) => {
  //iOS端配合js
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

if (getOS() == "ios"){
  setupWebViewJavascriptBridge(function(bridge) {
    window.IosAPi = {
      downAttach(){
        //下载附件
        bridge.callHandler('DOWNLOAD_ATTACHMENT',...arguments)
      },
      cancelLation(){
        //注销
        bridge.callHandler('CANCELLATION_USER_CALLBACK', ...arguments)
      },
      cleanAttach() {
        //清空附件
        bridge.callHandler('CLEAN_ALL_ATTACHMENTS', ...arguments)
      },
      checkVersion(){
        //检查版本号
        bridge.callHandler('CHECK_NEW_VERSION', ...arguments)
      },
      updataIPA(){
        //更新IPA
        bridge.callHandler('UPDATA_IPA', ...arguments)
      },
      callPhone(){
        //拨打电话
        bridge.callHandler('CALL_PHONE', ...arguments)
      },
      loginSuc(){
        //登录成功，写入用户名和密码
        bridge.callHandler('LOGIN_SUCCESS_CALLBACK',...arguments)
      }
    }
  })
}
