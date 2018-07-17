<template>
  <div class="img-uploader"
       @drop="handleDrop"
       ref="uploader">

    <!--没有图片显示点击上传-->
    <!-- <p class="img-uploader-placeholder" v-if="!hasImages">{{placeholder}}</p> -->

    <!--图片预览列表-->
    <div v-if="hasImages" class="previev-wrap">
      <div v-for="(data,index) in imageDataList" class="img-uploader-preview" :key="data.id">

        <div class="preview-img">
          <img :src="data"/>
        </div>

        <img src="../assets/round_close.svg" class="img-uploader-delete-btn" @click="deleteImg(index)"/>
      </div>
    </div>
    <div class="new" @click="openInput($event)">
      <template v-if="hasImages">
        <i class="iconfont icon-pics"></i>
        <span class="pics-sm">{{countText}}/3</span>
      </template>
      <template v-else>
        <i class="iconfont icon-pic-new"></i>
        <span class="pics-sm">添加劳动图片</span>
      </template>
    </div>


    <!-- input-->
    <input
      style="display: none"
      :id="inputId"
      ref="input"
      type="file"
      accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
      @change="handleFileChange"/>

    <!--错误提示-->
    <div class="img-uploader-error" v-if="errorText.length">{{errorText}}</div>

    <!--文件数-->
    <!-- <div class="img-uploader-count" v-if="countText.length">{{countText}}</div> -->

  </div>
</template>

<script>
import resizeImage from "@/assets/libs/resize";
import { Toast } from "vux";
import getOS from "@/assets/libs/os";

export default {
  components: {
    Toast
  },
  props: {
    // 占位文字
    placeholder: {
      default: "点击上传图片",
      type: String
    },
    // 文件更改回调
    onChangecg: {
      type: Function
    },
    // 图片大小的最大值(KB)
    maxSize: {
      default: 3072,
      type: Number
    },
    // 预览图片地址
    initImageData: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
      // input 的id
      inputId: "#ddddd",
      // 文件名
      fileNameList: [],
      // 错误提示
      errorText: "",
      // 预览图片地址
      imageDataList: Object.assign([], this.initImageData),
      // 图片计数
      countText: this.initImageData.length,
      //系统区分
      os: "",
      fileList: [],
      initImg: Object.assign([], this.initImageData)
    };
  },
  computed: {
    // 是否有图片
    hasImages() {
      return this.imageDataList.length > 0;
    },
    // 格式化的文件大小，可读的
    sizeFormatted() {
      let result = 0;
      if (this.maxSize < 1024) {
        result = this.maxSize + "K";
      } else {
        result =
          (this.maxSize / 1024).toFixed(this.maxSize % 1024 > 0 ? 2 : 0) + "M";
      }
      return result;
    }
  },
  mounted() {
    // 防止多个组件互相影响
    this.inputId = this.id || Math.round(Math.random() * 100000);

    ["drop", "dragenter", "dragover", "dragleave"].forEach(eventName => {
      this.preventDefaultEvent(eventName);
    });

    this.os = getOS();
  },
  methods: {
    handleFileChange() {
      let input = this.$refs.input;
      let files = input.files;

      this.handleFile(files);
      this.$refs.input.value = "";
    },
    handleDrop(e) {
      // 获取文件列表
      let files = e.dataTransfer.files;
      this.handleFile(files);
    },
    preventDefaultEvent(eventName) {
      document.addEventListener(
        eventName,
        function(e) {
          // 判断默认行为是否可以被禁用
          if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
              e.preventDefault();
            }
          }
        },
        false
      );
    },
    openInput(e) {
      if (this.imageDataList.length >= 3) {
        this.$vux.toast.show({
          type: "text",
          text: "最多选择三张图片!"
        });
      } else {
        this.$refs.input.value = "";
        if (this.os == "android") {
          // alert('安卓暂时无法操作');
          this.$refs.input.click();
        } else if (this.os == "ios") {
          this.$refs.input.click();
        }
        e.preventDefault();
      }
    },
    //删除图片
    deleteImg(index) {
      let _flag = false;

      if (this.initImg.length > 0 && index < this.initImg.length) {
        this.imageDataList.splice(index, 1);
        this.initImg.splice(index, 1);
        _flag = true;
      } else {
        this.imageDataList.splice(index, 1);
        this.fileList.splice(index, 1);
      }

      this.countText = this.imageDataList.length;
      if (_flag) {
        this.$emit("onChangecg", this.fileList, this.initImg);
      } else {
        this.$emit("onChangecg", this.fileList);
      }
    },
    // 处理图片
    handleFile(files) {
      //判断图片大小
      let size = Math.floor(files[0].size / 1024);
      if (size == 0) {
        return;
      } else if (size > this.maxSize) {
        this.errorText = `文件大小不能超过${this.sizeFormatted}`;
        return false;
      }

      // 文件选择事件
      if (files.length) {
        this.fileList.push(files[0]);
        this.$emit("onChangecg", this.fileList);
        this.preview(files);
      }
    },
    // 预览图片
    preview(files) {
      if (!files || !window.FileReader) return;
      // this.imageDataList = [];

      const _this = this,
        _files = files,
        len = files.length;

      let ind = 0;
      let loadImage = file => {
        let reader = new FileReader();
        reader.onload = function(e) {
          resizeImage(e.target.result, 150, 150, function(result) {
            _this.imageDataList.push(result);
            _this.countText = _this.imageDataList.length;
          });

          if (ind < len) {
            loadImage(_files[ind++]);
          }
        };
        reader.readAsDataURL(file);
      };

      loadImage(_files[ind++]);
    }
  }
};
</script>

<style scoped lang="less">
.img-uploader {
  color: #c0c0c0;
}
.img-uploader-preview-list {
  margin: 5px 10px;
  height: calc(150px + 18px * 2);
  /*width: 100%;*/
  white-space: nowrap;
  overflow: hidden;
  overflow-x: auto;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-overflow-scrolling: touch;
  text-align: center;
}

.img-uploader-preview {
  position: relative;
  display: inline-block;
  z-index: 2;
  margin-left: 2.5vw;
  vertical-align: top;
  .preview-img {
    height: 22vw;
    width: 22vw;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      border: 1px solid #999;
    }
  }
}
.previev-wrap {
  display: inline-block;
  margin-top: 20px;
  background:transparent;
}

.img-uploader-preview:hover {
  transform: scale(1.02);
}

.new {
  height: 22vw;
  width: 22vw;
  border: 1px dashed;
  text-align: center;
  margin-left: 1%;
  margin-top: 20px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: top;
  i {
    margin-top: 20px;
    display: inline-block;
  }
  .pics-sm {
    display: block;
    font-size: 12px;
    margin-top: 5px;
  }
}
.pics-num {
  display: inline-block;
  vertical-align: bottom;
}

.img-uploader-delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
  width: 20px;
  height: 20px;
}

.img-uploader-file-name {
  color: white;
  font-size: 5px;
  padding-top: 10px;
  margin: 0;
  display: inline-block;
  max-width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

.img-uploader-error {
  color: #e55;
  font-size: 12px;
  position: absolute;
  bottom: -28px;
  width: 100%;
}

.img-uploader-count {
  color: #573e51;
  font-size: 12px;
  position: absolute;
  bottom: -28px;
  width: 100%;
}
</style>
