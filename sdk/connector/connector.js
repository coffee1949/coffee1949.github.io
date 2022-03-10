/**
 * 连接管理类
 * 1 当前类会负责建立连接信道，包括4g和蓝牙，并决定建立通信信道的策略
 * 2 维护通信信道的稳定
 * 3 对上下层通信信息进行封装和加工
 */

import { _pullVehicleState, _downloadKey } from '../services/bussBase'
import { parseLTV, getRasKey } from '../utils/encodeUtils'
import BLEHandler from "./ble/bleHandle"
import Carriers from "./carriers/carrierHandle"
import { print, handleCallback } from '../utils/bsUtils'
import { AutoRetryErrors, BleCodes, BleConnectErrCode, CarrierCodes, CarrierConnectErrCode } from '../configs/statusCodeCfg'

export class Connector {
    /**
     * 
     * @param {*} vehicleInfo {
        sn: 'ddd',
        macAddress: 'ddfesfs',
        keyId: 'ddddd'

     * }
     * 
     * @param {*} emitter 
     */
    constructor(emitter, vehicleInfo) {
        print('in connector params are: ', vehicleInfo)
        this.sn = ''
        this.emitter = emitter
        this.ble = null  //蓝牙连接器
        this.carriers = null  //4g连接器
        this.uri = [0x00, 0x04] //
        this.bleListener = []  //蓝牙连接监听
        this.fourGListner = []  //4g连接状态监听
        this.connectCallback = []  // 连接车辆回调

        //this.channels = ['vs', 'connect']
        this.vehicleInfo = null //车辆信息，包含sn、是否支持4g等

        this.isBleConnected = false //车端是否连接上蓝牙

        this.isSupport4g = true   //是否支持4g，非单蓝牙版本
        this.is4gConnected = false  //车端是否连接上4g（车端是否4g在线）
        this.mqttConfig = null  //mqtt的配置信息

        this.emitter.on('bleChannel', this._handleBleChannel.bind(this))
        this.emitter.on('4gChannel', this._handle4gChannel.bind(this))

        this.isKeyOvertime = false //钥匙是否过期

        this.connectTime = 0 //蓝牙重连次数
        this.maxConnectTime = 3 //蓝牙最大重连次数
        this.repeater = null

        if (vehicleInfo) {
            this.init(vehicleInfo)
        }
    }

    /**
     * 初始化连接
     * @param {*} vehicleInfo {
        sn: 'ddd',
        macAddress: 'ddfesfs',
        keyId: 'ddddd'
     * }
     */
    init(vehicleInfo) {
        this.vehicleInfo = vehicleInfo //车辆信息，包含sn、是否支持4g等
        this.sn = vehicleInfo.sn
        this.ble = new BLEHandler(this.emitter, vehicleInfo)
        this.carriers = new Carriers(vehicleInfo.sn, this.emitter)
    }

    /**
     * 
     * @returns 是否已经连接上车辆
     */
    isVehicleConnected() {
        print('判断当前连车状态：', this.is4gConnected, this.isBleConnected)
        return this.is4gConnected || this.isBleConnected
    }

    /**
     * 订阅连接状态
     * @param {string} topic 
     * @param {*} fn 
     */
    subscribe(topic, fn) {
        if (topic === 'ble') {
            this.bleListener.push(fn)
        }
        if (topic === '4g') {
            this.fourGListner.push(fn)
        }
    }



    /**
     * 建立连接判断通过什么渠道
     * @param {*} cb 
     * @param {*} channel ble-蓝牙 4g-4g通道
     */
    async connect(cb, channel) {
        //先注册回调函数
        this.connectCallback.push(cb)
        if (!channel || "4g" === channel) {
            if (this.isSupport4g) {
                //获取mqtt配置
                //this.mqttConfig = await this._getMqttConfig();
                this.carriers.connect(this.mqttConfig)
            }
        }
        if (!channel || "ble" === channel) {
            let bleData = {
                keyId: this.vehicleInfo.keyId,
                sn: this.sn
            }
            //判断蓝牙设备是否打开对应权限
            let authed = await this._handleAuthorization()
            if (authed) {
                this._connectBle(bleData)
            }
            this.repeater = setInterval(() => {
                if(!this.isBleConnected){
                    this._connectBle(bleData)
                }
            }, 10 * 1000)
        }
        if (channel && ["ble", "4g"].indexOf(channel) < 0) {
            handleCallback(this.connectCallback, {
                code: 201,
                message: "连接渠道错误"
            })
        }
    }

