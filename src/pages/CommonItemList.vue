<template>
  <div class="dw-education">
    <m-header :mTitle="cTitle"
              :rightBtn="newBtn"
              @actionRight="addNew"> </m-header>
    <div class="g-content">
      <div class="mescroll" id="mescroll">
          <group :gutter="0">
            <div class="item" data-test="0" v-for="(item,index) in dataList" :key="index" @click="gotoDetail(item)">
              <!--教育学习-->
              <template v-if="pageType === TYPES.EDUCATION">
                <div class="cont">
                  <cell title="教育日期">
                    <div><span>{{item.educendate}}</span></div>
                  </cell>
                  <cell title="教育地点">
                    <div><span>{{item.educenplace}}</span></div>
                  </cell>
                  <cell title="教育内容">
                    <div><span>{{item.educencontent}}</span></div>
                  </cell>
                </div>
                <div class="opts" v-if="item.delete">
                  <a class="btn-del" @click="actionDel($event,item)">删除</a>
                </div>
              </template>
              <!--帮困扶助-->
              <template v-if="pageType === TYPES.HELP">
                <div class="cont">
                  <cell title="帮扶类别">
                    <div><span>{{item.helpcode_str}}</span></div>
                  </cell>
                  <cell title="帮扶日期">
                    <div><span>{{item.helpdate}}</span></div>
                  </cell>
                  <cell title="帮扶内容">
                    <div><span>{{item.helpcontent}}</span></div>
                  </cell>
                </div>
                <div class="opts" v-if="item.delete">
                  <span class="btn-del" @click="actionDel($event, item)">删除</span>
                </div>
              </template>
               <!--违规警告-->
              <template v-if="pageType === TYPES.VIOLATION">
                <div class="cont warn">
                  <cell title="违规开始时间">
                    <div><span>{{item.crossdate}}</span></div>
                  </cell>
                  <cell title="违规结束时间">
                    <div><span>{{item.crossenddate}}</span></div>
                  </cell>
                  <cell title="违规类型">
                    <div><span>{{item.crosstype_str}}</span></div>
                  </cell>
                </div>
              </template>
               <!--社区服务-->
              <template v-if="pageType === TYPES.COMMUNITY">
                <div class="cont">
                  <cell title="劳动地点">
                    <div><span>{{item.workplace}}</span></div>
                  </cell>
                  <cell title="开始时间">
                    <div><span>{{item.workdate}}</span></div>
                  </cell>
                  <cell title="结束时间">
                    <div><span>{{item.workenddate}}</span></div>
                  </cell>
                </div>
                <div class="opts" v-if="item.delete">
                  <a class="btn-del" @click="actionDel($event,item)">删除</a>
                </div>
              </template>
            </div>
          </group>
      </div>
    </div>
  </div>
</template>
<script>
import header from "@/components/header";
import { Group, Cell } from "vux";
import MeScroll from "../assets/libs/mescroll.m";

