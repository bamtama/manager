<template>
    <div id="noticeDet">
        <m-header :mTitle="dataItem.title" class="title"></m-header>
        <div class="g-content">
            <group :gutter="0" label-width="4em" label-margin-right="1em">
            <cell value-align="left" title="主题">{{dataItem.title}}</cell>
            <cell value-align="left" title="创建人" >{{dataItem.creator}}</cell>
            <cell value-align="left" title="创建事件">{{dataItem.datetime}}</cell>
            <cell value-align="left" title="内容">{{dataItem.content}}</cell>
            <cell value-align="left" title="回复内容">{{dataItem.reply}}</cell>
            </group>
        </div>
    </div>
</template>

<script>
  import header from '@/components/header'
  import {Group,Cell,XHeader,dateFormat} from 'vux'

  export default {
    name: "AnnouncementDetail",
    components: {
      Group,
      Cell,
      dateFormat,
      mHeader:header
    },
    data() {
      return {
        dataItem:{},
      }
    },
    mounted(){
      this.getData();
    },
    methods: {
      getData() {
        this.publicApi.ajax(this.URL.DETAIL.ANNOUCEMENT).then(res => {
          if (res.status === 200) {
            this.dataItem = res.data.data;
          }else{
          }
        });
      },
    }
  }
</script>

<style lang="less">
</style>
