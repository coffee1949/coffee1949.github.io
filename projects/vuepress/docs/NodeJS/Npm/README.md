---
title: NPM使用
---

## NPM命令

```bash

# 查看帮助的三种方式
npm
npm help
npm --help


# 查看npm版本
npm -v


# 查看当前使用的镜像
npm get registry 


# 设置淘宝镜像
npm config set registry http://registry.npm.taobao.org/


# npm的镜像替换成官网
npm config set registry https://registry.npmjs.org/


# 更新最新的npm
npm install npm -g


# 查看npm安装路径的2中方式
npm config get prefix
npm get prefix


# 初始化node项目
npm init


# 根据package.json声明的依赖项安装依赖
npm i
npm install


# 安装单个依赖项
npm i express
npm i express -D
npm i express -S


# 查看未安装的依赖项的最新版本
npm view --help
npm view <package>
npm view jquery
# view 的别名: v,info,show
npm v jquery
npm info jquery
npm show jquery


# 查看单独命令的使用方法
npm <command> --help
npm help <command>
# 如：
npm search --help
npm help search


# npm get && npm set && npm config
# 设置
npm config set <key> <value>
# 获取
npm config get [<key>]
# 删除
npm config delete <key>
# 查看所有设置
npm config list [--json]
npm config list
npm config list --json
npm config ls -l
npm config list -l
# other
npm config edit
npm set <key> <value>
npm get [<key>]


# 查看当前目录下node_modules下的依赖项
npm ls
# 查看当前目录下node_modules下的某个依赖项
npm ls vue


## 查看已全局安装的npm包
npm ls -g --depth 0
npm list -g --depth 0


# 运行package.json文件中scripts脚本
npm run <script>
npm run-script <script>
# 如：
npm run dev
npm run-script dev


# 查看npm版本、node版本等
npm version

```

## npm登录、发布npm包
```bash
# 查看当前登录用户
npm whoami


# 登录
npm login


# 登出
npm logout


# 发布
npm publish

```

## NPM缓存
```
npm cache clean
npm cache clean --force
```