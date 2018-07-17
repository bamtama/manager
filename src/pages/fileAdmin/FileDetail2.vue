<template>
  <div class="fc-CV" >
    <x-header :mTitle="type|titleChange" class="fc-edit"></x-header>
    <div class="g-content">
      <div class="mescroll" id="mescroll">
          <div>
          <div class="fcCard" v-for="i in 10" :key="i">
            <group label-width="7em" label-margin-right="10px" gutter="0">
              <x-textarea v-for="i in 5" :title="`title`" :key ="i" :value = "`value`" readonly="" autosize :rows="1"></x-textarea>
            </group>
          </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XTextarea, LoadMore, Scroller } from "vux";
import XHeader from "@/components/header";
export default {
  name: "userCV",
  data() {
    return {
      data: [],
      personid: this.$route.query.id,
      showState: false,
      Isbounce:true,
      meScroll:null,  //mescroll组件对象
      showLoading:true,//是否显示loading
      pageSum: 0,
      pageTotal: 1,
    };
  },
  props: ["type"],
  mounted() {
  },
  computed:{
  },
  filters: {
    titleChange(value) {
      var title = "其他信息";
      switch (Number(value)) {
        case 0:
          title = "其他信息";
          break;
        default:
          title = "其他信息";
          break;
      }
      return title;
    }
  },
  methods: {
    getInfo() {
    }
  },
  components: {
    XHeader,
    Group,
    Cell,
    XTextarea,
    LoadMore,
    Scroller
  }
};
</script>

<style lang="less">
@import url("../../assets/styles/custom.fc.less");
</style>
