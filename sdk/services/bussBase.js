import {Request} from '../utils/request'


/**
 * 去云端获取车辆信息
 * @param {string} roleId - 钥匙id
 * @returns 
 */
export function _getVehicleInfo(roleId){
    return Request({
        url: "/vehicle/wxm/v1/vehicleDetail",
        data: {
            roleId
        }
    })
}

//获取用户车辆列表信息
export function _getVehicleList(){
    return Request({
        url: "/vehicle/wxm/v1/vehicleMainPage",
        data: {
            //searchKey: "",
            pageNo: 1,
            pageSize: 60
          }
    })
}

/**
 * 去云端获取车辆配置
 * @param {string} sn 
 * @returns 
 */
export function _getVehicleConfig(sn){
    return Request({
        url: "/vehicle/wxm/v2/getVehicleConfig",
        data: {
            sn
        }
    })
}

/**
 * 更新车辆配置信息
 * @param {Object} config
 * * {
     *  configType: 1,
     *  configValue:1, 0：关闭 1：开启
     *  sn:'',
     *  timeout: 车控超时时间：1~8秒
     * }
 * @returns 
 */
export function _updateVehicleConfig(config){
    return Request({
        url: "/vehicle/wxm/v1/setVehicleConfig",
        data: config
    })
}

/**
 * //上报messageId到云端（车况返回状态同步）
 * @param {*} sn 
 * @param {*} messageId 
 * @returns 
 */
export function _stateDataAck(sn, messageId){
    return Request({
        url: "/mpaas/wxm/v1/vehicle/stateDataAck",
        data:{sn,messageId}
    })
}

/**
 * 更新车辆配置信息
 * @param {Object} loginInfo 
 * // loginInfo: {
        //     checkCode = '',
        //     clientSign = '',
        //     clientToken = '',
        //     selfUserId = ''
        // }
 * @returns 
 */
export function _login(loginInfo){
    let sysinfo = wx.getSystemInfoSync();
    let data = {
        brand: sysinfo.brand,
        model: sysinfo.model,
        system: sysinfo.system,
        modelIdentifier: '',
        checkCode: loginInfo.checkCode,
        clientSign: loginInfo.clientSign,
        clientToken: loginInfo.clientToken,
        selfUserId: loginInfo.selfUserId
      };
    return Request({
        url:"/authorize/openApi/v1/token/auto/login",
        data
    })
}

/**
 * 向云端获取车端在线状态
 * @param {string} sn 
 * @returns 
 */
export function _getVeicleOnlineStatus(sn){
    return Request({
        url: "/key/wxm/v1/iot/onlineStatus",
        data: {
            sn
        }
    })
}



/**
 * 通过4g拉取车况
 * @param {*} sn 
 */
export function _pullVehicleState(sn){
    return Request({
        url: "/key/wxm/v1/iot/stateData",
        data: {
            sn
        }
    })
}

/**
 * 向云端上报车端序列号
 * @param {*} sn 
 * @param {*} serialNumberHexStr 
 * @returns 
 */
export function _stateSerialNumberConfirm(sn, serialNumberHexStr){
    return Request({
        url: "/key/wxm/v1/iot/stateSerialNumberConfirm",
        data:{      
            sn,
            serialNumberHexStr
        }
    })
}

/**
 * 下载车钥匙
 * @param {*} sn 
 * @param {*} pkd base64的公钥 
 * @returns 
 */
export function _downloadKey(sn, pkd){
    return Request({
        url : "/key/wxm/v1/key/download",
        data:{
            sn,
            pkd
        }
    })
}

/**
 * 通过4g发送车控命令
 * @param {*} sn 
 * @param {*} commandName 
 * @param {*} commandValue 
 * @returns 
 */
export function _sendCommand(sn, commandName, commandValue){
    return Request({
        url: "/key/wxm/v1/iot/remoteCmd",
        data: {
            sn,
            commandName,
            commandValue
        }
    })
}

/**
 * 上传车端信息到云端
 * @param {*} data 
 * {
            sn,  //必填
            firmwareVersion,  //蓝牙固件版本号（非必填）
            vin,  //vin号（非必填）
            vehicleControlVersion  //车基固件版本号base64（非必填）
        }
 * @returns 
 */
export function _reportVersion(data){
    return Request({
        url: "/vehicle/wxm/v1/ota/reportVersion",
        data
    })
}

/**
 * 强制校准
 * @param {*} sn 
 * @param {*} random 
 * @returns 
 */
export function _rtcB2(sn,random){
    return Request({
        url: "/key/wxm/v1/key/search",
        data:{
            sn,
            random
        }
    })
}

/**
 * 异步校验rtc
 * @param {*} sn 
 * @param {*} random 
 * @param {*} rtcTime 
 * @returns 
 */
export function _rtcB3(sn, random, rtcTime){
    return Request({
        url: "/key/wxm/v2/rtc/search",
        data:{
            sn,
            random,
            rtcTime
        }
    })
}

export function _wxloginbyphone(){
    return Request({
        url: "/user/wxm/v2/quick/login",
        data: {

        }
    })
}






export default {
    _login,
    _getVehicleInfo,
    _getVehicleConfig,
    _getVehicleList,
    _updateVehicleConfig,
    _stateDataAck,
    _getVeicleOnlineStatus,
    _pullVehicleState,
    _stateSerialNumberConfirm,
    _downloadKey,
    _sendCommand,
    _reportVersion,
    _rtcB2,
    _rtcB3
}