---
title: 微信小程序
---

## 使用多列选择器（multiSelector）picker 实现日期时间选择器

```javascript
// datePicker.js
function withData(param) {
  return param < 10 ? "0" + param : "" + param;
}

function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}

function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
    array = null;
  switch (month) {
    case "01":
    case "03":
    case "05":
    case "07":
    case "08":
    case "10":
    case "12":
      array = getLoopArray(1, 31);
      break;
    case "04":
    case "06":
    case "09":
    case "11":
      array = getLoopArray(1, 30);
      break;
    case "02":
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28);
      break;
    default:
      array = "月份格式不正确，请重新输入！";
  }
  return array;
}

function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());
  return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [],
    dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date
    ? [...date.split(" ")[0].split("-"), ...date.split(" ")[1].split(":")]
    : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime,
  };
}

module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
};
```

```javascript
// index.wxml
<picker mode="multiSelector" value='{{dateTime1}}' range='{{dateTimeArray1}}' bindchange='changeDateTime1'
  bindcolumnchange='changeDateTimeColumn1'>
  选择日期时间: {{dateTimeArray1[0][dateTime1[0]]}}-{{dateTimeArray1[1][dateTime1[1]]}}-{{dateTimeArray1[2][dateTime1[2]]}}
  {{dateTimeArray1[3][dateTime1[3]]}}:{{dateTimeArray1[4][dateTime1[4]]}}
</picker>

<picker mode="multiSelector" value='{{dateTime}}' range='{{dateTimeArray}}' bindchange='changeDateTime'
  bindcolumnchange='changeDateTimeColumn'>
  选择日期时间: {{dateTimeArray[0][dateTime[0]]}}-{{dateTimeArray[1][dateTime[1]]}}-{{dateTimeArray[2][dateTime[2]]}}
  {{dateTimeArray[3][dateTime[3]]}}:{{dateTimeArray[4][dateTime[4]]}}:{{dateTimeArray[5][dateTime[5]]}}
</picker>
```

```javascript
// index.js
var dateTimePicker = require("./datePicker.js");
Page({
  data: {
    // 年月日 & 时分秒
    dateTimeArray: null,
    dateTime: null,
    // 年月日 & 时分
    dateTimeArray1: null,
    dateTime1: null,
    // 开始结束年份设置
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 20,
  },
  onLoad() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(
      this.data.startYear,
      this.data.endYear
    );
    var obj1 = dateTimePicker.dateTimePicker(
      this.data.startYear,
      this.data.endYear
    );
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
    });
  },
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value,
    });
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value,
    });
  },
  changeDateTimeColumn(e) {
    console.log(e);

    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(
      dateArr[0][arr[0]],
      dateArr[1][arr[1]]
    );
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(
      dateArr[0][arr[0]],
      dateArr[1][arr[1]]
    );
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
    });
  },
});
```
