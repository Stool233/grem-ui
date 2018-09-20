<template>
  <div class="gramcharts" @click="logchange()">
    <chart :options="line" @click="logchange()"></chart>
  </div>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts.vue'
    import Bus from '../config/bus'

    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/polar'
    import 'echarts/lib/component/geo'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/visualMap'
    import 'echarts/lib/component/dataset'

    export default {
      name: "gramcharts",
      components: {
        chart: ECharts
      },
      props: {
        chartdata: {
          type: Array
        }
      },
      data () {

        return {
          line: {
            title: {
              text: ''
            },
            grid: {
              top: "5%",
              left: '3%',
              right: '10%',
              bottom: '9%',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis'
            },
            // xAxis: {
            //   type: 'value',
            // },
            // yAxis: {
            //
            // },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['0min','5min','10min','15min','20min','25min','30min','35min','40min','45min','50min','55min','60min']
            },
            yAxis: {
              type: 'value'
            },
            series: [],
          },
          currentData: [],
          circles: []
        }
      },
      mounted () {
        this.refresh();

        let _this = this;
        Bus.$on('on-circles', function (circles) {
          //console.log('on');
          _this.circles = circles;
          _this.refresh();
        })
      },
      methods: {
        convertChartData (data) {
          let series = [];
          for (let item of data) {
            let datashow = [];
            for (let key in item) {
                // console.log(key);
                // datashow.push([key.split('time')[1], item[key]]);
                datashow.push(item[key]);
            }

            // console.log(datashow);

            series.push({
              type: 'line',
              data: datashow
            });
          }
          return series;
        },
        logchange () {
          // console.log(this.chartdata);
        },
        sampleData(data, flags) {
          //console.log('sampleData');
          //console.log(flags);

          let samples = [];
          if (data.length <= 0 || flags.length <= 0) {
            return samples;
          }

          for (let index = 0; index < flags.length; index++) {
            if (flags[index].chose) {
              data[index]['name'] = flags[index].position;
              // console.log(data);
              samples.push(data[index]);
            }
          }

          samples.sort(function (a, b) {
            // console.log(a);
            // console.log(b);
            if (a.data[0] < b.data[0])
              return 1;
            else if (a.data[0] === b.data[0])
              return 0;
            else
              return -1;
          });

          console.log(samples);

          return samples;
        },
        refresh () {
          this.currentData = this.sampleData(
            this.convertChartData(
              this.chartdata), this.circles);
          this.line.series = this.currentData;
        },
      },
      watch: {
        chartdata (curVal, oldVal) {
          this.refresh();
        },
      }
    }
</script>

<style scoped>
  .gramcharts{
    /*height: 300px;*/
    /*width: 300px;*/
    text-align:center;
  }
</style>
