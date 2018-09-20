<template>
    <el-main class="outer-result" v-loading="loading">
      <div class="tip">
        {{$t('m.TipOfResult')}}
      </div>
      <div class="gramresult">
        <table class="circles">
          <tr>
            <th class="table-item"></th>
            <th class="table-item" v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
              <div class="number">
                {{ num }}
              </div>
            </th>
          <tr v-for="num in [0, 1, 2, 3, 4, 5, 6, 7]">
            <td class="letter table-item">{{ String.fromCharCode(65+num) }}</td>
            <td :class="[circle_result.value === '1' ? 'circle-result' : 'circle-result-empty',
                             circle_result.chose ? 'circle_chose' : 'circle_not_chose',
                             circle_result.showForbidden ? 'forbidden-show' : '']"
                class="table-item"
                v-for="(circle_result, index) in circle_results.slice(num*12, (num+1)*12)"
                @click="changeShow(num*12+index)">
              <div class="circle-score" v-if="!circle_result.showForbidden">
                {{ parseInt(circle_result.score.toFixed(2) * 100) }}
              </div>
              <div class="forbidden-flag" v-if="circle_result.showForbidden">
                X
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="statistics" v-show="computed">
        {{$t('m.NumberPositive')}}：{{ positive_num }}
        {{$t('m.NumberNegative')}}：{{ negative_num }}
      </div>
    </el-main>
</template>

<script>
    import Bus from '../config/bus';

    export default {
        name: "gramresult",
        data () {
          return {
            circle_results: [
              // {
              //   position: 'A1',
              //   value: false,
              //   score: 0.5,
              //   chose: false
              //   showForbidden: false
              // }
            ],
            positive_num: 0,
            negative_num: 0,
            computed: false,
            loading: false,
          }
        },
        mounted () {
          this.clearResult();
          let _this = this;

          Bus.$on('on-forbidden-show', function (data) {
            _this.clearResult();
            _this.forbiddenShow(data);
          });

          Bus.$on('on-results', function (results) {
            _this.convertResults(results);
            _this.loading = false;
            _this.computed = true;
          });

          Bus.$on('on-loading', function () {
            _this.loading = true;
          });

          Bus.$on('on-error', function (error) {
            console.log(error);
            _this.loading = false;
            alert(error);
          })
        },
        methods: {

          clearResult: function() {
            this.circle_results = [];
            for (let i = 0; i < 96; i++) {
              this.circle_results.push({
                position: String.fromCharCode('A'.charCodeAt(0) + (i / 12)) + (i % 12 + 1),
                value: false,
                score: 0.5,
                chose: false,
                showForbidden: false
              });
            }
            this.positive_num = 0;
            this.negative_num = 0;
            this.computed = false;
            this.loading = false;
          },
          forbiddenShow: function (data) {

            for (let i = 0; i < 96; i++) {
              this.circle_results[i].showForbidden = false;
            }

            for (let item of data) {
              this.circle_results[item].showForbidden = true;
            }

          },
          convertResults: function (results) {

            this.positive_num = this.negative_num = 0;

            for (let i = 0; i < 96; i++) {
              let result = results[i];

              if (this.circle_results[i].showForbidden) {
                continue
              }

              this.circle_results[i].value = result.label;
              this.circle_results[i].score = result.score;

              result.label === '1' ? this.positive_num++ : this.negative_num++;
            }
          },
          changeShow: function (index) {
            this.circle_results[index].chose = !this.circle_results[index].chose;
            this.handleFlags();
          },
          handleFlags: function () {
            //console.log("emit");
            Bus.$emit('on-circles', this.circle_results);
          }
        }
    }
</script>

<style scoped>
  .outer-result{
  }

  .gramresult {
    display: flex;
    justify-content:center;
    /*text-align:center;*/
    /*width: 500px;*/
    /*height: 320px;*/
    /*text-align:center;*/
    /*margin:0 auto;*/
    /*background: #F5F5F5;*/
  }

  .letter{
    font-weight:bold;
    /*width: 10px;*/
    /*height: 30px;*/
    /*cursor: pointer;*/
    /*margin-bottom : 6px;*/
  }

  .number{
    /*flex: 1;*/
    /*display: inline-block;*/
    /*float: left;*/
    /*width: 30px;*/
    /*cursor: pointer;*/
    /*margin : 3px;*/
  }

  .circle-result {
    background: coral;
    text-align: center;
    border-radius: 50%;
  }
  .circle-result-empty {
    /*background: cornflowerblue;*/
    text-align: center;
    border-radius: 50%;
  }

  .circle_chose {
    border: 1px solid dodgerblue;
  }

  .circle_not_chose {
    border: 1px solid darkgrey;
  }

  .circle-score {
    cursor:pointer;
    /*position: relative;*/
    /*top: 6px;*/
  }

  body {
    margin: 0;
  }

  .tip{
    font-size: 15px;
    color: darkgrey;
  }

  .statistics {

  }

  .circles {
    border:solid 1px cornflowerblue;
  }

  .table-item {
    width: 30px;
    height: 30px;
  }

  .forbidden-show {
    pointer-events: none;
  }

  .forbidden-flag {
    font-weight: bold;
    color: black;
  }
</style>
