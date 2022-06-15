---
title: NRM使用
---
## NRM是什么
> 用来快速切换 NPM 镜像源的一个工具


## NRM使用
```bash
# 安装
nrm install nrm -g
# 如果报错，则指定低版本安装，如下：
nrm install nrm@0.3.0 -g


# 查看使用方法
nrm -h
nrm --help


# 查看版本
nrm -V
nrm --version


# 查看当前使用的镜像
nrm current


# 查看所有可用镜像源
nrm ls 


# 切换镜像源
nrm use taobao 

```