
import { print } from "../../utils/bsUtils";
import * as b from "../../services/bussBase";
//const mqtt = require('mqtt')
import mqtt from "../../libs/mqtt.min.js"
import { _getVeicleOnlineStatus } from "../../services/bussBase"


/**
 * 21xx - 获取mqtt连接信息 22xx-连接mqtt
 *
 * 2101 - 获取mqtt连接信息
 * 2102 - 获取mqtt连接信息成功
 * 2103 - 获取mqtt连接信息失败
 * 
 * 2201 - 开始连接mqtt
 * 2202 - 连接mqtt成功
 * 2203 - 连接mqtt失败
 * 2204 - 重连mqtt
 * 2206 - 订阅成功
 * 2207 - 订阅失败
 * 2208 - 发送车控命令
 */

class Carriers {
  constructor(sn, emitter) {
    this.sn = sn;
    this.emitter = emitter;

    this.url = ""; //当前连接地址
    this.client = null;
  }

  connect(connectOpt) {
    connectOpt = connectOpt || wx.getStorageSync("Nokey-iot4g")
    if (!connectOpt) {
      this.emitter.emit("4gChannel", {
        type: "connect",
        code: 2103,
        data: {
          stage: "connect",
        },
      });
      return;
    }
    this._connectMqtt(connectOpt);
  }

  _connectMqtt({
    aliIotClientId,
    aliIotPassword,
    aliIotTopic,
    aliIotUsername,
    aliIotAddressList
  }) {
    if (this.client) {
      this.client = null;
    }
    let url = "wxs://" + aliIotAddressList[0].address;
    let that = this;
    const options = {
      connectTimeout: 6000, // 超时时间
      clientId: aliIotClientId,
      username: aliIotUsername,
      password: aliIotPassword,
      url: url,
    };
    this.client = mqtt.connect(url, options);
    this.client.on("reconnect", info => {
      that.emitter.emit("4gChannel", {
        type: "connect",
        code: 2204,
        message: '重连mqtt',
        data: {
          stage: "reconnect",
          info: info,
        },
      });
    });
    this.client.on("error", error => {
      that.emitter.emit("4gChannel", {
        type: "connect",
        code: 2203,
        message:'连接mqtt失败',
        data: {
          stage: "error",
          info: error,
        },
      });
    });
    this.client.on("connect", async res => {
      that.emitter.emit("4gChannel", {
        type: "connect",
        code: 2202,
        message: "连接mqtt成功",
        data: {
          stage: "connected",
          info: res,
        },
      });
      let [err, data] = await _getVeicleOnlineStatus(that.sn)
      if (!err) {
        that.emitter.emit("4gChannel", {
          type: "connect",
          code: 2209,
          message: "4g连接成功",
          data: data.data
        });
      }else{
        if([10002020, 17022, 10002030].indexOf(err.data.code) > 0){
          this.emitter.emit("info", {
            code:403,
            message: "登录异常"
          })
        }
      }

      //订阅一个主题
      that.client.subscribe(
        aliIotTopic,
        {
          qos: 0,
        },
        (error, granted)=> {
            if(error){
                that.emitter.emit("4gChannel", {
                    code: 2207,
                    message: "订阅失败",
                    type: "connect",
                    data: {
                      stage: "subscribe",
                      info: err,
                    },
                  });
            }else{
                that.emitter.emit("4gChannel", {
                    code: 2206,
                    message: "订阅成功",
                    type: "connect",
                    data: {
                      stage: "subscribe",
                      info: granted,
                    },
                  });
            }
          
        }
      );
    });
    this.client.on("message", function (topic, message) {
      print("4g received topic:", topic);
      print("4g received msg:", JSON.parse(message.toString()));
      that._handleMessage(topic, message);
    });
  }

  /**
   * 4g返回的车况处理和分发
   * @param {*} topic
   * @param {*} message
   * {
   *  messageId,
   *  notifyType,
   *  messageBody:{
   *      type,
   *      data:{ sn }
   * }
   * }
   * @returns
   */
  _handleMessage(topic, message) {
    if (!message) {
      return;
    }
    let vehicleData = JSON.parse(message.toString());
    print("4g返回的数据：", vehicleData)
    let sn = vehicleData.messageBody.data.sn;
    if (this.sn != sn) {
      print(`非当前车辆数据，当前车辆${this.sn}, 返回的车辆${sn}`);
      return;
    }
    let type = vehicleData.messageBody.type; //业务类型
    switch (type) {
      case 1: //车况接收
        this._handleVsPush(vehicleData);
        break;
      case 3: //车辆在线离线
        this._handleOfflinePush(vehicleData);
        break;
      case 7: //钥匙冻结
        break;
      case 8: //钥匙解冻
        break;
      case 9: //钥匙过期
        break;
      case 10: //智能服务已过期
        break;
      case 11: //智能服务即将过期
        break;
      case 12: //单点登录
        break;
    }
  }

  /**
   * 处理车况推送
   * @param {*} vehicleData
   */
  _handleVsPush(vehicleData) {
    print("4g返回的车况", vehicleData);
    let vehicleStatusDataStr = vehicleData.messageBody.data.vehicleStatusData;
    let wordArray = wx.CryptoJS.enc.Base64.parse(vehicleStatusDataStr);
    let vehicelHex = wordArray.toString(wx.CryptoJS.enc.Hex);
    let messageId = vehicleData.messageBody.data.messageId;
    print("4g返回的16进制车况3008:", vehicelHex);
    this.emitter.emit("4gChannel", {
      type: "vs",
      data: vehicelHex,
    });
    //同步messageId到云端
    b._stateDataAck(this.sn, messageId);
  }

  /**
   * 处理上下线推送消息
   * @param {*} vehicleData
   */
  _handleOfflinePush(vehicleData) {
    print("上下线推送", vehicleData);
    let data = vehicleData.messageBody.data;
    this.emitter.emit("4gChannel", {
      type: "status",
      data: data.status,
    });
  }

  /**
   * 通过4g发送车控命令
   * @param {*} command
   */
  sendCommand(command) {
    let gencData = command.hexTag + "01" + command.hexValue;
    let commandValue = wx.CryptoJS.enc.Base64.stringify(
      wx.CryptoJS.enc.Hex.parse(gencData)
    );
    b._sendCommand(this.sn, command.commandType, commandValue);
    this.emitter.emit('4gChannel',{
      type: "connect",
      code: 2208,
      message: "通过4g发送车控指令",
      data: command
    })
  }
}

export default Carriers;
