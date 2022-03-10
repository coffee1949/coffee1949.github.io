/**
 * 
 *  相关配置信息
 * 1 能力集配置（支持的车控命令列表）
 * 2 车况解析配置
 * 3 车控执行前置条件配置
 * 
 */

/**
 * 名词说明
 * state -- 代表车况，车在运行过程中产生的状态，如车门开关情况
 * config -- 车辆相关设置项，如是否打开标定数据
 * info -- 车辆本身相关信息，物理实体信息，比如车油箱大小
 */

/**
 * 用户登陆
 loginInfo: {
            checkCode = '',用rsa公钥加密的des密码
            clientSign = '',客户端签名
            clientToken = '',用des密码加密的access_token
            selfUserId = ''自己系统的UserId
  }
  cb参数：{
    code : 200/201,
    message : "登录成功"/登录失败
   }
 */

function login(loginInfo, cb) {

}

/**
 * 主动触发下载车钥匙（登录态才能使用）
 * @param keyId - 钥匙唯一标示，可以是sn
 * cb参数：{
    code : 200/201
    message : "下载成功"/下载失败
   }
 */
function downloadKey(keyId, cb) {

}
/**
 * 主动删除本地车钥匙
 * @param keyId - 钥匙唯一标示，可以是sn
 * cb参数：{
    code : 200/201
    message : "删除成功"/删除失败
   }
 */
function deleteKey(keyId, cb) {

}
/**
 * 获取钥匙状态
 * @param keyId - 车辆钥匙唯一标示，可以是roleId
 * 1-待领取, 2-已领取, 3-已过期, 4-已撤回, 5-已冻结
 */
function getKeyStatus(keyId) {
  let keyStatus = {
    code: 1,
    message: "待领取"
  }
  return keyStatus
}

/**
 * 分享钥匙 - 二期需求
 * @param keyId - 钥匙权限唯一标示，可以是roleId
 */
