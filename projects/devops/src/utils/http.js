import axios from 'axios';

class Http {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';
    this.timeout = 3000;
    this.queue = {};
  }

  merge(options) {
    return {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
    };
  }

  // 封装拦截方法
  setInterceptor(instance, url) {
    // 请求拦截
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = '';
      if (Object.keys(this.queue).length === 0) {
        // store.commit("setLoading", 1);
      }
      this.queue[url] = url;
      return config;
    });
    // 响应拦截
    instance.interceptors.response.use((res) => {
      delete this.queue[url];
      if (Object.keys(this.queue).length === 0) {
        // store.commit("setLoading");
      }
      return res.data;
    });
  }

  request(options) {
    const instance = axios.create();
    this.setInterceptor(instance, options.url);
    const config = this.merge(options);
    return instance(config);
  }
}

export default new Http();
