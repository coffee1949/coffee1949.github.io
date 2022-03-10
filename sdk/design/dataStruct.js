// 微信返回的用户信息
let userBaseInfo = {
    nickName: "--",
    avatarUrl: "https://xplan-static.oss-cn-shanghai.aliyuncs.com/h5/img/avatar.svg"
}

//登录以后用户信息
let userInfo = {
    mobile: "",
    signKey: res.data.signKey,
    unionId: res.data.unionId,
    openId: res.data.openId,
    tokenTimeOutTime: res.data.tokenTimeOutTime,
    "X-Ingeek-UserId": res.data.userId,
    "X-Ingeek-AccessToken": res.data.accessToken
}

//当前车辆支持的车控列表
let vehicleCtrlCmdList=[]

//车控指令
let commandPreconditionList = ""
let commandPreconditionListObj = [{
    alias,
    discontent
}]

//车辆信息
let vehicleInfo = {
    isOwner: true,   //是否是车主
    vin:'',   //车辆vin号
    vehicleName:'',  //车辆名称
    sn:'',  // 钥匙sn
    vehicleId:'',  //车辆id
    vehicleModelName:'',  //车型
    uiDisplayRelation: {    //ui展示的相关配置
        oil: 'continuationMileage'  //油量展示方式
    },
    hardwareType: 1,  //硬件类型 1-单蓝牙，2-4g 3-蓝牙+4g   
    keyId: '',  //钥匙id
    keyStatus: 1, //钥匙状态 1-使用中 2-待生效 4-已过期 5-已撤回 11-已解绑 12-已转移
    isFreeze: false,  //钥匙冻结
    macAddress: '',
    electricCar: true,  //电车
    keyEndDate: '', //钥匙过期时间
    keyStartDate: '',  //钥匙生效时间
    revocationTimeZn: ''  //钥匙撤回时间
}

