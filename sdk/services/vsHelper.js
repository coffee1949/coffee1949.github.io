import { EncodeUtils } from "../utils/encodeUtils";
import {evals} from "../libs/eval"

/**
 * 把16进制字符串车况数据按照配置模版解析出来
 * @param {*} stateStr - 16进制车况字符串
 * @returns rawVehicleStateStructure- 原始车况对象
 */
 export function parseVehicleStateFromHex(stateStr) {
    var targetStr = stateStr.trim();
    let rawVehicleStateStructure = _getRawVehicleStateStructure()
    for (var key in rawVehicleStateStructure) {
      let length = rawVehicleStateStructure[key].length;
      let value = targetStr.substring(0, length * 2);
      rawVehicleStateStructure[key].value = value;
      rawVehicleStateStructure[key].bitValue = EncodeUtils.str16ToBit(value);
      if (!rawVehicleStateStructure[key].range || rawVehicleStateStructure[key].range[0] <= parseInt("0x" + value) && parseInt("0x" + value) <= rawVehicleStateStructure[key].range[1]) {
        rawVehicleStateStructure[key].int = EncodeUtils.hex2int(value) || 0;
        rawVehicleStateStructure[key].float = parseFloat(EncodeUtils.hex2int(value)).toFixed(1) || 0.0
      } else {
        rawVehicleStateStructure[key].int = null;
        rawVehicleStateStructure[key].float = null
      }
      targetStr = targetStr.substring(length * 2, targetStr.length)
    }
    return rawVehicleStateStructure
}
 /**
     * 组装成业务方需要的车况数据格式,参见 
     * @param {*} vehicleStateConfig 参见 interface.ts中vehicleStateConfig.vehicleStatus.items
     * @param {*} rawVehicleState 参见 vsHelper中 _getRawVehicleStateStructure
     * @returns vehicleState - 业务方所需的车况格式，包含的车况信息有：
     {
        frontLeftDoor, //左前车门
        frontRightDoor, //右前车门
        rearLeftDoor
        rearRightDoor
        frontLeftLock
        frontRightLock
        rearLeftLock
        rearRightLock
        power
        frontLeftWindow
        frontRightWindow
        rearLeftWindow
        rearRightWindow
        trunk, //后备箱门
        hood, //引擎盖
        temperatureInside
        temperatureOutside
        voltage,  //电瓶电压
        remainL, //剩余电量
        totalMileage //总里程
        maxWindLevel //最大风速
        currentWindLevel  //当前风速
        acRightTemp //右空调温度
        acLeftTemp  //左空调温度
        acSwitch //AC开关
        acAutoSwitch //空调自动开关
        acRsv  //
        acAutoCycle //自动循环
        acInternalCycle  //内循环
        acExternalCycle  //外循环
        positionP //档位
        vehicleMode  //车辆模式
        continuationMileage  //剩余里程
        lock //车锁
        door //车门
        window //车窗
        isStart  //是否启动引擎
        isStallP  //是否p档
        isLocalModel //是否本地模式
        isTraveling  //是否行驶中
      }
     * 
     */
      export function assembleVehicleState(vehicleStateConfig, rawVehicleState){
        let vehicleState={};
        if (vehicleStateConfig.length < 1) {
            return;
        }
        for (let i = 0; i < vehicleStateConfig.length; i++) {
            let item =vehicleStateConfig[i];
            let temp ={};
            switch (item.key) {
                case 'frontLeftDoor'://左前车门
                temp = Object.assign({}, item, _getDoorByIndex(rawVehicleState, 7));
                break;
                case 'frontRightDoor'://右前车门
                temp = Object.assign({}, item, _getDoorByIndex(rawVehicleState, 6));
                break;
                case 'rearLeftDoor'://左后车门
                temp = Object.assign({}, item, _getDoorByIndex(rawVehicleState, 5));
                break;
                case 'rearRightDoor'://右后车门
                temp = Object.assign({}, item, _getDoorByIndex(rawVehicleState, 4));
                break;
                case 'frontLeftLock'://左前车锁
                temp = Object.assign({}, item, _getLockByIndex(rawVehicleState, 3));
                break;
                case 'frontRightLock'://右前车锁
                temp = Object.assign({}, item, _getLockByIndex(rawVehicleState, 2));
                break;
                case 'rearLeftLock'://左后车锁
                temp = Object.assign({}, item, _getLockByIndex(rawVehicleState, 1));
                break;
                case 'rearRightLock'://右后车锁
                temp = Object.assign({}, item, _getLockByIndex(rawVehicleState, 0));
                break;
                case 'power'://电源状态
                temp = Object.assign({}, item, _getPower(rawVehicleState));
                break;
                case 'frontLeftWindow'://左前车窗
                temp = Object.assign({}, item, _getWindowByIndex(rawVehicleState, 5));
                break;
                case 'frontRightWindow'://右前车窗
                temp = Object.assign({}, item, _getWindowByIndex(rawVehicleState, 4));
                break;
                case 'rearLeftWindow'://左后车窗
                temp = Object.assign({}, item, _getWindowByIndex(rawVehicleState, 3));
                break;
                case 'rearRightWindow'://右后车窗
                temp = Object.assign({}, item, _getWindowByIndex(rawVehicleState, 2));
                break;
                case 'trunk'://后备箱⻔
                temp = Object.assign({}, item, _getTrunk(rawVehicleState));
                break;
                case 'hood'://引擎盖
                temp = Object.assign({},item, _getHood(rawVehicleState));
                break;
                case 'temperatureInside'://车内温度
                temp = Object.assign({}, item, _getTemperature(rawVehicleState, 'temperatureInside'));
                break;
                case 'temperatureOutside'://车外温度
                temp = Object.assign({}, item, _getTemperature(rawVehicleState, 'temperatureOutside'));
                break;
                case 'voltage'://电瓶电压
                temp = Object.assign({}, item, _getVoltage(rawVehicleState));
                break;
                case 'remainL'://剩余油量
                temp = Object.assign({}, item, _getRemainL(rawVehicleState));
                break;
                case 'continuationMileage'://续航里程
                temp = Object.assign({}, item, _getContinuationMileage(rawVehicleState));
                break;
                case 'totalMileage'://总里程
                temp = Object.assign({}, item, _getTotalMileage(rawVehicleState));
                break;
                case 'maxWindLevel'://最大风速
            // Object.assign(this.getRemainL());
                break;
                case 'currentWindLevel'://当前风速
                temp = Object.assign({}, item, _getCurrentWindLevel(rawVehicleState));
                break;
                case 'acRightTemp'://右空调温度
                //Object.assign(this.getRemainL());
                break;
                case 'acLeftTemp'://左空调温度
                //Object.assign(this.getRemainL());
                break;
                case 'acSwitch'://AC开关
                temp = Object.assign({}, item, _getAcSwitch(rawVehicleState));
                break;
                case 'acAutoSwitch'://空调自动开关
                break;
                case 'acRsv'://RSV
                break;
                case 'acAutoCycle'://自动循环
                break;
                case 'acInternalCycle'://内循环
                break;
                case 'acExternalCycle'://外循环
                break;
                case 'positionP'://档位
                temp = Object.assign({}, item, _getStallP(rawVehicleState));
                break;
                case 'vehicleMode'://本地模式
                temp = Object.assign({}, item, _getLocalModel(rawVehicleState));
                break;
            }
            vehicleState[item.key]=temp;
        }
    
        let extendsVehicleConditionData = {
            lock:_getDoorLock(rawVehicleState),
            door:_getDoor(rawVehicleState),
            window:_getWindow(rawVehicleState),
            isStart: _getIsStart(rawVehicleState),
            isStallP: _getStallP(rawVehicleState),
            isLocalModel: _getLocalModel(rawVehicleState),
            isTraveling: _getTraveling(rawVehicleState),
        }
        vehicleState = {...vehicleState, ...extendsVehicleConditionData};
        return vehicleState
    }


