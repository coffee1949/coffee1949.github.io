// 集成功能直接调用，不关心底层,处理逻辑
import * as t from "./bleBase"
import * as b from "../../services/bussBase"
import { ta, packet } from "../../utils/dataAssemble";
import { ab2hex, hexCharCodeToStr, Str2Bytes } from '../../utils/encodeUtils';
import { print, getFeatureExchange } from '../../utils/bsUtils'
import { isAndriod, isIos } from "../../utils/wxUtils";

/**
 * 蓝牙连接Topic说明
 * topic名称： bleChannel
 * 数据类型：
 * {
 *    type: connnet-连接信息，info-车控/车况数据返回/配置数据返回
 *    code:  //11xx-蓝牙适配器相关， 12xx-扫描蓝牙设备, 13xx- 连接ble设备相关, 14xx-获取服务相关, 15xx-获取特征值, 16xx-订阅特征值
 *    message: ''
 *    data: {}
 * }
 * connect 1xxx - 返回连接的状态和阶段
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
 * 1311 - 开始蓝牙BLE断连
 * 1312 - 蓝牙BLE断开成功
 * 1313 - 蓝牙BLE断连失败
 * 1314 - 蓝牙断开连接
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
 * 1904 - 钥匙不可用
 * 
 * info 2xxx - 车况/车控/配置信息返回
 * 2100 - 车况数据返回
 * 2202 - 车控命令执行成功
 * 2203 - 车控命令执行失败
 * 2204 - 车控命令写入成功
 * 2205 - 车控命令写入失败
 * 2206 - 车控命令写入
 * 2301 - 车控版本返回
 * 2302 - rtc校验方式返回
 * 2303 - 车控命令执行结果返回
 * 
 * 
 */


/**
 * 蓝牙工具类
 * 封装小程序蓝牙流程方法
 * 处理事件通信
 */

/**
 * params:{
 *  sn,
 *  macAddress
 * }
 */
class BLEHandler {
  constructor(emitter, params) {
    print('in bleHandle params are: ', params)
    this.sn = params.sn  // 通信的主要数据载体
    this.uri = [0x00, 0x04] //组装命令的头部定义, 有两种，一种是04，一种是40
    this.hasConnected = false // 是否建立蓝牙连接（但未连上车辆）
    this.driving = false // 是否行驶中
    this.dealingCmd = false // 正在处理控车命令的标识（同一时段，只能处理一条蓝牙写入命令）
    this.isLocalModel = false // 是否本地模式

    this.connectMaxTime = 3 // 自动重连蓝牙次数，超过3次报错
    this.deviceName = "iKey" + this.sn.substr(-5);

    this.macAddress = params.macAddress // 安卓可以从云端直接获取到mac地址
    this.blename = this.sn.substr(-5); // 用来匹配蓝牙设备的name，sn的后五位
    this.emitter = emitter
    this.readCharacteristicId = "";  // 读取id
    this.writeCharacteristicId = "";// 写入id
    this.notifyCharacteristicId = ""; // 监听通知id
    this.rtcType = 'b2' //校准方式b2,强制。b3 异步
    this.serviceId = ""; // deviceId对应的uuid，用来获取特征值
    this.lastDate = new Date().getTime()
    this.isIphone = isIos()
    this.deviceId = (!this.isIphone) && this.macAddress
    this.mtuvalue = 190 //安卓蓝牙低功耗最大传输单元  
    this.mtuSet = false //记录mtuvalue是否设置，会在wx接口出错时候用来处理报错 //todo，老业务字段，需要判断
    this.services = ['0000FFF0-0000-1000-8000-00805F9B34FB'] //ios环境直接搜索特定的蓝牙uuid
    //this.services = this.isIphone ? ['0000FFF0-0000-1000-8000-00805F9B34FB'] : [] //ios环境直接搜索特定的蓝牙uuid
    this.discoverTimer = null  //扫描定时器
    this.connectTime = 0  //蓝牙连接次数
  }

