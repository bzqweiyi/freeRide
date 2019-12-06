import { toLogin } from './login'

const API_URI = 'https://gaidiha.com/api'

const request = (url, params, method)=>{
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_URI}/${url}`,
        data: params,
        methods: method || 'GET',
        success(res) {
          wx.hideLoading()
          const isSuccess = isHttpSuccess(res.statusCode);
          // 成功的请求状态
          if (isSuccess) { 
            let { code, message } = res.data
            //登陆成功
            if (code === 0) { 
              resolve(res.data);
            } else if (code === 600010) {//token过期
              toLogin()
            } else {
              wx.showToast({
                title: message,
                icon:'none',
                duration: 2000
              })
            }      
          } else {
            reject({
              msg: `网络错误:${res.statusCode}`,
              detail: res.msg
            });
          }
        } ,
        fail: reject
      })
  })
}
function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}


export default {
  request,
  apiLogin: p => request('/user/login', p),
  apiFreeRide: p => request('/freeRide/list', p),
  apiFreeRideDeatil: p => request('/freeRide/detail', p),
  apiAddOrder: p => request('/freeRide/pub', p, 'POST'),
  apiUpdateUser: p => request('/user/update', p)

}