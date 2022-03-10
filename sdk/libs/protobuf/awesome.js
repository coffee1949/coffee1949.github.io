module.exports={
  "nested": {
    "DKHeader": {
      "fields": {
        "sn": {
          "type": "string",
          "id": 1
        },
        "userId": {
          "type": "string",
          "id": 2
        },
        "deviceId": {
          "type": "string",
          "id": 3
        },
        "timestamp": {
          "type": "int64",
          "id": 4
        }
      }
    },
    "DKCounterItem": {
      "fields": {
        "uri": {
          "type": "int32",
          "id": 1
        },
        "value": {
          "type": "int32",
          "id": 2
        },
        "timestamp": {
          "type": "int64",
          "id": 3
        }
      }
    },
    "DKCounter": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "items": {
          "rule": "repeated",
          "type": "DKCounterItem",
          "id": 3
        }
      }
    },
    "BleScanStart": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        }
      }
    },
    "BleFindTarget": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "int32",
          "id": 3
        }
      }
    },
    "BleConnectStart": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        }
      }
    },
    "BleConnectFinish": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "int32",
          "id": 3
        }
      }
    },
    "MQTTConnectStart": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        }
      }
    },
    "VehicleStatusBle": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "bytes",
          "id": 3
        }
      }
    },
    "VehicleStatusRsp": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "bytes",
          "id": 3
        }
      }
    },
    "VehicleCommandBle": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "command": {
          "type": "string",
          "id": 3
        }
      }
    },
    "VehicleCommandRsp": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "command": {
          "type": "string",
          "id": 3
        }
      }
    },
    "BleDisconnected": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "int32",
          "id": 3
        }
      }
    },
    "MQTTDisconnected": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "int32",
          "id": 3
        }
      }
    },
    "LocationData": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "latitude": {
          "type": "double",
          "id": 3
        },
        "longtitude": {
          "type": "double",
          "id": 4
        },
        "locateTimestamp": {
          "type": "int64",
          "id": 5
        }
      }
    },
    "NetworkReachability": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "int32",
          "id": 3
        }
      }
    },
    "VINBle": {
      "fields": {
        "header": {
          "type": "DKHeader",
          "id": 1
        },
        "uri": {
          "type": "int32",
          "id": 2
        },
        "result": {
          "type": "string",
          "id": 3
        }
      }
    },
    "ReportItem": {
      "fields": {
        "uri": {
          "type": "int32",
          "id": 1
        },
        "counter": {
          "type": "DKCounter",
          "id": 2
        },
        "bleScanStart": {
          "type": "BleScanStart",
          "id": 3
        },
        "bleFindTarget": {
          "type": "BleFindTarget",
          "id": 4
        },
        "bleConnectStart": {
          "type": "BleConnectStart",
          "id": 5
        },
        "bleConnectFinish": {
          "type": "BleConnectFinish",
          "id": 6
        },
        "mqttConnectStart": {
          "type": "MQTTConnectStart",
          "id": 7
        },
        "vehicleStatusBle": {
          "type": "VehicleStatusBle",
          "id": 8
        },
        "vehicleStatusRsp": {
          "type": "VehicleStatusRsp",
          "id": 9
        },
        "vehicleCommandBle": {
          "type": "VehicleCommandBle",
          "id": 10
        },
        "vehicleCommandRsp": {
          "type": "VehicleCommandRsp",
          "id": 11
        },
        "bleDisconnected": {
          "type": "BleDisconnected",
          "id": 12
        },
        "mqttDisconnected": {
          "type": "MQTTDisconnected",
          "id": 13
        },
        "locationData": {
          "type": "LocationData",
          "id": 14
        },
        "networkReachability": {
          "type": "NetworkReachability",
          "id": 15
        },
        "vinBle": {
          "type": "VINBle",
          "id": 16
        }
      }
    }
  }
}
