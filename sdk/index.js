/**
 * 车况车控整体逻辑控制类，sdk总控类
 * 当前类是sdk的主控类，负责车控服务、车况服务、连接服务、业务服务的管理，并提供对外接口进行一系列操作
 * 1 建立蓝牙连接/4g连接
 * 2 配置资源给到对应的服务
 * 3 对业务方提供需要的数据
 *
 *
 * 使用方法：
 * 1 业务小程序登录
 * 2 业务小程序获取车辆列表
 * 3 用户选择车辆
 * 4 创建当前对象，并传入用户token和车辆sn  -let vController =  new VController({token,sn})
 * 5 初始化 vController.init() - 获取车辆配置数据
 * 6 订阅车况/车控返回
 * 7 连接蓝牙或4g，并监听连接生命周期
 * 8 发送车控指令
 *
 *
 *
 * 用户端关注的车况返回种类
 * 1 所有的车况返回
 * 关注的车控执行阶段和结果
 * 1 车控执行阶段
 * 2 车控执行结果
 * 关注的蓝牙和4g连接阶段和结果
 * 1 蓝牙和4g的连接结果
 * 2 蓝牙和4g的连接阶段
 *
 * todo
 * 1 异常状态处理 done
 * 2 打点
 * 3 destroy操作 done
 * 4 初始化时候先重置操作 done
 * 5 打包优化（压缩/混淆）
 * 6 重写通信协议组装方法(dataAssemble)
 * 7 参考app的token过期文档
 * 8 钥匙的管理规则
 */
import "./libs/crypto-js"; // wx.CryptoJS


import { BussService } from "./services/bussService";
import { VehicleControlService } from "./services/vehicleControlService";
import { VehicleStateService } from "./services/vehicleStateService";
import { Connector } from "./connector/connector";
import { isValidFun, print , handleCallback} from "./utils/bsUtils";
import { EventEmitter2 } from "eventemitter2";
import { getRasKey } from "./utils/encodeUtils"

//var EventEmitter2 = require('eventemitter2');


class NokeySdk {
    /**
     * 必须传vehicle
     * @param vehicle   {sn:'aaa',vin:'bbb','roleId':'12345abc'}
     */
    constructor(vehicle) {
        this.vehicle = vehicle
        this._init();
    }

    _init() {
        this.emitter = new EventEmitter2();
        this.connector = new Connector(this.emitter)  //连接器
        this.vcListener = null
        this.bsListener = []

        this.bsService = new BussService()  //业务服务
        this.vsService = new VehicleStateService(this.emitter)
        this.vcService = new VehicleControlService(this.emitter, this.connector, this.vsService, this.bsService)
        this.emitter.on("info", this._handleBussInfo.bind(this))
    }

    /**
     * 处理业务回调
     * @param {*} res 
     */
    _handleBussInfo(res){
        if(res.code === 403){
            handleCallback(this.bsListener, res)
        }
    }

    /**
     * 业务方需要连接车辆
     * @param {obj} cb  function
     * {
        sn,
        roleId
      }
      channel ble-蓝牙 4g-4g通道
     */
    async connectVehicle(cb, channel) {
        print("SDK: Start connectVehicle, vehicle info is: ")

        //生成公私密钥
        getRasKey()

        //获取车辆基本信息
        let vehicleInfo = await this.bsService.getVehicleInfo(this.vehicle);
        if (!vehicleInfo) {
            cb({
                code: 201,
                message: "获取车辆信息失败"
            });
            return
        }
        try {
            this.vehicleInfo = vehicleInfo;
            //将需要的数据设置到对应的服务中
            this.vsService.setVehicleStateConfig(
                JSON.parse(vehicleInfo.vehicleStatusData).data[0].vehicleStatus.items
            );
            this.vcService.setCmdList(vehicleInfo.vehicleCtrlCmdList);
            print("SDK 车控前置条件有：", vehicleInfo.commandPreconditionList)
            this.vcService.setCmdPreCondition(
                JSON.parse(vehicleInfo.commandPreconditionList)
            );
            this.vsService.setVehicleInfo(this.vehicleInfo)
            let connectParm = {
                sn: this.vehicleInfo.sn,
                macAddress: this.vehicleInfo.macAddress,
                keyId: this.vehicleInfo.keyId
            }
            this.connector.init(connectParm); //连接器
            this.vcService.setConnector(this.connector);
            this.connector.setVehicleInfo(vehicleInfo);
        } catch (error) {
            cb({
                code: 201,
                message: "信息初始化失败"
            });
        }
        if (!this.bsService.isKeyValid()) {
            cb({
                code: 201,
                message: "当前钥匙不合法"
            });
            return
        }
        //初始化连接器
        await this.connector.connect(cb, channel);
    }


