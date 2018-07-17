<template>
  <div id="dw-home">
    <m-header :mTitle="setTitle" :defaultBack="false" v-if="showMainTitle"></m-header>
    <div v-bind:class="['dw-page',{'dw-foucs':!showMainTitle}]">
      <keep-alive>
        <router-view class="rview"></router-view>
      </keep-alive>
    </div>
    <div class="g-viewbox">
      <tabbar class="g-tabbar">
        <tabbar-item :selected="pageActive==nav.pagePath" @click.native="gotoPage({path:'/Home/' + nav.pagePath})" v-for="nav in navObj" :key="nav.id">
          <svg class="svg-icon" slot="icon" v-html="`<use xlink:href='${nav.iconUriDef}'></use>`">
          </svg>
          <svg class="svg-icon" slot="icon-active" v-html="`<use xlink:href='${nav.iconUriAct}'></use>`">
          </svg>
          <span slot="label">{{nav.title}}</span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
</template>

<script>
import header from "@/components/header";
import { Tabbar, TabbarItem, Loading, TransferDom } from "vux";
import { mapGetters } from "vuex";

export default {
  components: {
    Loading,
    Tabbar,
    TabbarItem,
    mHeader: header
  },
  directives: {
    TransferDom
  },
  name: "Home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isLoading", "cachePages"]),
    showMainTitle(){
      if(this.$route.path === '/Home/Index' || this.$route.path === '/Home/Mine'){
        return true;
      }
      else{
        return false;
      }
    },
    setTitle() {
      let titleObj = {
        Index: "主页",
        LocList: "定位",
        Attention: "关注",
        Mine: "我的"
      };
      let tKey = this.$route.path.replace("/Home/", "");
      return titleObj[tKey];
    },
    pageActive() {
      return this.$route.path.replace("/Home/", "");
    },
    navObj() {
      let _navObject = [
        {
          iconUriDef: "#icon-index",
          iconUriAct: "#icon-index",
          pagePath: "Index",
          title: "首页"
        },
        {
          iconUriDef: "#icon-location",
          iconUriAct: "#icon-location",
          pagePath: "LocList",
          title: "定位"
        },
        {
          iconUriDef: "#icon-focus",
          iconUriAct: "#icon-focus",
          pagePath: "Attention",
          title: "关注"
        },
        {
          iconUriDef: "#icon-mine",
          iconUriAct: "#icon-mine",
          pagePath: "Mine",
          title: "我的"
        }
      ];
      return _navObject;
    }
  },
  data() {
    return {
      title: ""
    };
  },
  mounted() {
  },
  activated(){
    if(!sessionStorage.username){
      this.getUsername()
    }
  },
  methods: {
    gotoPage(pathObj) {
      this.$router.push(pathObj);
    },
    //获取用户名
    getUsername() {
      this.publicApi.ajax(this.URL.BASE.USERINFO,{},0).then(res => {
        if (res.data.status === 200) {
          this.username = res.data.data.username;
          //本地信息写入
          sessionStorage.setItem("userName", this.username);
        } else {
        }
      });
    }
  }
};
</script>

<style lang='less'>
#dw-home {
  height: 100%;
  background: #eaf0f3;
  .dw-page {
    position: fixed;
    top: 44px;
    bottom: 53px;
    left: 0;
    right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .rview{
    overflow: hidden;
  }
  .dw-foucs {
    top: 0;
  }
  .weui-tabbar {
    box-shadow: 0px -2px 13px 0px rgba(163, 169, 172, 0.2);
    &:before {
      content: none;
    }
    .svg-icon {
      font-size: 25px;
    }
    .weui-tabbar__label {
      font-size: 11px;
    }
  }
}
</style>