  /**
   * todo
   * @returns 初始化蓝牙连接
   * 总共分为几个步骤：
   * 1 蓝牙配对
   * 2 下载钥匙  （目前缺失）
   * 3 订阅特征值
   * 4 认证钥匙
   */
  async initBle() {
    // 先关闭一下蓝牙适配器
    await this.closeBLEConnection()
    await this.closeBLEAdapter()
    wx.offBluetoothAdapterStateChange();
    //监听蓝牙适配器状态变化
    //this.onBluetoothAdapterStateChange()
    // 监听蓝牙连接状态变化
    //this.onBLEConnectionStateChange()
    ta.init()
    await this.connect()

  }

  async connect() {
    let hasBluetouthAdapterReady = await this._getBluetoothAdapterState()
    let hasConnectedDevices = false
    //蓝牙适配器未就绪
    if (!hasBluetouthAdapterReady) {
      //打开蓝牙适配器
      let openSuc = await this._openAdapter()
      if (openSuc) {
        hasConnectedDevices = await this._getConnectedBluetoothDevices()
      } else {
        // todu - 提示蓝牙适配器权限问题
        //error.state=='3'&&Alert.iphone_bleAuthorized
        return
      }
    } else {
      hasConnectedDevices = await this._getConnectedBluetoothDevices()
    }
    //已经连接到蓝牙
    if (hasConnectedDevices) {
      this.hasConnected = hasConnectedDevices
      await this._communicateBle()
      return
    } else {
      //扫描设备
      let hasStartSearched = await this._startSearch()
      this.onBluetoothFound()
      //安卓端其实不需要扫描设备，其deviceId就是macAdress
      // if (hasStartSearched && this.isIphone) {
      //   //设置扫描时间10秒
      //   this.discoverTimer = setTimeout(() => {
      //     this.emitter.emit("bleChannel", {
      //       type: "connect",
      //       code: 1205,
      //       message: "未扫描到蓝牙设备"
      //     })
      //     t._stopSearchBluetooth()
      //   }, 10 * 1000)
      //   this.onBluetoothFound()
      // } else {
      //   //安卓端其实不需要扫描设备，其deviceId就是macAdress
      //   t._stopSearchBluetooth()
      //   this._communicateBle()
      // }
    }
  }

  /**
   * 获取蓝牙适配器状态
   */
  async _getBluetoothAdapterState() {
    //获取蓝牙适配器状态
    let [err, res] = await t._getBluetoothAdapterState.call(this)
    print("蓝牙适配器状态 is:", res)
    //如果适配器未打开或者打开失败
    if (err || (res && !res.available)) {
      return false
    } else {
      return true
    }
  }

  async _openAdapter() {
    let [err, res] = await t._openAdapter.call(this);
    //获取蓝牙适配器出错
    if (err) {
      print("打开蓝牙适配器失败")
      /**
       * 仅针对ios,state 3 - 蓝牙设备未授权
       */
      if (this.isIphone && err.state == 3) {
        //todo 弹窗提示打开ios权限
        this.emitter.emit("bleChannel", {
          type: "connect",
          code: 1005,
          message: "蓝牙未授权"
        })
      }
      if (1000 == err.errCode || 1001 == err.errCode) {
        this.emitter.emit("bleChannel", {
          type: "connect",
          code: 1004,
          message: "蓝牙未开启"
        })
      }
      return false
    }
    return true
  }


  /**
   * 获取已连接设备
   * @returns 
   */
  async _getConnectedBluetoothDevices() {
    //获取已连接设备
    let [err, res] = await t._getConnectedBluetoothDevices.call(this)
    print("已连接的设备有： ", res)
    //找到已连接设备
    if (res?.devices && res.devices.length > 0) {
      let array = res.devices;
      let target = array.find(item => {
        return item.name == this.deviceName || item.deviceId == this.macAddress;
      })
      if (target && target.deviceId) {
        this.deviceId = target.deviceId
        return true
      }
      return false
    } else {
      return false
    }
  }


