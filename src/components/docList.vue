
<template>
  <div class="docList">
      <div class="left" @click="goLink">
        <p v-for="(value,key) in showData" :key="key"><span>{{key}}</span><span>{{value}}</span></p>
      </div>
      <div class="right" v-if="rightShow" @click="rigthEvent" :id="'delete_'+btnId">
        <slot name="right">{{right}}</slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "docList",
  props: {
    data: Array | Object,
    right: String,
    rightShow: {
      type: Boolean,
      default: true
    },
    btnId:Number,
    titleHeader: String,
    idName:String|Number,
    link: String | Object,
    filterRule: {
      type: String | Object,
      default: ""
    }
  },
  data() {
    return {
      showData: {}
    };
  },
  mounted() {
    if (this.filterRule) {
      this.changeData();
    } else {
      this.showData = this.data;
    }
  },
  filters: {},
  methods: {
    rigthEvent: function(event) {
      this.$emit("rightBtn");
    },
    goLink() {
      this.$store.dispatch("setRewardObj",this.data)
      this.$router.push(this.link);
    },
    titleChange(value) {
      if (this.filterRule) {
        let val = this.filterRule[value] ? this.filterRule[value] : "";
        return val;
      } else {
        return value;
      }
    },
    changeData() {
      for(let item in this.filterRule){
         this.$set(this.showData,this.filterRule[item],this.data[item])
      }
    }
  }
};
</script>

<style scoped lang="less">
.docList {
  background-color: #fff;
  padding: 15px 10px;
  font-size: 17px;
  line-height: 2;
  display: flex;
  margin-bottom: 4px;
  .left {
    flex: 70% 1 1;
    p{
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
       line-height: 1.8;
      span{
        display: block;
        &:nth-of-type(1){
          &::after{
            content: ":"
          }
        }
        &:nth-of-type(2){
          flex:50% 1 1;
          padding-left: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis
        }
      }
    }
    
  }
  .right {
    // flex: 30% 1 1;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    color: #fa9898;
    padding: 0 10px;
  }
}
</style>
