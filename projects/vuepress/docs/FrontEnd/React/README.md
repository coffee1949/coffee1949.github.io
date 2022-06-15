---
title: React入门
---

## 安装脚手架工具

```
npm i -g create-react-app
```

## 创建新项目

```
create-react-app my-app
yarn create react-app my-app
```

## 启动不起来？

1. 修改 package.json 文件中的 dependencies 下面的 react-scripts 的版本为 2.1.8
2. 删除 node_modules 文件夹，并使用 yarn 重新安装依赖包
3. 重新安装完成后使用 yarn start 启动项目
