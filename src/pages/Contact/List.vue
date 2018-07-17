<template>
  <div class="address">
    <m-header mTitle="通讯录" :defaultSearch="true" @actionSearch="search"></m-header>
    <div class="g-content">
      <orgSelection @actionChange="actionOrgChange"></orgSelection>
      <div class="mescroll-wrap">
        <me-scroll @meScrollDom="getScroll"
                   @downRefresh="refresh"
                   @loadMore="loadmore">
          <group :gutter="10">
            <cell v-for="item in dataList" :key="item.id" :title="item.name"
                  @click.native="showDetail(item)">{{item.phonenum}}</cell>
          </group>
        </me-scroll>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog :hide-on-blur="true" class="detail-dialog" v-model="detailShow">
        <group :gutter="0" v-for="item in detail" :key="item.id" label-width="4em" label-margin-right="2em">
          <cell value-align="left">
            <img class="avator" :src="item.detail.photo" />
            <span class="name">{{item.name}}</span>
          </cell>
          <cell title="电话号码">{{item.phonenum}}</cell>
          <cell title="备用号码">{{item.detail.phonenum2}}</cell>
          <cell title="地址">{{item.detail.address}}</cell>
          <cell title="爱好">{{item.detail.hobits}}</cell>
        </group>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import header from "@/components/header";
import orgselection from '@/components/OrgSelection';
import mescroll from '@/components/meScroll'
import { Group, CellBox, Cell, XButton, dateFormat, XDialog, TransferDom } from "vux";

export default {
  name: "ContactList",
  components: {
    Group,
    CellBox,
    Cell,
    XButton,
    dateFormat,
    mHeader: header,
    orgSelection: orgselection,
    meScroll: mescroll,
    XDialog
  },
  directives:{
    TransferDom
  },
  data() {
    return {
      dataList: [],
      meScroll: null,
      detail: {},
      detailShow: false
    };
  },
  mounted() {
  },
  activated() {

  },
  computed: {

  },
  methods: {
    getList(){
      this.publicApi.ajax(this.URL.LIST.CONTACT, {}, 1).then((res)=>{
        if(res.data.status === 200){
          this.dataList = res.data.data;
          this.meScroll.endSuccess(20,true);
        }
        else{
          alert('error')
        }
      })
    },
    search(){

    },
    actionOrgChange(){
      this.getList()
    },
    getScroll(ele){
      this.meScroll = ele;
    },
    refresh(){
      console.log('下拉刷新')
      this.getList()
    },
    loadmore(){
      console.log('上拉加载')
      this.getList()
    },
    showDetail(item){
      console.log(item)
      this.detailShow = true;
      this.detail= [item];
    }
  }
};
</script>

<style lang="less" scoped>
  .detail-dialog{
    .avator{
      height: 64px;
      width: 64px;
      border-radius: 50%;
    }
    .name{
      vertical-align: 20px;
      margin: 0 0 0 20px;
    }
  }
</style>
