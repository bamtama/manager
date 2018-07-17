<template>
  <div :class="'iconfont '+checked(check)" v-show="show"></div>
</template>

<script>
export default {
  name: "checkbox",
  props: {
    check: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checked(type) {
      return type == true ? "dw-checkbox dw-chechbox-active" : "dw-checkbox";
    }
  }
};
</script>

<style lang="less">
.dw-checkbox,
.dw-chechbox-active {
  position: absolute;
  font-size: 11px;
  left: 16%;
  top: -2%;
  color: #999999;
}
.dw-checkbox {
  &:before {
    content: "\e60d";
  }
}
.dw-chechbox-active {
  &:before {
    content: "\e60e";
    color: #ff9400;
  }
}
</style>

