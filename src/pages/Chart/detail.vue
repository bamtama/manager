<template>
<div class="ju-chart">
  <m-header :mTitle="ctitle" class="g-header-transparent"></m-header>
  <div class="g-content">
    <div class="chart-view-wrap">
      <div id="type" data-chart="circle" data-inited="1" class="chart-view">
        <div class="other">
          <h3>类型（合计：<b>{{this.allCount}}人）</b></h3>
        </div>
        <div class="cont"></div>
      </div>
      <div id="culture" data-chart="circle" data-inited="1" class="chart-view">
        <div class="other">
          <h3>喜好（合计：<b>{{this.allCount}}人）</b></h3>
        </div>
        <div class="cont"></div>
      </div>
      <div id="age" data-chart="pie" class="chart-view">
        <div class="other">
          <h3>年龄（合计：<b>{{this.allCount}}人）</b></h3>
        </div>
        <div class="cont"></div>
      </div>
      <div id="gender" data-chart="pie"  class="chart-view">
        <div class="other">
          <h3>性别（合计：<b>{{this.allCount}}人）</b></h3>
        </div>
        <div class="cont"></div>
      </div>
      <div id="dnum" data-chart="line" class="chart-view">
        <div class="other">
          <h3>总计人数（合计：<b>{{this.allCount}}人）</b></h3>
        </div>
        <div class="cont"></div>
      </div>
      <div id="rc" data-chart="line" class="chart-view">
        <div class="other">
          <h3>参与情况</h3>
          <ul class="tab">
            <li v-for="(item,index) in tabList"
                @click="tabChange(index)" v-bind:class="{'cur':index===curTabIndex}">{{item.name}}</li>
          </ul>
        </div>
        <div class="cont"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import header from '@/components/header'
  import {Swiper, SwiperItem} from 'vux'
  import * as Echarts from "echarts";
  import * as customTheme from '@/assets/styles/custom.project.json';
  import AGE from '../../../static/mock/chartage.json';
  import GENDER from '../../../static/mock/chartgender.json';
  import CULTURE from '../../../static/mock/chartculture.json';
  import TYPE from '../../../static/mock/charttype.json';
  import LINE1 from '../../../static/mock/chartline1.json';
  import LINE2 from '../../../static/mock/chartline2.json';

  export default {
    components:{
      mHeader:header,
      Swiper,
      SwiperItem
    },
    name: "ChartDetail",
    data(){
      return {
        unitcode: this.$route.query.id,
        allCount: this.$route.query.count,
        ctitle: this.$route.query.name + '详细统计',

        data: {},
        titles:{},
        id: null,
        charts: {},
        chart: null,

        tabList:[{
          name:'所有',
          subtype: 'all'
        },{
          name:'一个筛选',
          subtype: 'project'
        },{
          name:'两个筛选',
          subtype: 'unmanage'
        },{
          name:'三个筛选',
          subtype: 'phsign'
        },{
          name:'四个筛选',
          subtype: 'bksign'
        }],
        curTabIndex:0
      }
    },
    computed:{

    },
    mounted(){
      this.initCharts()
      this.getData('type');
      this.getData('culture');
      document.querySelector('.g-content').addEventListener('scroll',this.scrolling)
      // this.getData('age');
      // this.getData('sex');
      //
      // this.getData('dnum');
      // document.querySelector('.g-content').addEventListener('scroll',this.scrolling)
    },
    beforeRouteLeave(to,from, next){
      for(var i in this.charts){
        if(this.charts[i]){
          this.charts[i].dispose()
        }
      }
      document.querySelector('.g-content').removeEventListener('scroll',this.scrolling)
      next();
    },
    methods:{
      scrolling(e){
        let wh = window.innerHeight;
        let charts = document.querySelectorAll('.chart-view');
        charts.forEach((dom,i)=>{
          if(dom.getBoundingClientRect().top < wh && !dom.dataset.inited){
            dom.dataset.inited = 1;
            this.getData(dom.id);
          }
        })
      },
      tabChange(i){
        if(i !== this.curTabIndex){
          console.log(this.tabList[i].subtype)
          this.curTabIndex = i;
          //获取新的数据
          this.getData('rc', this.tabList[i].subtype);
        }
      },
      initCharts(){
        //初始化各个模块
        let ids = [];
        let doms = document.querySelectorAll('.chart-view');
        doms.forEach((dom,i)=>{
          ids.push(dom.id)
          if(!this.charts[dom.id]){
            if(dom.dataset.chart.includes('pie')){
              this.initPie(dom.id)
            }
            else if(dom.dataset.chart.includes('line')){
              this.initLine(dom.id)
            }
            else if(dom.dataset.chart.includes('circle')){
              this.initCircle(dom.id)
            }
          }
        })
      },
      getData(type,sub){
        let uri = type;
        if(sub){
          uri = type + sub;
        }
        if(type==='rc' && !sub){
          uri = type + this.tabList[this.curTabIndex].subtype;
        }
        this.charts[type].showLoading('default',{
          text: '',
          color: '#fff',
          textColor: '#fff',
          maskColor: 'transparent',
          zlevel: 0
        })

        let data = {
          'type': TYPE,
          'culture': CULTURE,
          'gender':GENDER,
          'age': AGE,
          'dnum': LINE1,
          'rc': LINE2
        }

        setTimeout(()=>{
          this.charts[type].setOption({
            dataset: {
              source: data[type]
            },
          })
          this.charts[type].hideLoading()
        },1000)
      },
      initCircle(id){
        if(!this.charts[id]){
          this.charts[id] = Echarts.init(document.getElementById(id).querySelector('.cont'),customTheme);
          let opt_params = {
            'type':{
              labelFormat: '{b}\n{@cnt}人({d}%)'
            },
            'culture':{
              labelFormat: '{@diploma}\n{@cnt}人\n({d}%)'
            }
          };
          let option = {
            // dataset:{
            //   //source: datalist
            // },
            tooltip:{
              confine:true,
              textStyle:{
                fontSize:16
              },
              formatter:(params)=>{
                if(params.value.name){
                  return params.value.name + '：<b>'+params.value.cnt + '</b>人' + '('+ params.percent + '%)'
                }
                else{
                  return params.value.diploma + '：<b>'+params.value.cnt + '</b>人' + '('+ params.percent + '%)'
                }
              }
            },
            series : [
              {
                name: opt_params[id].name,
                type:'pie',
                radius: ['38%', '55%'],
                center: ['50%', '55%'],
                seriesLayoutBy: 'row',
                label: {
                  normal: {
                    fontSize:15,
                    position: 'outside',
                    formatter: opt_params[id].labelFormat
                  }
                }
              }
            ]
          };
          this.charts[id].setOption(option)
        }
      },
      initPie(id){
        this.charts[id] = Echarts.init(document.getElementById(id).querySelector('.cont'),customTheme);
        let opt_params = {
          'age':{
            labelFormat: '{@age}\n{@cnt}人\n({d}%)'
          },
          'gender':{
            labelFormat: '{@gender}\n{@cnt}人({d}%)'
          }
        };
        let option = {
          // dataset:{
          //   //source: this.data[id]
          // },
          tooltip:{
            confine:true,
            formatter:(params)=>{
              if(params.value.gender){
                return params.value.gender + '：<b>'+params.value.cnt + '</b>人' + '(' +  params.percent + '%)'
              }
              else{
                return params.value.age + '：<b>'+params.value.cnt + '</b>人' + '(' +  params.percent + '%)'
              }
            }
          },
          series : [
            {
              name: opt_params[id].name,
              type: 'pie',
              radius : '55%',
              center: ['50%', '55%'],
              seriesLayoutBy: 'row',
              label: {
                normal: {
                  fontSize: 15,
                  position: 'outside',
                  formatter: opt_params[id].labelFormat
                }
              }
            }
          ]
        };
        this.charts[id].setOption(option)
      },
      initLine(id){
        this.charts[id] = Echarts.init(document.getElementById(id).querySelector('.cont'),customTheme);
        if(id.includes('dnum')){
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type:'shadow',
                textStyle: {
                  color: "#333"
                }
              },
              confine:true,
              formatter:(params)=>{
                console.log(params)
                return params[0].name +'<br />分布人数：'+ params[0].data.cnt
              }
            },
            visualMap: [{
              top: 10,
              right: 10,
              type: 'piecewise',
              pieces: [
                {gt: 0, lte: 999, color:'#516b91'},
                {gt: 1000, lte: 1999 , color:'#59c4e6'},
                {gt: 2000, lte: 2999 , color:'#edafda'},
                {gt: 3000, color:'#93b7e3'},
              ],
              outOfRange: {
                color: '#ddd'
              },
              textStyle:{
                color:'#999'
              }
            }],
            grid: {
              top: 28,
              left: 48
            },
            xAxis: [{
              boundaryGap: true,
              type: 'category',
              axisTick:{
                show:false
              },
              axisLine:{
                lineStyle:{
                  color: '#999'
                }
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                color: '#999'
              }
            }],
            yAxis: [{
              type:'value',
              splitLine:{
                show:true
              },
              axisLine:{
                show:false
              },
              axisLabel:{
                interval: 0,
                color: '#999'
              },
            }],
            dataZoom:[{
              show: true,
              height: 24,
              xAxisIndex: [0],
              bottom: 0,
              start:0,
              end:100,
              showDetail:true,
              textStyle:{
                color:'#fff'
              }
            }],
            // dataset: {
            //   dimensions: ['name', 'cnt'],
            //   source: LINE1
            // },
            seriesLayoutBy:'row',
            series: [{
              type: "bar",
              symbolSize: 4,
              symbol:'emptyCircle',
              smooth: 0.3,
              smoothMonotone: 'y',
              dimensions: ['name','cnt'],
              areaStyle: {
                normal: {
                  color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(16,101,252,0.8)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(16,101,252,0.2)'
                  }], false),
                  shadowBlur: 10
                }
              }
            },
            ]
          };
          this.charts[id].setOption(option)
        }
        else{
          let option = {
            grid:{
              top:20,
              left: 48
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                textStyle: {
                  color: "#fff"
                }
              },
              formatter:(params)=>{
                let item = params[0];
                let str = item.name
                  + '<br /><span style="color: #516b91">●</span>预计参与率：' + item.data.lastpercent + '%'
                  + '<br /><span style="color: #59c4e6">●</span>实际参与率：' + item.data.percent + '%'
                  + '<br /><span style="color: #edafda">●</span>总参与率：' + item.data.allpercent + '%'
                return str;
              }
            },
            calculable: true,
            dataZoom: [{
              show: true,
              height: 24,
              xAxisIndex: [0],
              bottom: 0,
              start: 0,
              end: 100,
              textStyle:{
                color:"#999"
              }
            }],
            xAxis: [{
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                color: '#999'
              },
            }],
            yAxis: [{
              type: 'value',
              min: 0,
              max: 100,
              splitLine: {
                show: true
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                interval: 0,
                color: '#999',
                formatter:'{value}%',
              }
            }],
            // dataset: {
            //   //dimensions: ['maporgname', 'completotal', 'completotal', 'notcompletotal'],
            //   //source: Object.assign([], LINE2.aaData.slice(1))
            // },
            series: [
              {
                type: 'line',
                dimensions: ['name','lastpercent'],
              },
              {
                type: 'line',
                dimensions: ['name', 'percent']
              },
              {
                type: 'bar',
                dimensions: ['name', 'allpercent']
              },
            ]
          };
          //option.dataset.source = Object.assign([], LINE2.aaData.slice(1));
          this.charts[id].setOption(option)
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .chart-view-wrap{
    padding: 0 8px;
    /*width: 600vw;*/
    /*overflow: scroll;*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*align-content: center;*/
    /*align-items: center;*/
  }
.chart-view{
  flex:none;
  width: 100%;
  margin: 8px 0 12px 0;
  background: rgba(0,0,0,0.05);
  border-radius: 7px;
  padding: 15px 0;
  .cont{
    height: 70vw;/*calc((100vh - 44px)/2)*/;
    width: 100%;
  }
  .other{
    width: 100%;
    color: @theme-color;
    h3{
      font-size: 22px;
      text-align: center;
      font-weight: 700;
      margin: 0 0 10px 0;
    }
    .tab{
      margin:0 10px;
      &>li{
        font-size: 13px;
        display:inline-block;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        &.cur{
          color: @theme-color;
          background: rgba(0,0,0,0.1);
        }
      }
    }
  }
}
</style>