function _getDoorByIndex(rawVehicleState, index) {
  let value = rawVehicleState.door.bitValue.substr(index, 1);
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

//各车门门锁 1 已锁，0 未锁
function _getLockByIndex(rawVehicleState, index) {
  let value = rawVehicleState.door.bitValue.substr(index, 1);
  return {
    value: value,
    valueZn: value ? '上锁' : '解锁'
  }
}

function _getPower(rawVehicleState) {
  let temp = {
    "00": "OFF",
    "01": "ACC",
    10: "ON",
    11: "START"
  }
  let value = rawVehicleState.other.bitValue.substr(6,2)
  return {
    value: temp[value],
    valueZn: ''
  }
}

function _getWindowByIndex(rawVehicleState, index) {
  let value = rawVehicleState.other.bitValue.substr(index,1);
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

function _getHood(rawVehicleState){
  let value = rawVehicleState.other.bitValue.substr(0,1);
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

//后备箱， 1 开，0 关
function _getTrunk(rawVehicleState) {
  let value = parseInt(rawVehicleState.other.bitValue.substr(1, 1),10);
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

//车内温度
function _getTemperature(rawVehicleState,key) {
  let temperatureObj = rawVehicleState[key]
  if (-1 == temperatureObj.support || "START" != _getPower(rawVehicleState).value) {
    return {
      value: '--',
      valueZn: '--'
    };
  }
  let expression = temperatureObj['expression'] || "x*0.5-40";
  let expressionParse = expression.replace(/x/g, temperatureObj.float);
  let value = temperatureObj.float == null ? "--" : parseFloat(evals(expressionParse)).toFixed(1);
  return {
    value: value,
    valueZn: ''
  }
}

//电压
function _getVoltage(rawVehicleState) {
  let v = '--';
  if (rawVehicleState.voltage && (0.1 * rawVehicleState.voltage.int) > 0 && (0.1 * rawVehicleState.voltage.int) < 16) {
    v = (0.1 * rawVehicleState.voltage.int).toFixed(1);
  }
  return {
    value: v,
    valueZn: '',
    label: "电压",
    unit: ""
  }
}

function _getRemainL(rawVehicleState) {
  let value =  rawVehicleState?.oilMass?.int ||  0;
  return {
    value: value,
    valueZn: ""
  }
}

//续航里程
function _getContinuationMileage(rawVehicleState) {
  return {
    value: rawVehicleState?.continuationMileage?.int ||0,
    valueZn: ''
  }
}

function _getTotalMileage(rawVehicleState) {
  let value = (rawVehicleState?.totalMileage?.float || 0) * 0.1;
  return {
    value: value,
    valueZn: '',
    label: "总里程",
    unit: "km"
  }
}

//空调风档
function _getCurrentWindLevel(rawVehicleState) {
  let value = rawVehicleState?.ac?.bitValue.substr(24, 4);
    return {
      value: value,
      valueZn: ''
    }
}

//ac开关 1开 ，0 关
function _getAcSwitch(rawVehicleState) {
  let value = rawVehicleState?.ac?.bitValue.substr(31, 1).indexOf(1) > -1 ? 1 : 0;
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}




//是否本地模式
function _getLocalModel(rawVehicleState) {
  return {
    key:"",
    value: rawVehicleState?.stall?.bitValue.substr(6, 1) == "1",
    valueZn: ''
  }
}

//门锁 1 已锁，0 未锁
function _getDoorLock(rawVehicleState) {
  let value = rawVehicleState?.door?.bitValue.substr(0, 4).indexOf(0) > -1 ? 0 : 1;
  return {
    value: value,
    valueZn: value ? '已锁' : '未锁',
    label: "",
    unit: ""
  }
 }

 //车门 1开，0 关
function _getDoor(rawVehicleState) {
  let value = rawVehicleState?.door?.bitValue.substr(4, 4).indexOf(1) > -1 ? 1 : 0;
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

//车窗 1 开，0 关
function _getWindow(rawVehicleState) {
  let value = rawVehicleState?.other?.bitValue.substr(2, 4).indexOf(1) > -1 ? 1 : 0;
  return {
    value: value,
    valueZn: value ? '开' : '关'
  }
}

//引擎是否启动
function _getIsStart(rawVehicleState) {
  return {
    key:"isStart",
    value: rawVehicleState?.other?.bitValue.substr(6, 2) != "00",
    valueZn: '',
    name:""
  }

}
//是否p档
function _getStallP(rawVehicleState) {
  return {
    value: rawVehicleState?.stall?.bitValue.substr(7, 1) == "0",
    valueZn: ''
  }

}


function _getTraveling(rawVehicleState) {
  return {
    value: !_getStallP(rawVehicleState).value && _getIsStart(rawVehicleState).value || _getLocalModel(rawVehicleState).value,
    valueZn: '',
    label: "行驶中",
    unit: ""
  }

}


/**
 * 获取原始车况数据结构
 * 字段定义的顺序代表解析16进制的顺序
 */
 function _getRawVehicleStateStructure(){
    return {
        Tag: {
          name: "Tag",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: ""
        },
        length: {
          name: "length",
          length: 2,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: ""
        },
        companyID: {
          name: "companyID",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: ""
        },
        protocolVersion: {
          name: "protocolVersion",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: ""
        },
        sequenceNO:{
          name: "sequenceNO",
          length: 2,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: ""
        },
        door: {
          name: "door",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "车门"
        },
        other: {
          name: "other",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "其它信息"
        },
        temperatureInside: {
          name: "temperatureInside ",
          length: 1,
          range: [0, 200],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "车内温度"
        },
        temperatureOutside: {
          name: "temperatureOutside",
          length: 1,
          range: [-40, 60],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "车外温度"
        },
        voltage: {
          name: "voltage",
          length: 1,
          range: null,
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "电压"
        },
        oilMass: {
          name: "oilMass",
          length: 1,
          range: [0, 100],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "油量"
        },
        totalMileage: {
          name: "totalMileage",
          length: 4,
          range: [0, 0xFFFFFFFE],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "总里程"
        },
        ac: {
          name: "ac",
          length: 4,
          range: [0, 0xFFFFFFFE],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "空调"
        },
        stall: {
          name: "stall",
          length: 1,
          range: [0, 0xFFFFFFFE],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "档位"
        },
        continuationMileage:{
          name: "continuationMileage",
          length: 2,
          range: [0, 0x927c0],
          value: null,
          bitValue: "",
          int: 0,
          float: 0.0,
          mark: "续航里程"
        }
      }
}

export default {
    parseVehicleStateFromHex,
    assembleVehicleState
  }