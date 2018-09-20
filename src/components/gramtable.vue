<template>
  <div class="app">
    <div class="table">
      <input type="file" @change="importFile(this)" id="imFile" v-show="false"/>
      <a id="downlink"></a>
      <!--<el-button class="button" @click="uploadFile('not-raw')">导入数据</el-button>-->
      <el-button class="button" @click="uploadFile('raw')">{{$t('m.Upload')}}</el-button>
      <el-button class="button" @click="downloadFile()">{{$t('m.Export')}}</el-button>

      <el-button class="button" @click="showTableDialog">{{$t('m.Edit')}}</el-button>

      <el-dialog :title="$t('m.Result')" :visible.sync="dialogTableVisible"
                 fullscreen>
        <div class="tip">
          {{$t('m.TipOfEdit')}}
        </div>
        <el-table :data="outputData"
                  stripe
                  border
                  empty-text="Empty">
          <el-table-column property="菌株编号" :label="$t('m.No')" header-align="center">

            <template slot-scope="scope">

              <div @click="handleClick(scope.$index, scope.row)">
                <el-input v-if="checkEditable(scope.$index, scope.row)" size="small" v-model="scope.row.菌株编号"
                          @change="handleEdit(scope.$index, scope.row)"
                          @blur="handleClose(scope.$index, scope.row)"
                          @keyup.enter.native="handleClose(scope.$index, scope.row)"></el-input>
                <span v-else>
                {{scope.row.菌株编号}}
                </span>
              </div>

            </template>

          </el-table-column>
          <el-table-column property="位置" :label="$t('m.Position')" header-align="center"></el-table-column>
          <el-table-column property="产酶结果" :label="$t('m.Result')" header-align="center"></el-table-column>
          <!--<el-table-column label="操作" header-align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button-->
                <!--size="mini"-->
                <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-dialog>


      <gramcharts :chartdata="excelData"></gramcharts>
    </div>
    <div class="compute">
      <gramresult></gramresult>
      <div class="tip">
        {{$t('m.DetectionBasis')}}
      </div>
      <div class="radios">
        <!--<table class="radios-table">-->
          <!--<tr>-->
            <!--<td v-for="choise in ['0-5', '0-10', '0-15', '0-20', '0-25']" class="radio-td">-->
              <!--<el-radio v-model="computeType"-->
                        <!--:label="choise">-->
                <!--{{ choise }}-->
              <!--</el-radio>-->
            <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
            <!--<td v-for="choise in ['0-30', '0-35', '0-40', 'all']"  class="radio-td">-->
              <!--<el-radio v-model="computeType"-->
                        <!--:label="choise">-->
                <!--{{ choise }}-->
              <!--</el-radio>-->
            <!--</td>-->
          <!--</tr>-->
        <!--</table>-->

        <el-radio v-for="(item, index) in models" v-model="modelIndex" :label="index" class="radio-td" :class="index === 0 ? 'radio-first' : ''">

          {{ item.modelName }}
        </el-radio>


      </div>
      <!--<div class="radios">-->
        <!--<el-radio v-for="choise in ['0-5', '0-10', '0-15', '0-20', '0-25', '0-30', '0-35', '0-40', 'all']"-->
                  <!--v-model="computeType"-->
                  <!--:label="choise">{{ choise }}</el-radio>-->
      <!--</div>-->
      <el-button class="button" @click="computeScore()" :disabled="button_disable">{{$t('m.Start')}}</el-button>

    </div>
  </div>

</template>

