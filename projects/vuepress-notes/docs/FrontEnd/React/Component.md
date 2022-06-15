---
title: 组件详解
---

## 组件的类型

- UI 组件：只负责页面的渲染
- 容器组件：只负责业务逻辑和数据的处理
- 无状态组件（函数组件）：把 UI 组件用函数表示（可以省去生命周期函数，优化代码）

## 组件的几种创建方式

### 方式一：class 继承

```javascript
import React from "react";

class App extends React.Component {
  render() {
    return (
      <div>
        <p>hello,world</p>
        <p>hello,world</p>
        <p>hello,world</p>
      </div>
    );
  }
}

export default App;
```

### 方式二：函数组件

```javascript
import React from 'react'

function App(props){
    return (
        <div>
        <p>hello,world</p>
        <p>hello,world</p>
        <p>hello,world</p>
        <p>{{props.name}}</p>
      </div>
    )
}

export default App
```

## state：数据储存

```javascript
import React from "react";

class App extends React.Component {
  construct(props) {
    super(props);

    // 初始化state数据
    this.state = {
      value: "",
      list: Array(5).fill({
        name: "张三",
        age: 18,
      }),
    };
  }

  render() {
    return (
      <div>
        <p>hello</p>
        <p>hello</p>
        {this.state.list.map((item, index) => {
          return (
            <p key={item + index}>
              {item.name}
              {item.age}
            </p>
          );
        })}
      </div>
    );
  }
}

export default APp;
```

## render 函数

> render 函数的返回值才会渲染在页面中
> render 函数属于生命周期的范畴

## React 的生命周期

### 挂载卸载过程

- constructor()
- componentWillMount()
- render()
- componentDidMount()
- componentWillUnmount()

### 更新过程

- componentWillReceiveProps (nextProps)
- shouldComponentUpdate(nextProps,nextState)
- componentWillUpdate (nextProps,nextState)
- render()
- componentDidUpdate(prevProps,prevState)
