/**
 * request请求地址配置
 */
export const BaseUrls = {
    "develop": "https://sit-xplan.ingeek.com/api", //开发版本/开发环境
    "trial": "https://uat-xplan.ingeek.com/api", //体验版本/测试环境
    "pre-release": "https://pre-appserver.nokey.cn", //体验版本/预生产环境
    "release": "https://appserver.nokey.cn" //正式版本/生产环境
  }

/**
 * 公共静态资源地址配置
 */
export const ResouceUrls = {
    image: "https://xplan-static.oss-cn-shanghai.aliyuncs.com/h5/carmodel/v1/", //图片
    voice: "https://xplan-static.oss-cn-shanghai.aliyuncs.com/h5/voice/v1/" //音频
  }

  export default {
    BaseUrls,
    ResouceUrls
  }