let vehicleInfo2 = {
    "userId": "7941c00d2d3e4dd1aa4e8453764f03dd",
    "ownerUserMobile": "18516285834",
    "transferUserMobile": null,
    "sn": "A12B080A541BD3",
    "roleId": "856f30e54e634d02a760eec6083c9006",
    "isOwner": 1,
    "startTime": 1636353527000,
    "endTime": 2267505527000,
    "revocationTime": null,
    "vehicleId": "d3872912daec441eb74fd7dfc10be230",
    "vehicleModelId": "id4x",
    "vin": null,
    "vehicleName": "我的爱车BD3",
    "vehicleModelName": "上汽大众 ID.4X(21款)",
    "vehicleModelIcon": null,
    "keyStatus": 1,
    "kpre": "FFFFFFFFFFFF",
    "isFreeze": 0,
    "keyId": null,
    "electricCar": 1,
    "fuelVolumeMax": 100,
    "mileageMax": null,
    "uiDisplayRelation": "{\"oil\":\"remainL\"}",
    "macAddress": "C1:07:59:0F:1B:D3",
    "vehicleDueDate": 1667889527000,
    "currentFirmwareVersion": "1.2.7",
    "hardwareType": 3,
    "vehicleBrandIcon": null,
    "vehicleStatusData": "{\"msg\":\"成功\",\"data\":[{\"appId\":\"6b86b273ff34fce1\",\"model\":\"XPlan\",\"sdkList\":null,\"vehicleStatus\":{\"meta\":{\"version\":1,\"minLength\":136,\"length\":192,\"headerLength\":56,\"littleEndian\":0},\"items\":[{\"key\":\"frontLeftDoor\",\"groupKey\":\"Door\",\"groupName\":\"车门状态\",\"name\":\"左前车门\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"onValue\":1,\"offValue\":0,\"multiState\":1,\"warnType\":21,\"warnValues\":[1]},{\"key\":\"frontRightDoor\",\"groupKey\":\"Door\",\"groupName\":\"车门状态\",\"name\":\"右前车门\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"comment\":\"0关，1开\",\"onValue\":1,\"offValue\":0,\"warnType\":22,\"warnValues\":[1]},{\"key\":\"rearLeftDoor\",\"groupKey\":\"Door\",\"groupName\":\"车门状态\",\"name\":\"左后车门\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"comment\":\"0关，1开\",\"onValue\":1,\"offValue\":0,\"warnType\":23,\"warnValues\":[1]},{\"key\":\"rearRightDoor\",\"groupKey\":\"Door\",\"groupName\":\"车门状态\",\"name\":\"右后车门\",\"type\":\"int\",\"multiState\":1,\"length\":1,\"comment\":\"0关，1开\",\"onValue\":1,\"offValue\":0,\"warnType\":24,\"warnValues\":[1]},{\"key\":\"frontLeftLock\",\"groupKey\":\"Lock\",\"groupName\":\"车门锁状态\",\"name\":\"左前车锁\",\"type\":\"int\",\"length\":1,\"comment\":\"0解锁，1上锁\",\"multiState\":1,\"onValue\":0,\"offValue\":1,\"warnType\":11,\"warnValues\":[0]},{\"key\":\"frontRightLock\",\"groupKey\":\"Lock\",\"groupName\":\"车门锁状态\",\"name\":\"右前车锁\",\"type\":\"int\",\"length\":1,\"comment\":\"0解锁，1上锁\",\"multiState\":1,\"onValue\":0,\"offValue\":1,\"warnType\":12,\"warnValues\":[0]},{\"key\":\"rearLeftLock\",\"groupKey\":\"Lock\",\"groupName\":\"车门锁状态\",\"name\":\"左后车锁\",\"type\":\"int\",\"length\":1,\"comment\":\"0解锁，1上锁\",\"multiState\":1,\"onValue\":0,\"offValue\":1,\"warnType\":13,\"warnValues\":[0]},{\"key\":\"rearRightLock\",\"groupKey\":\"Lock\",\"groupName\":\"车门锁状态\",\"name\":\"右后车锁\",\"type\":\"int\",\"length\":1,\"comment\":\"0解锁，1上锁\",\"multiState\":1,\"onValue\":0,\"offValue\":1,\"warnType\":14,\"warnValues\":[0]},{\"key\":\"power\",\"name\":\"电源状态\",\"groupName\":\"\",\"type\":\"int\",\"length\":2,\"comment\":\"0：OFF，1：ACC，2：ON，3：START\",\"warnType\":60,\"warnValues\":[1,2,3]},{\"key\":\"frontLeftWindow\",\"groupKey\":\"Window\",\"groupName\":\"车窗状态\",\"name\":\"左前车窗\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":51,\"warnValues\":[1]},{\"key\":\"frontRightWindow\",\"groupKey\":\"Window\",\"groupName\":\"车窗状态\",\"name\":\"右前车窗\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":52,\"warnValues\":[1]},{\"key\":\"rearLeftWindow\",\"groupKey\":\"Window\",\"groupName\":\"车窗状态\",\"name\":\"左后车窗\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":53,\"warnValues\":[1]},{\"key\":\"rearRightWindow\",\"groupKey\":\"Window\",\"groupName\":\"车窗状态\",\"name\":\"右后车窗\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":54,\"warnValues\":[1]},{\"key\":\"trunk\",\"name\":\"后备箱⻔\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":30,\"warnValues\":[1]},{\"key\":\"hood\",\"name\":\"引擎盖\",\"type\":\"int\",\"length\":1,\"comment\":\"0关，1开\",\"multiState\":1,\"onValue\":1,\"offValue\":0,\"warnType\":70,\"warnValues\":[1]},{\"key\":\"temperatureInside\",\"name\":\"车内温度\",\"type\":\"double\",\"unit\":\"℃\",\"length\":8,\"expression\":\"x*0.5-50\",\"minValue\":-50,\"maxValue\":60,\"displayOnHome\":1,\"comment\":\"车内温度\"},{\"key\":\"temperatureOutside\",\"name\":\"车外温度\",\"type\":\"double\",\"unit\":\"℃\",\"length\":8,\"expression\":\"x*0.5-50\",\"minValue\":-50,\"maxValue\":60,\"comment\":\"车外温度\"},{\"key\":\"voltage\",\"name\":\"电瓶电压\",\"type\":\"float\",\"length\":8,\"unit\":\"V\",\"expression\":\"x*0.1\",\"minValue\":0,\"maxValue\":16,\"comment\":\"电瓶电压\"},{\"key\":\"remainL\",\"name\":\"剩余电量\",\"type\":\"int\",\"length\":8,\"unit\":\"%\",\"minValue\":0,\"maxValue\":100,\"comment\":\"剩余电量\"},{\"key\":\"totalMileage\",\"name\":\"总里程\",\"expression\":\"x*1\",\"type\":\"double\",\"length\":32,\"unit\":\"km\",\"minValue\":0,\"maxValue\":999999,\"comment\":\"总里程\"},{\"key\":\"maxWindLevel\",\"name\":\"最大风速\",\"expression\":\"\",\"type\":\"int\",\"length\":4,\"unit\":\"\",\"minValue\":0,\"maxValue\":14,\"comment\":\"最大风速\"},{\"key\":\"currentWindLevel\",\"name\":\"当前风速\",\"expression\":\"\",\"type\":\"int\",\"length\":4,\"unit\":\"\",\"minValue\":0,\"maxValue\":14,\"comment\":\"当前风速\"},{\"key\":\"acRightTemp\",\"name\":\"右空调温度\",\"expression\":\"x*0.5\",\"type\":\"float\",\"length\":8,\"unit\":\"℃\",\"minValue\":-40,\"maxValue\":60,\"comment\":\"右空调温度\"},{\"key\":\"acLeftTemp\",\"name\":\"左空调温度\",\"expression\":\"x*0.5\",\"type\":\"float\",\"length\":8,\"unit\":\"℃\",\"minValue\":-40,\"maxValue\":60,\"comment\":\"左空调温度\"},{\"key\":\"acSwitch\",\"name\":\"AC开关\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"AC开关\"},{\"key\":\"acAutoSwitch\",\"name\":\"空调自动开关\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"空调自动开关\"},{\"key\":\"acRsv\",\"name\":\"RSV\",\"expression\":\"\",\"type\":\"int\",\"length\":3,\"unit\":\"\",\"comment\":\"RSV\"},{\"key\":\"acAutoCycle\",\"name\":\"自动循环\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"自动循环\"},{\"key\":\"acInternalCycle\",\"name\":\"内循环\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"内循环\"},{\"key\":\"acExternalCycle\",\"name\":\"外循环\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"外循环\"},{\"key\":\"positionP\",\"name\":\"档位\",\"expression\":\"\",\"type\":\"int\",\"length\":1,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"0：P档，1：非P档\"},{\"key\":\"vehicleMode\",\"name\":\"本地模式\",\"expression\":\"\",\"type\":\"int\",\"length\":7,\"multiState\":1,\"onValue\":1,\"offValue\":0,\"unit\":\"\",\"comment\":\"0: 远程模式状态（telematics），app可控车； 1: 本地模式状态（normal），app不可控车； 只针对广汽车型，车端做逻辑判断\"},{\"key\":\"continuationMileage\",\"name\":\"剩余里程\",\"expression\":\"\",\"type\":\"int\",\"length\":16,\"unit\":\"km\",\"minValue\":0,\"displayOnHome\":2,\"maxValue\":60000,\"comment\":\"剩余里程\"}]}}],\"success\":true}",
    "commandPreconditionList": "[{\"commandAlias\":\"lock\",\"preconditionItemList\":[{\"alias\":\"doorClose\",\"code\":-1,\"discontent\":\"关闭车门\"},{\"alias\":\"trunkClose\",\"code\":-1,\"discontent\":\"关闭尾门\"}]},{\"commandAlias\":\"openTrunk\",\"preconditionItemList\":[]},{\"commandAlias\":\"startEngine\",\"preconditionItemList\":[{\"alias\":\"doorClose\",\"code\":-1,\"discontent\":\"关闭车门\"},{\"alias\":\"lock\",\"code\":-1,\"discontent\":\"车辆上锁\"},{\"alias\":\"trunkClose\",\"code\":-1,\"discontent\":\"关闭尾门\"}]},{\"commandAlias\":\"stopEngine\",\"preconditionItemList\":[{\"alias\":\"doorClose\",\"code\":-1,\"discontent\":\"关闭车门\"},{\"alias\":\"lock\",\"code\":-1,\"discontent\":\"车辆上锁\"},{\"alias\":\"trunkClose\",\"code\":-1,\"discontent\":\"关闭尾门\"}]},{\"commandAlias\":\"openWindow\",\"preconditionItemList\":[{\"alias\":\"doorClose\",\"code\":-1,\"discontent\":\"关闭车门\"}]},{\"commandAlias\":\"closeWindow\",\"preconditionItemList\":[{\"alias\":\"doorClose\",\"code\":-1,\"discontent\":\"关闭车门\"}]}]",
    "vehicleCtrlCmdList": ["lock", "trunk_open", "window"],
    "airCondition": null,
    "needUpdateAPP": false,
    "rangeData": null,
    "needUpdateFirmware": false,
    "latestFirmwareVersion": "1.2.7",
    "latestFirmwareContent": null,
    "taskId": null
  }

//车况数据
let vehicleState = {
    //续航里程
    continuationMileage: {
        comment : '',
        value: 1,
        unit: '单位'
    },
    //续航里程/续航电量
    remainL : {
        comment : '',
        value: 1,
        unit: '单位'
    },
    //是否本地模式
    isLocalModel:{
        value: 1
    },
    //是否在p档？
    isStallP:{
        value:1
    },
    //行驶中
    isTraveling:{
        value:1
    },
    // 引擎状态
    isStart:{
        value:1
    },
    //
    power:{

    },
    //总里程
    totalMileage:{

    },
    //车内温度
    temperatureInside: {

    },
    //车门状态
    door:{

    },
    frontLeftDoor:{
        value: 1   //1-开启
    },
    frontRightDoor:{

    },
    rearLeftDoor:{

    },
    rearRightDoor:{

    },
    //车窗
    window : {

    },
    //尾门
    trunk :{

    },
    //电瓶电压
    voltage:{

    },
    //门锁状态
    doorLock:{

    }

}

//微信code
let authCode = ''