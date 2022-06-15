import http from '../http';

export const getUser = () => http.request({
  url: '/user',
  method: 'get',
});

export const login = () => http.request({
  url: '/login',
  method: 'post',
});

export default {
  getUser,
  login,
};
