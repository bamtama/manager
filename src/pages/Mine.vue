<template>
  <div class='mine'>
    <div class="g-content">
      <group>
        <cell class="username" :title="username">
          <label class="admin">
            <span class="iconfont icon-admin"></span>
          </label>
        </cell>
      </group>
      <group>
        <cell  title="版本更新"></cell>
        <cell is-link title="二维码分享"></cell>
      </group>
      <group>
        <cell is-link  title="清除缓存"></cell>
      </group>
      <group>
        <cell title="退出登录"></cell>
      </group>
    </div>
  </div>
</template>
<script>
import header from "@/components/header";
import { Group, Cell, XButton, XInput, Badge, AlertModule } from "vux";

export default {
  name: "mine",
  components: {
    Group,
    XButton,
    Cell,
    XInput,
    Badge,
    AlertModule,
    mHeader: header
  },
  data() {
    return {
      showNew: false,
      username: "",
      version: "",
      type:""
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(!sessionStorage.username){
      this.username = window.sessionStorage.getItem('userName');
    }else{
      this.getUsername();
    }
  },
  methods: {
    init(){
      this.publicApi.ajax(this.URL.BASE.USERINFO,{},0).then(res => {
        if (res.data.status === 200) {
          this.username = res.data.data.username;
        }
      });
    }
  },
};
</script>
<style lang="less">
.mine{
  .weui-cells {
    margin-top: 0;
    margin-bottom: 8px;
  }
}

</style>
