<template>
  <div class="g-org-selection">
    <group :gutter="0" label-width="4em">
      <cell title="组织机构" class="org-sel-cell">
        <div class="org-sel-outer">
          <div class="org-sel-inner" ref="orgsel">
            <ul class="org-sel-ul">
              <template v-for="(item,index) in oldSelectedOrgList">
                <li :class="{'active':index===oldSelectedOrgList.length-1}"
                    :key="index"
                    @click="showAndSelectOrg(item)">{{item.text}}<i class="iconfont icon-right"></i>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </cell>
    </group>
    <div v-show="showHeader" class="popup-selection">
      <m-header mTitle="查询范围"
                :rightBtn="'查看全部'"
                :defaultBack="false"
                :leftBtn="mleftbtn"
                @actionLeft="cancelSelect"
                @actionRight="selectCurOrg">
      </m-header>
      <div class="g-content">
        <group :gutter="0" label-width="4em">
          <cell title="组织机构"  class="org-sel-cell">
            <div class="org-sel-outer">
              <div class="org-sel-inner" ref="orgsel">
                <ul class="org-sel-ul">
                  <template v-for="(item,index) in selectedOrgList">
                    <li :class="{'active':index===selectedOrgList.length-1}"
                        :key="index"
                        @click="actionSelectOrg(item)">{{item.text}}<i class="iconfont icon-right"></i>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </cell>
        </group>
        <group :gutter="0" class="org-list-wrap">
          <cell v-for="(item,index) in dataList" :key="index"
                value-align="left"
                :is-link="item.type==='folder'"
                @click.native="actionSelectOrg(item)">
            <span class="item" :class="{'active': selectedOrgCode === item.code}">{{item.text}}</span>
          </cell>
          <!--<cell-box :class="{'org-active':ind===orgListActive}" v-for="(organize,ind) in organizationList" :key="organize.id" @click.native="getOrgList(organize,ind)">{{organize.text}}</cell-box>-->
        </group>
      </div>
    </div>
  </div>
</template>

<script>
  import header from '@/components/header'
  import {Group, Cell} from 'vux'
  export default {
    name: "OrgSelection",
    components:{
      mHeader:header,
      Group, Cell,
    },
    data(){
      return {
        mleftbtn:'<i class="iconfont icon-arrow-left"></i>',

        selectedOrgList: [{ text: "总部", code: 44, type: "folder" }],
        selectedOrgCodes: {'44':true},
        selectedOrgCode: 0,
        dataList: [],
        showHeader: false,

        oldSelectedOrgList: [{ text: "总部", code: 44, type: "folder" }],

        cacheOrgList: [],   //缓存
      }
    },
    computed:{

    },
    props:{

    },
    mounted(){

    },
    methods:{
      showAndSelectOrg(item){
        this.showHeader = true;
        this.oldSelectedOrgList = Object.assign([],this.selectedOrgList); //记录原选择数据
        this.actionSelectOrg(item);
      },
      actionSelectOrg(item){
        if(item.code === this.selectedOrgCode && item.code != 44){
          return;
        }
        let promiselist = [];
        if (item.type ==='folder' && !this.cacheOrgList[item.code]){
          //不实时刷新的策略
          promiselist.push(this.publicApi.ajax(this.URL.LIST.ORG, { parent: item.code }, true));
        }
        Promise.all(promiselist).then(response=>{
          let res = response[0];
          if(!this.cacheOrgList[item.code]){
            if(res){
              if(res.data.status === 200){
                if(res.data.data.length > 0){
                  this.dataList = res.data.data;
                  this.cacheOrgList[item.code] = res.data.data;
                }
              }
              else{
                this.$vux.toast.show('获取数据失败，请重试')
              }
            }
          }
          else{
            this.dataList = this.cacheOrgList[item.code];
          }
          //将选择项目添加到已选列表中

          //是否下级
          if(item.code.toString().length > this.selectedOrgList[this.selectedOrgList.length-1].code.toString().length){
            //是下级元素，直接添加
            if(!this.selectedOrgCodes[item.code]){
              this.selectedOrgCodes[item.code] = true;
              this.selectedOrgList.push(item)
            }
          }
          else{
            //上级元素，弹出级别之上的项
            let arr = this.selectedOrgList;
            let newsel = [];
            for(let i in arr){
              if(arr[i].code.toString().length < item.code.toString().length){
                newsel.push(arr[i])
              }
              else{
                this.selectedOrgCodes[arr[i].code] = false;
              }
            }
            this.selectedOrgCodes[item.code] = true;
            this.selectedOrgList = newsel;
            this.selectedOrgList.push(item);
          }
          //列表上色
          this.selectedOrgCode = this.selectedOrgList[this.selectedOrgList.length - 1].code;
          //已选列表滚动
          this.$nextTick(()=>{
            //滚动到最右
            document.querySelectorAll('.org-sel-inner').forEach(ele=>{
              ele.scrollLeft=99999
            })
          })
        })
      },
      selectCurOrg(){
        this.oldSelectedOrgList = Object.assign([],this.selectedOrgList);
        this.$nextTick(()=>{
          //滚动到最右
          document.querySelectorAll('.org-sel-inner').forEach(ele=>{
            ele.scrollLeft=99999
          })
        })
        this.showHeader = false;
        //数据回调
        this.$emit('actionChange', this.selectedOrgList[this.selectedOrgList.length-1])
      },
      cancelSelect(){
        this.selectedOrgList = Object.assign([],this.oldSelectedOrgList);
        this.dataList = [];
        this.showHeader = false;
      }
    }
  }
</script>

<style scoped lang="less">
  .g-org-selection{
    .org-sel-cell{
      position: relative;
      .org-sel-outer{
        position: absolute;
        right: 10px;
        top: 0;
        height: 44px;
      }
    }
    .popup-selection{
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
    }
    .org-sel-outer{
      width: 250px;
      height: 44px;
      overflow: hidden;
    }
    .org-sel-inner{
      width: 250px;
      line-height: 44px;
      height: 58px;
      overflow: scroll;
    }
    .org-sel-inner{
      /*width: 200px;*/
      /*overflow-x: scroll;*/
      /*overflow-y: hidden;*/
      /*height: 32px;*/
    }
    .org-sel-ul{
      display: inline-block;
      white-space: nowrap;
      &>li{
        display: inline-block;
        &>.iconfont{
          font-size: 12px;
          transform: scale(0.8);
          font-weight: 700;
          vertical-align: 1px;
          padding: 0 3px 0 1px;
        }
        &.active{
          color: #024ea4;
        }
      }
    }
    .org-list-wrap{
      position: absolute;
      top: 44px;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: scroll;
      background: #fff;
      .item{
        color:#292929;
        &.active{
          color: #024ea4;
        }
      }
    }
  }
</style>
