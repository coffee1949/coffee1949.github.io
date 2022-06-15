---
title: Python基础
---

## 包引入

```python
import sys | from sys import *
```

## dir(): 查看模块内方法

> 内置的函数 dir() 可以找到模块内定义的所有名称。以一个字符串列表的形式返回:

```python

import sys

print(dir(sys))
```

## help(): 查看帮助信息

```python

import base64

help(base64)
```

## 使用__doc__属性查看包或方法的文档

```python

import base64

base64.__doc__
base64.b64encode.__doc__
```

## 进入help环境

```python

help()
```

## 退出help环境
```python

quit
```