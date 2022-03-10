import { EncodeUtils } from "../utils/encodeUtils";
import { commandConfig, cmdCodes } from "../configs/cmdConfig"


export function getPreConditionByCmd(preConditionList, cmd){
  let cmdPreCondition = preConditionList.find(item=>item.commandAlias === cmd)
  if(cmdPreCondition&& cmdPreCondition.preconditionItemList){
    return cmdPreCondition.preconditionItemList
  }
  return []
}

export function getCommandConfig(cmd) {
  let result = {}
  let command = commandConfig[cmd]
  command && (result = JSON.parse(JSON.stringify(command)))
  return result
}

/**
 *  构造命令执行返回结果
 * @param {*} code 
 * @param {*} message 
 * @returns 
 */
export function buildCmdResult(code, message){
  return  {
    code,
    message: message || cmdCodes[code]
  }
}

/**
 * 
 * @param {*} cmd 命令
 * @param {*} cmdList 
 * [
 *  lock
    window
    skylight
    search
    ac_control
    temp_regulation
    engine
    remote_engine
    air_volumn_regulation
    trunk
    trunk_open
    power_liftgate
    air_conditioning
 * ]
 */
export function checkCmdEnable(cmd, cmdList){
  let result = {
      enable: true,
      message: ""
  }
  //针对尾门的配置
  if (cmd == "closeTrunk" && !cmdList.includes("trunk")) {
    result =  {
      enable: false,
      message: "不支持关闭尾门"
    }
  }
  return result
}

/**
 * @param {*} command - 车控命令
 * @param {*} vehicleState - 车况 
 * @param {Array} preCondition  - 车况前置条件
 * @returns 
 */
export function checkCmdPrecondition(command, vehicleState, preConditionArr) {
  let result = {
    flag: true,
    message: ""
  };
  if (!vehicleState || Object.keys(vehicleState).length < 1 || !command || preConditionArr.length<1) {
    return result
  }
  let compareObj = {
    doorClose: !vehicleState.door.value,
    doorOpen: vehicleState.door.value,
    trunkClose: !vehicleState.trunk.value,
    trunkOpen: vehicleState.trunk.value,
    engineOff: vehicleState.power.value === 'OFF' || vehicleState.power.value === 'ACC',
    engineOn: vehicleState.power.value === 'ON' || vehicleState.power.value === 'START',
    lock: vehicleState.lock.value,
    unlock: !vehicleState.lock.value,
    windowOpen: vehicleState.window.value,
    windowClose: !vehicleState.window.value,
    hoodOpen: vehicleState.hood.value,
    hoodClose: !vehicleState.hood.value
  };
  let message = "";
  for (let i = 0; i < preConditionArr.length; i++) {
    let key = preConditionArr[i].alias;
    if (!compareObj[key]) {
      message += " " + preConditionArr[i].discontent;
    }
  }
  if (message) {
    result = {
      flag: false,
      message: message
    };
  }
  return result;
}





/**
 * 车控结果映射成页面提示
 * @param {*} resultInt -- 车控分类
 * @param {*} reasonInt -- 车控状态
 * @returns 
 */
export function mapVehicleControlTip(resultInt, reasonInt) {
  let state = {
    0: {
      0: ""
    },
    1: {
      0: ""
    },
    2: {
      0: "条件不满足",
      1: "蓄电池电压不正常",
      2: "电源处于未退电状态",
      3: "车辆不处于设防状态",
      4: "门未关闭"
    },
    3: {
      0: "失败",
      1: "指令错误",
      2: "CAN通讯异常",
      3: "权限不满足",
      4: "认证失败",
      5: "等待执行中断",
      6: "指令太频繁"
    },
    4: {
      0: "已接收指令"
    },
    5: {
      0: "车辆状态已存在",
      1: "车门已上锁",
      2: "车门已解锁",
      3: "车窗已打开",
      4: "车窗已关闭",
      5: "后备箱已解锁",
      6: "车辆已启动",
      7: "车辆已熄火"
    },
    6: {
      0: "正在执行中",
      1: "车窗正在关闭",
      2: "车窗正在打开"
    }
  };
  return state[resultInt][reasonInt]
}


/**
 * 解析车控返回数据
 * @param {string} oristr - 车控执行返回字符串
 * @returns 
 */
export function parseVehicleControlRes(oristr) {
  let result = _getVehicleControlConfig()
  var targetStr = oristr.trim();
  for (var key in result) {
    let length = 0;
    if (key != "val") {
      length = result[key].length
    } else {
      length = result["len"].int
    }
    let value = targetStr.substring(0, length * 2);
    result[key].value = value;
    result[key].bitValue = EncodeUtils.str16ToBit(value);
    result[key].int = EncodeUtils.hex2int(value);
    targetStr = targetStr.substring(length * 2, targetStr.length)
  }
  return result
}

/**
* 获取车控配置信息
* @returns 
*/
function _getVehicleControlConfig() {
  return {
    Tag: {
      name: "Tag",
      length: 1,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    },
    Result: {
      name: "Result",
      length: 1,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    },
    Reason: {
      name: "Reason",
      length: 1,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    },
    Reserve: {
      name: "Reserve",
      length: 1,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    },
    len: {
      name: "len",
      length: 1,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    },
    val: {
      name: "val",
      length: null,
      value: null,
      bitValue: "",
      int: 0,
      mark: ""
    }
  };
}

export default {
    getCommandConfig,
    buildCmdResult, 
    parseVehicleControlRes, 
    mapVehicleControlTip, 
    checkCmdPrecondition, 
    getPreConditionByCmd
}