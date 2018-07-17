<template>
  <div class="spvClass">
    <x-header mTitle="xxxx" class="fc-edit"></x-header>
    <div class="g-content">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="i in 8" :key="i">
          <div class="fcCard">
            <group label-width="7em" label-margin-right="10px" gutter="0">
              <x-textarea v-for="j in 3" :title="`title`" :value = "`value`" :key="j" readonly="" autosize :rows="1"></x-textarea>
            </group>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Group, XTextarea, Flexbox, XButton,FlexboxItem } from "vux";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import XHeader from '@/components/header'
import {goString} from '@/filter'
export default {
  name: "spvClass",
  data() {
    return {
      dataInfo:null,
      personid:this.$route.query.id,
      btnArray:[],
      moreShow:true,
      swiperOption: {
        notNextTick: true,
        slidesPerView: "auto",
        spaceBetween: 5,
        roundLengths: true,
        observer: true,
        dynamicBullets: true,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  props:["type"],
  created() {

  },
  methods:{
  },
  components: {
    XHeader,
    swiper,
    swiperSlide,
    Group,
    XTextarea,
    Flexbox,
    XButton,
    FlexboxItem
  }
};
</script>
<style lang="less">
@import url("../../assets/styles/custom.fc.less");
.spvClass {
  .noMoreData{
    color: gray;
    font-size: 12px;
    text-align: center;
  }
  background-color: #f4f4f4;
  .colBtn{
    padding: 0 10px 20px;

  }
  .fcCard{
    margin-bottom: 40px;
  }
  .weui-btn{
    font-size: 15px;
    padding: 7px 0;
    border:1px solid #024ea4;
    color: #024ea4
  }
}
</style>
