<template>
  <div>
    <m-header :mTitle="cTitle"
              ref="mheader"
              :defaultSearch="true"
              :searchPlaceholder="sPlaceholder"
              @actionSearch="actionCurSearch" :defaultBack="cTitle=='关注'||cTitle=='定位'?false:true"> </m-header>
    <div class="g-content">
      <orgSelection @actionChange="actionOrgChange" v-if="pageType===TYPES.LOCLIST"></orgSelection>
      <div class="mescroll-wrap">
        <div class="mescroll" id="mescroll">
          <group :gutter="10" class="g-group g-list">
            <cell-box class="item" v-for="(item,index) in dataList" :key="index" @click.native="gotoDetail(item)">
              <!--定位列表项-->
              <list-item v-if="pageType === TYPES.LOCLIST"
                         :name="item.personname"
                         :cont1="`号码：${item.fixnumber}`"
                         :cont2="`部门：${item.orgname}`">
              </list-item>
              <!--信息-->
              <list-item v-if="pageType === TYPES.FriendList || pageType === TYPES.ATTENTION"
                         :showicon="true"
                         :ismale="item.sex === '1'"
                         :name="item.personname"
                         :type="item.rctype"
                         :cont1="`电话：${item.tel}`"
                         :cont2="`类型：${item.type}`"
                         :cont3="`号码：${item.fixnumber}`">
                <div slot="right" class="opts">
                  <div class="opt-follow"
                       v-bind:class="{'z-following':item.isFocus}"
                       @click="followTarget($event,item)">
                    <span class="default"><i class="iconfont icon-follow"></i>关注</span>
                    <span class="active">已关注</span>
                  </div>
                </div>
              </list-item>
              <!--电话报告/违规警告/社区服务/教育学习/帮困扶助-->
              <list-item v-if="pageType === TYPES.COMMUNITYSERVICELIST || pageType === TYPES.TELREPORTLIST
                          || pageType === TYPES.VIOLATIONWARNLIST || pageType === TYPES.EDUCATIONLIST
                          || pageType === TYPES.HELPLIST || pageType === TYPES.REWARDLIST || pageType === TYPES.FIELDVISITLIST "
                         :showicon="true"
                         :ismale="item.sex === '1'"
                         :name="item.personname"
                         :type="item.monitorlevel_str"
                         :cont1="`号码：${item.fixnumber}`"
                         :cont2="`手机：${item.contactmobil}`">
              </list-item>
              <template v-else></template>
            </cell-box>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import header from "@/components/header";
import listitem from "@/components/listitem";
import orgselection from "@/components/OrgSelection";
import MeScroll from "../assets/libs/mescroll.m";
import { mapGetters } from "vuex";
import { Group, CellBox } from "vux";

