<template>
  <div class="spvAdmin">
    <x-header :mTitle="type|titleChange" class="fc-edit" :rightBtn="fcTime" v-on:actionRight="selectTime">
    </x-header>
    <div class="g-content">
      <div class="mescroll" id="mescroll">
        <div>
          <template v-for="i in 9">
            <div class="fcCard" :key="i">
              <group label-width="7em" label-margin-right="10px" gutter="0">
                <x-textarea v-for="i in 3" :key="i" :title="`title${i}`"  :value ="`content${i}`" readonly="" autosize :rows="1"></x-textarea>
              </group>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Group, Cell, XTextarea, dateFormat, LoadMore, Scroller } from "vux";
import XHeader from "@/components/header";
export default {
  name: "spvAdmin",
  data() {
    return {
      searchTime: "",
      fcTime: `<a slot="right" @click="selectTime">选择时间</a>`,
      superData: [],
      pageSum:0,
      pageTotal:1,
      showState:false,
      meScroll:null,
      showLoading:false,
      dataTime:"",
      format:"YYYY-MM",
    };
  },
  components: {
    XHeader,
    Group,
    Cell,
    XTextarea,
    LoadMore,
    Scroller
  },
  props: ["type"],
  created() {
  },
  mounted(){
  },
  computed:{

  },
  filters: {
    titleChange(value) {
      return '标题';
    }
  },
  methods: {
    selectTime() {
      let self = this;
      this.$vux.datetime.show({
        value: "", // 其他参数同 props
        clearText: "选择时间",
        confirmText: "查询",
        cancelText: "取消",
        minYear: "1949",
        format: this.format,
        onConfirm:(val)=>{
          alert(`开始查询${val}的时间内的数据`)
        }
      });
    },
  }
};
</script>

<style lang="less">
@import url("../../assets/styles/custom.fc.less");
.spvAdmin {
  overflow: hidden;
  background-color: #f4f4f4;
}
</style>
