// import Vue from 'vue'
// import Router from 'vue-router'

class mBack {
  constructor() {
    this.state = true;
    this.$vux = "";
    this.frame = [{
        name: "alert",
        class: "body>.vux-alert .weui-dialog"
      },
      {
        name: "confirm",
        class: "body>.vux-confirm .weui-dialog"
      },
      {
        name: "datetime",
        class: "body>#vux-datetime-instance"
      }
    ];
    this.alertDom = null
  }
  addFrame(arrays) {
    arrays.forEach(item => {

      let state = this.frame.some(val => {
        return val.name == item.name;
      });

      if (!state) {
        this.frame.push(item);
      } else {
        this.frame.forEach((val, ind) => {
          if (val.name == item.name) {
            Object.assign(this.frame[ind], item);
          }
        });
      }
    });
  }
  loop() {
    let frameState = true;
    this.frame.forEach(item => {
      let alertDom = document.querySelector(item.class);
      if (!alertDom) return;
      if (alertDom && (getComputedStyle(alertDom).display !== "none")) {
        frameState = false;
        if (item.fn) {
          item.fn();
        } else {
          (this.$vux[item.name] && this.$vux[item.name].hide()) ||
          (alertDom.style.display = "none");
        }
      }
    })
    frameState ? this.allow() : this.prevent();
    return this;
    // if (frameState){
    //   this.allow()
    // }else{
    //   this.prevent()
    // }
  }
  /**
   * 允许路由跳转
   */
  allow() {
    this.state = true;
    return this;
  }
  /**
   * 传入Vux
   * @param {Object} Obj 
   */
  setVux(Obj) {
    this.$vux = Obj;
    return this;
  }
  /**
   * 阻止路由跳转
   */
  prevent() {
    this.state = false;
    return this;
  }
  checkShow() {
    document.querySelectorAll()
  }
  /**
   * 关闭弹窗
   */
  hide() {
    this.$vux.alert && this.$vux.alert.hide();
    this.$vux.confirm && this.$vux.confirm.hide()
    this.$vux.datetime && this.$vux.datetime.hide();
    return this;
  }
  /**
   * 获取当前是否允许跳转  
   */
  getState() {
    return this.state;
  }
}
// export default new mBack();
export default {
  install(Vue, option) {
    Vue.prototype.$mBack = new mBack();
    option && Vue.prototype.$mBack.addFrame(option)
  }
}
