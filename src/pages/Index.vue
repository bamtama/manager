<template>
  <div>
    <div class="m-index" v-bind:class="{'z-popupshow':showmenu}">
      <div class="m-banner" style="width: 100%; padding: 28% 0; background: url('static/images/bg.jpg');background-size:contain;margin-bottom:24px;">
      </div>
      <div class="m-common-use">
        <div class="m-index-arrow">
          <div class="index-arrow-title">常用</div>
        </div>
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/4" v-for="item in selectedList" :key="item.id" @click.native="
          gotoPage(item)">
            <div class="flex-demo">
              <div class="m-common-icon">
                <svg class="svg-icon" v-html="`<use xlink:href='#icon-${item.myMenu.menuIcon}'></use>`"></svg>
              </div>
              <p>{{item.myMenu.funcName}}</p>
            </div>
          </flexbox-item>
          <flexbox-item :span="1/4" @click.native="showAll">
            <div class="flex-demo">
              <div class="m-common-icon">
                <svg class="svg-icon">
                  <use xlink:href="#icon-all"></use>
                </svg>
              </div>
              <p>全部</p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="m-focus">
        <div class="m-index-arrow">
          <div class="index-arrow-title">我的关注</div>
        </div>
        <div class="m-focus-list">
          <div class="wrap">
            <ul>
              <li class="item" v-for="item in focusList" :key="item.id">
                <img :src="item.avator"/>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="m-menu-popup" v-bind:class="{'z-show':showmenu}">
        <div class="cont">
          <div class="opts">
            <span class="title">所有应用</span>
            <span class="edit" @click="changeMenu">
            <template v-if="!isEdit">编辑</template>
            <template v-else>完成</template>
          </span>
          </div>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/4" v-for="item in selectingList" :key="item.id">
              <div class="flex-demo">
                <div class="checkbox" @click="changeCheckedItem(item,$event)" v-show="isEdit">
                  <i class="iconfont icon-checkbox" v-show="item.type!==1"></i>
                  <i class="iconfont icon-checkbox-checked" v-show="item.type===1"></i>
                </div>
                <div class="m-common-icon" @click="gotoPage(item)">
                  <svg class="svg-icon" v-html="`<use xlink:href='#icon-${item.myMenu.menuIcon}'></use>`"></svg>
                </div>
                <p>{{item.myMenu.funcName}}</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <div class="m-menu-mask" v-show="showmenu" @click="hideAll"></div>
    </div>
  </div>
</template>

<script>
import {
  Flexbox,
  FlexboxItem,
  CheckIcon,
  TransferDom
} from "vux";

export default {
  components: {
    Flexbox,
    FlexboxItem,
    CheckIcon
  },
  name: "home",
  directives:{
    TransferDom
  },
  data() {
    return {
      menuList: [],
      seletedList: [],
      selectingList: [],
      isEdit: false,


      commonlistPost: [],
      focusList: [],
      showmenu: false,

      popupTrans: "",
      popupHeight: "",
      checkShow: false,
      checkHasChange: false,
      popupAdd: "-10",
      attenPageIndex: 1,
      pageCount: 0,
    };
  },
  activated() {
  },
  mounted() {
    this.getList();
    this.getFocusList();
  },
  computed: {
    selectedList() {
      return this.menuList.filter(function(commonObj) {
        return commonObj.type === 1;
      });
    }
  },
  methods: {
    getList() {
      //获取常用列表
      this.publicApi.ajax(this.URL.BASE.MENU, {}, 2).then(res => {
        if (res.data.status === 200) {
          this.menuList = res.data.data;
        } else {
          this.$vux.toast.text(res.data.message);
        }
      });
    },
    getFocusList() {
      this.publicApi.ajax(this.URL.BASE.FOCUS, {}, 0)
        .then(res => {
          if (res.data.status === 200) {
            if(res.data.data.length > 0){
              this.focusList = res.data.data;
            }
          } else {
            this.$vux.toast.text(res.data.message);
          }
        });
    },
    gotoPage(item) {
      //跳转
      this.$store.dispatch("globalLoading", 2); //跳转前进行loading显示
      this.$router.push({path:item.myMenu.menuUrl});
    },
    showAll(){
      this.showmenu = true;
      this.selectingList = JSON.parse(JSON.stringify(this.menuList));
    },
    hideAll(){
      this.showmenu = false;
      this.isEdit = false;
    },
    changeCheckedItem(item,event){
      event.stopPropagation()
      if(item.type===1){
        item.type = 0;
      }
      else{
        item.type = 1;
      }
    },
    changeMenu(){
      if(this.isEdit){
        //完成编辑
        this.isEdit = false;
        this.menuList = JSON.parse(JSON.stringify(this.selectingList));
        this.showmenu = false;
        //传值给后台什么的
      }
      else{
        //进入编辑
        this.isEdit = true;
      }
    }
  }
};
</script>

<style lang="less">
.m-index {
  height: 100%;
  overflow: scroll;
  .flex-demo {
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
    position: relative;
    .m-common-icon {
      position: relative;
      .svg-icon {
        font-size: 32px;
      }
    }
    .checkbox{
      position: absolute;
      right: 0;
      top: 0;
      padding: 5px;
      z-index: 10;
      color: @theme-color;
      .iconfont{
        font-size: 12px;
      }
    }
  }
  .m-common-use,
  .m-focus {
    padding-top: 15px;
    position: relative;
    background-color: #ffffff;
    margin-bottom: 20px;
  }
  .m-index-arrow {
    font-size: 15px;
    width: 6em;
    position: absolute;
    top: -10px;
    left: 0;
    .index-arrow-title {
      width: 100%;
      padding: 2px 0 4px 0;
      background: @theme-color;
      color: #fff;
      text-align: center;
      border-radius: 0 0 50% 50% ;
    }
  }
  .m-focus {
    padding: 28px 0 10px 0;
    .m-focus-list{
      overflow: hidden;
      height: 85px;
      .wrap{
        overflow-x: scroll;
        height: 200px;
        white-space: nowrap;
      }
      .item{
        display: inline-block;
        margin: 0 2vw;
        width: 20vw;
        height: 20vw;
        border-radius: 50%;
        overflow: hidden;
        img{
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .m-menu-popup{
    position:absolute;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 10;
    max-height: 0;
    transition: all 300ms;
    overflow: hidden;
    white-space: normal;
    &.z-show{
      max-height: 300px;
    }
    .opts{
      padding: 10px 12px;
      font-size: 12px;
      overflow: hidden;
      &>.edit{
        float: right;
        border: 1px solid @theme-color;
        padding: 2px 5px;
        color: @theme-color;
      }
      &>.title{
        float: left;
        font-size: 15px;
        color: @theme-color;
        padding: 1px;
      }
    }
  }
  .m-menu-mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: rgba(0,0,0,0.3);
  }
}
</style>
