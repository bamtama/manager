<template>
  <div>
    <m-header mTitle="我的收藏" ref="mheader"> </m-header>
    <div class="g-content">
      <me-scroll
        @meScrollDom="getMeScrollDom"
        @loadMore="loadMore"
        @downRefresh="refresh" >
        <div class="fav-list">
          <swipeout>
            <swipeout-item transition-mode="follow" v-for="(item,i) in dataList" :key="i">
              <div slot="right-menu">
                <swipeout-button type="warn" @click.native="actionDel(item)">删除</swipeout-button>
              </div>
              <div slot="content" class="item">
                <img :src="item.img"/>
                <div class="right-cont">
                  <p class="title">{{item.title}}</p>
                  <p class="content">{{item.content}}</p>
                  <div class="baseinfo">
                    <span class="author">{{item.author}}</span>
                    <span class="datetime">{{item.datetime}}</span>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </me-scroll>
    </div>
  </div>
</template>

<script>
  import header from "@/components/header";
  import MeScroll from "@/components/meScroll";
  import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

  export default {
    name: "FavList",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      mHeader: header,
      meScroll: MeScroll
    },
    data() {
      return {
        dataList: [],
        showLoading: 2, //辅助标记，仅在页面加载和刷新时需要
        meScroll: null,
        pageIndex: 0,
        pageSum: 1,
        searchKey: "",
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
        this.publicApi.ajax(this.URL.LIST.FAV, {}, this.showLoading).then(res => {
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
    }
  };
</script>
<style lang="less" scoped>
  .fav-list{
    .item{
      padding: 12px 8px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      img{
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        flex: none;
      }
      .right-cont{
        overflow: hidden;
        padding: 0 12px 0 24px;
        flex: auto;
        .title{
          font-weight: 700;
        }
        .content{
          overflow: hidden;
          white-space: nowrap;
          word-break: break-all;
          text-overflow: ellipsis;
        }
        .baseinfo{
          font-size: 12px;
          color: #999;
          width: 100%;
          .author{
            float:left;
          }
          .datetime{
            float:right;
          }
        }
      }
    }
  }
</style>
