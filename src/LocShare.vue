<template>
  <div>
    <m-header mTitle="位置上报" class="g-header-transparent"></m-header>
    <div class="ju-map">
      <div id="amap"></div>
      <div v-transfer-dom>
        <loading :show="loadingMap" :text="loadingText"></loading>
      </div>
      <div class="info-pane" v-bind:class="{'show':showInfo}">
        <span class="btn-upload" @click="actionUploadLoc">上传</span>
        <div class="line"></div>
        <div class="baseinfo" v-on:touchmove="hideInfo" v-on:touchstart="getTouchStart">
          <p class="name">{{currentMarkerDetail.username}}</p>
          <!--<p class="type">{{currentMarkerDetail.type}}</p>-->
        </div>
        <ul class="detail">
          <li>
            <span><i class="iconfont icon-location"></i></span> {{currentMarkerDetail.addr}}
          </li>
          <li>
            <span><i class="iconfont icon-clock"></i></span> {{currentMarkerDetail.datetime}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import header from '@/components/header'
  import {Loading, TransferDom, dateFormat} from 'vux'
  export default {
    name: "Loc",
    components:{
      mHeader:header,
      Loading,
    },
    directives: {
      TransferDom
    },
    computed:{
      loadingText(){
        return `地图资源加载中
        请耐心等待...`
      }
    },
    data(){
      return {
        loadingMap: true,
        touchstarty:null,

        amap: null,
        ageo: null,
        marker: null,

        currentMarkerDetail: {},  //选中覆盖物对应的详情信息
        showInfo: false,  //是否显示详情面板

        lat: '',
        lng: '',
        addr: '',
        itemid: this.$route.query.id,         //事项id
        needUpload: false,  //需要定位
      }
    },
    mounted(){
      let mapuri = '//webapi.amap.com/maps?v=1.4.3&key=305f41fcb370a7a285eaecf07e05bbf6';
      let mapuiuri = '//webapi.amap.com/ui/1.0/main.js';

      if(!window.AMap){
        this.publicApi.remoteLoad(mapuri).then(()=>{
          this.publicApi.remoteLoad(mapuiuri).then(()=>{
            console.log('载入地图资源成功');
            this.initMap();
          })
        })
      }
      else{
        this.initMap();
      }
    },
    methods:{
      actionUploadLoc(){
        console.log('定位并上传地址信息')
        this.showInfo = false;
        this.setMarkerDefault(this.marker);
        this.$store.dispatch('globalLoading',1);

        this.needUpload = true;
        this.ageo.getCurrentPosition();
      },
      initMap(){
        let self = this;
        AMapUI.loadUI(['control/BasicControl','overlay/SimpleMarker'], function(BasicControl,SimpleMarker) {
          self.amap = new AMap.Map('amap', {
            zoom: 15
          });

          //添加一个缩放控件
          self.amap.addControl(new BasicControl.Zoom({
            position: 'rt'
          }));

          //初始化Pin图标
          self.defaultIcon = new AMap.Icon({
            size: new AMap.Size(20, 20),  //图标大小
            image: 'static/images/pin.png',
            imageSize: new AMap.Size(20, 20)
          })
          self.activeIcon = new AMap.Icon({
            size: new AMap.Size(39, 46.5),  //图标大小
            image: "static/images/pin-active.png",
            imageSize: new AMap.Size(39, 46.5)
          })
          self.defaultIconOffset = new AMap.Pixel(-10,-10);
          self.activeIconOffset = new AMap.Pixel(-18,-42);
          //地图事件绑定
          self.amap.on('touchmove', (e)=>{
            self.hideInfo()
          });
          //地图初始化完毕
          self.loadingMap = false;

          //定位初始化
          self.amap.plugin(['AMap.Geolocation'],function(){
            self.$store.dispatch('globalLoading', 1);
            self.ageo = new AMap.Geolocation({
              useNative:true,
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              maximumAge: 0,           //定位结果缓存0毫秒，默认：0
              convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: false,        //显示定位按钮，默认：true
              buttonPosition: 'LT',    //定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
              markerOptions: {
                icon: self.defaultIcon,
                offset: self.defaultIconOffset
              },
              showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            self.ageo.on('complete',function(e){
              console.log('获取定位成功');
              self.lng = e.position.lng;
              self.lat = e.position.lat;
              self.addr = e.formattedAddress;

              //信息写入marker
              self.addMarkerDefault({
                lng: self.lng,
                lat: self.lat,
                addr: self.addr
              })

              //上传信息
              if(self.needUpload){
                console.log('up')
                self.uploadLoc()
              }

              self.$store.dispatch('globalLoading',0);
            });
            self.ageo.on('error',function(e){
              self.$vux.toast.text('获取定位失败，请打开定位权限后重试')
              self.$store.dispatch('globalLoading',0);
              console.log(e)
            });
            self.loadingMap = false;
            self.amap.addControl(self.ageo);
            setTimeout(()=>{
              self.ageo.getCurrentPosition();
            }, 500)
          })
        });
      },
      addMarkerDefault(item){
        this.amap.clearMap();

        //添加默认样式的marker实例
        if(this.marker){
          this.marker.setPosition([item.lng, item.lat])
        }
        else{
          this.marker = new AMap.Marker({
            // content:"<i class='g-marker-blue'></i>",
            icon: this.defaultIcon,
            offset: this.defaultIconOffset,
            position: [item.lng, item.lat],
            extData: item
          });
          this.marker.on('touchstart',(e)=>{
            this.updateFocus()
          })
        }
        this.amap.add(this.marker);
      },
      updateFocus(){
        //更改当前样式
        this.setMarkerActive(this.marker);
        //显示详情面板
        this.showInfo = true;
        //获取详情面板信息并加载
        this.currentMarkerDetail = this.marker.getExtData();
        this.currentMarkerDetail.username = window.sessionStorage.userName;
        this.currentMarkerDetail.datetime = dateFormat(new Date())
      },
      setMarkerActive(m){
        //设定marker为选中状态
        if(m){
          m.setIcon(this.activeIcon)
          m.setOffset(this.activeIconOffset)
        }
      },
      setMarkerDefault(m){
        //设定marker为默认状态
        if(m){
          m.setIcon(this.defaultIcon)
          m.setOffset(this.defaultIconOffset)
        }
      },
      hideInfo(e){
        if(e){
          let cury = e.targetTouches[0].clientY;
          if(cury - this.touchstarty > 30){
            //隐藏面板并去除当前marker的焦点样式
            this.showInfo = false;
            this.setMarkerDefault(this.marker)
          }
        }
        else{
          this.showInfo = false;
          this.setMarkerDefault(this.marker)
        }
      },
      getTouchStart(e){
        //手势辅助
        this.touchstarty = e.targetTouches[0].clientY;
      },
      uploadLoc(){
        console.log(this.itemid)
        this.publicApi.loc.upload({
          id: this.itemid,
          longitude: this.lng,
          latitude: this.lat,
          location: this.addr
        }).then(res=>{
          // alert(JSON.stringify(res.data))
          if(res.data.status === 200){
            this.$vux.toast.show({text: '位置上报成功', type:'text'})
          }
          else{
            this.$vux.toast.show({text: res.data.message , type:'text'})
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