  async _communicateBle() {
    print("开始连接蓝牙")
    //1 建立连接
    if (!this.hasConnected) {
      let re = await this._connectBle()
      if (!re) {
        return
      }
    }
    let hasGetServices = await this._getBLEServices()
    print("拿到services了吗？", hasGetServices)
    if (hasGetServices) {
      let hasGetCh = await this._getCharacteristics()
      if (hasGetCh) {
        this.notifyBLECharacteristicValueChange()

        this.doFeatureExchange()

      }
    } else {
      this.hasConnected = false
      this._communicateBle()
    }
  }

  async _setBLEMTU() {
    let [err, res] = await t._setBLEMTU.call(this);
    if (err != null) {
      this.emitter.emit("bleChannel", {
        type: "connect",
        message: "安卓setBLEMTU设置出错",
        data: err
      })
      return;
    }
    return true
  }
  async _startSearch() {
    let [err, res] = await t._startSearch.call(this);
    if (res) {
      return true
    }
    return false

  }
  onBluetoothFound() {
    wx.onBluetoothDeviceFound(res => {
      print('on found', res)
      let current = res.devices[0]
      if (!current.name) {
        // 过滤无name的蓝牙设备,节省性能
        return
      }
      // ios 需要用deviceName匹配deviceID
      if (this.deviceName === current.name) {
        // 找到匹配的设备，设置deviceId
        this.deviceId = current.deviceId;//5907d0bb2
        t._stopSearchBluetooth()  //停止查找新设备 停止监听新设备发现
        this._communicateBle()  //连接设备并与设备建立通信
      }
    })
  }

  //连接蓝牙设备
  async _connectBle() {
    let [err, res] = await t._connectBle.call(this);
    //安卓必须设置mtu，否则无法通信
    if (isAndriod()) {
      await this._setBLEMTU()
    }
    this.connectTime++
    if (err != null) {
      if (this.connectTime <= this.connectMaxTime) {
        this._connectBle()
        return
      } else {
        this.hasConnected = false
        this.emitter.emit("bleChannel", {
          type: "connect",
          code: 1303,
          message: "蓝牙BLE连接失败"
        })
        return false;
      }
    }
    this.hasConnected = true
    this.emitter.emit("bleChannel", {
      type: "connect",
      code: 1302,
      message: "链接蓝牙成功"
    })
    return true
  }
  async _getBLEServices() {
    let [err, res] = await t._getBLEServices.call(this);
    if (err != null) {
      return false;
    }
    return true
  }

  async _getCharacteristics() {
    let [err, res] = await t._getCharacteristics.call(this);
    if (err != null) {
      // 取消连接
      this.closeBLEConnection()
      this.closeBLEAdapter()
      return;
    }
    return true
  }

  async notifyBLECharacteristicValueChange() {
    let [err, res] = await t._notifyBLECharacteristicValueChange.call(this);
    if (err != null) {
      // 取消连接
      this.closeBLEConnection()
      this.closeBLEAdapter()
      return;
    }
    this.onBLECharacteristicValueChange()
    // todu 是否需要存储蓝牙连接状态
    //wx.setStorageSync("bluestatus", "on");
    return true
  }
  async closeBLEConnection() {
    let [err, res] = await t._closeBLEConnection.call(this);
    //断连成功
    if (err != null) {
      //todo 做一些断连成功操作
      this.emitter.emit("bleChannel", {
        type: "connect",
        code: 1312,
        message: "蓝牙BLE断连成功"
      })
      return true
    } else {
      this.emitter.emit("bleChannel", {
        type: "connect",
        code: 1313,
        message: "蓝牙BLE断连失败"
      })
      return false
    }
  }
  async closeBLEAdapter() {
    let [err, res] = await t._closeBLEAdapter.call(this);
    if (err != null) {
      return false
    } else {
      return true
    }
  }


