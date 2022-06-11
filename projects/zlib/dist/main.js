"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adb_1 = require("./utils/adb");
(0, adb_1.getDevices)().then(res => {
    console.log('b', res);
});
