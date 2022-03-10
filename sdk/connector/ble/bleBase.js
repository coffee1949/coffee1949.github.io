// 底层功能的包装
// 这里是对微信接口的调用和封装，
// 只提供方法包装，直接返回调用接口结果，纯函数，函数内部不保存各种方法
// 处理兼容性


let debug = true //是否开启蓝牙调试,调试才输出

import { promisify } from '../../utils/wxUtils'
import { print } from '../../utils/bsUtils'

// 初始化蓝牙适配器
function _openAdapter() {
    print(`—————— —————— ——————`);
    print(`准备初始化蓝牙适配器...`);
    return promisify(wx.openBluetoothAdapter).then(
        (res) => {
            print(`✔ 适配器初始化成功！`)
            this.emitter.emit("bleChannel", {
                type: "connect",
                code: 1102,
                message: "蓝牙适配器打开成功"
            })
            return [null, res]
        },
        (err) => {
            this.emitter.emit("bleChannel", {
                type: "connect",
                code: 1103,
                message: "蓝牙适配器打开失败"
            })
            print("初始化蓝牙适配器失败：", err)
            //print(`✘ 初始化失败！${errToString(err)}`);
            //todo err.state == 3 && Alert.iphone_bleAuthorized(); // 原有逻辑，针对ios有个报错弹窗，不知道为啥没有安卓的报错
            return [err, null]
        }
    );
}


function _getConnectedBluetoothDevices() {
    print(`获取已连接的蓝牙设备...`);
    return promisify(wx.getConnectedBluetoothDevices, {
        services: this.services
    }).then(
        res => {
            return [null, res]
        },
        err => {
            return [err, null]
        }
    )
}


/**
 * 
 * @returns 获取蓝牙适配器状态
 */
function _getBluetoothAdapterState() {
    print(`获取蓝牙适配器状态...`)
    this.emitter.emit("bleChannel", {
        type: "connect",
        code: 1106,
        message: "获取蓝牙适配器状态"
    })
    return promisify(wx.getBluetoothAdapterState).then(
        res => {
            print(`获取蓝牙适配器状态成功`)
            return [null, res]
        },
        err => {
            print(`获取蓝牙适配器状态失败`)
            return [err, null]
        }
    )
}

/**
 * @param {Array<string>} services
 * @param { Int } interval
 */
// 搜索附近蓝牙设备
function _startSearch() {
    print(`准备搜寻附近的蓝牙外围设备...`);
    this.emitter.emit("bleChannel", {
        type: "connect",
        code: 1201,
        message: "开始扫描蓝牙设备"
    })
    print("this.servcies are: ", this.services)
    //todo 老业务代码区分了安卓，代码层面无意义，先删除了
    return promisify(wx.startBluetoothDevicesDiscovery, {
        //todo 老业务逻辑字段，需要考虑是否需要优化
        powerLevel: "high",
        interval: 0,
        refreshCache: false,
        services: this.services, // ios会有特定的写死的uuid
    }).then(
        (res) => {
            print(`✔ 开始扫描成功!`);
            return [null, res]
        },
        (err) => {
            this.emitter.emit("bleChannel", {
                type: "connect",
                code: 1203,
                message: "扫描蓝牙设备失败"
            })
            print(`✘ 搜索蓝牙设备失败！`, err);
            return [err, null]
        }
    );
}

/**
 *@param {Array<string>} devices
 *@deviceId 设备ID
 */
function _onBluetoothFound() {
    print(`监听搜寻新设备事件...`);
    return _onBluetoothFound_promise.call(this).then(res => {
        print(`✔ 设备ID找到成功!`);
        return [null, res]
    }, err => {
        print(`✘ 设备ID找到失败!`);
        return [errToString(err), null]

    })
}



/**
 */
function _onBluetoothFound_promise() {
    print(`blename:${this.blename}`)
    return new Promise((resolve, reject) => {
        wx.onBluetoothDeviceFound(res => {
            let current = res.devices[0]
            if (!current.name) {
                // 过滤无name的蓝牙设备,节省性能
                return
            }
            // andriod可以直接连接mac地址（来自云端数据库）
            if (!this.isIphone) {
                this.deviceId = this.macAddress
                resolve('found')  // 自定义这个关键词
            }
            // ios 需要用deviceName匹配deviceID
            if (this.deviceName === current.deviceName) {
                // 找到匹配的设备，设置deviceId
                this.deviceId = current.deviceId;//5907d0bb2
                resolve('found')  // 自定义这个关键词
            }
            reject('device not found')
        }, err => {
            reject(err)
        })
    })
}

