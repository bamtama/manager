<template>
  <div class="fcInTube">
    <x-header mTitle="好友信息" class="fc-edit" :rightBtn="careHtml" v-on:actionRight="careEvent" >
      <p slot="right"><i class="iconfont icon-follow">{{concern}}</i></p>
    </x-header>
    <div class="g-content">
      <flexbox >
      <flexbox-item :span="42/100" class="userBox">
        <div class="imgBorder">
          <img :src="userInfo.photo" alt="" srcset="">
        </div>
      </flexbox-item>
      <flexbox-item class="InfoBox" :span="58/100">
        <h2 class="f27">{{userInfo.name}}&emsp;<span class="f18">{{userInfo.sex}}</span></h2>
        <p class="f15" ><i class="iconfont icon-ID"></i>{{userInfo.idCard}}</p>
        <p class="f15"><i class="iconfont icon-phone"></i>{{userInfo.tel}}</p>
      </flexbox-item>
    </flexbox>
    <group gutter="0">
      <cell  v-for="item in IntubeList" :key="item.id" is-link :link="item.link">
        <p slot="icon" class="f15"><i class="iconfont icon-dian f12" :style="{color:item.color}"></i>&emsp;{{item.title}}</p>
      </cell>
    </group>
    <group gutter="20">
      <cell
      title="汇总"
      is-link
      :border-intent="false"
      :arrow-direction="showContent001 ? 'up' : 'down'"
      @click.native="showContent001 = !showContent001"></cell>
      <transition  name="list" tag="div">
        <div class="optlist" v-show="showContent001" >
            <cell-box  :border-intent="false" class="sub-item" is-link :link='classList[0]' key="1">信息列表1</cell-box>
            <cell-box  class="sub-item" is-link key="2" :link='classList[1]'>信息列表1</cell-box>
            <cell-box  class="sub-item" is-link key="3" :link='classList[2]'>信息列表1</cell-box>
            <cell-box  class="sub-item" is-link key="4" :link='classList[3]'>信息列表1</cell-box>
        </div>
      </transition>
    </group>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XImg, Group, Cell, CellBox } from "vux";
import XHeader from "@/components/header";
import { mapGetters } from "vuex";

var IntubeList = [
  {
    title: "基本信息",
    color: "#ec6941",
    link: { path: "FileDetail1/0", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#f19149",
    link: { path: "FileDetail1/1", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#f8b551",
    link: { path: "FileDetail2/0", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#fff45c",
    link: { path: "FileDetail2/1", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#b3d465",
    link: { path: "FileDetail2/2", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#80c269",
    link: { path: "FileDetail1/2", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#32b16c",
    link: { path: "FileDetail3/0", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#13b5b1",
    link: { path: "FileDetail2/5", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#00b7ee",
    link: { path: "FileDetail2/3", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#00b7ee",
    link: { path: "FileDetail1/3", query: { id: "#fff" } }
  },
  {
    title: "其他信息",
    color: "#448aca",
    link: { path: "FileDetail2/4", query: { id: "#fff" } }
  }
];

var classList = [
  { path: "FileDetail4/0", query: { id: "#fff" } },
  { path: "FileDetail4/2", query: { id: "#fff" } },
  { path: "FileDetail4/3", query: { id: "#fff" } },
  { path: "FileDetail4/4", query: { id: "#fff" } }
];
export default {
  name: "FileInTube",
  data() {
    return {
      concern: "关注",
      showContent001: true,
      IntubeList,
      classList,
      Iscare: false,
      persionId: null,
      focusParam: [], //关注的参数
      userInfo: {
        name: "",
        sex: "",
        ID: "",
        phone: ""
      }
    };
  },
  activated(){
    console.log(1111)
  },
  computed: {
    ...mapGetters(["fileItem"]),
    careHtml() {
      return `<p class="${
        this.Iscare ? "hadCare" : ""
      }"><i class="iconfont icon-follow"></i>${this.concern}</p>`;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    //获取用户具体信息，用于关注接口
    careEvent() {
      this.$vux.confirm.show({
        content: this.Iscare ? '确认取消关注？':'确认关注',
        onConfirm:()=>{
          this.Iscare = !this.Iscare;
          if(this.Iscare){
            this.concern = '已关注'
          }
          else{
            this.concern = '关注'
          }
        }
      });
    },
    getInfo() {
      this.publicApi
        .ajax(this.URL.DETAIL.FILEDETAIL, { personid: this.$route.query.id },2)
        .then(res => {
          if (res.data.status === 200) {
            this.userInfo = res.data.data.detail;
            this.userInfo.photo =  res.data.data.detail.photo||"static/images/default-avator.png";
          } else {
            this.$vux.toast.show({type:'text', text:'获取数据失败'})
          }
        });
    }
  },
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    CellBox
  }
};
</script >

<style lang="less">
@import url("../../assets/styles/custom.fc.less");
.fcInTube {
  background-color: #f4f4f4;
  padding-bottom: 30px;
  .vux-flexbox {
    background-size: 100% 100%;
    height: 137px;
    opacity: 0.9;
    width: 100%;
  }
  .userBox {
    align-items: center;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    .imgBorder {
      width: 104px;
      height: 104px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
  .InfoBox{
    color: #666;
  }
  .sub-item {
    justify-content: center;
  }
  .hadCare {
    color: #eee;
    .icon-follow{
      display:none;
    }
  }
  .icon-ID, .icon-phone{
    color: #666;
    font-size: 18px;
    vertical-align: middle;
    margin: 0 5px 0 0;
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .fcInTube {
    .vux-flexbox {
      background-size: 100% 100%;
      height: 137px;
      opacity: 0.9;
      width: 100%;
    }
  }
}
</style>
