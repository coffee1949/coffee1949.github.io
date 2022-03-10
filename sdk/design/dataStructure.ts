/**
 * 车控命令对象定义
 */
export class Command{
    constructor(params){
        this.commandAlias =  params.commandAlias,
        this.commandType =  params.commandType,
        this.value =  params.value,
        this.hexTag =  params.hexTag,
        this.hexValue =  params.hexValue,
        this.mark =  params.mark,
        this.toastSuccess =  params.toastSuccess,
        this.toastFail =  params.toastFail,
        this.minWaitingTime =  params.minWaitingTime,
        this.maxWaitingTime =  params.maxWaitingTime,
        this.needCarData =  params.needCarData,
        this.voiceName =  params.voiceName,
        this.cmdSucStateKey=  params.cmdSucStateKey,
        this.cmdSucStateValue =  params.cmdSucStateValue
    }
    
}

/**
 * 原始车况对象
 */

interface VehicleStateVo {
    key: string,    //车况建值
    name: string,   //车况名
    comment: string,  //描述
    length: number,  //
    type: string, //数据类型  int/double/float
    groupKey?: string,  //车况组键值
    groupName?: string,  //车况组名
    multiState?: number,  //当前车况是否是多状态（离散值）
    onValue?: number,  // 打开值
    offValue?: number,  //关闭值
    warnType?: number,  //告警类型
    warnValues?: Array<number>, //触发告警值
    displayOnHome?: number,
    expression?: string,  //计算公式
    minValue?: number,   //最小值
    maxValue?: number,  //最大值
    unit?: string,  // 单位
  }


  let cmdPrecondition = [
    {
      commandAlias: 'lock',
      preconditionItemList:[
      { alias: 'doorClose', code: -1, discontent: '关闭车门' },
      { alias: 'trunkClose', code: -1, discontent: '关闭尾门' }
    ]
    },
    { commandAlias: 'openTrunk', preconditionItemList: [] },
    {
      commandAlias: 'startEngine',
      preconditionItemList: [
        { alias: 'doorClose', code: -1, discontent: '关闭车门' },
        { alias: 'lock', code: -1, discontent: '车辆上锁' },
        { alias: 'trunkClose', code: -1, discontent: '关闭尾门' }
      ]
    },
    {
      commandAlias: 'stopEngine',
      preconditionItemList: [
        { alias: 'doorClose', code: -1, discontent: '关闭车门' },
        { alias: 'lock', code: -1, discontent: '车辆上锁' },
        { alias: 'trunkClose', code: -1, discontent: '关闭尾门' }
      ]
    },
    { commandAlias: 'openWindow', preconditionItemList: [ 
      { alias: 'doorClose', code: -1, discontent: '关闭车门' } 
    ]},
    { commandAlias: 'closeWindow', preconditionItemList: [ 
      { alias: 'doorClose', code: -1, discontent: '关闭车门' } 
    ]}
  ]
  
  let vehicleStateConfig = {
  
    appId: "6b86b273ff34fce1",
    model: "XPlan",
    sdkList: null,
    vehicleStatus: {
      'items': [
        {
          key: 'frontLeftDoor',
          groupKey: 'Door',
          groupName: '车门状态',
          name: '左前车门',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          onValue: 1,
          offValue: 0,
          multiState: 1,
          warnType: 21,
          warnValues: [1]
        },
        {
          key: 'frontRightDoor',
          groupKey: 'Door',
          groupName: '车门状态',
          name: '右前车门',
          type: 'int',
          length: 1,
          multiState: 1,
          comment: '0关，1开',
          onValue: 1,
          offValue: 0,
          warnType: 22,
          warnValues: [1]
        },
        {
          key: 'rearLeftDoor',
          groupKey: 'Door',
          groupName: '车门状态',
          name: '左后车门',
          type: 'int',
          length: 1,
          multiState: 1,
          comment: '0关，1开',
          onValue: 1,
          offValue: 0,
          warnType: 23,
          warnValues: [1]
        },
        {
          key: 'rearRightDoor',
          groupKey: 'Door',
          groupName: '车门状态',
          name: '右后车门',
          type: 'int',
          multiState: 1,
          length: 1,
          comment: '0关，1开',
          onValue: 1,
          offValue: 0,
          warnType: 24,
          warnValues: [1]
        },
        {
          key: 'frontLeftLock',
          groupKey: 'Lock',
          groupName: '车门锁状态',
          name: '左前车锁',
          type: 'int',
          length: 1,
          comment: '0解锁，1上锁',
          multiState: 1,
          onValue: 0,
          offValue: 1,
          warnType: 11,
          warnValues: [0]
        },
        {
          key: 'frontRightLock',
          groupKey: 'Lock',
          groupName: '车门锁状态',
          name: '右前车锁',
          type: 'int',
          length: 1,
          comment: '0解锁，1上锁',
          multiState: 1,
          onValue: 0,
          offValue: 1,
          warnType: 12,
          warnValues: [0]
        },
        {
          key: 'rearLeftLock',
          groupKey: 'Lock',
          groupName: '车门锁状态',
          name: '左后车锁',
          type: 'int',
          length: 1,
          comment: '0解锁，1上锁',
          multiState: 1,
          onValue: 0,
          offValue: 1,
          warnType: 13,
          warnValues: [0]
        },
        {
          key: 'rearRightLock',
          groupKey: 'Lock',
          groupName: '车门锁状态',
          name: '右后车锁',
          type: 'int',
          length: 1,
          comment: '0解锁，1上锁',
          multiState: 1,
          onValue: 0,
          offValue: 1,
          warnType: 14,
          warnValues: [0]
        },
        {
          key: 'power',
          name: '电源状态',
          groupName: '',
          type: 'int',
          length: 2,
          comment: '0：OFF，1：ACC，2：ON，3：START',
          warnType: 60,
          warnValues: [1,2,3]
        },
        {
          key: 'frontLeftWindow',
          groupKey: 'Window',
          groupName: '车窗状态',
          name: '左前车窗',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 51,
          warnValues: [1]
        },
        {
          key: 'frontRightWindow',
          groupKey: 'Window',
          groupName: '车窗状态',
          name: '右前车窗',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 52,
          warnValues: [1]
        },
        {
          key: 'rearLeftWindow',
          groupKey: 'Window',
          groupName: '车窗状态',
          name: '左后车窗',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 53,
          warnValues: [1]
        },
        {
          key: 'rearRightWindow',
          groupKey: 'Window',
          groupName: '车窗状态',
          name: '右后车窗',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 54,
          warnValues: [1]
        },
        {
          key: 'trunk',
          name: '后备箱⻔',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 30,
          warnValues: [1]
        },
        {
          key: 'hood',
          name: '引擎盖',
          type: 'int',
          length: 1,
          comment: '0关，1开',
          multiState: 1,
          onValue: 1,
          offValue: 0,
          warnType: 70,
          warnValues: [1]
        },
        {
          key: 'temperatureInside',
          name: '车内温度',
          type: 'double',
          unit: '℃',
          length: 8,
          expression: 'x*0.5-50',
          minValue: -50,
          maxValue: 60,
          displayOnHome: 1,
          comment: '车内温度'
        },
        {
          key: 'temperatureOutside',
          name: '车外温度',
          type: 'double',
          unit: '℃',
          length: 8,
          expression: 'x*0.5-50',
          minValue: -50,
          maxValue: 60,
          comment: '车外温度'
        },
        {
          key: 'voltage',
          name: '电瓶电压',
          type: 'float',
          length: 8,
          unit: 'V',
          expression: 'x*0.1',
          minValue: 0,
          maxValue: 16,
          comment: '电瓶电压'
        },
        {
          key: 'remainL',
          name: '剩余电量',
          type: 'int',
          length: 8,
          unit: '%',
          minValue: 0,
          maxValue: 100,
          comment: '剩余电量'
        },
        {
          key: 'totalMileage',
          name: '总里程',
          expression: 'x*1',
          type: 'double',
          length: 32,
          unit: 'km',
          minValue: 0,
          maxValue: 999999,
          comment: '总里程'
        },
        {
          key: 'maxWindLevel',
          name: '最大风速',
          expression: '',
          type: 'int',
          length: 4,
          unit: '',
          minValue: 0,
          maxValue: 14,
          comment: '最大风速'
        },
        {
          key: 'currentWindLevel',
          name: '当前风速',
          expression: '',
          type: 'int',
          length: 4,
          unit: '',
          minValue: 0,
          maxValue: 14,
          comment: '当前风速'
        },
        {
          key: 'acRightTemp',
          name: '右空调温度',
          expression: 'x*0.5',
          type: 'float',
          length: 8,
          unit: '℃',
          minValue: -40,
          maxValue: 60,
          comment: '右空调温度'
        },
        {
          key: 'acLeftTemp',
          name: '左空调温度',
          expression: 'x*0.5',
          type: 'float',
          length: 8,
          unit: '℃',
          minValue: -40,
          maxValue: 60,
          comment: '左空调温度'
        },
        {
          key: 'acSwitch',
          name: 'AC开关',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: 'AC开关'
        },
        {
          key: 'acAutoSwitch',
          name: '空调自动开关',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '空调自动开关'
        },
        {
          key: 'acRsv',
          name: 'RSV',
          expression: '',
          type: 'int',
          length: 3,
          unit: '',
          comment: 'RSV'
        },
        {
          key: 'acAutoCycle',
          name: '自动循环',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '自动循环'
        },
        {
          key: 'acInternalCycle',
          name: '内循环',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '内循环'
        },
        {
          key: 'acExternalCycle',
          name: '外循环',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '外循环'
        },
        {
          key: 'positionP',
          name: '档位',
          expression: '',
          type: 'int',
          length: 1,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '0：P档，1：非P档'
        },
        {
          key: 'vehicleMode',
          name: '本地模式',
          expression: '',
          type: 'int',
          length: 7,
          multiState: 1,
          onValue: 1,
          offValue: 0,
          unit: '',
          comment: '0: 远程模式状态（telematics），app可控车； 1: 本地模式状态（normal），app不可控车； 只针对广汽车型，车端做逻辑判断'
        },
        {
          key: 'continuationMileage',
          name: '剩余里程',
          expression: '',
          type: 'int',
          length: 16,
          unit: 'km',
          minValue: 0,
          displayOnHome: 2,
          maxValue: 60000,
          comment: '剩余里程'
        }
      ],
      meta: {
        headerLength: 56,
        length: 192,
        littleEndian: 0,
        minLength: 136,
        version: 1
      }
    }
  }