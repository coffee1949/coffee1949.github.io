### 从零搭建本项目

> 创建package.json文件

```javascript
npm init -y
```

> 创建tsconfig.json文件

```javascript
tsc init // 依赖全局安装typescript：npm i -g typescript
```

> 修改生成的tsconfig.json文件内容

```javascript
// 打开rootDir和outDir
"rootDir": "./src"
"outDir": "./bin"
```

#