function shareKey(keyId) {

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
function sendCommand(cmd, fn) {

}

/**
 * 获取可执行的命令配置,返回命令总集的子集
 * @param vehicleId - 车辆唯一标示，可以是sn
 */
function getCommandList(vehicleId) {
  return [
    "lock",  //解锁闭锁车辆
    "trunk_open",  //开后尾门
    "trunk_close", //关后尾门
    "window",  //开/闭窗
    "engine"  //启动/关闭引擎
  ]
}

/**
 * 获取车辆详情
 * @param vehicleId - 车辆唯一标示，可以是roleId
 */
function getVehicleInfo(vehicleId) {
  return {
    "ownerUserMobile": "18516285834",  //车主手机号
    "sn": "A12B080A541BD3",  //车辆sn
    "keyId": "856f30e54e634d02a760eec6083c9006", //钥匙唯一id
    "isOwner": 1,  //是否车主
    "startTime": 1636353527000,  //当前钥匙权限开始和结束时间（针对被分享钥匙的用户）
    "endTime": 2267505527000,
    "revocationTime": null,  //钥匙撤回时间针对被分享钥匙的用户）
    "vehicleId": "d3872912daec441eb74fd7dfc10be230", //车辆唯一id
    "vehicleName": "我的爱车BD3",  //车辆名称
    "vehicleModelId": "id4x", //车辆品牌id
    "vehicleModelName": "上汽大众 ID.4X(21款)",  //车辆品牌名称
    "vin": null, //vin号
    "keyStatus": 101, // 101-使用中,102-待生效,104-已过期,105-已撤回,111-已解绑,112-已过户, 120-已冻结（客服操作冻结）
    "electricCar": 1, //是否电车 1- 是 0-否
    "fuelVolumeMax": 100, //最大油量
    "mileageMax": null, //最大里程数
    "currentFirmwareVersion": "1.2.7", //当前固件版本
    "hardwareType": 3,  //硬件类型 1-单蓝牙，2-4g 3-蓝牙+4g  
    "vehicleBrandIcon": null,  //车辆品牌logo
    "vehicleCtrlCmdList": ["lock", "trunk_open", "window"]  //车控能力列表
  }
}

/**
 * 获取车辆配置
 * @param vehicleId - 车辆唯一标示，可以是sn
 * return [
 *  {
 *    configType: 1, 1-智能接闭锁开关, 2-定位开关, 3-离车告警开关,4-电动后尾门,5-智能接闭锁消息通知开关
 *    configValue: 0,  0-关闭, 1-开启
 * }
 * ]
 */
function getVehicleConfig(vehicleId) {

}

/**
 * 更新车辆配置
 * @param vehicleId - 车辆唯一标示，可以是sn
 * @param params 
 * {
 *  configType: 1, 1:智能接闭锁开关,2:定位开关 ,3:离车提醒,4:电动尾门设置,5:智能接闭锁消息通知开关,
 *  configValue: 1, 0-关闭, 1-开启
 *  sn:
 *  timeout:
 * }
 */
function updateVehicleConfig(vehicleId, params) {

}

/**
     * 订阅消息
     * @param {*} topic - VS- 车况， ble-蓝牙连接情况， 4g-4g连接情况 ，operate-操作, VC-车控流程
     * @param {*} fn - 回调
     * fn参数：res
     * 1. 车况信息: res = 参见 VehicleState
     * 2. ble: res = {
        code: xxx,  参加 蓝牙连接code定义
        message: '',
        data?: {}
     }
     * 3. 4g: res = {
        code: xxx,  参见 4g连接code定义
        message: '',
        data?: {}
     }
     * 4. operate: sdk需要小程序客户端进行操作的消息
     res = {
        code: xxx,  参见 操作code定义
        message: '',
        data?: {}
     }
     * 5. VC : 返回车控的各个流程和阶段
*/
function subscribe(topic, fn) {

}

/**
 * 同步返回当前车况信息
 * @param vehicleId - 车辆唯一标示，可以是sn
 * return VehicleState
 */
function askForVehicleState(vehicleId) {
  return {
    key: string,    //车况建值
    name: string,   //车况名
    comment: string,  //描述
    type: string, //数据类型  int/double/float
    groupKey?: string,  //车况组键值
    groupName?: string,  //车况组名
    warnType?: number,  //告警类型
    warnValues?: Array < number >, //触发告警值
    unit?: string,  // 单位
    value: 1, //车况数值
    valueZn: 'dfdf' //中文名
  }
}

/**
 * 主动触发车辆连接，触发sdk初始化，包含重新获取数据以及蓝牙和4g初始化，设置初始化车况监听
 * @param vehicleId - 车辆唯一标示，可以是sn
 * @param cb - 回调 （回调必须执行，只返回最终的成功和失败状态）
 * cb参数 res ={
    code: xxx,
    message: 'xxxxxxx',
    data?: {}
  }
  200 - 连接车辆成功 （4g或者蓝牙连接成功都算成功）
  201 - 连接车辆失败
 */
function connectVehicle(vehicleId, cb) {

}

/**
 * 主动断开车辆连接
 * @param  vehicleId - 车辆唯一标示，可以是sn
 * @param cb 
 */
function disconnectVehicle(vehicleId, cb) {

}


/**
 * 返回客户端的车况数据格式
 */
interface VehicleState {
  key: string,    //车况建值
  name: string,   //车况名
  comment: string,  //描述
  type: string, //数据类型  int/double/float
  groupKey?: string,  //车况组键值
  groupName?: string,  //车况组名
  warnType?: number,  //告警类型
  warnValues?: Array<number>, //触发告警值
  unit?: string,  // 单位
  value: 1, //车况数值
  valueZn: 'dfdf' //中文名
}


//蓝牙连接code定义
/**
 * 1000 - 蓝牙连接断开
 * 1001 - 开始蓝牙配对
 * 1002 - 蓝牙配对成功
 * 1003 - 蓝牙配对失败
 * 1004 - 蓝牙未开启
 * 1005 - 蓝牙未授权
 * 1006 - 定位未开启
 * 1007 - 定位未授权
 *
 * 1101 - 打开蓝牙适配器
 * 1102 - 蓝牙适配器打开成功
 * 1103 - 蓝牙适配器打开失败
 * 1104 - 关闭蓝牙适配器
 * 1105 - 蓝牙适配器状态变化
 * 1106 - 获取蓝牙适配器状态
 *
 * 1201 - 开始扫描蓝牙设备
 * 1202 - 扫描蓝牙设备成功
 * 1203 - 扫描蓝牙设备失败
 * 1204 - 扫描到蓝牙设备
 * 1205 - 未扫描到蓝牙设备
 *
 * 1301 - 开始蓝牙BLE连接
 * 1302 - 蓝牙BLE连接成功
 * 1303 - 蓝牙BLE连接失败
 * 1304 - 开始蓝牙BLE断连
 * 1305 - 蓝牙BLE断开
 * 1306 - 蓝牙BLE断连失败
 *
 * 1401 - 获取蓝牙服务
 * 1402 - 获取到的蓝牙服务
 * 1403 - 获取蓝牙服务失败
 *
 * 1501 - 获取特征值
 * 1502 - 获取特征值成功
 * 1503 - 获取特征值失败
 *
 * 1601 - 订阅特征值
 * 1602 - 订阅特征值成功
 * 1603 - 订阅特征值失败
 *
 * 1701 - featureExchange
 * 1702 - featureExchange成功
 * 1703 - featureExchange失败
 *
 * 1801 - rtc校准
 * 1802 - rtc校准成功
 * 1803 - rtc校准失败
 *
 * 1901 - 蓝牙认证
 * 1902 - 蓝牙认证成功
 * 1903 - 蓝牙认证失败
 */

//4g连接code定义
/**
 * 2000 - 4g连接断开
 * 21xx - 获取mqtt连接信息 2xx-连接mqtt
 * 2101 - 获取mqtt连接信息
 * 2102 - 获取mqtt连接信息成功
 * 2103 - 获取mqtt连接信息成功
 *
 * 2201 - 开始连接mqtt
 * 2202 - 连接mqtt成功
 * 2203 - 连接mqtt失败
 * 2204 - 重连mqtt
 * 2206 - 订阅成功
 * 2207 - 订阅失败
 * 2208 - 发送车控命令
 */

//操作code定义
/**
 * 100 - 蓝牙配对码展示
    { code 100
      message: '蓝牙配对码展示'
      data:{
        info: paircode
      }
    }
 */