<script>
    import XLSX from 'xlsx'
    import Gramcharts from "./gramcharts";
    import Gramresult from "./gramresult";
    import $ from '../config/http'
    import Bus from '../config/bus';
    import Analyser from '../config/analysis'

    export default {
        name: "gramtable",
        components: {Gramresult, Gramcharts},
        data () {
          return {
            imFile: '',
            outFile: '',
            errorDialog: false,
            errorMsg: '',
            excelData: [],
            outputData: [],
            computeType: "0-15",
            apiComputeUrl: 'http://127.0.0.1:8081/gram/modelCompute/computeList',
            button_disable: false,
            dataType: "not-raw",
            times: [],
            names: [],
            emptyFlag: "EMPTY",
            forbiddenList: [],

            dialogTableVisible: false,
            editable: [],

            apiUrlModels: "http://127.0.0.1:8081/gram/model",
            models: [],  // 从后台获取的目前支持的模型列表
            modelIndex: 0,
          }
        },
        mounted() {
          this.imFile = document.getElementById('imFile');
          this.outFile = document.getElementById("downlink");

          for (let i = 0; i < 60+1; i += 5) {
            this.times.push(String(i)+'min');
          }
          for (let i = 0; i < 96; i++) {
            this.editable.push(false)
          }
          this.getModelsFromBackEnd();
        },
        methods: {
          getModelsFromBackEnd() {
            $.ajax.get(this.apiUrlModels)
              .then((response)=>{
                console.log(response);
                // let results = response.results;
                let code = response.code;
                if (code !== 0) {
                  this.$notify.error({
                    title: this.$t('m.Error'),
                    message: response.msg,
                    offset: 100
                  });

                } else {
                  let results = response.data;
                  this.models = results;
                }

              }).catch(error=>{
              Bus.$emit('on-error', error);
            })
          },
          showTableDialog() {
            this.dialogTableVisible = true;
          },
          checkEditable(index, row) {
            if (row.菌株编号 === undefined || row.菌株编号.length === 0) {
              this.editable[index] = true;
              return true;
            }
            return this.editable[index]
          },
          handleClose(index, row) {
            this.editable[index] = false;
            row.菌株编号 = row.菌株编号 + "_____1";
            row.菌株编号 = row.菌株编号.split("_____")[0];
            console.log(this.editable[index]);
            console.log(index);
            console.log(row);
          },
          handleClick(index, row) {
            this.editable[index] = true;
            row.菌株编号 = row.菌株编号 + "_____1";
            row.菌株编号 = row.菌株编号.split("_____")[0];
            console.log(this.editable[index]);
            console.log(index);
            console.log(row);
          },
          handleEdit(index, row) {
            console.log(index, row);
          },
          uploadFile: function (dataType) { // 点击导入按钮
            this.dataType = dataType;
            this.imFile.click()
          },
          importFile: function () {
            let obj = this.imFile;
            if (!obj.files) {
              return;
            }
            let f = obj.files[0];
            let reader = new FileReader();
            let $t = this;
            reader.onload = function (e) {
              let data = e.target.result;
              if ($t.rABS) {
                $t.wb = XLSX.read(btoa(this.fixdata(data)), {
                  type: 'base64'
                });
              } else {
                $t.wb = XLSX.read(data, {
                  type: 'binary'
                });
              }
              let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
              // console.log(typeof json);
              $t.getNames(json);

              let analyser = new Analyser($t.forbiddenList);
              let result;
              try {
                result = analyser.analyzeRawData(json, $t.times);
              } catch (e) {
                console.log(e);
                $t.$notify.error({
                  title: $t.$t('m.Error'),
                  message: $t.$t('m.MessageOfFormatData'),
                  offset: 100,
                });
              }
              $t.dealFile(result);

              // $t.dealFile($t.analyzeRawData(json))
            };
            if (this.rABS) {
              reader.readAsArrayBuffer(f);
            } else {
              reader.readAsBinaryString(f);
            }
          },
          downloadFile: function () { // 点击导出按钮
            let rs = this.outputData;
            if (rs.length <= 0) {
              this.$notify.error({
                title: this.$t('m.Error'),
                message: this.$t('m.MessageOfEmpty'),
                offset: 100
              });
              return ;
            }
            let _this = this;
            this.$prompt(this.$t('m.TipOfInputFileName'), this.$t('m.Tip'), {
              confirmButtonText: this.$t('m.Confirm'),
              cancelButtonText: this.$t('m.Cancel'),
            }).then(({ value }) => {
              let data = [{}];
              for (let k in rs[0]) {
                data[0][k] = k
              }
              data = data.concat(rs);
              console.log(value);
              _this.downloadExcel(data, value === null ? 'data' : value)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('m.OperationFail')
              });
            });
            // let data = [{}];
            // for (let k in rs[0]) {
            //   data[0][k] = k
            // }
            // data = data.concat(rs);
            // this.downloadExcel(data, 'data')
          },
          computeLength: function (data) {
            let length = 0;
            let as = [];
            for (let key in data) {

              let p = /[A-Z]/;
              if (p.test(data[key]) && data[key].length === 1) {
                as.push(key.split("EMPTY_")[1]);
              }
            }
            // console.log(as);
            length = Math.abs(as[1] - as[0]);
            return length;
          },

          getNames: function(data) {

            let first = this.findFirst(data);
            // console.log(data);
            // console.log(first);

            if (first === null) return ;
            this.names = [];
            let posFirst = first.pos;
            let keyFirst = parseInt(first.key.split("EMPTY_")[1]);

            for (let i = posFirst+1; i < posFirst+1+8; i++) {
              for (let j = keyFirst+2; j < keyFirst+2+12; j++) {
                // console.log(i);
                this.names.push(data[i]["__EMPTY_" + String(j)]);
              }
            }

            this.outputData = [];
            for (let i = 0; i < 96; i++) {
              this.outputData.push({
                '菌株编号': this.names.length > 0 ? (this.names[i] !== undefined ? this.names[i] : "") : "",
                '位置': this.getPositionFromIndex(i),
                "产酶结果": ""
              });
            }

            // console.log(this.names);
          },
          findFirst: function(data) {
            for (let i = 0; i < data.length; i++) {
              for (let key in data[i]) {
                // console.log(data[i][key]);
                if (data[i][key] === '菌株顺序') {
                  return {pos: i, key: key};
                }
              }
            }
            return null;
          },

          dealFile: function (data) {
            // console.log(data);
            this.imFile.value = '';
            if (data.length <= 0) {
              this.errorDialog = true;
              this.errorMsg = '请导入正确信息';
            } else {
              this.excelData = data;
              this.$notify.success({
                title: this.$t('m.Success'),
                message: this.$t('m.MessageOfOperate'),
                offset: 100,
              });

              // 发送到96孔页面，提示哪些孔无数据
              Bus.$emit('on-forbidden-show', this.forbiddenList);

            }

          },
          fixdata: function (data) {  // 文件流转BinaryString
            let o = '';
            let l = 0;
            let w = 10240;
            for (; l < data.byteLength / w; ++l) {
              o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            }
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
          },
          /**
           * 计算结果
           */
          computeScore: function () {

            if (this.excelData.length <= 0) {
              this.$notify.error({
                title: this.$t('m.Error'),
                message: this.$t('m.MessageOfEmpty'),
                offset: 100
              });
              return ;
            }

            this.button_disable = true;
            Bus.$emit('on-loading');

            let data = [];
            let jsondata;
            // if (this.computeType === 'all') {
            //   for (let item of this.excelData) {
            //     let dataItem = [];
            //     for (let key in item) {
            //       dataItem.push(item[key]);
            //     }
            //     data.push({data: dataItem});
            //   }
            //   jsondata = {
            //     data: data
            //   };
            //
            //   // for (let item of this.excelData) {
            //   //   let dataItem = {};
            //   //   dataItem[0] = item["time"+0];
            //   //   dataItem[5] = item["time"+5];
            //   //   data.push(dataItem);
            //   // }
            //
            // } else {
            //   for (let item of this.excelData) {
            //     let pos = this.computeType.split('-')[1];
            //     // console.log(item);
            //     // data.push({
            //     //   time0: item['time0'],
            //     //   timeNext: item['time'+pos]
            //     // });
            //     let dataItem = {};
            //     dataItem[0] = item["time"+0];
            //     dataItem[pos] = item["time"+pos];
            //     data.push(dataItem);
            //   }
            //
            //   // jsondata = {
            //   //   computeType: this.computeType,
            //   //   data: data
            //   // };
            //   jsondata = data;
            // }

            let times = this.models[this.modelIndex].times;
            for (let item of this.excelData) {
              let dataItem = {};
              for (let timeItem of times) {
                dataItem[timeItem] = item["time"+timeItem];
              }
              data.push(dataItem);
            }

            jsondata = data;
            console.log(jsondata);

            jsondata = JSON.stringify(jsondata);
            // jsondata = Qs.stringify(jsondata);

            // console.log(jsondata);
            let _this = this;
            $.ajax.post(this.apiComputeUrl,
                        jsondata,
                        {headers:{'Content-Type':'application/json'}})
              .then((response)=>{
                console.log(response);
                // let results = response.results;
                let code = response.code;
                if (code !== 0) {
                  this.$notify.error({
                    title: this.$t('m.Error'),
                    message: response.msg,
                    offset: 100
                  });

                } else {
                  let results = response.data;
                  // console.log(results);
                  Bus.$emit('on-results', results);
                  _this.button_disable = false;

                  _this.convertResult2Excel(results);
                }


            }).catch(error=>{
              Bus.$emit('on-error', error);
            }).finally(()=>{
              _this.button_disable = false;
            })

          },

          convertResult2Excel: function(results) {
            // this.outputData = [];

            for (let i = 0; i < 96; i++) {
              let result = results[i];
              // this.outputData.push({
              //   '菌株编号': this.names.length > 0 ? this.names[i] : " ",
              //   '位置': this.getPositionFromIndex(i),
              //   "产酶结果": result.label === '1' ? '+' : '-'
              // });
              this.outputData[i]["产酶结果"] =  (result.label === '1' ? '+' : '-')
            }

          },

          getPositionFromIndex: function(index) {
            let a = index / 12;
            let b = index % 12;
            return String.fromCharCode("A".charCodeAt(0) + a) + String(b + 1);
          },

          downloadExcel: function (json, downName, type) {
            let keyMap = []; // 获取键
            for (let k in json[0]) {
              keyMap.push(k);
            }
            console.info('keyMap', keyMap, json);
            let tmpdata = []; // 用来保存转换好的json
            json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
              v: v[k],
              position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
            }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
              tmpdata[v.position] = {
                v: v.v
              }
            });
            let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
            let tmpWB = {
              SheetNames: ['mySheet'], // 保存的表标题
              Sheets: {
                'mySheet': Object.assign({},
                  tmpdata, // 内容
                  {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
                  })
              }
            };
            let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
              {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
            ))], {
              type: ''
            });  // 创建二进制对象写入转换好的字节流
            let href = URL.createObjectURL(tmpDown);  // 创建对象超链接
            this.outFile.download = downName + '.xlsx';  // 下载名称
            this.outFile.href = href;  // 绑定a标签
            this.outFile.click();  // 模拟点击实现下载
            setTimeout(function () {  // 延时释放
              URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
            }, 100)
          },

          s2ab: function (s) { // 字符串转字符流
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i) {
              view[i] = s.charCodeAt(i) & 0xFF
            }
            return buf;
          },

        }
    }
</script>

<style scoped>
  .app{
    width:100%;
    margin:0 auto;
    overflow:auto;
    _display:inline-block;
  }
  .table{
    width:500px;
    float:left;
    text-align:center;
    margin-top:5px
  }
  .compute{
    width: 500px;
    margin-left:650px;
    text-align:center;
    margin-top:5px
  }
  .radios{
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    /*justify-content:center;*/
    padding-top: 10px;
    padding-bottom:10px;
  }
  .tip{
    font-size: 15px;
    color: darkgrey;
  }

  .radios-table {

  }

  .radio-td {
    padding: 5px;
  }

  .radio-first{
    margin-left: 30px;
  }

</style>