    //处理蓝牙和定位设备打开和授权情况
    async _handleAuthorization() {
        let systemInfo = wx.getSystemInfoSync()
        let platform = systemInfo.platform
        let status = null
        if (false === systemInfo.bluetoothEnabled) {
            status = {
                type: "connect",
                code: 1004,
                message: "蓝牙未开启"
            }
        }
        if (platform === 'android') {
            if (false === systemInfo.locationEnabled) {
                status = {
                    type: "connect",
                    code: 1006,
                    message: "定位未开启"
                }
            }
            if (false === systemInfo.locationAuthorized) {
                status = {
                    type: "connect",
                    code: 1007,
                    message: "定位未授权"
                }
            }
        }
        if ("ios" === platform && false === systemInfo.bluetoothAuthorized) {
            status = {
                type: "connect",
                code: 1005,
                message: "蓝牙未授权"
            }
        }
        print("当前蓝牙状态：", status)
        if (status) {
            handleCallback(this.bleListener, status)
            handleCallback(this.connectCallback, {
                code: 201,
                message: status.message
            })
            return false
        }
        return true
    }

    //连接蓝牙
    async _connectBle(bleData) {
        //1 处理车钥匙逻辑
        await this._handleKey(bleData)
        // 2 监听蓝牙连接状态变更/连接蓝牙
        await this.ble.initBle()

    }
    /**
     * 处理钥匙相关
     * @param {*} bleData 
     * @param {*} forceDownload - 是否强制下载
     * @returns 
     */
    async _handleKey(bleData, forceDownload) {
        print("处理钥匙相关逻辑")
        let offlineKeyStorage = wx.getStorageSync('Nokey-offlineKey') || {};
        //先从本地存储中拿钥匙
        let keyObj = offlineKeyStorage[bleData.keyId];
        //本地存储不存在，从云端下载钥匙
        if (!keyObj || forceDownload) {
            let pkgObj = getRasKey()
            print('my pkb is:', pkgObj)
            let pkd = pkgObj.publicKeyBase64
            let [err, res] = await _downloadKey(bleData.sn, pkd)
            if (res) {
                keyObj = res.data
                print("云端下载钥匙：", keyObj)
            } else {
                return
            }
        }
        //解析出16进制字符串
        let hexStr = wx.CryptoJS.enc.Base64.parse(keyObj.keyMetaData).toString()
        //从16进制中解析LTV
        let parsedKeyArr = parseLTV(hexStr)
        //拿到钥匙过期时间
        let keyEndDateTime = parseInt("0x" + parsedKeyArr[2].value) * 1000;
        //设置钥匙是否过期状态
        this.isKeyOvertime = keyEndDateTime < new Date().getTime()
        wx.setStorageSync("Nokey-TRUSTKEY", hexStr);

        //设置离线存储
        let keyData = {
            keyMetaData: keyObj.keyMetaData,
            sn: bleData.sn
        };
        let key = parsedKeyArr[0].value;
        offlineKeyStorage[key] = keyData;
        wx.setStorageSync('Nokey-offlineKey', offlineKeyStorage);
    }

    setVehicleInfo(vehicleInfo) {
        print('set vehicleInfo in connector: ', vehicleInfo)
        this.vehicleInfo = vehicleInfo
        this.isSupport4g = vehicleInfo.hardwareType
        this.sn = vehicleInfo.sn
    }

    connectMqtt(mqttConfig) {
        this.carriers.connect(mqttConfig)
    }

    _handleBleError() {
        this.ble.initBle()
    }

