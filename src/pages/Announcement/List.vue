<template>
  <div class="notice">
    <m-header mTitle="我的评论" :defaultSearch="true" ref="mheader" @actionSearch="search"></m-header>
    <div class="g-content" ref="gc">
      <tab>
        <tab-item selected @on-item-click="tabChange(0)">我收到的</tab-item>
        <tab-item @on-item-click="tabChange(1)">我发出的</tab-item>
      </tab>
      <div style="position: absolute;top: 44px;bottom: 0;right: 0;left: 0;overflow: scroll">
        <div class="page-item" v-show="tabIndex===0">
          <group :gutter="0">
            <cell-box v-for="(item,index) in dataList.received" :key="index" @click.native="gotoPage(item)">
              <div class="item">
                <div class="title">
                  {{item.title}}
                </div>
                <div class="msg">
                  <span>{{dateformat(item.time)}}</span>
                  <span class="name">{{item.name}}</span>
                </div>
              </div>
            </cell-box>
          </group>
        </div>
        <div class="page-item" v-show="tabIndex===1">
          <group :gutter="0">
            <cell-box v-for="(item,index) in dataList.send" :key="index" @click.native="gotoPage(item)">
              <div class="item">
                <div class="title">
                  回复的主题：{{item.title}}
                </div>
                <div class="msg">
                  <span>{{dateformat(item.time)}}</span>
                  <span class="name">{{item.name}}</span>
                </div>
              </div>
            </cell-box>
          </group>
        </div>
      </div>
      <x-button type="primary" class="addBtn" @click.native="gotoEdit">新增</x-button>
    </div>
  </div>
</template>

<script>
import header from "@/components/header";
import { Group, CellBox, XButton, dateFormat, Tab, TabItem } from "vux";
import meScroll from '@/components/meScroll'

export default {
  name: "AnnouncementList",
  components: {
    Group,
    CellBox,
    XButton,
    dateFormat,
    mHeader: header,
    Tab,
    TabItem,
    meScroll: meScroll
  },
  data() {
    return {
      dataList: {
        received:{},
        send:{}
      },
      showLoading: 2, //辅助标记，仅在页面加载和刷新时需要
      type: "",
      tabIndex: 0,
    };
  },
  mounted(){
    this.getList();
  },
  methods: {
    tabChange(i){
      if(i !== this.tabIndex){
        this.tabIndex = i;
        this.getList();
      }
    },
    getList(){
      this.publicApi.ajax(this.URL.LIST.ANNOUNCEMENT,{},this.showLoading).then(res=>{
        if (res.data.status === 200) {
          if(this.tabIndex === 0){
            this.dataList.received = res.data.data.list;
          }
          else{
            this.dataList.send = res.data.data.list;
          }
          //更换loading
          this.showLoading = 0;
        } else {
          this.$vux.toast.text(res.data.message);
        }
        //不管搜索条是否弹出，都关闭他
        this.$refs.mheader.actionHideSearchBar();
      })
    },
    gotoEdit(){
      this.$router.push({name:"AnnouncementEdit"})
    },
    gotoPage(id) {
      this.$router.push({ name: "AnnouncementDetail", query: { id: id } });
    },
    dateformat(date) {
      return dateFormat(new Date(date), "YYYY-MM-DD HH:mm:ss");
    },
    search(key) {
      this.pageIndex = [0,0];
      this.showLoading = 2;
      this.getList();
    }
  },
};
</script>

<style lang="less">
.notice {
  .page-item{
    .item{
      width: 100%;
    }
    .title{
      font-size: 16px;
    }
    .msg{
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
      font-size: 13px;
      color: #666;
    }
  }
  .addBtn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 16px;
    color: #fefeff;
    box-shadow: 1.805px 2.396px 7.12px 0.88px rgba(211, 211, 211, 0.6);
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
}
</style>
