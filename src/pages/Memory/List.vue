<template>
  <div>
    <m-header mTitle="备忘录" ref="mheader"> </m-header>
    <div class="g-content">
      <me-scroll
        @meScrollDom="getMeScrollDom"
        @loadMore="loadMore"
        @downRefresh="refresh" >
        <div class="memory-list" v-for="item in dataList" :key="item.ind" @click="toDetail(item)">
          <group class="g-group" label-width="4em" :gutter="0" >
            <cell value-align="left" title="标题">{{item.title}}</cell>
            <cell value-align="left" title="事件">{{item.content}}</cell>
            <cell value-align="left" title="时间">{{item.triggertime}}</cell>
          </group>
        </div>
      </me-scroll>
    </div>
    <div v-transfer-dom>
      <popup v-model="showMemoryDetail" class="memory-detail-popup">
        <div class="cont">
          <group class="g-group" label-width="4em" :gutter="0">
            <cell value-align="left" title="标题">{{itemDetail.title}}</cell>
            <cell value-align="left" title="事件">{{itemDetail.content}}</cell>
            <cell value-align="left" title="时间">{{itemDetail.triggertime}}</cell>
            <cell value-align="left" title="子事件">
              <p v-for="(sub,i) in itemDetail.subs" :key="i">
                {{sub.content}}
              </p>
            </cell>
          </group>
          <div class="opts">
            <span @click="gotoEdit(itemDetail)">修改</span>
            <span @click="actionDel(itemDetail)">删除</span>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import header from "@/components/header";
  import MeScroll from "@/components/meScroll";
  import { Group, Cell, CellBox, XTextarea , Popup, TransferDom} from "vux";

  export default {
    name: "MemoryList",
    components: {
      Group,
      Cell,
      CellBox,
      mHeader: header,
      XTextarea,
      MeScroll,
      Popup
    },
    directives:{
      TransferDom
    },
    data() {
      return {
        dataList: [],
        showLoading: 2, //辅助标记，仅在页面加载和刷新时需要
        meScroll: null,
        pageIndex: 0,
        pageSum: 1,
        searchKey: "",
        showMemoryDetail:false,
        itemDetail: {}
      };
    },
    activated() {
    },
    mounted() {},
    computed: {},
    methods: {
      getMeScrollDom(ele) {
        this.meScroll = ele;
      },
      getList() {
        let rqdata = {
          draw: this.pageIndex
        };
        this.publicApi.ajax(this.URL.LIST.MEMORY, {}, this.showLoading).then(res => {
          if (res.data.status === 200) {
            if (this.pageIndex === 1) {
              //第一页加载/刷新
              this.dataList = res.data.data.list;
              this.pageSum = res.data.data.pageSum;

              //更换loading
              this.showLoading = true;

              //滚动相关设置
              this.meScroll.endSuccess(20, true);
              if (this.pageSum <= this.pageIndex) {
                //是否有后续页
                this.meScroll.showNoMore();
              }
            } else {
              //后续页加载
              this.dataList = this.dataList.concat(res.data.data.list);
              //判断之后是否还有后续页
              if (this.pageSum > this.pageIndex) {
                this.meScroll.endSuccess(20, true);
              } else {
                this.meScroll.endSuccess(20, false);
              }
            }
          } else {
            this.$vux.toast.text(res.data.message);
          }

          //不管搜索条是否弹出，都关闭他
          this.$refs.mheader.actionHideSearchBar();
        });
      },
      loadMore() {
        console.log("loadmore");
        this.pageIndex++;
        this.getList();
      },
      refresh() {
        console.log("refresh");
        this.pageIndex = 1;
        this.getList();
      },
      search(key) {
        this.pageIndex = 1;
        this.searchKey = key;
        this.getList();
      },
      toDetail(item) {
        this.itemDetail = item;
        this.showMemoryDetail = true;
        console.log(item)
      },
      actionDel(item){
        let _this = this;
        this.$vux.confirm.show({
          title:"确定删除？",
          onCancel(){
          },
          onConfirm(){
            _this.showMemoryDetail = false;
            _this.dataList.splice(_this.dataList.findIndex(ele =>{return ele.id === item.id }), 1);
          }
        })
      },
      gotoEdit(item){
        this.$router.push({name:'MemoryEdit', query:item})
      }
    }
  };
</script>
<style lang="less" scoped>
  .memory-list{
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  .memory-detail-popup{
    background: transparent;
    .cont{
      margin: 10px;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;
    }
    .opts{
      text-align: right;
      margin: 10px;
      &>span{
        display: inline-block;
        padding: 3px 8px;
        font-size: 13px;
        background: rgba(0,0,0,0.1);
        border-radius: 3px;
        color: #333;
        &:nth-child(1){
          color: @theme-color;
        }
      }
    }
  }
</style>