    _handleBleChannel(res) {
        //连接类型
        if (res.type === 'connect') {
            //如果是需要自动重连的错误
            // if (AutoRetryErrors.indexOf(res.code) > -1) {
            //     if (this.connectTime < this.maxConnectTime) {
            //         this.connectTime++
            //         print(`开始第${this.connectTime}次蓝牙重连接`)
            //         this._connectBle({
            //             keyId: this.vehicleInfo.keyId,
            //             sn: this.sn
            //         })
            //         return
            //     }
            // }
            //执行订阅蓝牙连接的回调
            handleCallback(this.bleListener, res)
            //连接发生错误
            if (BleConnectErrCode.indexOf(res.code) > -1) {
                handleCallback(this.connectCallback, {
                    code: 201,
                    message: BleCodes[res.code]
                })
            }
            switch (res.code) {
                case 1902: //认证成功
                    print("认证成功，设置isBleConnected为true")
                    this.isBleConnected = true
                    // clearInterval(this.repeater)
                    // this.repeater = null  //清空定时器
                    handleCallback(this.connectCallback, {
                        code: 200,
                        message: BleCodes[res.code]
                    })
                    break
                case 1314:  //蓝牙断开连接
                    this.isBleConnected = false
                    break
                case 1104:  //关闭蓝牙适配器
                    this.isBleConnected = false
                    break
                case 1101: //重新打开蓝牙适配器
                    if (!this.isBleConnected) {
                        this.ble.initBle()
                    }

            }
        }
        if (res.type === 'info') {
            //车况返回
            if (res.code === 2100) {
                this.emitter.emit('HEXVS', res.data)
            }
            if (res.code === 2206) {
                // if (this.uri == [0x00, 0x04]) {
                //     this.emitter.emit('SetTimer', res.data)
                // }
                this.emitter.emit('SetTimer', res.data)
            }
            //设置uri
            if (res.code === 2301) {
                this.uri = res.data
            }
            //车控结果返回
            if (res.code === 2303) {
                this.emitter.emit('HEXVC', res.data)
            }
        }
    }

    async _handle4gChannel(res) {
        if (res.type === 'vs') {
            print("4g接收到16进制车况", res.data)
            this.emitter.emit('HEXVS', res.data)
        }
        if (res.type === 'connect') {
            this.fourGListner.forEach(item => {
                item(res)
            })
            //返回连接阶段数据
            let code = res?.code
            if (code === 2209) {
                print("设置4g是否已经连接车辆：", res.data)
                this.is4gConnected = !!res.data.status
                //如果车端在线
                if (res.data.status == 1) {
                    //主动拉取车况
                    _pullVehicleState(this.sn)
                }
            }
            if (code === 2208) {
                this.emitter.emit('SetTimer', res.data)
            }
            if (CarrierConnectErrCode.indexOf(code) > -1) {
                handleCallback(this.connectCallback, {
                    code: 201,
                    message: CarrierCodes[res.code]
                })
            }
        }
        //上下线推送消息
        if (res.type === 'status') {
            print("4g接收的上下线消息")
        }

    }

    removeListen() {
        // 移除所有蓝牙事件
        this.emitter.removeAllListeners("bleChannel")
        //移除4g渠道监听事件
        this.emitter.removeAllListeners("4gChannel")
    }

    /**
     * 关闭连接
     */
    closeConnection() {
        this.removeListen()
        this.ble.closeBLEConnection()
        this.ble.closeBLEAdapter()
        if (this.carriers.client) {
            this.carriers.client.end(true)
        }
    }


    /**
     * 
     * @param {*} command - 组装好的命令数据
     * @returns 
     */
    sendCommand(command) {

        //如果已经连接上蓝牙
        if (this.isBleConnected) {
            this.ble.sendCommand(command, this.uri)
        } else {
            this.carriers.sendCommand(command)
        }
    }


    getBleData(key) {
        // 这里是一个多态，1，不传递key，返回整个对象，2.传递数组key，返回命中的key对象，3传递单值key，命中返回值，不命中返回整个对象
        // 这里暴露一些蓝牙设置的属性，方便外部调用，传递key，数组
        const defaultData = {
            sn: this.sn
            // todo这里增加数据
        }
        var resArr
        let type = Object.prototype.toString.call(key)
        if (!key || !this[key]) {
            resArr = defaultData
        } else if (type === '[object String]') {
            resArr = this[key]
        } else if (type === '[object Array]') { }

    }

}

