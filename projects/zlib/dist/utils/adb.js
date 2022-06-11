"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevices = exports.execShell = void 0;
const child_process_1 = require("child_process");
/**
 * 执行指定的shell命令
 * @param command shell命令
 * @returns 命令执行结果
 */
const execShell = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
};
exports.execShell = execShell;
const getDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    const a = yield (0, exports.execShell)('adb devices');
    console.log('a', a);
    return a;
});
exports.getDevices = getDevices;