    /**
     * 获取可执行的命令列表
     */
    getCommandList() {
        print('SDK getCommandList')
        return this.bsService.getCommandList(this.vehicle.sn)
    }

    /**
     * 订阅消息
     * @param {*} topic - VS- 车况， ble-蓝牙连接情况， 4g-4g连接情况
     * @param {*} fn
     */
    subscribe(topic, fn) {
        print('SDK subscribe', topic)
        if (fn && isValidFun(fn)) {
            if (topic === "VS") {
                this.vsService.subscribe(fn);
            } else if(topic === "info"){
                this.bsListener.push(fn)
            }else {
                this.connector.subscribe(topic, fn);
            }
        }
    }

    /**
     * 发送车控指令
     * [
     *  lock - 车辆锁定
     *  unlock - 车辆解锁
     *  closeWindow - 关闭窗户
     *  openWindow - 开窗
     *  search - 寻车
     *  closeTrunk - 关闭后尾门
     *  openTrunk - 打开后尾门
     *  stopEngine - 关闭引擎
     *  startEngine - 启动引擎
     *  refrush - 刷新
     * ]
     * callback-调用车控命令回调，回调中会返回车控命令执行状态
     * commandRes = {
        'code': '302',
        'message': '正在执行车控，不可再次执行'
    }
     */
    /**
     * code定义  3xx- 基础条件不满足 ，4xx - 车况情况不允许（前置条件不满足）
     * 200 - 执行成功
     * 301 - 用户未登录
     * 302 - 正在执行车控，不可再次执行
     * 303 - 未连接车辆
     * 404 - 车况情况不允许执行（本地模式/当前车控前置车况不满足等）
     * 500 - 其他错误
     */
    sendCommand(cmd, cb) {
        print('SDK：sending Command', cmd)
        this.vcService.sendCommand(cmd, cb)
    }


    /**
     * 是否已连上车端（4g或者蓝牙都ok）
     */
    hasVehicleConnected() {
        return this.connector.isBleConnected || this.connector.is4gConnected
    }

    /**
     * 登陆
     * res {
        code : 200-登录成功/201-登录失败
        data: err
     * }
     */
    async login(loginInfo, cb) {
        print('SDK: start login', loginInfo)
        let [err, res] = await this.bsService.login(loginInfo);
        if (err) {
            cb({
                code: 201,
                data: err
            })
        } else {
            cb({
                code: 200
            })
        }
    }

    async loginSync(loginInfo) {
        print('SDK: start loginSync', loginInfo)
        let [err, res] = await this.bsService.login(loginInfo);
        if (err) {
            return {
                code: 201,
                data: err
            }
        } else {
            return {
                code: 200
            }
        }
    }

    /**
     * 获取车辆详情
     * @param {*} vehicle
     {
    roleId: '',
    sn:''
  }
     * @returns
     */
    getVehicleInfo() {
        print('SDK: getVehicleInfo is: ')
        return this.bsService.getVehicleInfo(this.vehicle);
    }

    /**
     * 获取车辆列表
     */
    getVehicleList() {
        return this.bsService.getVehicleList();
    }



    /**
     * 获取车辆配置
     */
    getVehicleConfig() {
        return this.bsService.vehicleConfig
    }

    /**
     *
     * @param {*} config
     */
    updateVehicleConfig(config) {
    }

    /**
     * 主动请求车况
     */
    askForVehicleState() {
        print('SDK: askForVehicleState')
    }

    /**
     * 业务方主动要求删除钥匙（断开车辆连接）
     */
    delKey() {
        print('SDK delKey')
        this.bsService.delKey(this.vehicle.sn)
    }

    /**
     * 清理旧数据，断开蓝牙和4g连接
     * @param {*} sn
     */
    destroy() {
        //关闭连接
        this.connector.closeConnection()
        //删除钥匙
        this.delKey()
        //todo 清空缓存信息

    }
}

export default NokeySdk
