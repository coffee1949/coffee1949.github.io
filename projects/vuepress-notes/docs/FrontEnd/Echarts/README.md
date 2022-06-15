---
title: Echarts
---

## 下载
[https://echarts.apache.org/zh/download.html](https://echarts.apache.org/zh/download.html)

## 使用
```html
<!-- 创建容器 -->
<div id='container' style='width: 900px;height: 600px;'></div>

<!-- 引入echarts.js -->
<script src='./echarts.js'></script>
<script>
    // 初始化
    let chart = echarts.init(document.getElementById('container'), 'dark')

    // 构建配置项
    let option = {
        ...
    }

    chart.setOption(option)

</script>

```

## 配置项详解

### 标题组件
```javascript
{
    // 标题组件，包含主标题和副标题。
    title: {
        show: true, // 是否显示标题组件。
        text: '主标题', // 主标题文本，支持使用 \n 换行。
        link: 'http://baidu.com', // 主标题文本超链接。
        target: 'blank', // 指定窗口打开主标题超链接。self | blank
        subtext: '副标题',
        sublink: 'http://jd.com',
        subtarget: 'blank',
        textStyle:{ // 主标题文字样式
            color: '#f00',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontFamily: 'Arial',
            fontSize: 18,
            lineHeight: 36,
            width: 100,
            height: 36,
            textBorderColor: 'rgba(0,0,0,0.1)',
            // ...
        },
        subtextStyle: {
            // ...
        },
        textAlign: 'center', // auto|left|right|center
        top: 10, // title 组件离容器左侧的距离。left 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比，也可以是 'left', 'center', 'right'。
        left: 10,
        right:10,
        bottom: 10,
        backgroundColor: '#f00', // 背景颜色：rgb|rgba|#f00
    }
}
```
### 提示框组件
```javascript
{
    // 提示框组件。
    tooltip: {
        show: true, // 是否显示提示框组件，包括提示框浮层和 axisPointer。
        trigger: 'item', // 触发类型：item（数据项图形触发）|axis（坐标轴触发）|none（什么都不触发）
        axisPointer: {}, // 这个暂不研究
        showContent: true, // 是否显示提示框浮层
        alwaysShowContent: false, // 是否永远显示提示框内容
        triggerOn: 'mousemove|click', // 提示框触发的条件
        position: [10,10], // 提示框的位置，可以是：Array|Object|Function|String等
        formatter: '', // 提示框浮层内容格式器，字符串模板|回调函数
        backgroundColor: '#f00', // 背景颜色
        padding: 10,
        borderColor: '#333',
        borderWidth: 2,
        textStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            fontFamily: 'Arial',
            // ...
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // 额外附加到浮层的 css 样式。
    }
}

```
### 图例组件
```javascript
{
    // 图例组件
    legend: {
        show: true, // 是否显示
        left: 'center', // auto|10|10%|left|right|center,
        top: 10, // auto|20|20%|top|middle|bottom
        right: 'auto',
        bottom: 'auto',
        width: 'auto', // 图例组件的宽度
        height: 'auto'. // 图例组件的高度，默认自适应
        align: 'auto', // 图例标记和文本的对齐。
        padding: 10, // 图例内边距
        itemGap: 10, // 图例每项之间的间隔
        textStyle: {
            color: '#f00',
            // ...
        },
        formatter: '',
        tooltip: { // 和外层tooltip配置相同
            show: true,
        },
        // data: ['环境数据1','环境数据2','环境数据3'],
        data: [{
            name: '环境数据1',
            textStyle: {
                color:'red'
            }
        }],
        backgroundColor: '#f00'
    }
}
```
### grid：直角坐标系内绘图网格
```javascript
{
    grid: {
        left: 10, // 10|10%|left|center|right
        top: 20, // 2-|20%|top|middle|bottom,
        right: 20, // 20|20%,
        bottom: 50, // 50|20%
        width: 'auto',
        height: 'auto',
        backgroundColor: '#f00',
        tooltip: {}
    }
}
···

### xAxis

### yAxis

### series

### dataZoom

### dataset