  /**
   * 发送车控命令
   * @param {*} command.value - 车控命令 eg: [0x01, 0x01]
   * @returns 
   */
  async sendCommand(command, uri) {
    //设置车控命令版本
    if (uri) {
      this.uri = uri
    }
    let commandHex = this.uri
    if (command.commandAlias === "refrush") {
      commandHex = [0x00, 0x31]
    }
    var encData = ta.encryptData(this.sn, commandHex, command.value);
    print("发送的车控指令", encData[0])
    this.emitter.emit('bleChannel', {
      type: "info",
      code: 2206,
      message: "车控命令写入",
      data: command
    })
    let done = await this.writeBle(encData[0])

    if (!done) {
      this.emitter.emit("bleChannel", {
        type: "info",
        code: 2205,
        message: "车控命令写入失败"
      })
      return
    } else {
      this.emitter.emit("bleChannel", {
        type: "info",
        code: 2204,
        message: "车控命令写入成功"
      })
    }
    return true

  }
  /**
   * 开始连接车钥匙，第一步是做featureexchange
   */
  async doFeatureExchange() {
    print("开始做featureExchange")
    this.emitter.emit("bleChannel", {
      type: "connect",
      code: 1701,
      message: "featureExchange阶段"
    })
    var fea = ta.exchangeFeatures();
    await this.writeBle(fea[0])
  }


  async writeBle(value) {
    // 单纯写入命令
    let buffer = new Uint8Array(value.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
    let [err, res] = await t._writeBLECharacteristicValue.call(this, buffer)
    if (err != null) {
      return
    }
    return true
  }

  /**
   * 监听蓝牙连接状态变化
   */
  onBLEConnectionStateChange() {
    wx.onBLEConnectionStateChange(res => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      if (!res.connected) {
        //this.closeBLEAdapter()
        // wx.setStorageSync("bluestatus", "");
        this.emitter.emit("bleChannel", {
          type: "connect",
          code: 1314,
          message: "蓝牙断开连接"
        })
      }else{
        print("----------蓝牙设备连接上了--------")
      }
    })
  }

