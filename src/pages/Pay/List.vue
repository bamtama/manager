<template>
  <div>
    <m-header mTitle="消费记录" ref="mheader"> </m-header>
    <div class="g-content">
      <group :gutter="5" class="g-group" v-for="(item,i) in dataList" :key="i">
        <cell title="合计">{{item.total}}</cell>
        <cell-form-preview :list="item.detail"></cell-form-preview>
      </group>
    </div>
  </div>
</template>

<script>
  import header from "@/components/header";
  import { Group, Cell, CellBox,CellFormPreview} from "vux";

  export default {
    name: "PayList",
    components: {
      mHeader: header,
      Group,
      Cell,
      CellBox,
      CellFormPreview
    },
    data() {
      return {
        dataList:[]
      }
    },
    activated() {
    },
    mounted() {
      this.getList()
    },
    computed: {},
    methods:{
      getList(){
        this.publicApi.ajax(this.URL.LIST.PAY,{},2).then(res=>{
          if(res.data.status===200){
            this.dataList = res.data.data;
          }
        })
      }
    }
  };
</script>
<style lang="less" scoped>
</style>
