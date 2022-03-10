/**
 * 车况解析规则配置
 */
export const VehicleStateConfig = {
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
  sequenceNO: {
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
  continuationMileage: {
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

export const BleStates = { 
  0: '初始值', 
  1: '蓝牙初始化', 
  2: '蓝牙初始化成功', 
  3: '蓝牙初始化失败,请确保蓝牙已经打开', 
  5: '获取蓝牙状态', 
  6: '获取蓝牙状态成功', 
  7: '获取蓝牙状态失败', 
  9: '获取正在连接中的设备', 
  10: '获取正在连接中的设备成功', 
  11: '获取正在连接中的设备失败', 
  12: '目标设备已经连接', 
  13: '断开正在连接中的设备成功', 
  14: '断开正在连接中的设备失败', 
  15: '扫描蓝牙设备(确保部分手机微信已授权位置权限)', 
  16: '扫描蓝牙设备成功', 
  17: '扫描蓝牙设备失败', 
  18: '目标被找到', 
  20: '开始蓝牙连接', 
  21: '蓝牙连接成功', 
  22: '蓝牙连接失败', 
  25: '设置蓝牙mtu',
  26: '设置蓝牙mtu成功', 
  27: '设置蓝牙mtu失败', 
  30: '获取连接设备的services', 
  31: '获取连接设备的services成功', 
  32: '获取连接设备的services失败', 
  35: '获取连接设备的charid', 
  36: '获取连接设备的charid成功', 
  37: '获取连接设备的charid失败', 
  40: '监听特征值数据变化', 
  41: '监听特征值数据变化成功', 
  42: '监听特征值数据变化失败', 
  45: '开始写入算法', 
  46: '写入算法成功', 
  47: '写入算法失败', 
  50: '上报车机数据', 
  51: '上报车机数据成功', 
  52: '上报车机数据失败', 
  55: '蓝牙已连接正在进行rtc', 
  56: '从云端获取rtc数据成功', 
  57: ' 从云端获取rtc数据失败', 
  58: '写入rtc数据成功', 
  59: '写入rtc数据失败', 
  60: '蓝牙已连接rtc校准失败', 
  61: ' 蓝牙已连接rtc校准成功', 
  70: ' 蓝牙已连接正在认证', 
  71: ' 蓝牙已连接认证失败', 
  200: '蓝牙已连接认证成功', 
  500: '连接超时', 
  502: '流程异常，强制终止', 
  999: ' 蓝牙异常断开' 
}

// export const commandStates = {
//   0: '初始值', 
//   1: '开始发送车控', 
//   5: '解锁', 
//   6: '闭锁', 
//   7: '尾门开启', 
//   8: '尾门关闭', 
//   9: '引擎开启', 
//   10: '引擎关闭', 
//   11: '车窗开启', 
//   12: '车窗关闭', 
//   13: '寻车', 
//   14: '刷新', 
//   46: '组装车控数据', 
//   50: '写入车控数据', 
//   51: '写入车控数据成功', 
//   52: '写入车控数据失败', 
//   60: '成功返回车控', 
//   61: '成功返回车况', 
//   200: '成功', 
//   500: '操作超时', 
//   501: '等待车况数据超时'
// }
/**
 * 车控命令执行阶段定义
 */
// export const commandStates = {
//   'start': '开始发送车控',  //用户点击车控按钮
//   'cmdData': '组装车控数据',
//   'excute': '开始执行命令',  //排除了一切车况条件和前置条件开始执行车控
//   'write': '写入车控数据',
//   'writeSuc': '写入车控数据成功',
//   'writeFail': '写入车控数据失败',
//   'cmdSuc': '车况执行成功',
//   'cmdFail': '车况执行失败',
//   'cmdTimeout': '车况执行超时'
// }

/**
 * 车控命令执行阶段定义
 */
export const commandStage = {
  'start': '开始发送车控',  //用户点击车控按钮
  'valid': '车控命令校验',  //车控命令校验
  'prepare': '命令准备阶段',  //排除了一切车况条件和前置条件开始执行车控,这个阶段包含几个过程（执行动画/设置抖动等操作/组装数据等）
  'write': '写入车控命令',  //调用微信api写入特征值/调用4g接口发送车控
  'done': '命令执行完成'   //命令执行完成
}

/**
 * 车控命令执行状态
 * 3** - 车控命令校验阶段的状态码
 * 4** - 命令准备阶段状态码
 * 5** - 写入命令阶段状态码
 * 6** - 命令执行完成阶段状态码
 */
export const commandStates = {
  '301': '正在执行车控，不可再次执行',
  '302': '未连接车辆，不可发送命令',
  '303': '本地模式无法控制车辆',
  '304': '车辆行驶中，无法控制车辆',
  '305': '当前车控命令需要前置车况支持',

  '401': '组装命令数据出错',

  '501': '写入车控成功',
  '502': '写入车控失败',

  '601': '命令执行成功',
  '602': '命令执行失败',
  '603': '命令执行超时'
}

let commandRes = {
  'sn': '',
  'cmd': '',
  'stageCode': 'start',
  'stageName': '开始发送车控',
  'stateCode': '301',
  'stateMessage': '正在执行车控，不可再次执行'
}

/**
 * 车控命令集合
 */
export const commands =[
  'lock',
  'unlock',
  'closeWindow',
  'openWindow',
  'search',
  'closeTrunk',
  'openTrunk',
  'stopEngine',
  'startEngine',
  'refrush'
]




export const commandConfig = {
  "lock": {
    commandAlias: "lock",
    commandType:'lock',
    value: [0x01, 0x01, 0x00],
    hexTag:"01",  //通过云端控车的指令tag
    hexValue:"00",  //通过云端控车的指令value
    mark: "上锁",
    toastSuccess:"闭锁成功",
    toastFail:"闭锁失败",
    minWaitingTime: 2000,
    maxWaitingTime: 8000,
    needCarData: true,
    voiceName: "lock.mp3",
    vehicleConditionData_key:'doorLock',
    vehicleConditionData_val:1
  },
  "unlock": {
    commandAlias: "",
    commandType:'lock',
    value: [0x01, 0x01, 0x01],
    hexTag:"01",
    hexValue:"01",
    mark: "解锁",
    toastSuccess:"解锁成功",
    toastFail:"解锁失败",
    minWaitingTime: 2000,
    maxWaitingTime: 8000,
    needCarData: true,
    voiceName: "unlock.mp3",
    vehicleConditionData_key:'doorLock',
    vehicleConditionData_val:0
  },
  "closeWindow": {
    commandAlias: "closeWindow",
    commandType:'window',
    value: [0x02, 0x01, 0x00],
    hexTag:"02",
    hexValue:"00",
    minWaitingTime: 8000,
    maxWaitingTime: 15000,
    mark: "关窗",
    toastSuccess:"车窗已关闭",
    toastFail:"",
    needCarData: true,
    voiceName: "windowClose.mp3",
    vehicleConditionData_key:'window',
    vehicleConditionData_val:0
  },
  "openWindow": {
    commandAlias: "openWindow",
    commandType:'window',
    value: [0x02, 0x01, 0x01],
    hexTag:"02",
    hexValue:"01",
    minWaitingTime: 8000,
    maxWaitingTime: 15000,
    mark: "开窗",
    toastSuccess:"车窗已开启",
    toastFail:"",
    needCarData: true,
    voiceName: "windowOpen.mp3",
    vehicleConditionData_key:'window',
    vehicleConditionData_val:1
  },
  "search": {
    commandAlias: "",
    commandType:'search',
    value: [0x04, 0x01, 0x01],
    hexTag:"04",
    hexValue:"01",
    mark: "寻车",
    toastSuccess:"",
    toastFail:"",
    minWaitingTime: 4000,
    maxWaitingTime: 4000,
    needCarData: false,
    voiceName: "lookCar.mp3",
    vehicleConditionData_key:null,
    vehicleConditionData_val:null
  },
  "closeTrunk": {
    commandAlias: "closeTrunk",
    commandType:'trunk',
    value: [0x06, 0x01, 0x00],
    hexTag:"06",
    hexValue:"00",
    minWaitingTime: 8000,
    maxWaitingTime: 15000,
    mark: "关闭后备箱",
    toastSuccess:"尾门已关闭",
    toastFail:"",
    needCarData: true,
    voiceName: "trunckClose.mp3",
    vehicleConditionData_key:'trunk',
    vehicleConditionData_val:0
  },
  "openTrunk": {
    commandAlias: "openTrunk",
    commandType:'trunk',
    value: [0x06, 0x01, 0x01],
    hexTag:"06",
    hexValue:"01",
    minWaitingTime: 2000,
    maxWaitingTime: 15000,
    mark: "打开后备箱",
    toastSuccess:"尾门已开启",
    toastFail:"",
    needCarData: true,
    voiceName: "trunckOpen.mp3",
    vehicleConditionData_key:'trunk',
    vehicleConditionData_val:1
  },
  "stopEngine": {
    commandAlias: "stopEngine",
    commandType:'engine',
    hexTag:"08",
    hexValue:"00",
    value: [0x08, 0x01, 0x00],
    minWaitingTime: 2000,
    maxWaitingTime: 15000,
    mark: "熄火",
    toastSuccess:"引擎已熄火",
    toastFail:"",
    needCarData: true,
    voiceName: "end.mp3",
    vehicleConditionData_key:'isStart',
    vehicleConditionData_val:false
  },
  "startEngine": {
    commandAlias: "startEngine",
    commandType:'engine',
    value: [0x08, 0x01, 0x01],
    hexTag:"08",
    hexValue:"01",
    minWaitingTime: 3000,
    maxWaitingTime: 8000,
    mark: "启动",
    toastSuccess:"引擎已启动",
    toastFail:"",
    needCarData: true,
    voiceName: "start.mp3",
    vehicleConditionData_key:'isStart',
    vehicleConditionData_val:true
  },
  "refrush": {
    commandAlias: "refrush",
    value: [0x01, 0x01, 0x00],
    hexTag:"",
    hexValue:"",
    minWaitingTime: 1000,
    maxWaitingTime: 5000,
    mark: "刷新",
    toastSuccess:"",
    toastFail:"",
    needCarData: false,
    voiceName: null,
    vehicleConditionData_key:null,
    vehicleConditionData_val:null
  }
};