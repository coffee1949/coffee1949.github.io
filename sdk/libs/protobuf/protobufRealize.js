import base64 from './weichatPb/src/base64';
import vehicleAction4g from '../../../api/4g/vehicleAction4g';
import MqttConnection from '../../../api/4g/mqttConnection';
var protobuf = require('./weichatPb/protobuf.js'); //引入protobuf模块
var  awesomeConfig = require('./awesome.js');//加载awesome.proto对应的json
import { isLogin } from "../../utils/wxUtils";
class ProtobufRealize{
  constructor(ReportItemField,params){
    // if (!ProtobufRealize.instance) {
    //   this.ReportItemField="";
    //   this.params={};
    //   this.AwesomeRoot = null;
    //   this.counterArray=[];
    //   ProtobufRealize.instance = this;
    // }
    // return ProtobufRealize.instance;
    this.ReportItemField=ReportItemField;
    this.params=params;
    this.AwesomeRoot = protobuf.Root.fromJSON(awesomeConfig);
  }
  init(ReportItemField,params){
   
  }
  getMessageBase64(){
    try {
      let reportItemMessage=this.analysisReportItem();
     // console.log(">>>>>>",reportItemMessage);
      let messageBuffer=reportItemMessage.encode().finish();
      let valbase64 =base64.encode(messageBuffer,0,messageBuffer.length);   
      //console.log("message结果：：：：",messageBuffer); 
      return valbase64;
    } catch (error) {
      console.log("转换diting失败",error)
      return null;
    }
 
    // let ReportItemMessage =AwesomeRoot.lookupType("ReportItem");
    // let messageReportItem=ReportItemMessage.create(temp);
    // let messageBuffer =messageReportItem.encode().finish();
    // let valbase64 =base64.encode(messageBuffer,0,messageBuffer.length);
    // console.log("message结果：：：：",messageBuffer);    
    // return valbase64;
  }
  analysisReportItem(){
  let ReportItemMessage =this.AwesomeRoot.lookupType("ReportItem");
    if(this.ReportItemField=='counter'){
     // console.log("counter>>>>",this.getCounterMessage());
      return this.getCounterMessage();
    }
     let message =ReportItemMessage.fields[this.ReportItemField].type;
     let temp={uri:this.params.uri};
       temp[this.ReportItemField]=this.getMessageObjRealize(message,this.params);       
       return ReportItemMessage.create(temp);
  }
  //实现赋值message对象
  getMessageObjRealize(message,params){
    let messageObj=this.AwesomeRoot.lookupType(message);
    let temp =Object.assign({},params||this.params);
    messageObj.fields.hasOwnProperty("timestamp")&&(temp.timestamp=this.getTimestamp());
    messageObj.fields.hasOwnProperty("header")&&(temp.header=this.getHeader());
    return messageObj.create(temp);
  }
  getHeader(){
    return {
      "sn": isLogin() ? wx.getStorageSync("historysn") : "",
      "userId":wx.getStorageSync("Nokey-userInfo")["X-Ingeek-UserId"],
      "deviceId":wx.getStorageSync("X-Ingeek-DeviceId"),
      "timestamp":(new Date).getTime()
    }
  }
  getTimestamp(){
    return (new Date).getTime();
  }

  getCounterMessage(){
    let v4g = new vehicleAction4g();
    let mqttConnection=new MqttConnection();
    let counterMessage =this.AwesomeRoot.lookupType('DKCounter');
    let temp ={uri:this.params.uri,header:this.getHeader()};
    temp['items']=[
      {uri:3501,value:v4g.hasConnected4g?1:0,timestamp:this.getTimestamp()},
      {uri:3503,value:(mqttConnection.client&&mqttConnection.client.reconnecting)?1:(mqttConnection.client&&mqttConnection.client.connected?2:0),timestamp:this.getTimestamp()},
    ];   
    counterMessage.create(temp);
    return counterMessage.create(temp);
  }
}
module.exports = ProtobufRealize;