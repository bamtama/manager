<template>
    <div id="addNot">
        <m-header mTitle="新增主题"></m-header>
        <div class="g-content">
          <group label-width="5em" label-margin-right="1em" :gutter="0" class="g-group">
              <x-textarea title="主题<span class='req'>*</span>"
                          placeholder="请输入标题"
                          :rows="2"
                          autosize
                          v-model="title"> </x-textarea>
              <x-input title="发布人"
                       v-model="unit" placeholder="请输入昵称"></x-input>
              <x-textarea
                title='内容<span class="req">*</span>'
                placeholder="请输入内容"
                :rows="2" autosize
                v-model="content"> </x-textarea>
              <cell title="主题类型" class="category" value-align="left">
                  <radio :options="options" @on-change="change" v-model="category" class='radioBox' ref="radioBox"></radio>
              </cell>
          </group>
          <div class="g-btn-wrap">
            <x-button type="primary" class="submitBtn" @click.native="btnSubmit">发布</x-button>
          </div>
        </div>
    </div>
</template>

<script>
import header from "@/components/header";
import {
  Group,
  Cell,
  CellBox,
  XTextarea,
  XButton,
  XInput,
  Radio,
  Actionsheet
} from "vux";

export default {
  name: "AnnouncementEdit",
  components: {
    mHeader: header,
    XTextarea,
    Group,
    Cell,
    CellBox,
    XButton,
    XInput,
    Radio,
    Actionsheet
  },
  data() {
    return {
      unit: window.sessionStorage.getItem("orgName"),
      title: "",
      content: "",
      options: ["公开","私密"],
      category: "公开",
      receiveType: "",
    };
  },
  mounted() {
  },
  computed: {
  },
  activated() {
    this.slidLast();
  },
  watch: {
  },
  methods: {
    change(value, label) {
      this.checked = value;
      console.log("change:", value, label);
    },
    //新增页面的提交按钮事件；
    btnSubmit() {
      if (!this.title || !this.content || !this.category || !this.text) {
        this.$vux.toast.text("请将必填信息填写完整");
        return false;
      } else {
        if (this.category == "管理人员") {
          this.receiveType = 0;
        } else {
          this.receiveType = 1;
        }
        let data = {
          title: this.title,
          content: this.content,
          receiveType: this.receiveType,
          receiveDepart: this.text,
          receiveDepartId: this.code
        };
        this.publicApi.announcement("add", data).then(res => {
          if (res.status === 200) {
            this.$vux.toast.text("提交成功");
            var self = this;
            setTimeout(function() {
              self.$router.go(-1);
            }, 500);
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
  .category .weui-cell{
    padding:0 12px 0 0;
    margin-bottom: 5px;
  }
</style>
