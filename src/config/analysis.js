class Analyser {

  constructor(forbiddenList){
    this.forbiddenList = forbiddenList
  }

  analyzeRawData(data, times) {
    // console.log(data);
    // 清空数组
    this.forbiddenList.splice(0, this.forbiddenList.length);
    data = Analyser.cut2ResultData(data, 'Results');
    // console.log(data);
    data = data.map(Analyser.cut2TimeData);
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].map(Analyser.convertTo96Array);
    }
    data = data.map(Analyser.transfer2DArray);
    data = this.subtract2DArray(data[0], data[1]);
    data = Analyser.convertToObjectArray(data, times);

    let chartdata = [];
    for (let sample of data) {
      chartdata.push(Analyser.convert2array(sample));
    }
    return chartdata;
  }

  static convertToObjectArray(data, times){

    // console.log(this.times);

    let result = [];
    for (let i = 0; i < data.length; i++) {
      let item = {};
      // console.log(data[i]);
      for (let j = 0; j < data[0].length; j++) {
        item[times[j]] = data[i][j];
      }
      result.push(item);
    }

    return result;
  }

  static transfer2DArray(array) {

    // console.log(array);

    let n = array.length;
    let m = array[0].length;
    let result = new Array(m);

    for (let i = 0; i < m; i++) {
      result[i] = new Array(n);
    }

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = array[j][i];
      }
    }

    return result;
  }

  subtract2DArray(a, b) {

    // console.log(a);
    // console.log(b);

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[0].length; j++) {
        if (a[i][j] === 'NaN' || b[i][j] === 'NaN' || a[i][j] === undefined || b[i][j] === undefined
          || a[i][j].length === 0 || a[i][j].length === 0) {
          a[i][j] = 0;
          this.forbiddenList.push(i);
        } else {
          a[i][j] -= b[i][j];
        }
      }
    }
    return a;
  }

  static convertTo96Array(data) {

    // console.log(data);
    let first;
    // 判断是否为数字
    if (isNaN(data[1]["__EMPTY_1"])) first = 2;
    else first = 1;

    console.log(data[1]["__EMPTY_1"]);

    let results = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = first; j <= first+12-1; j++) {
        // console.log(data[i]);
        results.push(data[i]["__EMPTY_" + String(j)]);
      }
    }

    // console.log(results);

    return results;
  }

  static cut2TimeData(data) {

    let results = [];
    let pointer = 0;
    let length = data.length;
    let result = [];
    while (pointer < length) {
      if (Analyser.checkBoard(data[pointer])) {
        if (result.length > 0) {
          results.push(result);
        }
        result = [];
        result.push(data[pointer]);
      } else {
        if (Analyser.checkCanPush(data[pointer])) {
          result.push(data[pointer]);
        }
      }
      pointer++;
    }

    if (result.length > 0) {
      results.push(result);
    }

    return results;
  }

  static checkCanPush(json) {

    for (let key in json) {
      if (json[key].length === 1 && /[A-H]/.test(json[key])) {
        return true;
      } else {
        return false;
      }
    }

  }

  static checkBoard(json) {
    if ((json['__EMPTY_1'] === '1' || json['__EMPTY_2'] === '1') && (json["__EMPTY_2"] === '2' || json['__EMPTY_3'] === '2')) {
      return true;
    }
    return false;
  }

  static cut2ResultData(jsonData, str) {
    let results = [];
    let pointer = 0;
    let length = jsonData.length;
    let result = [];
    while (pointer < length) {
      if (Analyser.checkJson(jsonData[pointer], str)) {
        if (result.length > 0) {
          results.push(result);
        }
        result = [];
      } else {
        result.push(jsonData[pointer]);
      }
      pointer++;
    }
    if (result.length > 0) {
      results.push(result);
    }
    return results;
  }

  static checkJson(json, str) {
    for (let key in json) {
      if (json[key].indexOf(str) === 0) {
        return true;
      }
    }
    return false;
  }

  static convert2array (data) {
    let res = {};
    for (let key in data) {
      //
      // console.log('time'+key.split("min")[0]);
      // console.log(data[key]);
      res['time'+key.split("min")[0]] = data[key];

    }
    return res;
  }
}

export default Analyser;
