// 对外暴露接口，只涉及业务不关心功能
/*
使用方法
const emitter = new EventEmitter2();  //npm install eventemitter2 --save
const ble = new BLE(sn, emitter)

ble.listen(res => {
    switch (res.type) { // 蓝牙插件的反馈回调类型，目前有connect（链接），error(报错回调)，connect（操作反馈）
      case 'oprate':
        console.log('do something')
        break;
      case 'connect':
        console.log('do something')
        break;
      case 'error':
        console.log('do something')
        break;
        //todo 下面是原业务逻辑，写代码的时候需要参考下
    //     if (result.code != 0x0) {
    //       this.setServerState(71);
    //       logs.mon("bleConnectFinish", { uri: 3005, result: 4025 });
    //       logs.info('认证失败' + JSON.stringify(result));
    //       console.log('认证失败' + JSON.stringify(result));    
    //       if(result.code=='483'){//钥匙无效重新下载
    //         (new DownLoadKey()).downloadKey({
    //           currentCarObj: this.page.data.currentCarObj,
    //           sn: this.page.data.currentCarObj['sn'],
    //           reDownKey:true,
    //           callback:()=>{
    //             this.connectBt();
    //           }
    //         });
    //         return;
    //       }       
    //       this.connectBt();
    //     } else {
    //       console.log("认证成功。。。。。。。。。。。。。。。。。。。", this.page.data.currentCarObj);
    //       wx.setNavigationBarTitle({
    //         title: miniProgramConfig.title.default
    //       });
    //       this.setServerState(200);
    //       logs.mon("bleConnectFinish", { uri: 3005, result: 0 });
    //     }
    //     break;
    //   case 2:
    //     logs.mon("vehicleStatusBle", { uri: 3007, result: result });
    //     logs.info("车况3007:" + result);
    //     console.log("车况3007:" + result)
    //     vechicleAction.filterVehicleData(result);
    //     break;
    //   case 3:
    //     //console.log("车控", result);
    //     vechicleAction.setAnalysisVehicleControlData(result);
    //     break
    // }
})
const params = {
  sn : 'xxxxxx',  // 按照原业务逻辑，deviceName是sn的后5位
  emitter
}
ble.init(params);// params传递一下数据，主要是sn 
ble.send('some cmd') // 控车
ble.stop() // 断开蓝牙
*/

///
import BLEHandler from "./bleHandler"

class BLE extends BLEHandler {
    constructor(sn, emitter) {
        super(sn, emitter)
    }
    listen(callback) {
        // 蓝牙事件注册,打开bleChannel
        this.emitter.removeAllListeners("bleChannel")
        this.emitter.on("bleChannel", callback)
    }
    removeListen() {
        // 移除所有蓝牙事件
        this.emitter.removeAllListeners("bleChannel")
    }
    async init() {
        // todo 调用之前需要业务方判断是否登录等条件，
        await this.connect()
    }

    async connect(){
      //todo 这里需要置顶失败流程的策略，读取返回的res，发现失败可能需要重启蓝牙流程
      let flow = false
        // 打开蓝牙适配器状态监听
        this.onBLEConnectionStateChange()
        // 蓝牙适配器初始化
        await this.openAdapter()
        // 搜索蓝牙设备
        await this.startSearch()
        // 获取设备ID
        flow = await this.onBluetoothFound()
        // 停止搜索设备
        // await this.stopSearchBluetooth()
        if (!flow) return  // 未搜索到设备
        // 连接蓝牙
        await this.connectBlue();
        if(!this.isIphone){
          // 针对安卓，设置蓝牙低功耗最大传输单元
          //todo ,只针对安卓5.1以上，建议加版本判断
          await this.setBLEMTU()
          // 老业务逻辑下后面几个微信接口错误报错，都会对emtu是否设置进行处理
        }
        // 获取serviceId
        await this.getBLEServices()
        // 设置特征值
        await this.getCharacteristics();
        // 订阅特征值
        await this.notifyBLECharacteristicValueChange()
        // 打开传输监听，等待设备反馈数据
        this.onBLECharacteristicValueChange()
    }
    async initChar(){
      var fea = ta.exchangeFeatures();
      
    }

    // 发送指令
    async send(mudata, cmd) {
      //todo 调用这里的时候需要外部业务代码先判断使用蓝牙还是4g，使用4g的时候关闭车门需要提醒，原业务代码在sendCommandhis.page.data.currentCarObjDetail['electricTrunkOpen']&&!this.page.data.hasBleConnected)
      //todo 外部调用的业务逻辑害需要判断业务执行条件，原业务在这CAR.controlPreconditio
      let flow = await this.sentOrder(mudata, cmd)
      return flow
    }
    async close() {
        await this.closeBLEConnection()
        await this.closeBLEAdapter()
    }
    getBleData(key){
      // 这里是一个多态，1，不传递key，返回整个对象，2.传递数组key，返回命中的key对象，3传递单值key，命中返回值，不命中返回整个对象
      // 这里暴露一些蓝牙设置的属性，方便外部调用，传递key，数组
      const defaultData = {
        sn: this.sn
        // todo这里增加数据
      }
      var resArr
      let type = Object.prototype.toString.call(key)
      if(!key || !this[key]){
        resArr = defaultData
      } else if(type === '[object String]'){
        resArr = this[key]
      } else if(type === '[object Array]'){}

    }

}

export { BLE };
