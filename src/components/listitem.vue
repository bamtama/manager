<template>
  <div class="g-list-item">
    <div class="gender">
      <i class="iconfont icon-female" v-if="!ismale && showicon"></i>
      <i class="iconfont icon-male" v-if="ismale && showicon"></i>
    </div>
    <div class="baseinfo">
      <p class="name">{{name}}</p>
      <p class="sub">{{type}}</p>
    </div>
    <ul class="detail">
      <li>{{cont1}}</li>
      <li>{{cont2}}</li>
      <li>{{cont3}}</li>
    </ul>
    <slot name="right">
    </slot>
  </div>
</template>

<script>
  export default {
    name: "listitem",
    props:{
      showicon: false,
      ismale: false,
      name: '',
      type: '',
      cont1: '',
      cont2: '',
      cont3: ''
    }
  }
</script>

<style scoped>

</style>
