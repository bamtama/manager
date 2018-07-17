<template>
  <div id="app" class="g-p">
    <div v-transfer-dom>
      <!--全局显示的Loading-->
      <loading v-show="isLoading === 1"></loading>
      <div class="weui-mask_transparent" v-show="isLoading === 2">
        <div class="g-mask-loading" :class="loadingClass">
          <div class="cont">
            <img src="../static/images/loading.gif"/>
            <p class="tip">Loading...</p>
          </div>
          <div class="fakerefresh" v-show="fakeshow"></div>
        </div>
      </div>
    </div>
    <keep-alive :include="cachePages">
      <router-view class="rview"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Loading, TransferDom } from "vux";
import { mapGetters } from "vuex";

export default {
  components: {
    Loading,
    Tabbar,
    TabbarItem
  },
  directives: {
    TransferDom
  },
  name: "app",
  computed: {
    ...mapGetters(["isLoading", "cachePages", "loadingClass"])
  },
  data(){
    return {
      fakeshow:false,
      isFull: false
    }
  },
  mounted(){
    //预加载一些图
    // new Image().src = '../static/images/pin.png';
    // new Image().src = '../static/images/pin-active.png';
  },
  methods:{
    fakeRefresh(){
      this.fakeshow = true;
      setTimeout(()=>{
        this.fakeshow = false;
      },100)
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import '~vux/src/styles/1px.less';
@import url("./assets/styles/custom.reset.less");
@import url("./assets/styles/custom.july.less");
</style>
