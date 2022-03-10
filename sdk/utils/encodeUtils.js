/**
 *  当前文件包含底层编解码和转码相关工具
 */
 import {KJUR} from "./ecdh_all";
/**
 * 随机生成36位uuid
 * @returns 
 */
export function getUuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "";

  var uuid = s.join("");
  return uuid;
}

/**
 * 十六进制转成十进制
 * @param {*} hex 
 * @returns 
 */
export function hex2int(hex) {
  var len = hex.length,
    a = new Array(len),
    code;
  for (var i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }
  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

/**
 * buffer转成16进制字符串
 * @param {*} buffer 
 * @returns 
 */
export function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
  });
  return hexArr.join('')
}

/**
 * 十六进制转二进制bit
 * @param {*} str 
 * @returns 
 */
export function str16ToBit(str) {
  let result = "";
  str += "";
  for (let i = 0; i < str.length; i++) {
    let bit = parseInt(str[i], 16).toString(2);
    for (bit.toString(); bit.length < 4;) bit = "0" + bit;
    result += bit
  }
  return result
}

/*
 * 16进制数转bit（8位）
 * @str16: 十六进制字符串
 * */
export function str16ToBitByMap(str16) {
  let result = "",
    map = {
      0: "0000",
      1: "0001",
      2: "0010",
      3: "0011",
      4: "0100",
      5: "0101",
      6: "0110",
      7: "0111",
      8: "1000",
      9: "1001",
      a: "1010",
      b: "1011",
      c: "1100",
      d: "1101",
      e: "1110",
      f: "1111"
    };
  for (let i = 0; i < str16.length; i++) result += map[str16[i]];
  return result
}

/**
 * 16进制字符串转10进制比特数组
 * @param {*} str - 16进制字符串
 * @returns 
 */
export function Str2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var hexA = new Array();
  for (var i = 0; i < len; i++) {
    var s = str.substring(pos, pos + 2);
    var v = parseInt(s, 16);
    hexA.push(v);
    pos += 2;
  }
  return hexA;
}
/**
 * 十进制比特数组转16进制字符串
 * ？超过255会超过两个比特
 * @param {*} arr 
 * @returns 
 */
export function Bytes2Str(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
}

//ASCII码转16进制
export function strToHexCharCode(str) {
  if (str === "") {
    return "";
  } else {
    var hexCharCode = [];
    hexCharCode.push("0x");
    for (var i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
  }
}
//十六进制转ASCII码
export function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("存在非法字符!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

export function parseLTV(oristr) {
  let arr = [], targetStr = oristr;
  for (; targetStr.length > 0;) {
    let splitobj = getSplitObject(targetStr);
    arr.push(splitobj);
    targetStr = targetStr.substr(splitobj.strlength + 4)
  }
  return arr
}
export function getSplitObject(str) {
  let length = hex2int(str.substr(0, 2)) - 1,
    strlength = 2 * length,
    type = str.substr(2, 2),
    value = str.substr(4, strlength);
  return {
    allstr: str.substr(0, strlength + 4),
    strlength: strlength,
    length: length,
    type: type,
    value: value
  }
}

export function getRasKey() {
  let result = wx.getStorageSync('Nokey-rasKey')
  if (!result) {
    var curve = "secp256r1";
    var ec = new KJUR.crypto.ECDSA({ curve: curve });
    var keypair = ec.generateKeyPairHex();

    let privateKeyBase64 = wx.CryptoJS.enc.Base64.stringify(
      wx.CryptoJS.enc.Hex.parse(keypair.ecprvhex)
    );
    let publicKeyBase64 = wx.CryptoJS.enc.Base64.stringify(
      wx.CryptoJS.enc.Hex.parse(keypair.ecpubhex)
    );
    let privateKey = wx.CryptoJS.enc.Hex.parse(keypair.ecprvhex).toString();
    let publicKey = wx.CryptoJS.enc.Hex.parse(keypair.ecpubhex).toString();
    result = {
      privateKeyBase64,
      publicKeyBase64,
      privateKey,
      publicKey
    }
    wx.setStorageSync("Nokey-rasKey", result);
  }
  return result;
}


export var EncodeUtils = {
  hex2int: hex2int,
  parseLTV: parseLTV,
  str16ToBit: str16ToBit,
  hexCharCodeToStr: hexCharCodeToStr,
  Bytes2Str: Bytes2Str,
  Str2Bytes: Str2Bytes,
  getRasKey
};

