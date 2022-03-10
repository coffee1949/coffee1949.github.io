
import { BUtils } from "./bsUtils";

export var logs = {
    /**
     * 埋点上报事件，会往微信和日志系统各报一份
     * @param {sting} params 
     */
    info(params) {
      if(wx.getAccountInfoSync().miniProgram.envVersion === 'release'){
        try{
            var logwx = wx.getRealtimeLogManager();
            logwx&&logwx.info(params);
        }catch(err){}
        
        let url =`https://xplan.cn-shanghai.log.aliyuncs.com/logstores/xplan-wechat/track?APIVersion=0.6.0&'${_getParamsStr(params)}`;
        wx.request({
            url: url,
            method: "get",
            data: {},
            success: res => {
            },
            fail:error=>{
            }
          })
      }else{
        console.log(params)
      }
      
    },
  }

  /**
   * 获取移动端环境和手机型号
   * @returns 
   */
function _getDeviceInfo() {
  let deviceinfo = wx.getSystemInfoSync();
  return deviceinfo.system + "/" + deviceinfo.model
}

/**
 * 获取当前运行环境
 * @returns 
 */
function _getEnv() {
  let curEnv =wx.getStorageSync("env")||wx.getAccountInfoSync().miniProgram.envVersion;
  return ("release" == curEnv) ? "P" :(("trial" == curEnv)? "U" : ('pre-release'==curEnv?'PR':'T'));
}
/**
 * 获取日志环境数据参数字符串
 * @param {*} args 
 * @returns 
 */
function _getParamsStr(args) {
    let LogsObj = {
        u: wx.getStorageSync("Nokey-userInfo")["X-Ingeek-UserId"],
        m: wx.getStorageSync("Nokey-userInfo").mobile,
        d: wx.getStorageSync("X-Ingeek-DeviceId"),
        e: _getEnv(),
        sn: wx.getStorageSync("historysn"),
        sv: wx.getSystemInfoSync().SDKVersion,
        av: wx.getAccountInfoSync().miniProgram.version,
        p: wx.getSystemInfoSync().platform,
        di: _getDeviceInfo(),
        t: new Date().getTime(),
        msg:args
      };
    let paramsStr = BUtils.getParamsStrFromObj(LogsObj)
    return encodeURI(paramsStr)
}
