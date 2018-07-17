<template>
  <div class="g-header-wrap">
    <x-header class="g-header" slot="header">
        <span class="title">{{mTitle}}</span>
        <span v-if="defaultBack" slot="overwrite-left" v-on:click="actionBack" class="m-back">
          <i class="iconfont icon-arrow-left"></i>
        </span>
        <span v-else slot="overwrite-left" v-on:click="actionLeft" class="m-back" v-html="leftBtn"></span>
        <div slot="right" v-html="rightBtn" v-on:click="actionRight"></div>
        <div v-if="defaultSearch" slot="right"><i class="iconfont icon-search" @click="actionShowSearchBar"></i></div>
    </x-header>
    <!--搜索bar-->
    <div class="g-search-bar" v-bind:class="{'z-show':showSearchBar}" v-if="defaultSearch">
      <form action="" @submit="fakesubmit">
        <i class="iconfont icon-search"></i>
        <input v-model="key" type="search" :placeholder="searchPlaceholder" class="input-search" ref="searchInput" v-on:search="actionSearch"/>
        <span class="btn-search" v-on:click="actionSearch">搜索</span>
      </form>
    </div>
  </div>
</template>

<script>
	import {XHeader} from 'vux'
  import { throttle } from 'vux'

  export default{
		name:'customHeader',
		components:{
			XHeader
		},
		props:{
			mTitle:{},
			rightBtn:{},
			leftBtn:{},
			defaultBack:{
			  //默认返回事件，如果为自定义返回事件，则需要设置为false
				type: Boolean,
				default: true
			},
      defaultSearch:{
			  //默认搜索事件
			  type: Boolean,
        default: false
      },
      searchPlaceholder:{
			  type: String,
        default: '请输入关键词'
      },
      hideShade:{
        type:Boolean,
        default:false
      }
		},
    data(){
		  return{
		    showSearchBar: false,
        key:'',
      }
    },
    mounted(){
    },
    beforeDestroy(){
		  this.removeMask();
    },
		methods:{
			actionBack(){
        let goback = throttle(()=>{
         this.$router.go(-1)
        }, 500 ,{});
        goback()
			},
      actionShowSearchBar(){
			  this.showSearchBar = true;

        let mask = document.querySelector('.g-mask');
			  if(!mask){
          mask = document.createElement("div");
          mask.classList.add('g-mask');
          document.querySelector('body').appendChild(mask);
        }
        mask.addEventListener('touchstart',(ev)=>{
          ev.preventDefault();
          this.actionHideSearchBar()
        })
        setTimeout(()=>{mask.classList.add('z-show');},0)
        //给调出键盘一点点时间
        setTimeout(()=>{
          this.$refs.searchInput.focus();
          //隐藏底部菜单
          if(document.querySelector('.g-tabbar')){
            document.querySelector('.g-tabbar').style.display = 'none';
          }
        },100)
      },
      actionHideSearchBar(){
			  setTimeout(()=>{
          this.showSearchBar = false;
          this.removeMask();
          //显示底部菜单
          if(document.querySelector('.g-tabbar')){
            document.querySelector('.g-tabbar').style.display = 'flex';
          }
        },0)
      },
      removeMask(){
        let mask = document.querySelector('.g-mask');
        if(mask){
          mask.parentNode.removeChild(mask);
          mask = null;
        }
        document.activeElement.blur()
      },
      fakesubmit(ev){
        ev.preventDefault()
      },
			actionLeft(){
			  //左按钮事件
				this.$emit('actionLeft')
			},
			actionRight(){
			  //右按钮事件
				this.$emit('actionRight')
			},
      actionSearch(){
			  //搜索事件
        this.$emit('actionSearch', this.key);
        document.activeElement.blur()
      },
      setKeyword(k){
			  this.key = k;
      }
		},
	}
</script>

<style lang="less" scoped>
</style>
