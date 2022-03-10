/**
 * 当前文件包含业务中常用的工具方法
 */
import { BaseUrls } from "../configs/index.js";
import {parseLTV } from "./encodeUtils"

/**
 * 根据环境获取request请求地址
 * @param {*} env 
 * @returns 
 */
export function getBaseUrlByEnv(env){
  return BaseUrls[env] || ''
}

export function getFeatureExchange(res) {
  let rescon = res.slice(32).toUpperCase();
  if (rescon.indexOf("00FF") < 0) {
    return null
  }
  let ltv = rescon.split("00FF")[1].slice(2);
  let parseRtcArray = parseLTV(ltv);
  return parseRtcArray
}

//截流方法
export function Throttle(fn, interval) {
    var enterTime = 0,
      gapTime = interval || 1e3;
    return function () {
      var that = this,
        backTime = new Date;
      backTime - enterTime > gapTime && (fn.call(that, arguments), enterTime = backTime)
    }
  }
  //防抖方法
export function Debounce(fn, interval) {
    var timer, gapTime = interval || 1e3;
    return function () {
      clearTimeout(timer);
      var that = this,
        args = arguments;
      timer = setTimeout((function () {
        fn.call(that, args)
      }), gapTime)
    }
  }

  /**
   * 按照字母表顺序排列对象key值
   * @param {*} bodyObj 
   * @returns 
   */
  export function sortObject(bodyObj) {
    const orderBody = {};
    return Object.keys(bodyObj).sort().forEach((function (key) {
      orderBody[key] = bodyObj[key]
    })), orderBody
  }

  /**
   * 将参数对象转为url参数字符串
   * @param {*} obj - 参数对象
   * @returns 
   */
  export function getParamsStrFromObj(obj) {
    let paramsArray = [];
    for (var key in obj) paramsArray.push(key + "=" + obj[key]);
    return paramsArray.join("&")
  }

  /**
   * 判断一个变量是否是函数
   */
  export function isValidFun(fun){
    return fun && Object.prototype.toString.call(fun) === '[object Function]'
  }
  /**
   * 非正式环境打印出来
   */
  export function print() {
    let env = wx.getAccountInfoSync().miniProgram.envVersion
    env!='release' ? console.log(...arguments) : null;
  }

  /**
   * 
   * @param {Array} cbList - 回调函数数组或者单个函数
   * @param {*} params - 回调参数
   * @param {*} type - 执行类型 1-只执行一次 2-可重复执行
   */
  export function handleCallback(cbList, params, type=2){
    if(typeof cbList === 'function'){
      cbList = [cbList]
    }
    if(Array.isArray(cbList)){
      if(cbList.length > 0){
        if(type === 1){
          while(cbList.length>0){
            let cb = cbList.shift()
            isValidFun(cb) && cb(params)
          }
        }
        if(type === 2){
          for(let item of cbList){
            isValidFun(item) && item(params)
          }
        }
      }
    }
  }

  export const BUtils =  {
    getParamsStrFromObj,
    sortObject,
    isValidFun,
    getBaseUrlByEnv,
    print,
    getFeatureExchange,
    handleCallback
  }
