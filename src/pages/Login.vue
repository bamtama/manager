<template>
  <div class="ju-login" v-bind:style="{height:winheight+'px'}">
    <div class="logo">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzIgOTIiIHdpZHRoPSIyNzIiIGhlaWdodD0iOTIiPjxwYXRoIGZpbGw9IiNFQTQzMzUiIGQ9Ik0xMTUuNzUgNDcuMThjMCAxMi43Ny05Ljk5IDIyLjE4LTIyLjI1IDIyLjE4cy0yMi4yNS05LjQxLTIyLjI1LTIyLjE4QzcxLjI1IDM0LjMyIDgxLjI0IDI1IDkzLjUgMjVzMjIuMjUgOS4zMiAyMi4yNSAyMi4xOHptLTkuNzQgMGMwLTcuOTgtNS43OS0xMy40NC0xMi41MS0xMy40NFM4MC45OSAzOS4yIDgwLjk5IDQ3LjE4YzAgNy45IDUuNzkgMTMuNDQgMTIuNTEgMTMuNDRzMTIuNTEtNS41NSAxMi41MS0xMy40NHoiLz48cGF0aCBmaWxsPSIjRkJCQzA1IiBkPSJNMTYzLjc1IDQ3LjE4YzAgMTIuNzctOS45OSAyMi4xOC0yMi4yNSAyMi4xOHMtMjIuMjUtOS40MS0yMi4yNS0yMi4xOGMwLTEyLjg1IDkuOTktMjIuMTggMjIuMjUtMjIuMThzMjIuMjUgOS4zMiAyMi4yNSAyMi4xOHptLTkuNzQgMGMwLTcuOTgtNS43OS0xMy40NC0xMi41MS0xMy40NHMtMTIuNTEgNS40Ni0xMi41MSAxMy40NGMwIDcuOSA1Ljc5IDEzLjQ0IDEyLjUxIDEzLjQ0czEyLjUxLTUuNTUgMTIuNTEtMTMuNDR6Ii8+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTIwOS43NSAyNi4zNHYzOS44MmMwIDE2LjM4LTkuNjYgMjMuMDctMjEuMDggMjMuMDctMTAuNzUgMC0xNy4yMi03LjE5LTE5LjY2LTEzLjA3bDguNDgtMy41M2MxLjUxIDMuNjEgNS4yMSA3Ljg3IDExLjE3IDcuODcgNy4zMSAwIDExLjg0LTQuNTEgMTEuODQtMTN2LTMuMTloLS4zNGMtMi4xOCAyLjY5LTYuMzggNS4wNC0xMS42OCA1LjA0LTExLjA5IDAtMjEuMjUtOS42Ni0yMS4yNS0yMi4wOSAwLTEyLjUyIDEwLjE2LTIyLjI2IDIxLjI1LTIyLjI2IDUuMjkgMCA5LjQ5IDIuMzUgMTEuNjggNC45NmguMzR2LTMuNjFoOS4yNXptLTguNTYgMjAuOTJjMC03LjgxLTUuMjEtMTMuNTItMTEuODQtMTMuNTItNi43MiAwLTEyLjM1IDUuNzEtMTIuMzUgMTMuNTIgMCA3LjczIDUuNjMgMTMuMzYgMTIuMzUgMTMuMzYgNi42MyAwIDExLjg0LTUuNjMgMTEuODQtMTMuMzZ6Ii8+PHBhdGggZmlsbD0iIzM0QTg1MyIgZD0iTTIyNSAzdjY1aC05LjVWM2g5LjV6Ii8+PHBhdGggZmlsbD0iI0VBNDMzNSIgZD0iTTI2Mi4wMiA1NC40OGw3LjU2IDUuMDRjLTIuNDQgMy42MS04LjMyIDkuODMtMTguNDggOS44My0xMi42IDAtMjIuMDEtOS43NC0yMi4wMS0yMi4xOCAwLTEzLjE5IDkuNDktMjIuMTggMjAuOTItMjIuMTggMTEuNTEgMCAxNy4xNCA5LjE2IDE4Ljk4IDE0LjExbDEuMDEgMi41Mi0yOS42NSAxMi4yOGMyLjI3IDQuNDUgNS44IDYuNzIgMTAuNzUgNi43MiA0Ljk2IDAgOC40LTIuNDQgMTAuOTItNi4xNHptLTIzLjI3LTcuOThsMTkuODItOC4yM2MtMS4wOS0yLjc3LTQuMzctNC43LTguMjMtNC43LTQuOTUgMC0xMS44NCA0LjM3LTExLjU5IDEyLjkzeiIvPjxwYXRoIGZpbGw9IiM0Mjg1RjQiIGQ9Ik0zNS4yOSA0MS40MVYzMkg2N2MuMzEgMS42NC40NyAzLjU4LjQ3IDUuNjggMCA3LjA2LTEuOTMgMTUuNzktOC4xNSAyMi4wMS02LjA1IDYuMy0xMy43OCA5LjY2LTI0LjAyIDkuNjZDMTYuMzIgNjkuMzUuMzYgNTMuODkuMzYgMzQuOTEuMzYgMTUuOTMgMTYuMzIuNDcgMzUuMy40N2MxMC41IDAgMTcuOTggNC4xMiAyMy42IDkuNDlsLTYuNjQgNi42NGMtNC4wMy0zLjc4LTkuNDktNi43Mi0xNi45Ny02LjcyLTEzLjg2IDAtMjQuNyAxMS4xNy0yNC43IDI1LjAzIDAgMTMuODYgMTAuODQgMjUuMDMgMjQuNyAyNS4wMyA4Ljk5IDAgMTQuMTEtMy42MSAxNy4zOS02Ljg5IDIuNjYtMi42NiA0LjQxLTYuNDYgNS4xLTExLjY1bC0yMi40OS4wMXoiLz48L3N2Zz4=" />
    </div>
    <group :gutter="0" class="g-group login-group">
      <x-input placeholder="请输入账号" class="input-name" autocomplete="off" :show-clear="false" v-model="username" @on-focus="scrollToFocus">
        <label slot="label" class="title-label">账<i class="char1"></i>号：</label>
        <div slot="right">
          <i class="iconfont icon-close" @click="username=''"></i>
        </div>
      </x-input>
      <x-input placeholder="请输入密码" autocomplete="off" :show-clear="false" :type="pwdtype" v-model="password" @on-focus="scrollToFocus">
        <label slot="label" class="title-label">密<i class="char1"></i>码：</label>
        <div slot="right">
          <span class="pwd-vision" @click="showPwd=!showPwd">
            <i class="iconfont icon-visible" v-show="showPwd"></i>
            <i class="iconfont icon-invisible" v-show="!showPwd"></i>
          </span>
          <i class="iconfont icon-close" @click="password=''"></i>
        </div>
      </x-input>
      <x-input placeholder="请输入验证码"
               autocomplete="off"
               class="shotline"
               :show-clear="false"
               v-model="verifyCode"
               @on-focus="scrollToFocus">
        <label slot="label" class="title-label">验证码：</label>
        <div slot="right" class="code-img-wrap">
          <span class="code-img-tip" v-show="!showImgCodeError">加载中</span>
          <img v-show="showImgCode" class="code-img" v-bind:src="codeImgUri" @click="changeCode" onload="showImgCode()" onerror="showImgError()">
          <span class="code-img-tip" v-show="!showImgCode && showImgCodeError" @click="changeCode">点击重试</span>
        </div>
      </x-input>
    </group>
    <div class="remember">
      <input type="checkbox" id="remember" v-model="rememberPwd"/>
      <label for="remember">记住密码</label>
    </div>
    <div class="btn-wrap">
      <x-button type="primary" :show-loading="isLogin" @click.native="actionLogin">登录</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XInput, Flexbox, FlexboxItem, XButton, cookie } from "vux";
