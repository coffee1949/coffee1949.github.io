/**
 * 业务相关服务类
 */
import b from "./bussBase"
import {print} from "../utils/bsUtils"

export class BussService{

    constructor(){
        this.loginInfo = undefined
        this.sn = ''
        this.roleId = ''
        this.rawVehicleInfo = null  //原始车辆详情
        this.rawVehicleConfig = null //原始车辆配置
        this.vehicleList = []
        this.vehicleInfo = undefined
        this.vehicleConfig = undefined
    }

    /**
     * 登陆
     */
    async login(loginInfo){
        this.loginInfo = loginInfo
        let [err, res] = await b._login(loginInfo)
        if(res){
            print('login success', res)
            wx.setStorageSync("Nokey-userInfo", {
                signKey: res.data.signKey,
                unionId: res.data.unionId,
                openId: res.data.openId,
                tokenTimeOutTime: res.data.tokenTimeOutTime,
                "X-Ingeek-UserId": res.data.userId,
                "X-Ingeek-AccessToken": res.data.accessToken
            });
            wx.setStorageSync("Nokey-iot4g", {
                aliIotClientId: res.data.aliIotClientId,
                aliIotPassword: res.data.aliIotPassword,
                aliIotTopic: res.data.aliIotTopic,
                aliIotUsername: res.data.aliIotUsername,
                aliIotAddressList: res.data.aliIotAddressList
            });
        }
        return [err, res]
    }

    /**
     * 同步返回当前车辆详情
     * @returns 
     */
    getVehicleInfoSync(){
        return this.vehicleInfo
    }

    /**
     * 删除本地钥匙
     * @param {} sn
     */
    delKey(sn){
        if(this.vehicleInfo.sn != sn){
            return
        }
        let keyId = this.vehicleInfo.keyId
        let offlineKey = wx.getStorageSync('Nokey-offlineKey')
        offlineKey[keyId] = null
        wx.setStorageSync('Nokey-offlineKey', offlineKey)
        wx.removeStorageSync("Nokey-TRUSTKEY")
    }

    /**
     * 钥匙状态是否合法
     * @returns 
     */
    isKeyValid(){
        return (
            this.vehicleInfo &&
            this.vehicleInfo["keyStatus"] == 1 &&
            !this.vehicleInfo["isFreeze"]
          );
    }

     /**
     * 获取车辆详情（其实是获取当前钥匙信息）
     *@param vehicle {sn, roleId}
     */
    async getVehicleInfo(vehicle){
        /**
         * 按照目前的逻辑，获取车辆钥匙信息分三步
         * 1 获取用户的车辆（钥匙）列表
         * 2 遍历列表拿到用户选择的钥匙roleId,根据roleId去获取钥匙详情
         * 3 根据sn获取车辆配置信息
         * 这个逻辑如果做在sdk里面会有些问题
         */
        if(this.vehicleInfo){
            return this.vehicleInfo
        }
        print("获取车辆详情的参数：", vehicle)
        let [iErr, iRes] = await b._getVehicleInfo(vehicle.roleId)
        let [cErr, cRes] = await b._getVehicleConfig(vehicle.sn)
        print('iRes is: ', iRes)
        print('cRes is: ', cRes)
        if(iErr){
            iRes = undefined
        }
        if(!iErr && !cErr){
            let extra = {}
            let configMap = cRes.data.configMap
            if(configMap && configMap.length>0){
                configMap.forEach(element => {
                    switch(element.configType){
                        case 5: //智能解闭锁消息通知开关
                            extra.autoLockMessage = !!element.configValue
                        case 4:  //电动后尾门
                            extra.electricTrunkOpen = !!element.configValue
                            break
                        case 3:  //离车告警开关
                            extra.apartWarning = !!element.configValue
                            break
                        case 2:  //定位开关
                            extra.openLocation = !!element.configValue
                            break
                        case 1: //智能解闭锁
                            extra.autoLock = !!element.configValue
                            break
                    }
                })
                Object.assign(iRes, extra)
            }
        }
        this.vehicleInfo = iRes?.data
        return this.vehicleInfo
    }

    /**
     * 获取车辆列表
     */
     async getVehicleList(){
        let [err, res] = await b._getVehicleList()
        print('res is: ', res)
        this.vehicleList = res.data
        // wx.setStorageSync('cvehicle', JSON.stringify(res.data.data.mainList[0]))
        return this.vehicleList
    }

    /**
     * 获取车辆额外配置信息
     * configType 1-智能接闭锁开关, 2-定位开关, 3-离车告警开关,4-尾门控制开关,5-智能解闭锁消息通知开关
     */
    async getVehicleConfig(sn){
        if(!this.vehicleConfig){
            let [err, res] = await b._getVehicleConfig(sn)
            this.vehicleConfig = res.data
        }
        return this.vehicleConfig
    }

    /**
     * 更新车辆配置 configType 1-智能接闭锁开关, 2-定位开关, 3-离车告警开关,4-尾门控制开关,5-智能解闭锁消息通知开关
     * @param {*} config 
     * {
     *  configType: 1,
     *  configValue:1, 0：关闭 1：开启
     *  sn:'',
     *  timeout: 车控超时时间：1~8秒
     * }
     * 
     */
    async updateVehicleConfig(config){
        let [err, res] = await b._updateVehicleConfig(config)
    }

    /**
     * 判断用户是否登录
     */
    isLogin(){
        return true
    }





}