function _stopSearchBluetooth() {
    print(`停止查找新设备...`);
    wx.offBluetoothDeviceFound();
    return wx.stopBluetoothDevicesDiscovery().then(
        (res) => {
            print(`✔ 停止查找设备成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 停止查询设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _connectBle() {
    print(`准备连接设备... ${this.deviceId}`);
    return promisify(wx.createBLEConnection, {
        //todo 除了deviceid，其他是老业务参数，需要确定是否必要
        timeout: 1000 * 15,
        deviceId: this.deviceId,
        doDiscover: false,//不进行services
    }).then(
        (res) => {
            print(`✔ 连接蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 连接蓝牙失败！`, err);
            return [err, null]
        }
    );
}

function _setBLEMTU() {
    print(`设置蓝牙低功耗`)
    return promisify(wx.setBLEMTU, {
        deviceId: this.deviceId,
        mtu: this.mtuvalue
    }).then(
        (res) => {
            print(`✔ 设置BleMTU成功！`);
            this.mtuSet = true
            return [null, res]
        },
        (err) => {
            print(`✘ 设置BleMTU失败！${errToString(err)}`);
            this.mtuSet = false
            return [errToString(err), null]
        }
    );
}

function _closeBLEConnection() {
    this.emitter.emit("bleChannel", {
        type: "connect",
        code: 1304,
        message: "开始蓝牙BLE断连"
    })
    print(`断开蓝牙连接...`)
    return promisify(wx.closeBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔ 断开蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 断开蓝牙连接失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _closeBLEAdapter() {
    print(`释放蓝牙适配器...`)
    return wx.closeBluetoothAdapter().then(res => {
        print(`✔ 释放适配器成功！`)
        return [null, res]
    }, err => {
        print(`✘ 释放适配器失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _getBLEServices() {
    print(`获取蓝牙设备所有服务...`)
    return promisify(wx.getBLEDeviceServices, {
        deviceId: this.deviceId,
        //todo 下面是老业务参数
        discoverDelay: 0,
        doDiscover: true,
    }).then(res => {
        print(`✔ 获取service成功！`)
        this.emitter.emit("bleChannel", {
            type: "connect",
            code: 1402,
            message: "获取到的蓝牙服务",
            data: res
        })
        //todo 老业务逻辑，设置serviceId
        this.serviceId = res.services.find(item => {
            return item.uuid.toLowerCase().indexOf("fff0") > -1
        }).uuid;
        return [null, res]
    }, err => {
        print(`✘ 获取service失败！`, errToString(err))
        this.emitter.emit("bleChannel", {
            type: "connect",
            code: 1403,
            message: "获取蓝牙服务失败",
            data: err
        })
        return [errToString(err), null]
    })
}


function _getCharacteristics() {
    print(`开始获取特征值...`);
    this.emitter.emit("bleChannel", {
        type: "connect",
        code:1501,
        message: "获取特征值"
    })
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        discoverDelay: 0, //todo 老业务逻辑需确认
    }).then(
        (res) => {
            print(`✔ 获取特征值成功！`);
            this.emitter.emit("bleChannel", {
                type: "connect",
                code:1502,
                message: "获取特征值成功",
                data:res
            })
            // 设置写入id和监听id
            this.writeCharacteristicId = res.characteristics.find(item => {
                return item.uuid.toLowerCase().indexOf("fff1") > -1
            }).uuid;
            this.notifyCharacteristicId = res.characteristics.find(item => {
                return item.uuid.toLowerCase().indexOf("fff2") > -1
            }).uuid;
            return [null, res]
        },
        (err) => {
            this.emitter.emit("bleChannel", {
                type: "connect",
                code:1503,
                message: "获取特征值失败",
                data: err
              })
            print(`✘ 获取特征值失败！`, errToString(err));
            return [errToString(err), null]
        }
    );
}

// 订阅特征值
function _notifyBLECharacteristicValueChange() {
    this.emitter.emit("bleChannel", {
        type: "connect",
        code:1601,
        message: "订阅特征值"
    })
    return promisify(wx.notifyBLECharacteristicValueChange, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.notifyCharacteristicId,
        state: true,
        serial: this.mtuSet, //是否设置安卓最大传输单元
    }).then(res => {
        print(`✔ 订阅notify成功！`)
        this.emitter.emit("bleChannel", {
            type: "connect",
            code:1602,
            message: "订阅特征值成功",
            data:res
        })
        return [null, res]
    }, err => {
        print(`✘ 订阅notify失败！`, errToString(err))
        this.emitter.emit("bleChannel", {
            type: "connect",
            code:1603,
            message: "订阅特征值失败",
            data:res
        })
        return [errToString(err), null]
    })
}

function _writeBLECharacteristicValue(mudata) {
    print("写入蓝牙特征值参数：", this.deviceId, this.serviceId, this.writeCharacteristicId, mudata)
    return promisify(wx.writeBLECharacteristicValue, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.writeCharacteristicId,
        value: mudata,
    }).then(res => {
        print(`✔ 写入数据成功！`)
        return [null, res]
    }, err => {
        print(`✘ 写入数据失败！`, errToString(err))
        return [errToString(err), null]
    })
}

/**
 * 对微信接口回调函数的封装
 * @param {function} fn 
 */
function promisify_callback(fn) {
    return new Promise((resolve, reject) => {
        fn(
            (res) => {
                resolve(res);
            },
            (rej) => {
                reject(rej);
            }
        );
    });
}

// function print(str) {
//     debug ? console.log(str) : null;
// }

function errToString(err) {
    "use strict";
    // var obj = Object(this);
    // if (obj !== this)
    //     throw new TypeError();
    // var name = this.name;
    // name = (name === undefined) ? "Error" : String(name);
    // var msg = this.message;
    // msg = (msg === undefined) ? "" : String(msg);
    // if (name === "")
    //     return msg;
    // if (msg === "")
    //     return name;
    // return name + ": " + msg;
    return err
};

function _sentOrder() {

}
function _modBusCRC16() {

}


export {
    _getCharacteristics,
    _connectBle,
    _getBLEServices,
    _closeBLEConnection,
    _closeBLEAdapter,
    _stopSearchBluetooth,
    _notifyBLECharacteristicValueChange,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    _sentOrder,
    _writeBLECharacteristicValue,
    _modBusCRC16,
    _setBLEMTU,
    promisify_callback,
    _getBluetoothAdapterState,
    _getConnectedBluetoothDevices
};