export default {
  components: {
    XButton,
    FlexboxItem,
    Flexbox,
    XInput,
    Group
  },
  name: "login",
  data() {
    return {
      winheight: window.document.body.clientHeight,
      showPwd: false,
      codeImgUri: "static/images/vcode.png?random=" + new Date().getTime(),
      showImgCode: false,
      showImgCodeError: false,

      username: "",
      password: "",
      verifyCode: "",
      rememberPwd: false,

      isLogin: false
    };
  },
  computed: {
    pwdtype() {
      if (this.showPwd) {
        return "text";
      } else {
        return "password";
      }
    }
  },
  mounted() {
    this.$store.dispatch('clearCachePage');
    this.resetHeight();

    window.addEventListener("resize", this.resizeHeight);
    window.showImgCode = this.funShowImgCode;
    window.showImgError = this.funShowImgError;
    window.saveLoginInfo  = (username, password, isRmbPd)=>{
      window.iosUserInfo = {
        username: username,
        password: password,
        rememberPwd: isRmbPd
      }
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHeight);
    window.showImgCode = null;
    window.showImgError = null;
  },
  activated(){
    this.getDevMes();
  },
  methods: {
    resizeHeight() {
      this.resetHeight();
    },
    funShowImgCode() {
      this.showImgCode = true;
    },
    funShowImgError() {
      this.showImgCodeError = true;
    },
    getDevMes() {
      console.log('get msg')
      let msg;
      if(window.androidShare){
        msg = JSON.parse(window.androidShare.getLoginInfo());
      }
      else{
        msg = window.iosUserInfo;
      }
      this.username = msg.username;
      this.password = msg.password;
      if (msg.username && msg.username.length <= 0) {
        this.rememberPwd = false;
      } else {
        this.rememberPwd = true;
      }
      if(msg.rememberPwd && msg.rememberPwd === '1'){
        this.rememberPwd = true;
      }
    },
    resetHeight() {
      if (this.winheight < 480) {
        this.winheight = 480;
      }
    },
    changeCode() {
      this.showImgCode = false;
      this.showImgCodeError = false;
      setTimeout(()=>{
        this.codeImgUri = process.env.API_HOST + "static/images/vcode.png?random=" + new Date().getTime();
      },800)
    },
    scrollToFocus() {
      setTimeout(() => {
        document.querySelector("body").scrollTop = 200;
        document.querySelector(".input-name").scrollIntoView(true);
      }, 300);
    },
    actionLogin() {
      document.activeElement.blur();
      if (this.isLogin) {
        return false;
      }
      setTimeout(() => {
        //检查空值
        if (!this.username || !this.password || !this.verifyCode) {
          this.$vux.toast.text("请输入完整");
          return false;
        }
        //开始请求
        let reqd = {
          username: this.username,
          pwd: this.password,
          vcode: this.verifyCode
        };
        this.isLogin = true;
        console.log(this.URL)
        this.publicApi.ajax(this.URL.BASE.LOGIN, reqd ,0)
          .then(res => {
            if (res.data.status === 200) {
              //登录成功的后续操作，写入本地数据等
              //写入webview数据
              if (window.androidShare){
                window.androidShare.saveLoginInfo(
                  this.username,
                  this.password,
                  this.rememberPwd
                );
                window.androidShare.saveCookie(cookie.get("jId"));
              }
              else if(window.IosAPi){
                window.IosAPi&&window.IosAPi.loginSuc({
                  username:this.username,
                  pwd:this.password,
                  remember: this.rememberPwd ? '1' : '0',
                  cookie:cookie.get('jId')
                });
              }
              //清理缓存并跳转
              sessionStorage.clear();
              this.$store.dispatch("SetIndexState", true);
              this.$store.dispatch('addCachePage', 'Home');
              this.$router.replace({ path: "/Home/Index" });
              this.isLogin = false;
            } else {
              this.$vux.toast.show({
                text: res.data.message,
                type: "warn",
                time: 1500,
                onHide: () => {
                  this.changeCode();
                  this.isLogin = false;
                }
              });
            }
          })
          .catch(err => {
            this.isLogin = false;
          });
      }, 300);
    }
  }
};
</script>

<style scoped>
</style>
