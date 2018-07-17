<template>
  <div id="mescroll" class="mescroll">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**----------API接口说明-------------- */
/**
 * loadMore 上拉加载方法
 * downRefresh 下拉刷新方法
 * meScrollDom 获取mescroll实例
 */
/**--------------END----------------- */
import MeScroll from "@/assets/libs/mescroll.m";
export default {
  name:"mescroll",
  data(){
    return{
      meScroll:null,
      preTime:+new Date()
    }
  },
  props:{
    downUse:{ //是否开启下拉组件
      type:Boolean,
      default:true
    },
    downConfig:{ //具体下拉组件自定义配置，参数参考mescroll文档
      type:Object,
      default(){
        return {}
      }
    },
    upUse:{ //是否开启上拉组件
      type:Boolean,
      default:true
    },
    upConfig:{ //具体上拉组件自定义配置
      type:Object,
      default(){
        return {}
      }
    }
  },
  mounted(){
    this.initScroll()
  },
  methods:{
    initScroll() {
      let self = this;
      this.meScroll = new MeScroll("mescroll", {
        down: Object.assign({
          use:self.downUse,
          callback: self.refresh,
          auto: false,
          offset: 60
        },self.downConfig),
        up:Object.assign({
          callback: self.loadMore,
          use: self.upUse,
          hardwareClass:"mescroll-hardware",
          offset: 60,
          htmlNodata: '<p class="upwarp-nodata">-- 没有更多数据了 --</p>',
          onScroll:self.scroll
        },self.upConfig)
      });
      this.$emit("meScrollDom",this.meScroll)
    },
    refresh(){
      this.$emit("downRefresh")
    },
    loadMore(){
      this.$emit("loadMore")
    },
    scroll:function (mescroll,y,isUp=true) {
      if((+ new Date())- this.preTime > 200){
        this.preTime = (+ new Date())
        sessionStorage.setItem("scrollLocTop",y)
      }
     
    }
  }
}
</script>

<style lang="less">
@import url("../assets/libs/mescroll.min.css");
</style>
