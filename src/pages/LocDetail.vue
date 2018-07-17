<template>
  <div>
    <m-header :mTitle="cTitle" class="g-header-transparent"></m-header>
    <div class="ju-map">
      <div id="amap"></div>
      <div v-transfer-dom>
        <loading :show="loadingMap" :text="loadingText"></loading>
      </div>
      <template v-if="pageType!=='LocShare'">
      <div class="date-opts" v-show="tabIndex===1">
        <span class="vux-1px-b" v-bind:class="{'active':filterIndex === 0}" @click="changeFilterDay(0)">当日</span>
        <span class="vux-1px-b" v-bind:class="{'active':filterIndex === 3}" @click="changeFilterDay(3)">三日</span>
        <span v-bind:class="{'active':filterIndex === 7}" @click="changeFilterDay(7)">七日</span>
      </div>
      <ul class="tabs">
        <li v-bind:class="{'active':tabIndex === 0}" @click="changeTab(0)">实时监控</li>
        <li v-bind:class="{'active':tabIndex === 1}" @click="changeTab(1)">历史轨迹</li>
      </ul>
      <div class="draw-opts">
      <span class="btn-draw" :class="{'active':curAction==='draw'}" ref="btndraw" @click="actionDraw($event)">
        <i class="iconfont icon-map-draw"></i>
      </span>
        <span class="btn-move" :class="{'active':curAction==='move'}" @click="actionMove($event)">
        <i class="iconfont icon-map-move"></i>
      </span>
        <span class="btn-clear" :class="{'active':curAction==='clear'}" @click="actionClear($event)">清屏</span>
        <span class="vux-1px-l vux-1px-r"><!--辅助--></span>
      </div>
      </template>
      <div class="info-pane" v-bind:class="{'show':showInfo}">
        <span class="btn-upload" @click="actionUploadLoc" v-if="pageType==='LocShare'">上传</span>
        <div class="baseinfo">
        <!--<div class="baseinfo" v-on:touchmove="hideInfo" v-on:touchstart="getTouchStart">-->
          <p class="name">{{currentMarkerDetail.personname}}</p>
          <p class="type">{{currentMarkerDetail.type}}</p>
        </div>
        <ul class="detail">
          <li>
            <span><i class="iconfont icon-location"></i></span> {{currentMarkerDetail.fixsite}}
          </li>
          <li>
            <span><i class="iconfont icon-clock"></i></span> {{currentMarkerDetail.fixtime}}
          </li>
        </ul>
      </div>
      <!--绘制用-->
      <div class="drawmask" ref="drawmask"
           :class="{'z-show':curAction==='draw'}"
           @touchstart="drawStart($event)"
           @touchend="drawEnd($event)"
           @touchmove="drawMove($event)">
        <canvas id="mycanvas" width="798" height="798"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import header from '@/components/header'
  import { Loading,TransferDom, dateFormat } from 'vux'

  export default {
    name: "locdetail",
    components:{
      mHeader:header,
      Loading,
    },
    directives: {
      TransferDom
    },
    computed:{
      cTitle(){
        if(this.pageType!=='LocShare'){
          return `${this.name}的定位分享`
        }
        else{
          return '我的定位分享'
        }
      },
      loadingText(){
        return `地图资源加载中
        请耐心等待...`
      }
    },
    data(){
      return{
        pid: this.$route.query.id,
        unitcode: this.$route.query.unitcode,
        name: decodeURIComponent(this.$route.query.name),
        amap: null,
        ageo: null,
        loadingMap: true,
        pageType: this.$route.name,

        tabIndex: 0,      //实时-0,历史-1
        filterIndex: 0,   //当天-0，三天-3，七天-7

        showInfo: false,  //是否显示详情面板
        touchstarty:'',   //手势辅助坐标

        dataCurrentCoord:{},  //实时坐标
        dataCoords:[],        //历史坐标列表

        currentMarker: null,      //选中的覆盖物
        curMarkers: [],           //当前地图覆盖物实例数组,
        currentMarkerDetail: {},  //选中覆盖物对应的详情信息
        currentPath: null,        //当前展示的路径

        defaultIcon: null,
        activeIcon: null,
        defaultIconOffset: null,
        activeIconOffset: null,

        drawcircle:null,
        touchstartx:null,
        touchstarty:null,
        touchendx:null,
        touchendy:null,
        cradius:0,
        mapcircle: null,

        curAction: 'move'
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
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
    beforeDestroy(){
      console.log('销毁地图资源')
      if(this.amap){
        this.amap.off('touchmove')
        this.amap.clearMap();
        this.amap = null;
        let mapdom = document.querySelector('#amap');
        mapdom && mapdom.parentNode.removeChild(mapdom)
      }
    },
    methods:{
      initMap(){
        console.log('地图初始化')
        //地图初始化
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
          //数据初始化
          if(self.pageType!=='LocShare'){
            self.initData();
          }
          else{
            self.initLocShare();
          }
        });
      },
      initData(){
        this.getCurrentLoc()
      },
      initLocShare(){
        let self = this;
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
            self.$vux.toast.text('获取定位成功，准备上传');
            self.lng = e.position.lng;
            self.lat = e.position.lat;
            self.addr = e.formattedAddress;

            //信息写入marker
            self.updateMarkers([{
              fixx: self.lng,
              fixy: self.lat,
              fixsite: self.addr,
              fixtime: dateFormat(new Date()),
              personname: 'Joker'
            }])
            // self.addMarkerDefault({
            //   fixx: self.lng,
            //   fixy: self.lat,
            //   fixsite: self.addr,
            //   fixtime: dateFormat(new Date()),
            //   personname: 'Joker'
            // })
            self.$store.dispatch('globalLoading',0);
          });
          self.ageo.on('error',function(e){
            self.$vux.toast.text('获取定位失败，请打开定位权限后重试')
            // self.addMarkerDefault({
            //   fixx: '113.405875',
            //   fixy: '23.172019',
            //   fixsite: 'test'
            // })
            self.$store.dispatch('globalLoading',0);
          });
          self.loadingMap = false;
          self.amap.addControl(self.ageo);
          setTimeout(()=>{
            self.ageo.getCurrentPosition();
          }, 500)
        })
      },
      addMarkerDefault(item){
        //添加默认样式的marker实例
        let marker = new AMap.Marker({
          // content:"<i class='g-marker-blue'></i>",
          icon: this.defaultIcon,
          offset: this.defaultIconOffset,
          position: [item.fixx, item.fixy],
          extData: item
        });
        marker.setMap(this.amap);
        marker.on('touchstart',(e)=>{
          this.currentMarker = marker;
          this.updateFocus()
        })
        this.curMarkers.push(marker);
      },
      changeTab(i){
        let refresh = true;
        if(this.tabIndex === 1 && i === this.tabIndex){
          refresh = false;
        }
        //实时 or 历史
        this.tabIndex = i;
        //获取数据
        switch(this.tabIndex){
          case 0:
            //获取实时数据
            this.getCurrentLoc();
            break;
          case 1:
            //获取历史数据
            if(refresh){
              this.getHistoryLocs();
            }
            break;
          default:
            break;
        }
      },
      changeFilterDay(d){
        //历史监控-时间切换
        if(this.filterIndex !== d){
          this.filterIndex = d;
          //加载新的数据
          this.getHistoryLocs()
        }
      },
      updateFocus(){
        //更改当前样式
        this.setMarkerActive(this.currentMarker);
        for(let i in this.curMarkers){
          if(this.curMarkers[i] !== this.currentMarker){
            this.setMarkerDefault(this.curMarkers[i])
          }
        }
        //显示详情面板
        this.showInfo = true;
        //获取详情面板信息并加载
        this.currentMarkerDetail = this.currentMarker.getExtData();
      },
      getTouchStart(e){
        //手势辅助
        this.touchstarty = e.targetTouches[0].clientY;
      },
      hideInfo(e){
        if(e){
          let cury = e.targetTouches[0].clientY;
          if(cury - this.touchstarty > 30){
            //隐藏面板并去除当前marker的焦点样式
            this.showInfo = false;
            this.setMarkerDefault(this.currentMarker)
          }
        }
        else{
          this.showInfo = false;
          this.setMarkerDefault(this.currentMarker)
        }
      },
      setMarkerActive(m){
        //设定marker为选中状态
        // m.setContent("<i class='g-marker-orange'></i>")
        if(m){
          m.setIcon(this.activeIcon)
          m.setOffset(this.activeIconOffset)
        }
      },
      setMarkerDefault(m){
        //设定marker为默认状态
        // m.setContent("<i class='g-marker-blue'></i>")
        if(m){
          m.setIcon(this.defaultIcon)
          m.setOffset(this.defaultIconOffset)
        }
      },
      getCurrentLoc(){
        //获取实时定位并绘制Marker
        if(this.tabIndex === 0){
          //获取实时定位
          this.publicApi.ajax(this.URL.DETAIL.CURRENTLOC, {id: this.pid}, 1).then(res=>{
            if(res.data.status === 200){
              //获取数据成功
              let list = res.data.data.list;
              //渲染点
              if(list.length > 0){
                this.updateMarkers(list)
              }
              else{
                this.$vux.toast.text('所选部员无实时定位呢')
              }
            }
            else{
              this.$vux.toast.text(res.data.message)
            }
          })
        }
      },
      getHistoryLocs(){
        //获取历史定位
        let reqdata = {
          id: this.pid,
          beginTime: this.filterIndex
        }
        this.publicApi.ajax(this.URL.DETAIL.HISTORYLOC,{},1).then(res=>{
          if(res.data.status === 200){
            //绘制marker
            if(res.data.data.list.length > 0){
              this.dataCoords = res.data.data.list;
              this.updateMarkers(this.dataCoords)
            }
            else{
              this.$vux.toast.text('当前人员无历史定位')
            }
          }
          else{
            this.$vux.toast.text(res.data.message)
          }
        })
      },
      updateMarkers(list){
        //清除覆盖物
        for(let i in this.curMarkers){
          this.curMarkers[i].off('touchend');
          this.curMarkers[i] = null;
        }
        this.curMarkers = [];
        if(this.currentMarker){
          this.currentMarker.off('touchend');
          this.currentMarker = null;
        }
        this.showInfo = false;
        if(this.currentPath){
          this.currentPath.setData([])
        }
        this.amap.clearMap();
        //中心设定
        this.amap.setCenter([list[0].fixx, list[0].fixy])
        //显示点
        for(let i in list){
          this.addMarkerDefault(list[i])
        }
        //添加定位覆盖物到地图上
        this.amap.add(this.curMarkers);
        if(this.tabIndex === 1){
          //历史查询，需要绘制路线
          this.drawLines()
        }
        else if(this.tabIndex === 0){
          //实时查询，如果有关联人员则绘制折线
          this.drawArrows(list);
        }
      },
      drawLines(){
        //绘制路线并添加动画
        let self = this;
        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }
          let defaultLinestyle = {
            lineWidth: 3,
            strokeStyle: '#ec2422',
            dirArrowStyle: false
          };
          //路径
          self.currentPath = new PathSimplifier({
            zIndex: 100,
            map: self.amap, //所属的地图实例
            getPath: function(pathData, pathIndex) {
              return pathData.path;
            },
            renderOptions:{
              pathLineStyle: defaultLinestyle,
              pathLineSelectedStyle: defaultLinestyle,
              pathLineHoverStyle: defaultLinestyle,
            }
          });

          //路径数据加载
          let datapath = [];
          for(let i in self.dataCoords){
            datapath.push([self.dataCoords[i].fixx, self.dataCoords[i].fixy])
          }
          self.currentPath.setData([{
            path: datapath
          }]);

          //创建一个巡航器
          let nav = self.currentPath.createPathNavigator(0, {
            loop: true, //循环播放
            speed: 7 //巡航速度，单位千米/小时
          });
          nav.start();
        });
      },
      drawArrows(list){
        let datapath = [], startpoint = null;
        for(let i=0;i < list.length;i++){
          if(list[i].personid === this.pid){
            startpoint = [list[i].fixx, list[i].fixy]
          }
          else{
            datapath.push([list[i].fixx, list[i].fixy])
          }
        }
        let polylines = [];
        for(let i in datapath){
          polylines[i] = new AMap.Polyline({
            path: [startpoint, datapath[i]],
            showDir:true,
            strokeColor: '#f60b0b',   // 线颜色
            strokeWeight: 4           // 线宽
          });
        }
        this.amap.add(polylines)
        this.amap.setFitView()
      },
      actionMove(event){
        this.curAction = 'move';
      },
      actionClear(event){
        //清除当前画板
        this.curAction = 'move';
        this.clearLayers();
      },
      actionDraw(event){
        this.curAction = 'draw';
        this.cradius = 0;
      },
      drawStart(event){
        this.touchstartx = event.changedTouches[0].clientX;
        this.touchstarty = event.changedTouches[0].clientY;
        //清理地图
        this.clearLayers();
        //设置tab为实时定位，清理历史轨迹筛选日数
        this.filterIndex = 0;
        this.tabIndex = 0;
      },
      drawEnd(event){
        this.touchendx = event.changedTouches[0].clientX;
        this.touchendy = event.changedTouches[0].clientY;
        if(this.touchendx - this.touchstartx < 4 || this.touchendy - this.touchstarty < 4){
          return;
        }
        //将canvas数据转换circle数据转印到地图上
        let self = this;
        let tmpcenter = this.amap.containTolnglat(new AMap.Pixel(parseInt(this.touchstartx), parseInt(this.touchstarty)));
        this.mapcircle = new AMap.Circle({
          map: self.amap,
          center: tmpcenter,
          radius: this.cradius * self.amap.getResolution(tmpcenter),
          strokeColor: '#d098fd',
          strokeOpacity: 0.5,
          fillColor:'#fff',
          fillOpacity: 0.5,
          strokeWeight:2
        })
        //去除canvas
        let c = document.querySelector('#mycanvas');
        let ctx=c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);

        //状态恢复
        this.curAction = 'move';

        //获取当前圈内数据，并请求后台
        this.getDataInCircle()
      },
      drawMove(event){
        let x = event.changedTouches[0].clientX;
        let y = event.changedTouches[0].clientY;
        let c = document.querySelector('#mycanvas');
        let r1 = Math.abs(x-this.touchstartx);
        let r2 = Math.abs(y-this.touchstarty);
        this.cradius = Math.max(r1,r2);
        let ctx=c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);
        ctx.beginPath();
        ctx.arc(this.touchstartx,this.touchstarty,this.cradius,0,2*Math.PI);
        ctx.strokeStyle= '#d098fd';
        ctx.lineWidth= 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.5;
        ctx.fill();
      },
      getDataInCircle(){
        let reqdata = {
          fixx: this.mapcircle.getCenter().lng,
          fixy: this.mapcircle.getCenter().lat,
          unitcode: this.unitcode,
          radius: this.mapcircle.getRadius()
        };
        console.log(reqdata)
        this.publicApi.ajax(this.URL.DETAIL.CIRCLELOC, reqdata, 1).then(res=>{
          let list = res.data.data.list;
          if(list.length > 0){
            //显示点
            for(let i in list){
              this.addMarkerDefault(list[i])
            }
            //添加定位覆盖物到地图上
            this.amap.add(this.curMarkers);
          }
          else{
            this.$vux.toast.text('暂无数据！')
          }
        })
        //console.log(this.mapcircle.getCenter().lng)
        //alert(`当前选择区域中心点${this.mapcircle.getCenter()}，半径为${this.mapcircle.getRadius()}`)
      },
      clearLayers(){
        for(let i in this.curMarkers){
          this.curMarkers[i].off('touchend');
          this.curMarkers[i] = null;
        }
        this.curMarkers = [];
        if(this.currentMarker){
          this.currentMarker.off('touchend');
          this.currentMarker = null;
        }
        this.showInfo = false;
        if(this.currentPath){
          this.currentPath.setData([])
        }
        this.mapcircle && this.amap.remove(this.mapcircle);
        this.mapcircle = null;
        this.amap.clearMap();
      },
      actionUploadLoc(){
        this.ageo.getCurrentPosition();
      }
    }
  }
</script>

<style>

</style>
