/**
 * 车控服务类 - vehicleControlService
 */

import { getCommandConfig, buildCmdResult, parseVehicleControlRes, mapVehicleControlTip, checkCmdPrecondition, getPreConditionByCmd } from './vcHelper'
import { isValidFun, print } from '../utils/bsUtils'
import { promisifiedShowModal } from '../utils/wxUtils'

export class VehicleControlService {
    constructor(emitter, connector, vsService, bsService) {

        this.commandList = [];  //车控命令集合
        this.cmdPreCondition = [];  // 车控命令依赖条件
        this.connector = connector || null;  //连接器
        this.emitter = emitter || null;
        this.beforeCmdActions = []; //发送命令前的操作集合
        this.isCmding = false; //是否有车控命令正在执行
        this.listeners = [];  //车控执行阶段监听（可以多个）
        this.vsService = vsService  //车况服务
        this.bsService = bsService
        this.cmdCallback = []  //车控执行回调函数（只能一次执行）
        this.cmdTimer = null  //车控执行定时器

        this.cmdConfig = null //当前车控命令对象
        this.emitter.on('SetTimer', this._handleCmdWrite.bind(this))
        this.emitter.on('HEXVC', this._handleHEXVC.bind(this))
    }

    setConnector(connector) {
        this.connector = connector
    }

    subscribe(fn) {
        this.listeners.push(fn)
    }

    /**
     * 设置车控命令集合
     * @param {Array}} cmdList 
     */
    setCmdList(cmdList) {
        this.commandList = cmdList
    }

    /**
     * 设置车控命令依赖条件
     */
    setCmdPreCondition(cmdPreCondition) {
        this.cmdPreCondition = cmdPreCondition
    }

    /**
     *  发送车控指令
     * {
                'sn': '',
                'cdm': '',
                'stageCode': 'start',
                'stageName': '开始发送车控',
                'stateCode': '301',
                'stateMessage': '正在执行车控，不可再次执行'
            }
     */
    async sendCommand(cmd, cb) {

        if (cb && isValidFun(cb)) {
            this.cmdCallback.push(cb)
        }
        //是否正在执行车控
        if (this.isCmding) {
            let result = buildCmdResult(302)
            if (this.cmdCallback.length > 0) {
                this.cmdCallback.pop()(result)
            }
        }
        // 1 是否登录
        if (!this.bsService.isLogin()) {
            this._handleCmdResult('301')
            return
        }
        // 2 是否已连接成功
        if (!this.connector.isVehicleConnected()) {
            this._handleCmdResult('303')
            return
        }

        let vehicleState = this.vsService.getVehicleState()
        // 3 当前车况是否满足条件
        if (vehicleState?.isTraveling?.value) {
            this._handleCmdResult('404', '行驶中无法控制车辆')
            return
        }
        if (vehicleState?.isLocalModel?.value) {
            this._handleCmdResult('404', '本地模式无法控制车辆')
            return
        }
        //打开后尾门进行提示(只有在4g模式下才提示)
        if (cmd === "openTrunk" && !vehicleState['electricTrunkOpen'] && !this.connector.isBleConnected) {
            let result = await promisifiedShowModal({
                cancelText: '取消',
                confirmText: '开启',
                content: '远程开启尾门后将无法远程关闭，是否确定开启?',
                showCancel: true,
                title: '提示'
            })
            if (!result.confirm) {
                this._handleCmdResult('404', '取消执行')
                return
            }
        }
        //let vechicleInfo = this.bsService.getVehicleInfoSync()
        print("命令前置条件有:", this.cmdPreCondition)
        // 4 前置条件
        let isPreOk = checkCmdPrecondition(cmd, vehicleState, getPreConditionByCmd(this.cmdPreCondition, cmd))
        if (!isPreOk.flag) {
            this._handleCmdResult('404', `请先${isPreOk.message}再试`)
            return
        }
        let cmdConfig = getCommandConfig(cmd)
        this.cmdConfig = cmdConfig
        if (Object.keys(cmdConfig).length < 1) {
            this._handleCmdResult('304')
            return
        }
        //不支持关尾门（貌似车控菜单根本就不会有关尾门）
        if (cmd === "closeTrunk" && !this.commandList.includes("trunk")) {
            this._handleCmdResult('304')
            return
        }
        this.isCmding = true
        this.connector.sendCommand(cmdConfig)
        // }
    }
    /**
     * 当uri版本是04的时候，需要设定定时器
     * @param {*} command 
     */
    _handleCmdWrite(command) {
        //设置车控命令返回结果定时器
        let minTime = command.minWaitingTime
        let maxTime = command.maxWaitingTime
        this.cmdTimer = setTimeout(() => {
            if (this._checkCmdResult(command)) {
                this._handleCmdResult('200')
            } else {
                setTimeout(() => {
                    if (this._checkCmdResult(command)) {
                        this._handleCmdResult('200')
                    } else {
                        this._handleCmdResult('501')
                    }
                }, maxTime - minTime)
            }
        }, minTime)
    }

    /**
     * 处理车端返回的车控响应
     * @param {*} HEXVC 
     */
    _handleHEXVC(HEXVC) {
        let result = parseVehicleControlRes(HEXVC)
        print("车控执行返回结果 ", result)
        let message = mapVehicleControlTip(result.Result.int, result.Reason.int)

        //this._handleCmdResult(601, message)
    }

    /**
     * 当车控uri是04的时候，需要通过判定返回的车况是否满足车控执行结果要求来确定车控执行是否成功
     * @returns 
     */
    _checkCmdResult(command) {
        print("开始匹配结果", command)
        if (!command) {
            return true;
        }
        let { vehicleConditionData_key, vehicleConditionData_val, needCarData } = command
        if (!needCarData || !vehicleConditionData_key) {
            return true;
        }
        let vehicleState = this.vsService.getVehicleState()
        if (!vehicleState || Object.keys(vehicleState).length < 1) {
            return false;
        }
        print("当前车况为：", vehicleState)
        let flag = vehicleState[vehicleConditionData_key].value == vehicleConditionData_val;
        print("是否匹配结果", flag)
        return flag;
    }

    /**
     * 处理车况执行状态
     * @param {*} code 
     * @param {*} message 
     */
    _handleCmdResult(code, message) {
        // 重置正在执行状态
        this.isCmding = false
        this.cmdTimer = null
        //执行回调
        let result = buildCmdResult(code, message)
        print('执行车控结果', code, message)
        if (this.cmdCallback.length > 0) {
            this.cmdCallback.pop()(result)
        }
    }

}