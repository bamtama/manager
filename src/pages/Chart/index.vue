<template>
  <div class="ju-chart">
    <m-header mTitle="xx省用户数据统计" class="g-header-transparent"></m-header>
    <div class="g-content">
      <div class="mapchart" id="mychart"></div>
      <div class="tip-v">
        <div class="item">
          <b>{{dayCount}}</b>人<br />
        </div>
        <div class="item">
          <b>{{monthCount}}</b>人<br />
        </div>
        <div class="item">
          <b>{{newCount}}</b>人<br />
        </div>
      </div>
      <div class="tip-h">
        <h3>
          <span @click="gotoPage({name:'广东省',id:'44'})">全部数据</span>
        </h3>
        <ul>
          <li>
            <i class="iconfont icon-phonemonitor"></i>
            手机用户：<b>{{phoneSum}}</b>
          </li>
          <li>
            <i class="iconfont icon-watchmonitor"></i>
            手环用户：<b>{{handSum}}</b>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import header from '@/components/header'
  import * as Echarts from "echarts";

  //静态数据
  import GDJSON from '../../../static/json/GuangDongSheng.json';

  export default {
    name: "ChartIndex",
    components:{
      mHeader:header
    },
    data(){
      return {
        COLOR:{
          BG:'#fff',
          BORDER:'#516b91',
          SHADOW:'#8bf5fa',
          MAPBG:'#59c4e6',
          HIGH:'#516f94',
        },
        unitcode: window.sessionStorage.getItem('orgCode'),
        mapChart:null,
        highlightIndex: -1,
        dataSelected: null,
        mapChartClick :false,

        phoneSum: 0,
        handSum: 0,
        dayCount: 0,
        monthCount: 0,
        newCount: 0,
        proviceNewCount: 0,

        mapData:[],
        distributeList:[],
        formatDistributeList:[],
      }
    },
    mounted(){
      this.initData();
      window.gotoPage = (item)=>{
        this.gotoPage(item)
      }
    },
    beforeRouteLeave(to,from, next){
      if(to.path !== '/ChartDetail'){
        if(this.mapChart){
          //this.mapChart.getDom().removeEventListener('touchend',this.actionChartTouch)
          //this.mapChart.off('click');
          this.mapChart.dispose()
        }
      }
      next();
    },
    methods:{
      gotoPage(item){
        this.$router.push({path:'/ChartDetail?id='+ item.id + '&name='+item.name + '&count='+this.newCount})
      },
      initData(){
        //获取当前信息
        let promistlist = [];
        //全省人数
        promistlist.push(this.publicApi.ajax(this.URL.CHART.INDEX,{}))

        //请求
        this.$store.dispatch('globalLoading', 2)
        Promise.all(promistlist).then(res=>{
          //人数处理
          let tmp = {};

          this.phoneSum  = 0;
          this.handSum = 0;
          this.mapData = res[0].data.data;

          this.initMapChart();
        })
      },
      initMapChart(){
        if(!this.mapChart){
          this.mapChart = Echarts.init(document.getElementById('mychart'));
          Echarts.registerMap('GD', GDJSON);
          let opts = {
            backgroundColor: this.COLOR.BG,
            title: {
              show: false,
              text:'广东省',
              subtext: '查看详细统计',
              sublink: window.location.href.split('#')[0] + '#/ChartDetail?id=guangdong',
              subtarget:'self',
              x: '10px',
              top: '10px',
              textStyle: {
                color: '#fff',
                fontWeight:500
              }
            },
            tooltip: {
              trigger: 'item',
              confine:true,
              textStyle:{
                fontSize:16
              },
              formatter: (params)=>{
                if(params.data){
                  //返回详细信息
                  return '当前数量：'
                    +'<b>'+params.data.cnt + '</b><br />预计新增数量：'
                    +'<b>'+ params.data.cnt1 +'</b><br />'
                    +`<span onTouchStart="gotoPage({id:${params.data.id},name:'${params.data.name}'})">点击查看详情</span>`
                }
                else{
                  this.newCount = this.proviceNewCount;
                  return '暂无数据'
                }
              },
            },
            geo: {
              map: 'GD',
              zLevel:10,
              label: {
                show:true,
                color:'rgba(0,0,0,0.5)',
                fontSize:13,
                emphasis: {
                  fontSize: 15,
                  color:'rgba(255,255,255,0.8)',
                }
              },
              roam: true, //是否允许缩放
              layoutCenter: ['55%', '45%'], //地图位置
              layoutSize: "90%",
              itemStyle: {
                normal: {
                  color: this.COLOR.MAPBG,
                  borderColor: this.COLOR.BORDER,
                  shadowBlur: 10,
                  shadowColor: this.COLOR.SHADOW
                },
                emphasis: {
                  color: this.COLOR.HIGH, //悬浮背景
                }
              },
              emphasis:{
                label:{
                  color:'white'
                }
              },
              slient:true
            },
            series: [{
              type: 'map',
              geoIndex: 0,
              data: this.mapData
            }]
          };
          this.mapChart.setOption(opts);
          // this.mapChart.on('mousedown',(params)=>{
          //   //记录是否触摸了地图
          //   this.mapChartClick = true;
          //   //记录高亮索引
          //   let curindex = params.dataIndex;
          //   if(curindex !== -1){
          //     if(this.highlightIndex !== curindex){
          //       this.highlightIndex = curindex;
          //       this.updateMapChart(params.data)
          //     }
          //     else{
          //       this.gotoPage(params.data)
          //     }
          //   }
          //   else{
          //     this.updateMapChart(null)
          //   }
          // })
          // this.mapChart.getDom().addEventListener('touchend', this.actionChartTouch)
          this.$store.dispatch('globalLoading', 0);
        }
      },
      actionChartTouch(e){
        if(this.mapChartClick){
          //地图触摸标记清空以供下次使用
          this.mapChartClick = false;
        }
        else{
          //触摸了地图之外，则重置选择区域
          this.updateMapChart(null)
        }
      },
      updateMapChart(item){
        if(item){
          this.mapChart.setOption({
            title:{
              text: item.name,
              sublink: window.location.href.split('#')[0] + '#/ChartDetail?id='+item.id
            }
          })
          this.mapChart.dispatchAction(Object.assign({
            type:'highlight'
          }, item))
        }
        else{
          this.mapChart.setOption({
            title:{
              text: '广东省',
              sublink: window.location.href.split('#')[0] + '#/ChartDetail?id=44'
            }
          })
          this.mapChart.dispatchAction(Object.assign({
            type:'downplay',
            dataIndex: this.highlightIndex
          }))
          this.highlightIndex = -1;
          //重置当前在管人数g
          this.newCount = this.proviceNewCount;
        }
      }
    },
  }
</script>

<style lang="less">

</style>
