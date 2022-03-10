import { getBaseUrlByEnv, sortObject, print } from "./bsUtils.js";
import { getIngeekDeviceId } from "./wxUtils";
import { logs } from "./logs.js";

/**
 *
 * @param {*} params
 * {
 *    method : string,
 *    data: Object,
 *    url : string
 * }
 */
export function Request(params) {
  let { method, url, data } = params;
  let env =
    wx.getStorageSync("env") || wx.getAccountInfoSync().miniProgram.envVersion;
  let baseUrl = getBaseUrlByEnv(env);
  let requestUrl = baseUrl + url;

  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method: method || "post",
      data,
      header: _getHeader(data),
      dataType: "json",
      success: res => {
        print("request success", requestUrl, res);
        let code = res.data["code"];
        if (code == 0) {
          logs.info("请求成功结果:" + requestUrl + JSON.stringify(res));
          resolve([null, res.data]);
        } else {
          if ([10002020, 17022, 10002030].indexOf(code) < 0) {
            // wx.showToast({
            //   title: res.data.message || res.data.error,
            //   icon: "none",
            //   duration: 3000,
            // });
          }else{
            
          }
          reject([res, null]);
        }
      },
      fail: err => {
        logs.info("请求失败:" + this.title + JSON.stringify(err));
        reject([err, null]);
      },
      complete: com => {
        // wx.stopPullDownRefresh();
      },
    });
  });
}

/**
 * 组装请求头部
 */
function _getHeader(data) {
  let userInfo = wx.getStorageSync("Nokey-userInfo") || {
      "X-Ingeek-AccessToken": "",
      "X-Ingeek-UserId": "",
    },
    timestamp = parseInt(new Date().getTime() / 1e3),
    nonce = _getXIngeekNonce(timestamp),
    signature = "";

  userInfo &&
    userInfo.signKey &&
    (signature = _getXIngeekSignature(
      userInfo.signKey,
      timestamp,
      nonce,
      data
    ));

  return {
    "X-Ingeek-AppId": wx.getAccountInfoSync().miniProgram.appId,
    "X-Ingeek-AccessToken": userInfo["X-Ingeek-AccessToken"],
    "X-Ingeek-UserId": userInfo["X-Ingeek-UserId"],
    "X-Ingeek-DeviceId": getIngeekDeviceId(),
    "X-Ingeek-Nonce": nonce,
    "X-Ingeek-Timestamp": timestamp.toString(),
    "X-Ingeek-Signature": signature,
    Accept: "application/json",
  };
}

function _getXIngeekNonce(timestamp) {
  let radom = Math.random();
  
  var nonce = wx.CryptoJS.enc.Base64.stringify(
    wx.CryptoJS.SHA256((timestamp + radom).toString())
  );
  return nonce;
}

function _getXIngeekSignature(signkey, timestamp, nonce, body) {
  let conBody = Object.assign(body, {
    nonce: nonce,
    timestamp: timestamp,
  });
  let sortBody = sortObject(conBody);
  let paramsArray = [];
  for (var key in sortBody) {
    let value = sortBody[key];
    if (typeof value != "object" && !Number.isNaN(value)) {
      paramsArray.push(key + "=" + value);
    }
  }
  let signkeyObj = wx.CryptoJS.enc.Base64.parse(signkey);
  let paramsStr = paramsArray.join("&");
  let signature = wx.CryptoJS.enc.Base64.stringify(
    wx.CryptoJS.HmacSHA256(paramsStr, signkeyObj)
  );
  return signature;
}