  /**
   * 监听蓝牙适配器状态变化
   * 只有在调用了openAdapter接口以后才会触发
   */
  onBluetoothAdapterStateChange() {
    wx.offBluetoothAdapterStateChange();
    wx.onBluetoothAdapterStateChange(res => {
      print('蓝牙适配器状态变化')
      this.emitter.emit("bleChannel", {
        type: 'connect',
        code: 1105,
        message: '蓝牙适配器状态变更',
        data: res
      })
      if (!res.available && !res.discovering) {
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 1104,
          message: '关闭蓝牙适配器'
        })
        print('蓝牙适配器不可用')
        //this.closeBLEConnection();
      }
      if (res.available) {
        // todo 检测到适配器打开
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 1101,
          message: '打开蓝牙适配器'
        })
      }
    })
  }

  /**
   * 做车端认证流程：
   * 1 发送featureExchange请求
   * 2 根据featureExchange结果进行对应操作（上报vin/设定车控协议版本/rtc校验）
   * 3 钥匙认证（需要发送两包数据）
   * @param {*} value 
   * @returns 
   */
  handleCharacteristicChange(value) {
    print("ble接收到车端返回：", value)
    let res = ta.hexStringToArray(value);
    if (res.length < 16) {
      return;
    }
    res = res.slice(16);
    //返回删除钥匙，暂未做处理 0021
    if (res[0] == 0x00 && res[1] == 0x21) {
      print("删除钥匙结果。。。。。", res);
      return
    }
    //校准方式b2,强制。b3 异步
    //rtc校准 0005
    if (res[0] == 0x00 && res[1] == 0x05) {
      print("rtc校准结果")
      let rtcResult = res[2] == 0x00 && res[3] == 0x00 ? true : false;
      if (!rtcResult && this.rtcType == 'b2') {
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 1803,
          message: 'rtc校准失败'
        })
        print("rtc校准失败");
        return;
      } else {
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 1802,
          message: 'rtc校准成功'
        })
        print("rtc校准成功");
        //开始认证
        this.doCertification(1)
      }
      return;
    }
    /**
     * 00ff表示车端featureExchange返回，参见https://confluence.ingeek.com/pages/viewpage.action?pageId=34347197
     * 
     */
    if (res[0] == 0x00 && res[1] == 0xff) {

      //解析车端的功能集合
      let vehicleFeatures = getFeatureExchange(value);
      print("进行feature exchange，包含的车辆功能有：", vehicleFeatures)
      //处理车况上报逻辑
      this._handleReport(vehicleFeatures)
      this._handleUri(vehicleFeatures)
      this._handleRtc(vehicleFeatures)
      return
    }
    //车端认证0003
    if (res[0] == 0x00 && res[1] == 0x03) {
      print("进行车端认证")
      var result = ta.parseAuthPacket(this.sn, res.slice(2));
      //继续写入第二包
      if (result.code == 0x01e1) {
        this.doCertification(2)
      } else {
        //处理认证返回结果
        this._handleAuthResult(result)
      }
      return;
    }
    //车况数据返回
    if (res[0] == 0x00 && res[1] == 0x10) {
      var result = ta.decryptData(this.sn, res.slice(2));
      print("ble车端数据返回", result)
      //todo 接受数据的回调
      this.emitter.emit("bleChannel", {
        type: 'info',
        code: 2100,
        message: '车况数据返回',
        data: result
      })
      return;
    }
    //老车控指令，不返回车控执行结果
    if (res[0] == 0x00 && res[1] == 0x04) {
      var result = ta.decryptData(this.sn, res.slice(2));
      this.emitter.emit("bleChannel", {
        type: 'info',
        code: 2303,
        message: '车控执行结果返回',
        data: result
      })
    }
    //新车控指令，返回车控执行状态
    if (res[0] == 0x00 && res[1] == 0x40) {
      print("ble车控指令返回")
      var result = ta.decryptData(this.sn, res.slice(2));
      this.emitter.emit("bleChannel", {
        type: 'info',
        code: 2303,
        message: '车控执行结果返回',
        data: result
      })
    }
  }

  /**
   * 处理钥匙认证结果
   */
  async _handleAuthResult(result) {
    print("处理认证返回结果", result)
    //认证不成功
    if (result.code != 0x0) {
      //this.setServerState(71);
      //logs.mon("bleConnectFinish", { uri: 3005, result: 4025 });
      //logs.info('认证失败' + JSON.stringify(result)
      print("认证失败")
      if (result.code == '483') {
        print("钥匙不可用")
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 2003,
          message: '钥匙不可用',
          data: result
        })
      } else {
        this.emitter.emit('bleChannel', {
          type: 'connect',
          code: 1903,
          message: '蓝牙认证失败',
          data: result
        })
      }
    } else {
      this.onBluetoothAdapterStateChange()
      this.emitter.emit('bleChannel', {
        type: 'connect',
        code: 1902,
        message: '蓝牙认证成功',
        data: result
      })
    }
  }

  /**
   * rtc校准
   * @param {*} exchangedFeatures 
   */
  async _handleRtc(exchangedFeatures) {

    print('rtc校准', exchangedFeatures)
    if (!exchangedFeatures) {
      this.doCertification(1)
      return;
    }
    let rtc = exchangedFeatures.find(item => {
      return item.type == "B2"
    });
    print('rtc值：', rtc)
    //logs.info("rtc obj is"+JSON.stringify(rtc))
    //无须rtc校准，直接开始认证
    if (!rtc) {
      this.doCertification(1)
      return;
    }
    let rtcvalue = rtc.value.substr(0, 2);
    let randomNum = wx.CryptoJS.enc.Base64.stringify(wx.CryptoJS.enc.Hex.parse(rtc.value.substr(2, 12)));
    if (rtcvalue == "02") {
      this.rtcType = 'b2'
      this.emitter.emit('bleChannel', {
        type: 'info',
        code: 2302,
        message: 'rtc校验方式返回',
        data: 'b2'
      })
      //this._connectBleServices.rtcType="b2";
      //this._connectBleServices.workFlowF(55);
      //logs.info(55+ "需要云端校准");
      print('需要云端校准')
      let [err, res] = await b._rtcB2(this.sn, randomNum)
      if (!err) {
        print("云端获取到的rtc数据", res)
        //this._connectBleServices.workFlowF(56);
        let rtcTime = '0005' + wx.CryptoJS.enc.Base64.parse(res.data.rtcTime).toString();
        let rtcTimeAll = packet.buildPackets(Str2Bytes(rtcTime));
        this.writeBle(rtcTimeAll[0])
      } else {

      }
      return
    }
    //可选校准
    if (rtcvalue == "03") {
      this.rtcType = 'b3'
      this.emitter.emit('bleChannel', {
        type: 'info',
        code: 2302,
        message: 'rtc校验方式返回',
        data: 'b3'
      })
      //this._connectBleServices.rtcType="b3";
      print('被动校准')
      //logs.info("需要检查被动校准");
      let B9Obj = exchangedFeatures.find(item => {
        return item.type == "B9"
      });
      let timestamp = wx.CryptoJS.enc.Base64.stringify(wx.CryptoJS.enc.Hex.parse(B9Obj.value));
      print('rtc时间戳base64', timestamp)
      //logs.info("rtc时间戳:base64"+timestamp)

      b._rtcB3(this.sn, randomNum, timestamp).then(res => {
        let result = res[1]
        print("rtc time value", result)
        if (!result || !result.data['needUpdate']) {
          print("云端不需要异步校准")
          //logs.info("云端不需要异步校准");
          return;
        }
        let rtcTime = protocol.rtc + wx.CryptoJS.enc.Base64.parse(result.data.rtcTime).toString();
        let rtcTimeAll = packet.buildPackets(Str2Bytes(rtcTime));
        this.writeBle(rtcTimeAll[0])
      })
    }
    this.doCertification(1)
  }

  /**
   * 设置车控uri版本
   * @param {*} exchangedFeatures 
   */
  _handleUri(exchangedFeatures) {
    print('设置车控uri版本', exchangedFeatures)
    if (!exchangedFeatures) {
      return
    }
    let uriObj = exchangedFeatures.find(item => {
      return item.type == "B8"
    });
    if (!uriObj) {
      return;
    }
    let uri = uriObj.value == "01" ? [0x00, 0x40] : [0x00, 0x04];
    print('设置车控uri版本为：', uri)
    this.emitter.emit('bleChannel', {
      type: 'info',
      code: 2301,
      message: '车控版本返回',
      data: uri
    })
  }

  /**
   * 上报vin号
   * @param {*} exchangedFeatures 
   * @returns 
   */
  _handleReport(exchangedFeatures) {
    let vinObj = exchangedFeatures.find(item => {
      return item.type == "A5"
    });
    if (!vinObj) {
      return;
    }
    print('上报车辆信息vin等', vinObj)
    let vinCode = hexCharCodeToStr(vinObj.value);
    //logs.mon("vinBle", { uri: 3015, result: winCode });
    //reportVersion
    b._reportVersion({
      sn: this.sn,
      vin: vinCode
    }).then(res => {
      // todo 上报成功打点
    }).catch(err => {
      //todu 上报失败打点
    })
  }

  /**
   * 开始认证蓝牙
   * @param {*} type 
   */
  async doCertification(type) {
    //logs.info("0XFF后认证" + type + "时间差：" + (new Date().getTime() - this.time) / 1000 + "s");
    print("0XFF", type, new Date().getTime());
    if (type === 1) {
      this.emitter.emit('bleChannel', {
        type: 'connect',
        code: 1901,
        message: '开始蓝牙认证'
      })
    }
    var packet = ta.buildAuthPacket(this.sn, type);
    var packetArray = JSON.parse(JSON.stringify(packet));
    var times = 0;
    var startWritePacket = async (value) => {
      //logs.info(type + ">>>>>写入蓝牙的值", value);
      print("写入蓝牙的值", value)
      let write_res = await this.writeBle(value)
      if (write_res) {
        // 写入成功之后递归处理
        times += 1;
        if (times < packetArray.length) {
          startWritePacket(packetArray[times])
        }
      } else {
        print("写入writeAuthPacket失败", JSON.stringify(error))
      }
    };
    startWritePacket(packetArray[0])
  }

  // 收到设备推送的notification
  onBLECharacteristicValueChange() {
    print("设置特征值监听")
    wx.onBLECharacteristicValueChange(res => {
      this.handleCharacteristicChange(ab2hex(res.value))
    })
  }
}
export default BLEHandler
