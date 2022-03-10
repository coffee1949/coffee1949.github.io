/**
 * 当前文件放置基于微信api封装的工具类
 */
 import { getUuid } from "./encodeUtils";

 //判断当前是否是登陆状态
 export function isLogin(){
       userInfo = wx.getStorageSync("Nokey-userInfo"),
       flag = !1;
     return userInfo && userInfo.tokenTimeOutTime > (new Date).getTime() && (flag = !0), flag
 }

 export function isIos(){
    let systemInfo = wx.getSystemInfoSync()
    return systemInfo.platform === 'ios'
 }
 export function isAndriod(){
  let systemInfo = wx.getSystemInfoSync()
    return systemInfo.platform === 'android'
 }
 
 //设置银基自定义的deviceId
 export function getIngeekDeviceId() {
   let deviceId = wx.getStorageSync("X-Ingeek-DeviceId")
   if (!deviceId) {
     deviceId = getUuid()
     wx.setStorageSync("X-Ingeek-DeviceId", deviceId)
   }
   return deviceId
 }
 
 /**
  * 通过微信接口获取设备型号，新机型刚推出一段时间会显示unknown，微信会尽快进行适配
  * 当前方法 iPhone 6s Plus<iPhone8,2>会拿到尖括号内的内容，预计会有问题
  * @returns 
  */
 export function getModelIphone(){
   let modestr =wx.getSystemInfoSync().model;
   try{
     let modeArr = modestr.match(/\<([^)]*)\>/);
     return modeArr instanceof Array ?modeArr[1]:null;
   }catch(e){
     console.log(e)
     return null;
   }
 }
 

 /**
  * promise化的
  * @param {Object} params 
  * { cancelText = '取消',
      confirmText = '确定',
      content = '',
      showCancel = true,
      title = '提示'
    }
  */
 export function promisifiedShowModal(params){
    let info = Object.assign({
      cancelText :'取消',
      confirmText :'确定',
      content :'',
      showCancel : true,
      title : '提示'
    },params)
    return promisify(wx.showModal, info)
 }

 /**
 * 对微信接口的promise封装
 * @param {function} fn 
 * @param {object} args 
 */
export function promisify(fn, args) {
  return new Promise((resolve, reject) => {
      fn({
          ...(args || {}),
          success: (res) => resolve(res),
          fail: (err) => reject(err),
      });
  });
}
