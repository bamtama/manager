<template>
  <div id="fileDeatil1">
    <x-header :mTitle="type|titleChange" :left-options="{backText:''}" class="fc-edit"></x-header>
    <div class="g-content">
      <group gutter="0" label-width="4em" label-margin-right="20px">
      <template v-for="i in 20">
        <x-textarea :title="`label`" :value = "`content`" :key="i" readonly="" :rows="1" :autosize="true"></x-textarea>
      </template>
    </group>
    </div>
  </div>
</template>

<script>
import { Cell, Group, XTextarea, XButton, FlexboxItem, Flexbox } from "vux";
import XHeader from "@/components/header";

export default {
  name: "filedetail1",
  data() {
    return {
      data:  [],
      personid:this.$route.query.id,
      btnArray:[]
    };
  },
  props: ["type"],
  created() {
    this.getInfo();
  },
  filters: {
    titleChange(value) {
      var title = "";
      switch (Number(value)) {
        case 0:
          title = "基本信息";
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
    Group,
    Cell,
    XTextarea,
    XButton,
    XHeader,
    FlexboxItem,
    Flexbox
  }
};
</script>

<style lang="less">
#fileDeatil1 {
  height: 100%;
  .vux-x-textarea {
    font-size: 15px;
    color: #292929;
  }
  .colBtn{
    padding: 0 10px;
    .vux-flexbox-item{
      max-width: 60%;
      min-width: 30%;
      &:nth-of-type(3n+1){
        margin-left: 0!important;
      }
    }
  }
  .weui-btn{
    font-size: 15px;
    padding: 7px 0;
    border:1px solid #024ea4;
    color: #024ea4;
    margin: 10px auto;
    box-sizing: border-box;
  }
}
</style>
