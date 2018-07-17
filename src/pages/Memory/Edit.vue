<template>
  <div>
    <m-header mTitle="备忘详情" ref="mheader"> </m-header>
    <div class="g-content">
      <group class="g-group" label-width="4em" :gutter="0">
        <x-input title="标题" placeholder="请输入标题"></x-input>
        <x-input title="事件" placeholder="请输入备忘内容"></x-input>
      </group>
    </div>
  </div>
</template>

<script>
  import header from "@/components/header";
  import { Group, Cell, CellBox, XTextarea , XInput} from "vux";

  export default {
    name: "MemoryEdit",
    components: {
      mHeader: header,
      Group,
      Cell,
      CellBox,
      XTextarea,
      XInput
    },
    data() {
      return {
      };
    },
    activated() {
    },
    mounted() {},
    computed: {},
    methods: {

    }
  };
</script>
<style lang="less" scoped>
</style>