export default {
  name: `CommonList`,
  components: {
    CellBox,
    Group,
    mHeader: header,
    listItem: listitem,
    orgSelection:orgselection
  },
  data() {
    return {
      ORGCODE: window.sessionStorage.getItem('orgCode'),
      TYPES: {
        VIOLATIONWARNLIST: "ViolationWarnList",
        COMMUNITYSERVICELIST: "CommunityServiceList",
        FriendList: "FriendList",
        LOCLIST: "/Home/LocList",
        TELREPORTLIST: "TelReportList",
        EDUCATIONLIST: "EducationList",
        HELPLIST: "HelpList",
        FIELDVISITLIST: "FieldVisitList",
        REWARDLIST: "RewardList",
        ATTENTION: "/Home/Attention"
      },
      PAGEVALS: {
        ViolationWarnList: {
          eid: "107191",
          title: "违规警告",
          subpage: "ViolationPersonalList"
        },
        CommunityServiceList: {
          eid: "105191",
          title: "社区服务",
          subpage: "CommunityService"
        },
        FriendList: {
          eid: "103201",
          sid: '103202',
          title: "好友信息",
          subpage: "FileInTube"
        },
        "/Home/LocList": {
          eid: "104101",
          title: "定位",
          subpage: "LocDetail"
        },
        TelReportList: {
          eid: "106191",
          title: "电话报告",
          subpage: "TelPersonalDetail"
        },
        EducationList: {
          eid: "110101",
          title: "教育学习",
          subpage: "Education"
        },
        HelpList: {
          eid: "114101",
          title: "帮困扶助",
          subpage: "Help"
        },
        FieldVisitList: {
          eid: "",
          title: "实地走访",
          subpage: "FieldVisitDetail"
        },
        RewardList: {
          eid: "",
          title: "奖惩查看",
          subpage: "rewarList"
        },
        "/Home/Attention": {
          eid: "115101",
          title: "关注",
          subpage: "FileInTube"
        }
      },

      pageType: this.$route.name || this.$route.path,
      dataList: [],

      showLoading: 2, //辅助标记，仅在页面加载和刷新时需要

      meScroll: null,

      keyword: "",
      pageSize: 10,
      pageIndex: 0,
      pageSum: 0,
      unitcode: window.sessionStorage.getItem('orgCode')
    };
  },
  watch:{
    $route(newVal,oldVal){
      if(newVal.path !== this.pageType&&(newVal.path=="/Home/LocList"||newVal.path=="/Home/Attention")){
        this.routerChange(newVal.path)
      }
    }
  },
  computed: {
    cTitle() {
      if(this.pageType === this.TYPES.FriendList && this.$route.query.focus == 1){
        return '添加关注';
      }
      else{
        return this.PAGEVALS[this.pageType].title;
      }
    },
    sPlaceholder(){
      if(this.pageType === this.TYPES.FriendList){
        return '请输入姓名'
      }
    },
    ...mapGetters(["personListRefresh", "personListScrollTop"]),
    showOpts() {
      if (
        this.pageType === this.TYPES.FriendList ||
        this.pageType === this.TYPES.VIOLATIONWARNLIST
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  activated() {
    if (this.meScroll) {
      this.meScroll.scrollTo(this.$store.getters.personListScrollTop, 0);
    }
    //检查当前是否有修改项目
    let mitem = this.$store.getters.modifiedItem;
    //检查删除项目
    if (mitem) {
      //针对此项目更新对应列表项目
      let dlist = JSON.parse(JSON.stringify(this.dataList));
      for (let i in dlist) {
        if (dlist[i].personid === mitem.personid) {
          dlist[i].isFocus = mitem.isFocus;
        }
      }
      this.dataList = JSON.parse(JSON.stringify(dlist));
      this.$store.dispatch("setModifiedItem", null);
    }
  },
  created() {
    console.log(this.pageType)
    if(this.pageType === this.TYPES.LOCLIST){
      //不加载
      console.log('bujiazai')
    }
    else{
      this.getList();
    }
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    actionCurSearch(data) {
      this.keyword = data;
      this.pageIndex = 0;
      this.showLoading = 2;
      this.getList();
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
    routerChange(pagetype) {
      //强制刷新页面
      this.pageType = pagetype;
      this.pageIndex = 0;
      this.dataList = [];
      this.unitcode = this.ORGCODE;
      this.showLoading = 2;
      this.keyword = '';
      this.$refs.mheader.setKeyword('');
      if (this.meScroll) {
        this.$store.dispatch("setPersonListScrollTop",0);
        this.meScroll.scrollTo(0, 0);
      }
      if(this.pageType === this.TYPES.LOCLIST && this.ORGCODE == 44){
        //不加载
        console.log('bujiazai')
      }
      else{
        this.getList();
      }
    },
    getList() {
      if(this.pageType === this.TYPES.LOCLIST){
        if(this.unitcode == 44){
          this.dataList = [];
          this.meScroll.endSuccess(20, true);
          this.$vux.toast.text('请选择市及以下机构！');
          return false;
        }
      }
      let reqdata = {};
      switch (this.pageType) {
        case this.TYPES.LOCLIST:
          reqdata = {
            name: this.keyword,
            start: this.pageIndex * this.pageSize,
            pageSize: this.pageSize,
            unitcode: this.unitcode
          };
          break;
        case this.TYPES.FriendList:
          reqdata = {
            start: this.pageIndex * this.pageSize,
            length: this.pageSize,
            p_personname: this.keyword
          };
          break;
        case this.TYPES.ATTENTION:
          reqdata = {
            start: this.pageIndex * this.pageSize,
            length: this.pageSize,
            p_personname: this.keyword,
            fcorepersondict: '01'
          };
          break;
        case this.TYPES.VIOLATIONWARNLIST:
        case this.TYPES.TELREPORTLIST:
        case this.TYPES.COMMUNITYSERVICELIST:
        case this.TYPES.EDUCATIONLIST:
        case this.TYPES.HELPLIST:
        case this.TYPES.FIELDVISITLIST:
        case this.TYPES.REWARDLIST:
          reqdata = {
            draw: this.pageIndex + 1,
            p_personno: "",
            p_personname: this.keyword,
            p_idcard: ""
          };
          break;
        default:
          break;
      }

      this.publicApi
        .ajax(this.URL.LIST.LOC, reqdata, this.showLoading)
        .then(res => {
          if (res.data.status === 200) {
            if (this.pageIndex === 0) {
              //第一页加载/刷新
              this.dataList = res.data.data.list;
              if(!this.unitcode){
                this.unitcode = res.data.data.unitcode;
              }
              this.pageSum = res.data.data.pageSum;

              //更换loading
              this.showLoading = false;

              //滚动相关设置
              this.meScroll.endSuccess(20, true);
              if (this.pageSum <= this.pageIndex + 1) {
                //是否有后续页
                this.meScroll.showNoMore();
              }
            } else {
              //后续页加载
              this.dataList = this.dataList.concat(res.data.data.list);
              //判断之后是否还有后续页
              if (this.pageSum > this.pageIndex + 1) {
                this.meScroll.endSuccess(20, true);
              } else {
                this.meScroll.endSuccess(20, false);
              }
            }
          } else {
            this.$vux.toast.text(res.data.message);
          }

          //不管搜索条是否弹出，都关闭他
          this.$refs.mheader && this.$refs.mheader.actionHideSearchBar();
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
    gotoDetail(item) {
      //跳转前页面差异化处理
      let id = "";
      switch (this.pageType) {
        case this.TYPES.FriendList:
        case this.TYPES.ATTENTION:
          this.$store.dispatch("setFileItem", item);
          id = item.personid;
          break;
        default:
          id = item.personid;
          break;
      }
      //写入scroll数据并跳转到详情页
      this.$store.dispatch(
        "setPersonListScrollTop",
        this.meScroll.getScrollTop()
      );
      if(this.pageType === this.TYPES.LOCLIST){
        this.$store.dispatch('globalLoading',2);
      }
      //console.log(this.PAGEVALS[this.pageType].subpage)
      this.$router.push({
        name: `${this.PAGEVALS[this.pageType].subpage}`,
        query: {
          id: id, //personid
          name: encodeURIComponent(item.personname),
          phone:item.contactmobil,
          unitcode: this.unitcode
        }
      });
    },
    followTarget(event, item) {
      event.stopPropagation();
      //关注
      this.$vux.confirm.show({
        content: item.isFocus ? '确定不再关注此人？':'确定关注此人？',
        onConfirm:()=>{
          item.isFocus = !item.isFocus;
          if (item.isFocus) {
            this.$vux.toast.text("关注成功");
          } else {
            this.$vux.toast.text("取消关注成功");
          }
        },
        onCancel:()=>{
        }
      })
    },
    reqLocation(event, item) {
      event.stopPropagation();
      //要求上传地址
      this.publicApi.reqLocation({}).then(res => {
        if (res.data.status === 200) {
          this.$vux.toast.show({
            text: `<div><div style="font-size:24px"><i style="font-size:28px;vertical-align:-2px;margin-right: 5px;" class="iconfont icon-submit"></i><span>${
              item.name
            }</span></div><p style="padding-left:0.5em">要求提交实时定位</p></div>`,
            width: "73vw",
            type: "text"
          });
        } else {
          this.$vux.toast.text(res.data.message);
        }
      });
    },
    actionOrgChange(item){
      console.log(item)
      this.unitcode = item.code;
      this.keyword = '';
      this.showLoading = 2;
      this.getList();
    }
  }
};
</script>
<style lang="less">
@import url("../assets/libs/mescroll.min.css");
</style>