export default {
  name: "CommonItemList",
  components: {
    Group,
    Cell,
    mHeader: header
  },
  data() {
    return {
      TYPES: {
        EDUCATION: "Education",
        HELP: "Help",
        VIOLATION: "ViolationPersonalList",
        COMMUNITY: "CommunityService"
      },
      LOGS: {
        "Education":{
          list:'110201',
          getadd: '110203',
          del: '110204',
          add: '110202'
        },
        "Help":{
          list:'114201',
          getadd: '110203',
          del: '114202',
          add: '114204'
        },
        "ViolationPersonalList":{},
        "CommunityService":{}
      },
      pageType: this.$route.name,

      dataList: [],
      pageIndex: 0,
      meScroll: null,
      pageSum: 0,
      pid: this.$route.query.id,
      phone:this.$route.query.phone,
      newBtn: "",
      name: decodeURIComponent(this.$route.query.name),
      showLoading: 2
    };
  },
  computed: {
    cTitle() {
      let t = "";
      switch (this.pageType) {
        case this.TYPES.EDUCATION:
          t = this.name + " 教育学习";
          break;
        case this.TYPES.HELP:
          t = this.name + " 帮困扶助";
          break;
        case this.TYPES.VIOLATION:
          t = this.name + " 违规警告";
          break;
        case this.TYPES.COMMUNITY:
          t = this.name + " 社区服务";
          break;
      }
      return t;
    }
  },
  activated() {
    console.log("activated");
    if (this.meScroll) {
      this.meScroll.scrollTo(this.$store.getters.itemListScrollTop, 0);
    }
    //检查当前是否有删除/修改项目，优先级删除>修改
    let mitem = this.$store.getters.modifiedItem,
      ditem = this.$store.getters.deletedItem,
      targetIndex = -1;
    let key = '';
    switch (this.pageType){
      case this.TYPES.EDUCATION:
        key = 'rceducenid';
        break;
      case this.TYPES.HELP:
        key = 'rchelpid';
        break;
    }
    //检查删除项目
    if (ditem) {
      let arr = this.dataList.filter(item => {
        return item[key] !== ditem[key];
      });
      this.dataList = JSON.parse(JSON.stringify(arr));
      this.$store.dispatch("setDeletedItem", null);
      this.$store.dispatch("setModifiedItem", null);
    } else {
      //检查修改项目
      if (mitem) {
        //针对此项目更新对应列表项目
        this.dataList.some((item, index) => {
          if (item[key] === mitem[key]) {
            targetIndex = index;
            mitem.edit = item.edit;
            mitem.delete = item.delete;
            return true;
          }
        });
        this.dataList[targetIndex] = mitem;
        this.dataList = JSON.parse(JSON.stringify(this.dataList));
        this.$store.dispatch("setModifiedItem", null);
      }
    }
  },
  mounted() {
    this.getList();
    this.initNew();
    this.initScroll();
  },
  beforeRouteLeave(to, from, next) {
    if (to.meta.level > from.meta.level || !to.meta.level) {
      this.$store.dispatch(
        "setItemListScrollTop",
        this.meScroll.getScrollTop()
      );
    }
    next();
  },
  methods: {
    initNew() {
      if(this.pageType === "ViolationPersonalList"){
        console.log("没有新增按钮")
      }else{
        this.LOGS[this.pageType].getadd && this.$logLine.eventStart(this.LOGS[this.pageType].getadd);
         this.publicApi.getAddBtn(this.pageType).then(res => {
          if (res.data.status === 200) {
            if (res.data.data.isExist) {
              this.newBtn = "新增";
            } else {
              this.newBtn = "";
            }
            this.$logLine.eventEnd(0, res.data.message).send();
          } else {
            this.$vux.toast.text(res.data.message);
            this.$logLine.eventEnd(1, res.data.message).send();
          }
        });
      }

    },
    addNew() {
      this.LOGS[this.pageType].add && this.$logLine.eventStart(this.LOGS[this.pageType].add);
      switch (this.pageType) {
        case this.TYPES.EDUCATION:
          window.sessionStorage.removeItem("APP_EDUCATION_DETAIL");
          this.$router.push({ name: "AddEducation", query: { id: this.pid } });
          break;
        case this.TYPES.HELP:
          window.sessionStorage.removeItem("APP_HELP_DETAIL");
          this.$router.push({
            name: "HelpEdit",
            query: {
              id: this.pid,
              name: encodeURIComponent(this.name)
            }
          });
          break;
        case this.TYPES.COMMUNITY:
          window.sessionStorage.removeItem("APP_COMMUNITY_DETAIL");
          this.$router.push({
            name: "AddCommunityService",
            query: { id: this.pid }
          });
          break;
      }
    },
    gotoDetail(item) {
      let curname = this.pageType + "Detail";
      this.$store.dispatch('globalLoading',2);
      this.$router.push({
        name: curname,
        query: {
          id: this.pid,
          itemid: item.rceducenid || item.rccrossareaid || item.rcedupubworkid || item.rchelpid,
          delete: item.delete,
          edit: item.edit,
          name: this.name,
          phone:this.phone
        }
      });
    },
    initScroll() {
      let self = this;
      this.meScroll = new MeScroll("mescroll", {
        down: {
          callback: self.refresh,
          auto: false,
          offset: 60
        },
        up: {
          callback: self.loadMore,
          auto: false,
          offset: 60,
          htmlNodata: '<p class="upwarp-nodata">-- 没有更多数据了 --</p>'
        }
      });
    },
    loadMore() {
      console.log("loadmore");
      this.pageIndex++;
      this.getList();
    },
    refresh() {
      console.log("refresh");
      this.pageIndex = 0;
      this.getList();
    },
    getList() {
      this.LOGS[this.pageType].list && this.$logLine.eventStart(this.LOGS[this.pageType].list);
      this.publicApi
        .getCommonItemList(
          this.pageType,
          {
            personid: this.pid,
            type: 0,
            index: 0,
            draw: this.pageIndex + 1
          },
          this.showLoading
        )
        .then(res => {
          if (res.data.status === 200) {
            let newlist = res.data.data.list;
            // newlist.forEach((item,index)=>{
            //   item.draw = this.pageIndex+1;
            // })
            if (this.pageIndex === 0) {
              this.dataList = newlist;
              this.pageSum = res.data.data.pageSum;

              //更换loading
              this.showLoading = false;

              this.meScroll.endSuccess(20, true);
              if (this.pageSum <= this.pageIndex + 1) {
                //是否有后续页
                this.meScroll.showNoMore();
              }
            } else {
              //后续页加载
              this.dataList = this.dataList.concat(newlist);
              //判断之后是否还有后续页
              if (this.pageSum > this.pageIndex + 1) {
                this.meScroll.endSuccess(20, true);
              } else {
                this.meScroll.endSuccess(20, false);
              }
            }
            this.$logLine.eventEnd(0, res.data.message).send();
          } else {
            this.$vux.toast.text(res.data.message);
            this.$logLine.eventEnd(1, res.data.message).send();
          }
        });
    },
    actionDel(event, item) {
      event.stopPropagation();
      this.LOGS[this.pageType].del && this.$logLine.eventStart(this.LOGS[this.pageType].del);
      let delCallback = (idName, res) => {
        if (res.status !== 200){
          this.$vux.toast.show({
            text: "删除失败",
            type: "text"
          });
          this.$logLine.eventEnd(1, res.data.message).send();
        }
        else{
          this.$vux.toast.show({
            text: "删除成功",
            type: "text",
            onShow: () => {
              let arr = this.dataList.filter(function(val) {
                return val[idName] !== item[idName];
              });
              this.dataList = JSON.parse(JSON.stringify(arr));
            }
          });
          this.$logLine.eventEnd(0, res.data.message).send();
        }
      };

      //删除某项
      this.$vux.confirm.show({
        content: "您确定要删除该条记录吗？",
        onConfirm: () => {
          //教育学习-删除
          if (this.pageType === this.TYPES.EDUCATION) {
            this.publicApi
              .education("delete", { ids: item.rceducenid }, true)
              .then(res => {
                delCallback("rceducenid",res);
              });
          } else if (this.pageType === this.TYPES.COMMUNITY) {
            //社区服务-删除
            this.publicApi
              .communityService("delete", { ids: item.rcedupubworkid }, true)
              .then(res => {
                delCallback("rcedupubworkid",res);
              });
          } else if(this.pageType === this.TYPES.HELP){
            //帮困扶助-删除
            this.publicApi
              .help("delete", { ids: item.rchelpid }, true)
              .then(res => {
                delCallback("rchelpid",res);
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import url("../assets/libs/mescroll.min.css");

.dw-education {
  .addnew {
    font-size: 15px;
  }
  .weui-cells {
    margin-top: 0;
    .item {
      border-bottom: 4px solid #f5f5f5;
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      .cont {
        flex: auto;
      }
      .warn {
        .weui-cell__ft {
          padding-left: 2em;
        }
      }
      .opts {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: right;
        .btn-del {
          font-size: 15px;
          color: rgba(246, 11, 11, 0.7);
          padding: 20px 12px;
        }
      }
    }
    .weui-cell {
      padding: 3px 12px;
      &:before {
        height: 0;
        border: none;
      }
      .weui-cell__ft {
        width: 72.6%;
        text-align: left;
        color: #292929;
      }
    }
  }
}
</style>
