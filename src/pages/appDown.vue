<template>
  <div class="down">
    <img src="/static/images/logo@3x.png" alt="图表">
    <div>
      <h3>社矫管理</h3>
      <p>最新版本 4.0 - 1.11MB</p>
      <p>更新于：2018-05-30 15:22</p>
      <x-button class="downBtn">下载安装</x-button>
    </div>
  </div>
</template>

<script>
import {XButton } from 'vux'
export default {
  name:"down",
  data(){
    return{

    }
  },
  components:{
    XButton
  },
  created(){

  },
  methods:{
    
  }
}
</script>

<style lang="less">
  .down{
    width: 100%;
    height: 100%;
    background:url("/static/images/BG@3x.png") no-repeat 0 0;
    background-size: 100% 100%;
    text-align: center;
    img{
      width: 124px;
      height: 124px;
      margin:1.25rem 0 3.58rem;
    }
    div{
      h3{
        margin: 0 auto 37px;
        color: #024ea4;
        font-weight: 700;
        font-size: 24px;
        width: 200px;
        border-bottom: 2px solid #a2c7fc;
      }
      p{
        font-family: "PingFang-SC-Regular";
        font-size: 17px;
        color: #292929;
        text-align: center;
      }
      .downBtn{
        width: 170px;
        height: 40px;
        color: #fff;
        margin-top: 30px;
        font-size: 18px;
        border-radius: 5px;
        background-color: #ff9400;
      }
    }
  }
</style>
