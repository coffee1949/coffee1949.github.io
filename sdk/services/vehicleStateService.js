/**
 * 车况服务类 VSS - vehicleStateService
 */

import _t  from "./vsHelper"
import { print } from "../utils/bsUtils"
import {_stateSerialNumberConfirm} from "../services/bussBase"
export class VehicleStateService{
    /**
     * 车况相关配置信息
     * @param {Array} vsCfg - vehicleStateConfig
     */
    constructor(emitter){
        this.listeners = []
        this.vehicleState = wx.getStorageSync('offLineVehicleConditionData') || {} //最终返回的业务方需要的车况
        this.vehicleStateConfig = null  //车况配置信息 参照RawVehicleState
        this.lastRawVehicleState = null  //未解析成业务车况的车况数据
        this.emitter = emitter || null
        this.vehicleInfo = null
        this.emitter.on('HEXVS', this._handleVehicleState.bind(this))
    }

    subscribe(fn){
        this.listeners.push(fn)
    }

    clearAllListners(){
        this.listeners = []
    }
    setVehicleInfo(vehicleInfo){
        this.vehicleInfo = vehicleInfo
    }

    /**
     * 
     * @returns 
     */
    getVehicleState(){
        return this.vehicleState
    }


    /**
     * 暴露给外部的设置车况配置信息接口
     * @param {*} vehicleStateConfig 
     */
    setVehicleStateConfig(vsCfg){
        print("车况配置设置vsCfg is",vsCfg)
        this.vehicleStateConfig = vsCfg
    }
    /**
     * 处理车况
     * 1 解析16进制车况数据
     * 2 判断车况数据是否合法（主要是因为蓝牙和4g都会返回同样的sequence的车况）
     * 3 将车况数据解析成业务方需要格式
     * 4 设置离线车况（是否需要）- 不需要，应该放到controller层来做
     * @param {*} rawState - 16进制车况数据（来自蓝牙或者4g）
     */
    _handleVehicleState(rawState){
        print('开始处理16进制车况，接收到16进制车况：', rawState)
        //将16进制车况解析成车况对象
        let rawVehicleState = _t.parseVehicleStateFromHex(rawState)
        print('接收到车况，初步解析：', JSON.stringify(rawVehicleState))
        let lastSequenceNO= this.lastRawVehicleState?.sequenceNO?.value || "0000";
        print('上一次接收到的车况', JSON.stringify(this.lastRawVehicleState))
        let newSequenceNO=rawVehicleState?.sequenceNO?.value;
        print("新接收的车况序列号为：", newSequenceNO)
        if(newSequenceNO=="0000"||newSequenceNO=="ffff"){
            //上报车况序列号给云端
            _stateSerialNumberConfirm(this.vehicleInfo.sn, newSequenceNO)
        }
        //判断当前车况是否合法，有个蓝牙版本的判断，
        if(newSequenceNO=="0000"||!newSequenceNO|| parseInt("0x"+newSequenceNO)>parseInt("0x"+lastSequenceNO)){
            print("开始处理合法车况")
            this.lastRawVehicleState = rawVehicleState
            this.vehicleState = _t.assembleVehicleState(this.vehicleStateConfig, rawVehicleState)
            console.log("组装好的车况数据为：", this.vehicleState)
            this.listeners.forEach(item=>item(this.vehicleState))
            //this.emitter.emit('VS', this.vehicleState)
        }else{
            print("接收到重复车况")
        }
    }
}