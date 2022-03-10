
import {
    ED,
    CryptoJS,
    KJUR
  } from "./ecdh_all.js";
  const EC_NAME = "secp256r1";
  const IPH_FLAG_MF = 0x20000000;
  const IPH_FLAG_OFFSET = 0x1fffffff;
  var kBleMTU = 176;
  const kBleHeaderLength = 0x10;
  var kBleMaxBodyLength = kBleMTU - kBleHeaderLength;
  var localTransactionId = null;
  var idKeyPair = new Map();
  var gSessionInfo = new Map();
  class SessionContext {
    keyId = "";
    localPrivateKey = [];
    localPublickKey = [];
    localBnPrivateKey = null;
    localBnPublickKey = null;
    peerEmPublickKey = [];
    peerBnEmPublickKey = null;
    signCounter = 0;
    na = [];
    nb = [];
    secret = [];
    shareInfo = [];
    sessionKey = [];
    eIV = [];
    dIV = [];
    hmacKey = []
  }
  class TrustKey {
    keyId = [];
    vehiclePubKey = []
  }
  
  function uint16(arr) {
    console.log("转换前", arr);
    var length = arr.length;
    if (length < 2) {
      return 0
    }
    var result = (arr[0] << 8) + arr[1];
    console.log("转换后", result);
    return result
  }
  
  function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2)
    }).join("")
  }
  
  function printAsHexString(byteArray, tx, prefix) {
    if (byteArray == null || byteArray.length == 0) {
      return
    }
    var result = Array.prototype.map.call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2)
    }).join(" ");
    if (prefix) {} else {
      if (tx == 1) {} else {}
    }
  }
  
  function toByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
      result.push(parseInt(hexString.substr(i, 2), 16))
    }
    return result
  }
  
  function uint32ToArray(n) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, n, true);
    return new Uint8Array(view.buffer)
  }
  
  function uint32BEToArray(n) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, n, false);
    return new Uint8Array(view.buffer)
  }
  
  function uint16ToArray(n) {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, n, true);
    return new Uint8Array(view.buffer)
  }
  export function htonl(n) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, n, false);
    return view.getUint32(0)
  }
  export function ntohl(n) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, n);
    return view.getUint32(0, true)
  }
  
  function htons(n) {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, n);
    return view.getUint16(0)
  }
  
  function ntohs(n) {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, n);
    return view.getUint16(0, true)
  }
  
  function doECSign(priKey, data) {
    var sigalg = "SHA256withECDSA";
    var sign = new KJUR.crypto.Signature({
      alg: sigalg,
      prov: "cryptojs/jsrsa"
    });
    sign.initSign({
      ecprvhex: priKey,
      eccurvename: EC_NAME
    });
    sign.updateHex(toHexString(data));
    var result = sign.sign();
    return result
  }
  
  function doVerifyECSign(pubKey, plainData, signedData) {
    var sigalg = "SHA256withECDSA";
    var sig = new KJUR.crypto.Signature({
      alg: sigalg,
      prov: "cryptojs/jsrsa"
    });
    sig.initVerifyByPublicKey({
      ecpubhex: pubKey,
      eccurvename: EC_NAME
    });
    var plainHex = toHexString(plainData);
    sig.updateHex(plainHex);
    var verified = sig.verify(signedData);
    return verified
  }
  
  function convertToRawECSign(der) {
    var result = KJUR.crypto.ECDSA.asn1SigToConcatSig(toHexString(der));
    return toByteArray(result)
  }
  
  function convertToDerSign(raw) {
    var r = raw.substring(0, 64);
    var s = raw.substring(64, 128);
    var result = KJUR.crypto.ECDSA.hexRSSigToASN1Sig(r, s);
    return result
  }
  
  function parseTrustKey(trustKey) {
    var tk = new TrustKey();
    var max = trustKey.length;
    var i = 0;
    while (i < max) {
      var len = trustKey[i];
      var tag = trustKey[i + 1];
      var start = i + 2;
      var end = i + len + 1;
      var value = trustKey.slice(start, end);
      if (tag == 0x07) {
        tk.vehiclePubKey = value;
        break
      }
      i = end
    }
    return tk
  }
  
  function sha256(hexString) {
    var md = new KJUR.crypto.MessageDigest({
      alg: "sha256",
      prov: "sjcl"
    });
    md.updateHex(hexString);
    var result = md.digest();
    return result
  }
  
  function f8(keyId, sessionInfo) {
    let curve = ED.ec(EC_NAME);
    let peerPublicKey = {
      x: toHexString(sessionInfo.peerEmPublickKey.slice(1, 33)),
      y: toHexString(sessionInfo.peerEmPublickKey.slice(33))
    };
    var px = new ED.BigInteger(peerPublicKey.x, 16);
    var py = new ED.BigInteger(peerPublicKey.y, 16);
    peerPublicKey = {
      x: px.toString(),
      y: py.toString()
    };
    var dhKeyobj = ED.ecdh(sessionInfo.localBnPrivateKey, peerPublicKey, curve);
    var dhKey = new ED.BigInteger(dhKeyobj.x);
    var secret = dhKey.toByteArray();
    if (secret.length > 32) {
      secret.splice(0, secret.length - 32)
    } else if (secret.length < 32) {
      for (var i = 0; i < 32 - secret.length; i += 1) {
        secret.unshift(0)
      }
    }
    printAsHexString(secret, 1, "DHKey");
    var shareInfo = sessionInfo.localPublickKey;
    shareInfo = [...sessionInfo.localPublickKey, ...sessionInfo.peerEmPublickKey, ...sessionInfo.na, ...sessionInfo.nb];
    printAsHexString(shareInfo, 1, "ShareInfo");
    var dh = toHexString(secret);
    var tmp = "";
    var keyMaterial = [];
    tmp = tmp.concat(dh, "00000001", toHexString(shareInfo));
    keyMaterial = [...keyMaterial, ...toByteArray(sha256(tmp))];
    tmp = "";
    tmp = tmp.concat(dh, "00000002", toHexString(shareInfo));
    keyMaterial = [...keyMaterial, ...toByteArray(sha256(tmp))];
    var kenc = keyMaterial.slice(0, 16);
    var eIV = keyMaterial.slice(16, 32);
    var dIV = keyMaterial.slice(48, 64);
    var kmac = keyMaterial.slice(32, 64);
    sessionInfo.secret = keyMaterial;
    sessionInfo.shareInfo = shareInfo;
    sessionInfo.sessionKey = kenc;
    sessionInfo.eIV = eIV;
    sessionInfo.dIV = dIV;
    sessionInfo.hmacKey = kmac;
    gSessionInfo.set(keyId, sessionInfo)
  }
  
  function m2padding(input) {
    if (!input || !input.length) {
      return null
    }
    var inSize = input.length;
    var paddingSize = (((inSize / 16) | 0) + 1) * 16 - inSize;
    var padding = [0x80];
    for (var i = 0; i < paddingSize - 1; i += 1) {
      padding.push(0)
    }
    var result = [...input, ...padding];
    return result
  }
  
  function m2unpadding(input) {
    if (!input || !input.length) {
      return null
    }
    var current = input.length - 1;
    while (current > 0 && input[current] != 0x80) {
      current -= 1
    }
    var result = input.slice(0, current);
    return result
  }
  var Packet = {
    version: new Uint8Array(1),
    connectionId: new Uint8Array(1),
    type: new Uint8Array(1),
    rfu1: new Uint8Array(1),
    sourceId: new Uint8Array(2),
    destId: new Uint8Array(2),
    _length: Number,
    _packets: [],
    setMtu(value) {
      kBleMTU = value;
      kBleMaxBodyLength = kBleMTU - kBleHeaderLength;
      console.log("IOSXXXXXXXXXXXX", kBleMTU, kBleMaxBodyLength)
    },
    buildPackets: function (data) {
      this._packets = [];
      this.version = 0x09;
      this.connectionId = 0;
      this.type = 0;
      localTransactionId += 1;
      this.sourceId = uint16ToArray(localTransactionId);
      this._length = data.length;
      const dataLength = this._length;
      const fragmentSize = ((kBleMaxBodyLength / 8) | 0) * 8;
      var packetCount = 1;
      if (dataLength > fragmentSize) {
        packetCount = ((dataLength / fragmentSize) | 0) + Math.min(dataLength % fragmentSize | 0, 1);
        packetCount = packetCount | 0
      }
      for (let i = 0; i < packetCount; i += 1) {
        var location = i * fragmentSize;
        var length = Math.min(fragmentSize, dataLength - location);
        var packetData = data.slice(location, location + length);
        var mf = 1;
        if (length < fragmentSize || i == packetCount - 1) {
          mf = 0
        }
        var p = this._buildPacket(packetData, mf, location);
        this._packets.push(p)
      }
      return this._packets
    },
    _buildPacket: function (data, mf, offset) {
      var header = new Uint8Array(16);
      header[0] = this.version;
      header[1] = this.connectionId;
      header[2] = this.type;
      header[3] = 0;
      header[4] = this.sourceId[1];
      header[5] = this.sourceId[0];
      header[6] = 0;
      header[7] = 0;
      var arr = uint32ToArray(data.length);
      header[8] = arr[3];
      header[9] = arr[2];
      header[10] = arr[1];
      header[11] = arr[0];
      offset = (offset >> 3) | 0;
      if (mf == 1) {
        offset |= IPH_FLAG_MF
      }
      var off = uint32ToArray(offset);
      header[12] = off[3];
      header[13] = off[2];
      header[14] = off[1];
      header[15] = off[0];
      var result = new Uint8Array(header.length + data.length);
      result.set(header);
      result.set(data, header.length);
      printAsHexString(result, 1, null);
      return toHexString(result)
    }
  };
  var ECC = {
    generateKeyPair: function () {
      let curve = ED.ec(EC_NAME);
      var keyPair = ED.generateKeyPair(curve);
      return keyPair
    }
  };
  var TA = {
    init: function () {
      gSessionInfo = new Map();
      this.initTranscationId();
      idKeyPair = ECC.generateKeyPair();
      var priKey = new ED.BigInteger(idKeyPair.privateKey);
      var pubKey = idKeyPair.publicKey;
      var pubx = new ED.BigInteger(pubKey.x);
      var puby = new ED.BigInteger(pubKey.y);
      var tmp = "04" + toHexString(pubx.toByteArray()) + toHexString(puby.toByteArray());
      var p1 = priKey.toByteArray();
      if (p1.length == 33) {
        p1.splice(0, 1)
      }
      var p2 = pubx.toByteArray();
      var p3 = puby.toByteArray();
      if (p2.length == 33) {
        p2.splice(0, 1)
      }
      if (p3.length == 33) {
        p3.splice(0, 1)
      }
      var p4 = [0x04];
      p4.concat(p2);
      p4.concat(p3);
      idKeyPair.privateKey = p1;
      idKeyPair.publicKey = p4;
      idKeyPair.privateKey = wx.getStorageSync("Nokey-rasKey").privateKey;
      idKeyPair.publicKey = wx.getStorageSync("Nokey-rasKey").publicKey
    },
    deInit() {},
    hexStringToArray: function (hex) {
      return toByteArray(hex)
    },
    printToHexString: function (byteArray, tx, prefix) {
      printAsHexString(byteArray, tx, prefix)
    },
    exchangeFeatures: function () {
      var data = [0x00, 0xff, 0x01, 0x05, 0xa0, 0x00, 0x00, 0x00, 0x98];
      var data1 = [0x00, 0xff, 0x02, 0x05, 0xa0, 0x00, 0x00, 0x00, 0x99, 0x00, 0xe0, 0xf0, 0x19];
      var c = new Int8Array(data.length + data1.length);
      c.set(data);
      c.set(data1, data.length);
      var result = Packet.buildPackets(data);
      return result
    },
    buildAuthPacket: function (keyId, type) {
      var si = new SessionContext();
      if (!gSessionInfo.has(keyId)) {
        si.keyId = keyId;
        var keypair = ECC.generateKeyPair();
        var priKey = new ED.BigInteger(keypair.privateKey);
        var pubKey = keypair.publicKey;
        var pubx = new ED.BigInteger(pubKey.x);
        var puby = new ED.BigInteger(pubKey.y);
        var p = priKey.toByteArray();
        if (p.length == 33) {
          p.splice(0, 1)
        }
        si.localPrivateKey = p;
        si.localBnPrivateKey = keypair.privateKey;
        p = [0x04];
        var tmp = pubx.toByteArray();
        if (tmp.length == 33) {
          tmp.splice(0, 1)
        }
        p = p.concat(tmp);
        tmp = puby.toByteArray();
        if (tmp.length == 33) {
          tmp.splice(0, 1)
        }
        p = p.concat(tmp);
        si.localPublickKey = p;
        si.localBnPublickKey = keypair.publicKey;
        gSessionInfo.set(keyId, si)
      } else {
        si = gSessionInfo.get(keyId)
      }
      var buf = [0x00, 0x03];
      let trustKey = toByteArray(wx.getStorageSync("Nokey-TRUSTKEY"));
      buf.push(0x01);
      buf.push(0x01);
      buf.push(type);
      buf.push(0x02);
      if (type == 1) {
        buf.push(0x06);
        let fingerprint = sha256(toHexString(trustKey));
        let fp = toByteArray(fingerprint.toString());
        fp = fp.slice(0, 6);
        buf = buf.concat(fp)
      } else {
        buf.push(0x82);
        let trustKeySize = htons(trustKey.length);
        let tk = uint16ToArray(trustKeySize);
        buf.push(tk[1]);
        buf.push(tk[0]);
        buf = buf.concat(trustKey)
      }
      buf.push(0x03);
      buf.push(65);
      buf = buf.concat(si.localPublickKey);
      var na = new Uint8Array(16);
      var sec = new ED.SecureRandom();
      sec.nextBytes(na);
      si.na = na;
      buf.push(0x04);
      buf.push(si.na.length);
      buf = [...buf, ...si.na];
      var toBeSigned = buf.slice(2);
      var sign = doECSign(idKeyPair.privateKey, toBeSigned);
      var signArray = toByteArray(sign);
      var s = convertToRawECSign(signArray);
      buf.push(0x05);
      buf.push(64);
      buf = buf.concat(s);
      this.printToHexString(buf, 1, "PDU");
      var packet = Packet.buildPackets(buf);
      return packet
    },
    parseAuthPacket: function (keyId, data) {
      var result = {};
      var index = 0;
      if (data[index] != 0x01 || data[index + 1] != 0x02) {
        return {
          'code': 0x0102,
          'data': null
        }
      }
      index += 2;
      var errorCode = uint16(data.slice(index, index + 2));
      if (errorCode != 0x00) {
        return {
          'code': errorCode,
          'data': null
        }
      }
      index += 2;
      var si = gSessionInfo.get(keyId);
      if (data[index] != 0x02) {
        return {
          'code': 0x0102,
          'data': null
        };
      }
      index += 1;
      if (data[index] != 65) {
        return {
          'code': 0x0102,
          'data': null
        };
      }
      index += 1;
      si.peerEmPublickKey = data.slice(index, index + 65);
      index += 65;
      this.printToHexString(si.peerEmPublickKey, 0, "VehiclePubKey");
      if (data[index] != 0x03) {
        return {
          'code': 0x0102,
          'data': null
        };
      }
      index += 1;
      if (data[index] != 16) {
        return {
          'code': 0x0102,
          'data': null
        };
      }
      index += 1;
      si.nb = data.slice(index, index + 16);
      index += 16;
      var sign = data.slice(index + 2);
      var derSign = convertToDerSign(toHexString(sign));
      var toSignedData = data.slice(0, index);
      let trustKey = toByteArray(wx.getStorageSync("Nokey-TRUSTKEY"));
      var tk = parseTrustKey(trustKey);
      var signResult = doVerifyECSign(toHexString(tk.vehiclePubKey), toSignedData, derSign);
      this.deriveKeys(keyId, si);
      result = {
        'code': 0x0000,
        'data': signResult
      };
      return result
    },
    deriveKeys: function (keyId, sessionInfo) {
      f8(keyId, sessionInfo)
    },
    encryptData: function (keyId, uri, data) {
      console.log("arguments", arguments);
      var si = gSessionInfo.get(keyId);
      si.signCounter += 1;
      gSessionInfo.set(keyId, si);
      var paddedData = m2padding(data);
      var wordArray = CryptoJS.enc.Hex.parse(toHexString(paddedData));
      var encryptedData = wx.CryptoJS.AES.encrypt(wordArray, wx.CryptoJS.enc.Hex.parse(toHexString(si.sessionKey)), {
        mode: wx.CryptoJS.mode.CBC,
        iv: wx.CryptoJS.enc.Hex.parse(toHexString(si.eIV)),
        padding: wx.CryptoJS.pad.NoPadding
      });
      var ciphertext = encryptedData.ciphertext.toString();
      var encDataArr = toByteArray(ciphertext);
      var sig = uint32BEToArray(si.signCounter);
      var macData = [...encDataArr, ...sig];
      var m = CryptoJS.enc.Hex.parse(toHexString(macData));
      var mac = wx.CryptoJS.HmacSHA256(m, wx.CryptoJS.enc.Hex.parse(toHexString(si.hmacKey)));
      var macArray = toByteArray(mac.toString());
      var result = [...uri, ...encDataArr, ...macArray.slice(0, 10), ...sig];
      var packet = Packet.buildPackets(result);
      return packet
    },
    decryptData: function (keyId, data) {
      var si = gSessionInfo.get(keyId);
      var mac = data.slice(data.length - 32);
      var toDecryptData = data.slice(0, data.length - 32);
      var decryptedData = wx.CryptoJS.AES.decrypt({
        ciphertext: wx.CryptoJS.enc.Hex.parse(toHexString(toDecryptData))
      }, wx.CryptoJS.enc.Hex.parse(toHexString(si.sessionKey)), {
        mode: wx.CryptoJS.mode.CBC,
        iv: wx.CryptoJS.enc.Hex.parse(toHexString(si.dIV)),
        padding: wx.CryptoJS.pad.NoPadding
      });
      var dataStr = decryptedData.toString();
      var t = toByteArray(dataStr);
      t = m2unpadding(t);
      var result = toHexString(t);
      return result
    },
    initTranscationId: function () {
      if (localTransactionId == null) {
        var transId = new Uint8Array(2);
        var sec = new ED.SecureRandom();
        sec.nextBytes(transId);
        localTransactionId = uint16(transId)
      } else {}
    }
  };
  export var ta = TA;
  export var packet = Packet;